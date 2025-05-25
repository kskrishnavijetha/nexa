
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const COMPLIANCE_RULES = {
  GDPR: {
    patterns: [
      /\b(?:email|e-mail)\b/i,
      /\b(?:phone|telephone|mobile)\b/i,
      /\b(?:address|street|city|postal|zip)\b/i,
      /\b(?:name|firstname|lastname|surname)\b/i,
      /\b(?:ssn|social\s*security)\b/i,
      /\b(?:passport|driver\s*license|id\s*number)\b/i
    ],
    description: 'Personal data that requires GDPR compliance'
  },
  HIPAA: {
    patterns: [
      /\b(?:patient|medical|health|diagnosis|treatment)\b/i,
      /\b(?:prescription|medication|drug|dosage)\b/i,
      /\b(?:hospital|clinic|doctor|physician)\b/i,
      /\b(?:insurance|coverage|policy)\b/i,
      /\b(?:birth\s*date|dob|age)\b/i
    ],
    description: 'Protected Health Information (PHI)'
  },
  PCI_DSS: {
    patterns: [
      /\b(?:card\s*number|credit\s*card|debit\s*card)\b/i,
      /\b(?:cvv|cvc|security\s*code)\b/i,
      /\b(?:expir|exp\s*date|expiration)\b/i,
      /\b(?:cardholder|card\s*holder)\b/i,
      /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/
    ],
    description: 'Payment card industry data'
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { datasetId, regulations = ['GDPR', 'HIPAA', 'PCI_DSS'] } = await req.json();

    if (!datasetId) {
      return new Response(
        JSON.stringify({ error: 'Dataset ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get dataset
    const { data: dataset, error: datasetError } = await supabaseClient
      .from('datasets')
      .select('*')
      .eq('id', datasetId)
      .eq('user_id', user.id)
      .single();

    if (datasetError || !dataset) {
      return new Response(
        JSON.stringify({ error: 'Dataset not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create compliance job
    const { data: job, error: jobError } = await supabaseClient
      .from('data_processing_jobs')
      .insert({
        dataset_id: datasetId,
        job_type: 'compliance',
        status: 'running',
        progress: 0
      })
      .select()
      .single();

    if (jobError) {
      console.error('Job creation error:', jobError);
      return new Response(
        JSON.stringify({ error: 'Failed to create compliance job' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Start background compliance checking
    EdgeRuntime.waitUntil(performComplianceCheck(supabaseClient, dataset, job.id, regulations));

    return new Response(
      JSON.stringify({
        success: true,
        jobId: job.id,
        message: 'Compliance check started',
        status: 'running'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Compliance check error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function performComplianceCheck(
  supabaseClient: any,
  dataset: any,
  jobId: string,
  regulations: string[]
) {
  try {
    await updateJobProgress(supabaseClient, jobId, 25, 'Loading dataset...');

    // Get cleaned data or original data
    const dataPath = dataset.metadata.cleaned_data_path || dataset.metadata.storage_path;
    const { data: fileData, error: downloadError } = await supabaseClient.storage
      .from('datasets')
      .download(dataPath);

    if (downloadError) {
      throw new Error('Failed to download dataset');
    }

    const fileContent = await fileData.text();
    let data: any[] = [];

    await updateJobProgress(supabaseClient, jobId, 50, 'Analyzing compliance...');

    // Parse data based on file type
    if (dataset.file_type === 'csv') {
      data = parseCsvData(fileContent);
    } else if (dataset.file_type === 'json') {
      try {
        const parsed = JSON.parse(fileContent);
        data = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        data = [{ content: fileContent }];
      }
    }

    const violations: any[] = [];
    const classifications: any[] = [];

    // Check each regulation
    for (const regulation of regulations) {
      if (COMPLIANCE_RULES[regulation as keyof typeof COMPLIANCE_RULES]) {
        const ruleViolations = await checkRegulationCompliance(
          data,
          regulation,
          COMPLIANCE_RULES[regulation as keyof typeof COMPLIANCE_RULES],
          dataset.id
        );
        violations.push(...ruleViolations);
      }
    }

    await updateJobProgress(supabaseClient, jobId, 75, 'Saving compliance results...');

    // Use AI to enhance classification if OpenAI key is available
    if (openAIApiKey && data.length > 0) {
      const aiClassifications = await performAIClassification(data, dataset.id);
      classifications.push(...aiClassifications);
    }

    // Save violations to database
    if (violations.length > 0) {
      await supabaseClient.from('compliance_violations').insert(violations);
    }

    // Save classifications to database
    if (classifications.length > 0) {
      await supabaseClient.from('data_classifications').insert(classifications);
    }

    // Update dataset compliance status
    const complianceStatus = violations.some(v => v.severity === 'critical' || v.severity === 'high') 
      ? 'non_compliant' 
      : violations.length > 0 
        ? 'requires_review' 
        : 'compliant';

    await supabaseClient
      .from('datasets')
      .update({ compliance_status: complianceStatus })
      .eq('id', dataset.id);

    // Complete job
    await supabaseClient
      .from('data_processing_jobs')
      .update({
        status: 'completed',
        progress: 100,
        completed_at: new Date().toISOString(),
        result: {
          violations_found: violations.length,
          compliance_status: complianceStatus,
          regulations_checked: regulations,
          classifications_made: classifications.length
        }
      })
      .eq('id', jobId);

  } catch (error) {
    console.error('Compliance check error:', error);
    await supabaseClient
      .from('data_processing_jobs')
      .update({
        status: 'failed',
        error_message: error.message,
        completed_at: new Date().toISOString()
      })
      .eq('id', jobId);
  }
}

async function checkRegulationCompliance(
  data: any[],
  regulation: string,
  rules: any,
  datasetId: string
): Promise<any[]> {
  const violations: any[] = [];

  data.forEach((row, rowIndex) => {
    Object.keys(row).forEach(fieldName => {
      const fieldValue = String(row[fieldName] || '');
      
      rules.patterns.forEach((pattern: RegExp) => {
        if (pattern.test(fieldValue) || pattern.test(fieldName)) {
          violations.push({
            dataset_id: datasetId,
            rule_type: regulation,
            violation_type: 'sensitive_data_detected',
            description: `${rules.description} detected in field '${fieldName}'`,
            severity: getSeverityForRegulation(regulation),
            field_name: fieldName,
            row_index: rowIndex,
            recommendation: getRecommendationForRegulation(regulation, fieldName)
          });
        }
      });
    });
  });

  return violations;
}

async function performAIClassification(data: any[], datasetId: string): Promise<any[]> {
  const classifications: any[] = [];
  
  try {
    // Sample first few records for classification
    const sampleData = data.slice(0, 5);
    const fields = Object.keys(sampleData[0] || {});

    for (const fieldName of fields) {
      const sampleValues = sampleData.map(row => row[fieldName]).filter(Boolean);
      
      if (sampleValues.length === 0) continue;

      const prompt = `Analyze this data field and classify it:
Field name: ${fieldName}
Sample values: ${sampleValues.slice(0, 3).join(', ')}

Classify this field as one of: PII, Financial, Health, Contact, Technical, General
Also indicate if it contains sensitive data (true/false) and provide confidence score (0-1).
Respond in JSON format: {"classification": "PII", "sensitive": true, "confidence": 0.9, "category": "personal_identifier"}`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
        }),
      });

      const aiResult = await response.json();
      const aiClassification = JSON.parse(aiResult.choices[0].message.content);

      classifications.push({
        dataset_id: datasetId,
        field_name: fieldName,
        classification_type: aiClassification.classification,
        confidence_score: aiClassification.confidence,
        sensitive_data_detected: aiClassification.sensitive,
        data_category: aiClassification.category,
        tags: [`ai_classified`, aiClassification.classification.toLowerCase()]
      });
    }
  } catch (error) {
    console.error('AI classification error:', error);
  }

  return classifications;
}

function getSeverityForRegulation(regulation: string): string {
  const severityMap: { [key: string]: string } = {
    'GDPR': 'high',
    'HIPAA': 'critical',
    'PCI_DSS': 'high',
    'SOX': 'medium',
    'CCPA': 'medium'
  };
  return severityMap[regulation] || 'medium';
}

function getRecommendationForRegulation(regulation: string, fieldName: string): string {
  const recommendations: { [key: string]: string } = {
    'GDPR': `Encrypt or pseudonymize the '${fieldName}' field. Implement data minimization and ensure proper consent handling.`,
    'HIPAA': `Apply strong encryption to '${fieldName}'. Implement access controls and audit logging for PHI access.`,
    'PCI_DSS': `Mask or tokenize '${fieldName}'. Store payment data in PCI-compliant environment with proper encryption.`,
    'SOX': `Implement proper access controls and audit trails for '${fieldName}' field modifications.`,
    'CCPA': `Provide data subject rights for '${fieldName}'. Implement opt-out mechanisms and data deletion capabilities.`
  };
  return recommendations[regulation] || `Review and secure the '${fieldName}' field according to ${regulation} requirements.`;
}

function parseCsvData(csvContent: string): any[] {
  const lines = csvContent.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
    const row: any = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    return row;
  });
}

async function updateJobProgress(supabaseClient: any, jobId: string, progress: number, message?: string) {
  await supabaseClient
    .from('data_processing_jobs')
    .update({ progress })
    .eq('id', jobId);
}
