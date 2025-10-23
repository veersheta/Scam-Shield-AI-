
import React from 'react';
import QuizGame from './QuizGame';

const LiteracyHub: React.FC = () => {
  return (
    <div className="bg-neutral-dark p-6 md:p-8 rounded-2xl border border-neutral-light">
      <h3 className="text-2xl font-bold text-text-primary mb-2">Scam Literacy Hub</h3>
      <p className="text-text-secondary mb-6">Knowledge is your best defense. Test your skills with our quiz to stay ahead of scammers.</p>
      <QuizGame />
    </div>
  );
};

export default LiteracyHub;