
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    // Extract dataset ID from URL path
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const datasetId = pathParts[pathParts.length - 1];

    if (!datasetId) {
      return new Response(
        JSON.stringify({ error: 'Dataset ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get dataset with related data
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

    // Get processing jobs
    const { data: jobs, error: jobsError } = await supabaseClient
      .from('data_processing_jobs')
      .select('*')
      .eq('dataset_id', datasetId)
      .order('created_at', { ascending: false });

    // Get compliance violations
    const { data: violations, error: violationsError } = await supabaseClient
      .from('compliance_violations')
      .select('*')
      .eq('dataset_id', datasetId)
      .order('created_at', { ascending: false });

    // Get data classifications
    const { data: classifications, error: classificationsError } = await supabaseClient
      .from('data_classifications')
      .select('*')
      .eq('dataset_id', datasetId)
      .order('created_at', { ascending: false });

    // Get sample data if available
    let sampleData = null;
    try {
      const dataPath = dataset.metadata?.cleaned_data_path || dataset.metadata?.storage_path;
      if (dataPath) {
        const { data: fileData, error: downloadError } = await supabaseClient.storage
          .from('datasets')
          .download(dataPath);

        if (!downloadError && fileData) {
          const fileContent = await fileData.text();
          
          if (dataset.file_type === 'csv') {
            sampleData = parseCsvSample(fileContent, 5);
          } else if (dataset.file_type === 'json') {
            try {
              const parsed = JSON.parse(fileContent);
              sampleData = Array.isArray(parsed) ? parsed.slice(0, 5) : [parsed];
            } catch {
              sampleData = null;
            }
          }
        }
      }
    } catch (error) {
      console.log('Could not load sample data:', error);
    }

    // Calculate statistics
    const stats = {
      total_jobs: jobs?.length || 0,
      completed_jobs: jobs?.filter(j => j.status === 'completed').length || 0,
      failed_jobs: jobs?.filter(j => j.status === 'failed').length || 0,
      total_violations: violations?.length || 0,
      critical_violations: violations?.filter(v => v.severity === 'critical').length || 0,
      high_violations: violations?.filter(v => v.severity === 'high').length || 0,
      classifications_count: classifications?.length || 0,
      sensitive_fields: classifications?.filter(c => c.sensitive_data_detected).length || 0
    };

    const response = {
      dataset: {
        id: dataset.id,
        name: dataset.name,
        original_filename: dataset.original_filename,
        file_type: dataset.file_type,
        file_size: dataset.file_size,
        status: dataset.status,
        compliance_status: dataset.compliance_status,
        upload_date: dataset.upload_date,
        created_at: dataset.created_at,
        updated_at: dataset.updated_at,
        metadata: dataset.metadata
      },
      processing_jobs: jobs || [],
      compliance_violations: violations || [],
      data_classifications: classifications || [],
      sample_data: sampleData,
      statistics: stats
    };

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Dataset retrieval error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function parseCsvSample(csvContent: string, maxRows: number): any[] {
  const lines = csvContent.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const sampleLines = lines.slice(1, maxRows + 1);
  
  return sampleLines.map(line => {
    const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
    const row: any = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    return row;
  });
}
