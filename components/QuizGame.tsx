
import React, { useState } from 'react';
import { QUIZ_DATA } from '../constants';
import { CheckCircleIcon, ShieldExclamationIcon, XCircleIcon } from './icons/Icons';

const QuizGame: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);

  const currentQuestion = QUIZ_DATA[currentQuestionIndex];

  const handleAnswerSelect = (index: number) => {
    if (isAnswered) return;

    const isCorrect = index === currentQuestion.correctAnswerIndex;
    setSelectedAnswerIndex(index);
    setIsAnswered(true);
    setResults([...results, isCorrect]);
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setIsAnswered(false);
    setSelectedAnswerIndex(null);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };
  
  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswerIndex(null);
    setIsAnswered(false);
    setResults([]);
  };
  
  const getScoreFeedback = (finalScore: number) => {
    const percentage = (finalScore / QUIZ_DATA.length) * 100;
    if (percentage === 100) return { message: "Scam Expert!", color: "text-soft-mint" };
    if (percentage >= 75) return { message: "Great Job!", color: "text-electric-purple" };
    if (percentage >= 50) return { message: "Good Effort!", color: "text-warm-amber" };
    return { message: "Keep Learning!", color: "text-text-secondary" };
  };

  if (currentQuestionIndex >= QUIZ_DATA.length) {
    const feedback = getScoreFeedback(score);
    const percentage = (score / QUIZ_DATA.length) * 100;
    return (
      <div className="text-center p-4">
        <h4 className="text-2xl font-bold text-text-primary mb-2">Quiz Complete!</h4>
        <p className={`text-lg font-semibold mb-6 ${feedback.color}`}>{feedback.message}</p>
        
        <div className="relative w-36 h-36 mx-auto mb-6 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              className="text-neutral-light"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
              r="44"
              cx="50"
              cy="50"
            />
            <circle
              className="text-electric-purple"
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 44 * (percentage / 100)}, ${2 * Math.PI * 44}`}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="44"
              cx="50"
              cy="50"
              style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dasharray 1s ease-out' }}
            />
          </svg>
          <div className="absolute text-center">
            <span className="block text-3xl font-bold text-text-primary">{score}</span>
            <span className="block text-sm text-text-secondary">/{QUIZ_DATA.length}</span>
          </div>
        </div>

        <button
          onClick={handleRestart}
          className="bg-gradient-to-r from-brand-gradient-from to-brand-gradient-to bg-[size:200%_auto] animate-gradient-x hover:shadow-glow-purple text-white font-bold py-2 px-6 rounded-lg"
        >
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-semibold text-text-secondary">
          Question {currentQuestionIndex + 1}/{QUIZ_DATA.length}
        </span>
        <span className="text-sm font-semibold text-text-secondary">Score: {score}</span>
      </div>
      <div className="w-full bg-charcoal-black rounded-full h-2.5 mb-6 ring-1 ring-neutral-light">
        <div className="bg-electric-purple h-2.5 rounded-full transition-all duration-500" style={{ width: `${((currentQuestionIndex + 1) / QUIZ_DATA.length) * 100}%` }}></div>
      </div>
      
      <h4 className="text-lg font-semibold text-text-primary mb-6">{currentQuestion.question}</h4>
      
      <div className="space-y-3">
        {currentQuestion.options.map((option, index) => {
          const isCorrect = index === currentQuestion.correctAnswerIndex;
          const isSelected = index === selectedAnswerIndex;
          
          let buttonClass = 'w-full text-left p-4 rounded-lg border-2 border-neutral-light bg-charcoal-black hover:border-electric-purple transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-between';
          
          if (isAnswered && isCorrect) {
            buttonClass += ' bg-soft-mint/10 border-soft-mint/50';
          } else if (isAnswered && isSelected && !isCorrect) {
            buttonClass += ' bg-warm-amber/10 border-warm-amber/50';
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={isAnswered}
              className={buttonClass}
            >
              <span className="text-text-secondary">{option}</span>
              {isAnswered && isCorrect && <CheckCircleIcon className="h-6 w-6 text-soft-mint" />}
              {isAnswered && isSelected && !isCorrect && <XCircleIcon className="h-6 w-6 text-warm-amber" />}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className="mt-6 p-4 bg-charcoal-black rounded-lg border border-neutral-light">
          <p className="font-bold text-text-primary mb-2">{selectedAnswerIndex === currentQuestion.correctAnswerIndex ? 'Correct!' : 'Not Quite.'}</p>
          <p className="text-text-secondary text-sm">{currentQuestion.explanation}</p>
          <button
            onClick={handleNext}
            className="mt-4 w-full bg-electric-purple hover:opacity-90 transition-opacity text-white font-bold py-2 px-4 rounded-lg"
          >
            {currentQuestionIndex === QUIZ_DATA.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizGame;