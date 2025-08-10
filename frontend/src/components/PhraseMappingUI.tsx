// src/components/PhraseMappingUI.tsx
import React, { useState, useEffect } from 'react';
import { fetchMapping, saveMapping } from '../api/apiClient';

interface PhraseMappingUIProps {
  sid: string; // user/session id
}

const PhraseMappingUI: React.FC<PhraseMappingUIProps> = ({ sid }) => {
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const map = await fetchMapping(sid);
        setMapping(map);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [sid]);

  async function handleSave() {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      await saveMapping(sid, mapping);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleChange(gestureKey: string, newPhrase: string) {
    setMapping((prev) => ({
      ...prev,
      [gestureKey]: newPhrase,
    }));
  }

  if (loading) return <p>Loading mapping...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ marginTop: 20 }}>
      <h2>Customize Gesture → Phrase Mapping</h2>
      <table border={1} cellPadding={8} style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Gesture Pattern</th>
            <th>Output Phrase</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(mapping).map(([gesture, phrase]) => (
            <tr key={gesture}>
              <td><strong>{gesture}</strong></td>
              <td>
                <input
                  type="text"
                  value={phrase}
                  onChange={(e) => handleChange(gesture, e.target.value)}
                  style={{ width: '100%' }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={handleSave}
        disabled={saving}
        style={{ marginTop: 10 }}
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
      {success && <p style={{ color: 'green' }}>Mapping saved!</p>}
    </div>
  );
};

export default PhraseMappingUI;
