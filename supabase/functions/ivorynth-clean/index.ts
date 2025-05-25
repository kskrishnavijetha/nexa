
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CleaningOptions {
  removeDuplicates?: boolean;
  handleMissingValues?: 'remove' | 'fill' | 'interpolate';
  normalizeText?: boolean;
  standardizeFormats?: boolean;
}

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

    const { datasetId, options = {} } = await req.json();

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

    // Create cleaning job
    const { data: job, error: jobError } = await supabaseClient
      .from('data_processing_jobs')
      .insert({
        dataset_id: datasetId,
        job_type: 'clean',
        status: 'running',
        progress: 0
      })
      .select()
      .single();

    if (jobError) {
      console.error('Job creation error:', jobError);
      return new Response(
        JSON.stringify({ error: 'Failed to create cleaning job' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Start background cleaning process
    EdgeRuntime.waitUntil(performDataCleaning(supabaseClient, dataset, job.id, options));

    return new Response(
      JSON.stringify({
        success: true,
        jobId: job.id,
        message: 'Data cleaning job started',
        status: 'running'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Clean error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function performDataCleaning(
  supabaseClient: any,
  dataset: any,
  jobId: string,
  options: CleaningOptions
) {
  try {
    // Update job progress
    await updateJobProgress(supabaseClient, jobId, 25, 'Reading file data...');

    // Get file from storage
    const { data: fileData, error: downloadError } = await supabaseClient.storage
      .from('datasets')
      .download(dataset.metadata.storage_path);

    if (downloadError) {
      throw new Error('Failed to download file');
    }

    const fileContent = await fileData.text();
    let cleanedData: any[] = [];
    let cleaningResults: any = {};

    await updateJobProgress(supabaseClient, jobId, 50, 'Cleaning data...');

    // Parse and clean data based on file type
    if (dataset.file_type === 'csv') {
      cleanedData = await cleanCsvData(fileContent, options);
    } else if (dataset.file_type === 'json') {
      cleanedData = await cleanJsonData(fileContent, options);
    } else if (dataset.file_type === 'sql') {
      cleanedData = await cleanSqlData(fileContent, options);
    }

    await updateJobProgress(supabaseClient, jobId, 75, 'Saving cleaned data...');

    // Save cleaned data back to storage
    const cleanedFileName = dataset.metadata.storage_path.replace(/(\.[^.]+)$/, '_cleaned$1');
    const { error: uploadError } = await supabaseClient.storage
      .from('datasets')
      .upload(cleanedFileName, JSON.stringify(cleanedData), { upsert: true });

    if (uploadError) {
      throw new Error('Failed to save cleaned data');
    }

    // Update dataset metadata
    await supabaseClient
      .from('datasets')
      .update({
        status: 'cleaned',
        metadata: {
          ...dataset.metadata,
          cleaned_data_path: cleanedFileName,
          cleaning_applied: options,
          records_before: dataset.metadata.original_record_count || 0,
          records_after: cleanedData.length
        }
      })
      .eq('id', dataset.id);

    // Complete job
    await supabaseClient
      .from('data_processing_jobs')
      .update({
        status: 'completed',
        progress: 100,
        completed_at: new Date().toISOString(),
        result: {
          records_processed: cleanedData.length,
          cleaning_summary: cleaningResults
        }
      })
      .eq('id', jobId);

  } catch (error) {
    console.error('Data cleaning error:', error);
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

async function updateJobProgress(supabaseClient: any, jobId: string, progress: number, message?: string) {
  await supabaseClient
    .from('data_processing_jobs')
    .update({ progress })
    .eq('id', jobId);
}

async function cleanCsvData(csvContent: string, options: CleaningOptions): Promise<any[]> {
  const lines = csvContent.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const data = lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
    const row: any = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    return row;
  });

  let cleanedData = [...data];

  // Remove duplicates
  if (options.removeDuplicates) {
    cleanedData = cleanedData.filter((item, index, self) => 
      index === self.findIndex(t => JSON.stringify(t) === JSON.stringify(item))
    );
  }

  // Handle missing values
  if (options.handleMissingValues === 'remove') {
    cleanedData = cleanedData.filter(row => 
      Object.values(row).every(value => value !== '' && value !== null && value !== undefined)
    );
  } else if (options.handleMissingValues === 'fill') {
    cleanedData = cleanedData.map(row => {
      const filledRow = { ...row };
      Object.keys(filledRow).forEach(key => {
        if (!filledRow[key] || filledRow[key] === '') {
          filledRow[key] = 'N/A';
        }
      });
      return filledRow;
    });
  }

  // Normalize text
  if (options.normalizeText) {
    cleanedData = cleanedData.map(row => {
      const normalizedRow = { ...row };
      Object.keys(normalizedRow).forEach(key => {
        if (typeof normalizedRow[key] === 'string') {
          normalizedRow[key] = normalizedRow[key].toLowerCase().trim();
        }
      });
      return normalizedRow;
    });
  }

  return cleanedData;
}

async function cleanJsonData(jsonContent: string, options: CleaningOptions): Promise<any[]> {
  try {
    let data = JSON.parse(jsonContent);
    if (!Array.isArray(data)) {
      data = [data];
    }
    
    // Apply similar cleaning logic as CSV
    return data;
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
}

async function cleanSqlData(sqlContent: string, options: CleaningOptions): Promise<any[]> {
  // For SQL files, extract INSERT statements and convert to JSON format
  const insertMatches = sqlContent.match(/INSERT\s+INTO\s+\w+\s*\([^)]+\)\s+VALUES\s*\([^)]+\)/gi);
  if (!insertMatches) {
    return [];
  }
  
  // Simple parsing - in production, use a proper SQL parser
  return insertMatches.map((statement, index) => ({
    id: index,
    sql_statement: statement.trim(),
    parsed: true
  }));
}
