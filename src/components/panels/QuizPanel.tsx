'use client';

import React, { useState, useEffect } from 'react';
import { useExplorerStore } from '../../store/useExplorerStore';
import { QUIZ_QUESTIONS } from '../../utils/molecules';
import { GlassCard } from '../ui/GlassCard';
import { NeonButton } from '../ui/NeonButton';
import { Award, CheckCircle2, XCircle, RotateCcw, ArrowRight } from 'lucide-react';

export const QuizPanel: React.FC = () => {
  const { activeMoleculeId, score, addScore, resetScore, scale } = useExplorerStore();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  // Retrieve questions for active scale or active molecule
  const activeQuizId = (scale === 'galaxy' || scale === 'earth' || scale === 'cell' || scale === 'quark') ? scale : activeMoleculeId;
  const questions = QUIZ_QUESTIONS[activeQuizId] || [];

  // Reset quiz state when user changes the module/scale
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setQuizFinished(false);
  }, [activeQuizId]);

  if (questions.length === 0) {
    return (
      <GlassCard className="w-[340px] p-5 flex flex-col items-center gap-3 border border-cyberGreen/20 pointer-events-auto" glowColor="green">
        <Award className="w-10 h-10 text-white/30" />
        <h2 className="text-sm font-mono uppercase tracking-wider text-white">Quantum Quiz Core</h2>
        <p className="text-xs text-slate-400 text-center leading-relaxed">
          No training quiz modules are loaded for the active molecule. Switch to Water, Carbon Dioxide, Caffeine, DNA, or Graphene.
        </p>
      </GlassCard>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  const handleSubmit = () => {
    if (selectedOption === null || isAnswered) return;
    setIsAnswered(true);
    
    if (selectedOption === currentQuestion!.correctAnswer) {
      addScore(100); // add XP
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setQuizFinished(false);
    resetScore();
  };

  return (
    <GlassCard className="w-full border border-cyberGreen/20 flex flex-col gap-4 pointer-events-auto" glowColor="green" showScanner>
      {/* Quiz Title Header */}
      <div className="flex justify-between items-center pb-2 border-b border-cyberGreen/20">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-cyberGreen" />
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white">Quantum Quiz</h2>
        </div>
        <div className="bg-cyberGreen/10 border border-cyberGreen/30 text-cyberGreen font-mono px-2 py-0.5 rounded text-[11px] font-bold">
          XP: {score}
        </div>
      </div>

      {!quizFinished ? (
        <div className="flex flex-col gap-4">
          {/* Question Index */}
          <div className="flex justify-between text-[10px] font-mono text-white/40">
            <span>QUESTION {currentQuestionIndex + 1} OF {questions.length}</span>
            <span>MODULE: {activeQuizId.toUpperCase()}</span>
          </div>

          {/* Question Text */}
          <p className="text-sm font-semibold text-slate-200 leading-relaxed font-sans">
            {currentQuestion?.question}
          </p>

          {/* Options List */}
          <div className="flex flex-col gap-2">
            {currentQuestion?.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQuestion.correctAnswer;
              
              // Border colors based on submit state
              let btnClass = 'border-white/10 bg-spaceLight/50 text-slate-300 hover:border-cyberGreen/30 hover:bg-cyberGreen/5';
              if (isSelected) {
                btnClass = 'border-cyberGreen bg-cyberGreen/10 text-white';
              }
              if (isAnswered) {
                if (isCorrect) {
                  btnClass = 'border-cyberGreen bg-cyberGreen/20 text-white shadow-neonGreen';
                } else if (isSelected) {
                  btnClass = 'border-cyberPink bg-cyberPink/20 text-white shadow-neonPink';
                } else {
                  btnClass = 'border-white/5 bg-spaceLight/30 text-white/40 cursor-not-allowed';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  disabled={isAnswered}
                  className={`text-left text-xs font-sans rounded p-3 border transition-all duration-200 flex justify-between items-center pointer-events-auto ${btnClass}`}
                >
                  <span>{opt}</span>
                  {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-cyberGreen shrink-0" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-cyberPink shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Action / Next Button */}
          {!isAnswered ? (
            <NeonButton
              variant="green"
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className="w-full pointer-events-auto"
            >
              Verify Answer
            </NeonButton>
          ) : (
            <div className="flex flex-col gap-3">
              {/* Answer Feedback Explanation */}
              <div className={`p-3 rounded text-xs leading-relaxed font-sans border ${
                selectedOption === currentQuestion.correctAnswer 
                  ? 'bg-cyberGreen/10 border-cyberGreen/20 text-green-200' 
                  : 'bg-cyberPink/10 border-cyberPink/20 text-pink-200'
              }`}>
                <span className="font-bold font-mono block mb-1">
                  {selectedOption === currentQuestion.correctAnswer ? 'SECURE_SUCCESS' : 'ANOMALY_DETECTED'}
                </span>
                {currentQuestion.explanation}
              </div>
              
              <NeonButton
                variant="green"
                onClick={handleNext}
                className="w-full flex items-center justify-center gap-2 pointer-events-auto"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </NeonButton>
            </div>
          )}
        </div>
      ) : (
        // Quiz Completed Screen
        <div className="flex flex-col items-center gap-4 py-3 text-center">
          <Award className="w-16 h-16 text-cyberGreen animate-bounce" />
          <div>
            <h3 className="text-lg font-bold font-mono text-white">Focus Assessment Completed</h3>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              You have successfully completed this molecule module.
            </p>
          </div>
          <div className="bg-spaceLight border border-cyberGreen/20 p-4 rounded-lg w-full flex flex-col gap-2">
            <span className="text-[10px] font-mono text-white/40 block">XP REWARD CERTIFIED</span>
            <span className="text-3xl font-extrabold font-mono text-cyberGreen text-glow-green">+{score} XP</span>
          </div>
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 text-xs font-mono text-cyberGreen hover:underline cursor-pointer pointer-events-auto"
          >
            <RotateCcw className="w-4 h-4" /> Restart Assessment
          </button>
        </div>
      )}
    </GlassCard>
  );
};
