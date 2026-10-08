import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProduceDoodle } from '../doodles/ProduceDoodle';
import { X, Flame, CheckCircle2, AlertCircle, ArrowRight, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

export const QuizModal: React.FC = () => {
  const {
    showQuizModal,
    setShowQuizModal,
    todayQuiz,
    quizStreak,
    isQuizAnsweredToday,
    submitQuizAnswer,
    setActiveGuideId,
  } = useApp();

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(isQuizAnsweredToday);
  const [isCorrect, setIsCorrect] = useState<boolean>(isQuizAnsweredToday);

  if (!showQuizModal) return null;

  const handleSubmit = () => {
    if (selectedIndex === null) return;
    const correct = submitQuizAnswer(selectedIndex);
    setIsCorrect(correct);
    setHasSubmitted(true);
    if (correct) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2E6B47', '#D6482F', '#E79B1F', '#FACC15', '#4ADE80'],
        });
      } catch {}
    }
  };

  const handleOpenGuide = () => {
    setShowQuizModal(false);
    setActiveGuideId(todayQuiz.produceId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-[#FFFDF5] rounded-3xl border-2 border-[#233022]/15 shadow-2xl p-6 overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#B45309]">
            <Flame className="w-3.5 h-3.5 text-[#D97706]" />
            <span className="text-xs font-bold font-mono">{quizStreak}-Day Streak</span>
          </div>

          <button
            onClick={() => setShowQuizModal(false)}
            className="w-8 h-8 rounded-full bg-[#FAF6E9] hover:bg-[#233022]/5 flex items-center justify-center text-[#4A4E42] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Specimen Centerpiece Avatar */}
        <div className="flex flex-col items-center text-center my-2">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center border-2 transition-all ${
              hasSubmitted && isCorrect
                ? 'bg-[#DCFCE7] border-[#22C55E]'
                : hasSubmitted
                ? 'bg-[#FEE2E2] border-[#EF4444]'
                : 'bg-[#F0FDF4] border-[#10B981]/40'
            }`}
          >
            {hasSubmitted ? (
              <ProduceDoodle
                symbolId={todayQuiz.symbolId}
                archetype={todayQuiz.archetype}
                name={todayQuiz.specimenName}
                size={56}
              />
            ) : (
              <span className="font-mono text-3xl font-black text-[#065F46]">?</span>
            )}
          </div>

          <span className="text-[11px] font-bold tracking-wider uppercase text-[#065F46] mt-3">
            Daily Specimen · {todayQuiz.dateString}
          </span>
          <h2 className="text-xl font-bold font-serif text-[#233022] mt-0.5">
            {hasSubmitted && isCorrect
              ? 'You nailed it!'
              : hasSubmitted
              ? 'Good try!'
              : 'Guess the mystery produce'}
          </h2>
        </div>

        {/* Clues Box */}
        <div className="bg-[#F4FBF6] border border-[#D1FAE5] rounded-2xl p-3.5 space-y-2 my-4">
          {todayQuiz.clues.map((clue: string, idx: number) => (
            <div key={idx} className="flex items-start gap-2 text-xs leading-relaxed">
              <span className="font-mono font-bold text-[#065F46] shrink-0">
                Clue {idx + 1}:
              </span>
              <span className="text-[#374151]">{clue}</span>
            </div>
          ))}
        </div>

        {/* Options or Answer Resolution */}
        {!hasSubmitted ? (
          <div className="space-y-2">
            {todayQuiz.options.map((option: string, idx: number) => {
              const isSelected = selectedIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedIndex(idx)}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-semibold transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#065F46] text-white border-[#065F46] shadow-sm'
                      : 'bg-white text-[#233022] border-[#233022]/15 hover:border-[#233022]/40'
                  }`}
                >
                  <span>{option}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-[#86EFAC]" />}
                </button>
              );
            })}

            <button
              onClick={handleSubmit}
              disabled={selectedIndex === null}
              className="w-full mt-3 h-11 rounded-full bg-[#047857] hover:bg-[#065F46] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Submit Guess</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-4 pt-1">
            <div
              className={`p-3.5 rounded-2xl border text-center ${
                isCorrect
                  ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]'
                  : 'bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 font-bold text-sm">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Correct! It is {todayQuiz.specimenName}.</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    <span>Not quite! It was {todayQuiz.specimenName}.</span>
                  </>
                )}
              </div>
              <p className="text-xs text-[#4B5563] mt-2 leading-relaxed">
                {todayQuiz.funFact}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleOpenGuide}
                className="flex-1 h-11 rounded-full border border-[#047857] text-[#047857] hover:bg-[#ECFDF5] font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Open Guide</span>
              </button>
              <button
                onClick={() => setShowQuizModal(false)}
                className={`flex-1 h-11 rounded-full text-white font-bold text-xs transition-colors flex items-center justify-center ${
                  isCorrect ? 'bg-[#047857] hover:bg-[#065F46]' : 'bg-[#DC2626] hover:bg-[#B91C1C]'
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
