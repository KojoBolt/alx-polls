'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function CreatePollPage() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => setOptions([...options, '']);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Insert poll
    const { data, error } = await supabase
      .from('polls')
      .insert([{ question }])
      .select();

    if (error) {
      setMessage('Error creating poll: ' + error.message);
      setLoading(false);
      return;
    }

    const pollId = data?.[0]?.id;

    // Insert options
    const optionsData = options
      .filter((opt) => opt.trim() !== '')
      .map((opt) => ({ poll_id: pollId, option_text: opt }));

    if (optionsData.length > 0) {
      const { error: optionsError } = await supabase
        .from('options')
        .insert(optionsData);

      if (optionsError) {
        setMessage('Poll created, but error adding options: ' + optionsError.message);
        setLoading(false);
        return;
      }
    }

    setMessage('Poll created successfully!');
    setQuestion('');
    setOptions(['', '']);
    setLoading(false);
    setTimeout(() => {
      router.push('/polls');
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h1>Create a Poll</h1>
      <label>
        Question:
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
          style={{ width: '100%', marginBottom: 10 }}
        />
      </label>
      <h2>Options</h2>
      {options.map((opt, idx) => (
        <div key={idx}>
          <input
            type="text"
            value={opt}
            onChange={(e) => handleOptionChange(idx, e.target.value)}
            required
            style={{ width: '100%', marginBottom: 5 }}
          />
        </div>
      ))}
      <button type="button" onClick={addOption} style={{ marginBottom: 10 }}>
        Add Option
      </button>
      <br />
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Poll'}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}