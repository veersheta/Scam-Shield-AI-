
import React from 'react';
import QuizGame from './QuizGame';

const LiteracyHub: React.FC = () => {
  return (
    <div className="bg-light-glass dark:bg-dark-glass backdrop-blur-xl p-6 md:p-8 rounded-2xl border border-white/20">
      <h3 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">Scam Literacy Hub</h3>
      <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6">Knowledge is your best defense. Test your skills with our quiz to stay ahead of scammers.</p>
      <QuizGame />
    </div>
  );
};

export default LiteracyHub;