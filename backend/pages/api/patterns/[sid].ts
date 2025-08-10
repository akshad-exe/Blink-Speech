import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const defaultMapping = {
  doubleBlink_lookLeft: "Help",
  tripleBlink_lookRight: "Yes",
  longBlink: "Stop",
  lookUp: "Water please"
};

export default async function handler(req, res) {
  const { sid } = req.query;

  if (req.method === 'GET') {
    const { data } = await sb
      .from('patterns')
      .select('mapping')
      .eq('sid', sid)
      .single();

    res.status(200).json({ mapping: data?.mapping ?? defaultMapping });
  } else if (req.method === 'POST') {
    const { mapping } = req.body;
    await sb
      .from('patterns')
      .upsert({ sid, mapping }, { onConflict: 'sid' });
    res.status(201).json({ success: true });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
