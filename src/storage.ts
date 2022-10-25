const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_KEY = Deno.env.get('SUPABASE_KEY') || '';

const QUERY_URL = `https://${ SUPABASE_URL }.supabase.co/rest/v1/texts`;

const querySupabase = async (query: string, method?: string, data?: unknown) => {
  return await fetch(`${ QUERY_URL }?${ query }`, {
    method: method || 'GET',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${ SUPABASE_KEY }`,
      'Content-Type': 'application/json',
    },

    body: data ? JSON.stringify(data) : undefined,
  });
}

export const getText = async (uuid: string): Promise<string | null> => {
  const response = await querySupabase(`select=text&uuid=eq.${ uuid }`);

  if (!response.ok) return null;

  const json = await response.json();
  return json.length ? json[0].text : null;
}

export const setText = (uuid: string, value: string) => {
  querySupabase(`select=text&uuid=eq.${ uuid }`).then(async response => {
    const json = await response.json();
    json.length
      ? querySupabase(`uuid=eq.${ uuid }`, 'PATCH', { text: value })
      : querySupabase('', 'POST', { uuid, text: value });
  });
}
