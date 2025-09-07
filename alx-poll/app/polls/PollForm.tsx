import React, { useState } from 'react';

interface PollFormProps {
  onSubmit: (question: string) => void;
  initialQuestion?: string;
}

const PollForm: React.FC<PollFormProps> = ({ onSubmit, initialQuestion = '' }) => {
  const [question, setQuestion] = useState(initialQuestion);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      setError('Poll question cannot be empty.');
      return;
    }
    setError('');
    onSubmit(question);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="poll-question">Poll Question:</label>
      <input
        id="poll-question"
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        style={{ display: 'block', width: '100%', marginBottom: 4 }}
      />
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      <button type="submit">Submit</button>
    </form>
  );
};

export default PollForm;
