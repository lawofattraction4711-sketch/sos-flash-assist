import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AuditQueueItem {
  id: string
  user_id: string | null
  table_name: string
  operation: string
  accessed_data: any
  session_id: string | null
  request_id: string | null
  created_at: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create Supabase client with service role key for secure operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    console.log('Processing audit queue...')

    // Get unprocessed audit queue items
    const { data: queueItems, error: queueError } = await supabase
      .from('audit_queue')
      .select('*')
      .eq('processed', false)
      .order('created_at', { ascending: true })
      .limit(100)

    if (queueError) {
      console.error('Error fetching audit queue:', queueError)
      throw queueError
    }

    if (!queueItems || queueItems.length === 0) {
      console.log('No audit items to process')
      return new Response(
        JSON.stringify({ message: 'No audit items to process', processed: 0 }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    console.log(`Processing ${queueItems.length} audit items`)
    let processedCount = 0
    const errors: string[] = []

    // Process each audit item
    for (const item of queueItems as AuditQueueItem[]) {
      try {
        // Generate audit hash for integrity verification
        const { data: hashResult, error: hashError } = await supabase
          .rpc('generate_audit_hash', {
            p_user_id: item.user_id,
            p_table_name: item.table_name,
            p_operation: item.operation,
            p_accessed_data: item.accessed_data,
            p_timestamp: item.created_at
          })

        if (hashError) {
          console.error('Error generating hash for item:', item.id, hashError)
          errors.push(`Hash generation failed for ${item.id}: ${hashError.message}`)
          continue
        }

        // Insert into secure audit_logs table (only service role can do this)
        const { error: insertError } = await supabase
          .from('audit_logs')
          .insert({
            user_id: item.user_id,
            table_name: item.table_name,
            operation: item.operation,
            accessed_data: item.accessed_data,
            session_id: item.session_id,
            request_id: item.request_id,
            hash_verification: hashResult,
            created_at: item.created_at
          })

        if (insertError) {
          console.error('Error inserting audit log for item:', item.id, insertError)
          errors.push(`Audit log insertion failed for ${item.id}: ${insertError.message}`)
          continue
        }

        // Mark queue item as processed
        const { error: updateError } = await supabase
          .from('audit_queue')
          .update({ processed: true })
          .eq('id', item.id)

        if (updateError) {
          console.error('Error marking item as processed:', item.id, updateError)
          errors.push(`Failed to mark ${item.id} as processed: ${updateError.message}`)
          continue
        }

        processedCount++
        console.log(`Successfully processed audit item ${item.id}`)

      } catch (error) {
        console.error('Unexpected error processing item:', item.id, error)
        errors.push(`Unexpected error for ${item.id}: ${error.message}`)
      }
    }

    console.log(`Processing complete. Processed: ${processedCount}, Errors: ${errors.length}`)

    return new Response(
      JSON.stringify({ 
        message: 'Audit queue processing complete',
        processed: processedCount,
        total: queueItems.length,
        errors: errors.length > 0 ? errors : undefined
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Fatal error in audit processing:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error during audit processing',
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})