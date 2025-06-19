import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vyplifyflwrdqftojktm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5cGxpZnlmbHdyZHFmdG9qa3RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNDEwMTksImV4cCI6MjA2NTkxNzAxOX0.9b1WLtqX9-dieD8uAunaK-5FNjgKCP-AVAzI8AGvXcU';
const supabase = createClient(supabaseUrl, supabaseKey);

const sessions = [
  { number: 1, title: 'SUD Assessment' },
  { number: 2, title: 'Understanding Addiction & CPS' },
  { number: 3, title: 'Triggers, Cravings & Coping' },
  { number: 4, title: 'Parenting Skills in Recovery' },
  { number: 5, title: 'Relapse Prevention & Support' },
  { number: 6, title: 'Rebuilding Trust & Consistency' },
  { number: 7, title: 'Boundaries & Communication' },
  { number: 8, title: 'Grief, Guilt & Repair' },
  { number: 9, title: 'Identity & Future Planning' },
  { number: 10, title: 'Reflection & Graduation' }
];

export default function App() {
  const [clientName, setClientName] = useState('');
  const [clientId, setClientId] = useState(null);
  const [currentSession, setCurrentSession] = useState(null);
  const [clientResponse, setClientResponse] = useState('');
  const [note, setNote] = useState('');

  const saveClient = async () => {
    if (!clientName) return;
    const { data } = await supabase
      .from('clients')
      .upsert([{ name: clientName }], { onConflict: ['name'] })
      .select();
    if (data && data.length > 0) setClientId(data[0].id);
  };

  const generateNote = async () => {
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();
    const session = sessions.find(s => s.number === currentSession)?.title;
    const content = `Client: ${clientName}\nSession: ${session}\nDate: ${date} ${time}\n\nClient Response:\n${clientResponse}\n\nClient appeared engaged.\n\nSigned: Lisha Fant, LCDC, MS`;
    setNote(content);

    if (clientId) {
      await supabase.from('sessions').insert([
        {
          client_id: clientId,
          session_number: currentSession,
          response: clientResponse,
          note: content,
          created_at: new Date().toISOString()
        }
      ]);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Grateful-Guidance Counseling Curriculum</h1>

      <input
        placeholder="Client Name"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
        style={{ padding: '8px', margin: '10px 0', width: '300px' }}
      />
      <button onClick={saveClient} style={{ padding: '8px 12px', marginLeft: '10px' }}>Save Client</button>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', margin: '20px 0' }}>
        {sessions.map(s => (
          <button key={s.number} onClick={() => setCurrentSession(s.number)} style={{ padding: '10px' }}>
            Session {s.number}
          </button>
        ))}
      </div>

      {currentSession && (
        <div style={{ marginTop: '20px' }}>
          <h2 style={{ fontSize: '18px' }}>
            Session {currentSession}: {sessions.find(s => s.number === currentSession)?.title}
          </h2>
          <textarea
            placeholder="Client response and notes..."
            value={clientResponse}
            onChange={(e) => setClientResponse(e.target.value)}
            rows={6}
            style={{ width: '100%', padding: '10px', marginTop: '10px' }}
          />
          <button onClick={generateNote} style={{ padding: '10px', marginTop: '10px' }}>
            Generate Progress Note
          </button>
          {note && (
            <div style={{ background: '#f4f4f4', padding: '15px', marginTop: '15px', whiteSpace: 'pre-wrap' }}>
              {note}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
