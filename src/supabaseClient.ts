import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;
let cachedConfig: {
  supabaseUrl: string;
  supabaseAnonKey: string;
  hasServiceRoleKey: boolean;
  hasResendKey: boolean;
} | null = null;

export interface BackendConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  hasServiceRoleKey: boolean;
  hasResendKey: boolean;
}

/**
 * Fetches the public Supabase config and API states from the Express backend securely.
 */
export async function fetchBackendConfig(): Promise<BackendConfig> {
  if (cachedConfig) return cachedConfig;
  try {
    const res = await fetch('/api/config');
    if (!res.ok) throw new Error('Failed to retrieve credentials from backend configuration api');
    const data = await res.json();
    cachedConfig = data;
    return data;
  } catch (err) {
    console.warn('Could not retrieve backend config API, falling back to client environment.', err);
    return {
      supabaseUrl: ((import.meta as any).env?.VITE_SUPABASE_URL as string) || '',
      supabaseAnonKey: ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string) || '',
      hasServiceRoleKey: false,
      hasResendKey: false,
    };
  }
}

/**
 * Checks if Supabase client credentials are fully configured.
 */
export async function isSupabaseConfigured(): Promise<boolean> {
  const config = await fetchBackendConfig();
  return !!(config.supabaseUrl && config.supabaseAnonKey);
}

/**
 * Gets or initializes the Supabase client.
 * Returns null if Supabase is not configured yet.
 */
// export async function getSupabaseClient(): Promise<SupabaseClient | null> {
//   if (supabaseClient) return supabaseClient;

//   const config = await fetchBackendConfig();
//   const url = config.supabaseUrl || ((import.meta as any).env?.VITE_SUPABASE_URL as string);
//   const key = config.supabaseAnonKey || ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string);

//   if (!url || !key) {
//     console.warn('Supabase URL or Anon Key is missing. Live cloud sync is suspended. Please input your credentials in the settings panel.');
//     return null;
//   }

//   try {
//     supabaseClient = createClient(url, key, {
//       auth: {
//         persistSession: true,
//         autoRefreshToken: true,
//       }
//     });
//     return supabaseClient;
//   } catch (err) {
//     console.error('Failed to initialize Supabase client:', err);
//     return null;
//   }
// }

// export async function getSupabaseClient(): Promise<SupabaseClient | null> {
//   // TEMPORARY: Force offline mode for demo
//   return null;
// }
export async function getSupabaseClient(): Promise<SupabaseClient | null> {
  console.log("OFFLINE MODE ENABLED");
  return null;
}

/**
 * Proxy function to send emails via Resend from the server.
 */
export async function sendResendEmail(to: string, subject: string, bodyText: string): Promise<{ success: boolean; error?: string; simulated?: boolean }> {
  try {
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #4f46e5; margin-bottom: 20px;">WorkspaceOS Notification</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap;">${bodyText}</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 11px; color: #64748b;">This is an automated notification from WorkspaceOS.</p>
      </div>
    `;

    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, subject, html }),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Server error sending email');
    }

    return await res.json();
  } catch (err: any) {
    console.error('sendResendEmail error:', err);
    return { success: false, error: err.message };
  }
}
