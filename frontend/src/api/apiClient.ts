// src/api/apiClient.ts
export async function fetchMapping(sid: string) {
  const res = await fetch(`/api/patterns/${sid}`);
  if (!res.ok) throw new Error(`Error fetching mapping: ${res.statusText}`);
  const data = await res.json();
  return data.mapping;
}

export async function saveMapping(sid: string, mapping: Record<string, string>) {
  const res = await fetch(`/api/patterns/${sid}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mapping }),
  });
  if (!res.ok) throw new Error(`Error saving mapping: ${res.statusText}`);
  return await res.json();
}
