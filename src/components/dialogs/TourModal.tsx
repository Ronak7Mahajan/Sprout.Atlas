import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProduceDoodle } from '../doodles/ProduceDoodle';
import { X, ArrowRight, ArrowLeft, Check } from 'lucide-react';

export const TourModal: React.FC = () => {
  const { showTourModal, setShowTourModal } = useApp();
  const [currentStep, setCurrentStep] = useState<number>(0);

  if (!showTourModal) return null;

  const steps = [
    {
      title: '500+ Botanical Guides',
      subtitle:
        'Discover field-grade nutrition facts, optimal refrigerator storage, ripeness cues, and washing advice for every fruit and vegetable.',
      badge: 'ENCYCLOPEDIA',
      badgeColor: '#2E6B47',
      doodles: [
        { symbolId: 'd-apple', archetype: 'pome', name: 'Apple' },
        { symbolId: 'd-carrot', archetype: 'root', name: 'Carrot' },
        { symbolId: 'd-strawberry', archetype: 'berry', name: 'Strawberry' },
      ],
    },
    {
      title: 'The 6-Color Rainbow Plate',
      subtitle:
        'Log your daily botanical diversity across Red, Orange, Yellow, Green, Blue/Purple, and White phytonutrient categories to optimize gut microbiome health.',
      badge: 'DAILY NUTRITION',
      badgeColor: '#D97724',
      doodles: [
        { symbolId: 'd-tomato', archetype: 'nightshade', name: 'Tomato' },
        { symbolId: 'd-lemon', archetype: 'citrus', name: 'Lemon' },
        { symbolId: 'd-blueberry', archetype: 'berry', name: 'Blueberry' },
      ],
    },
    {
      title: 'Daily Mystery Specimen Quiz',
      subtitle:
        'Test your produce knowledge each day with 3 progressive botanical clues. Guess correctly to build your explorer streak!',
      badge: 'DAILY CHALLENGE',
      badgeColor: '#C7432B',
      doodles: [
        { symbolId: 'd-avocado', archetype: 'stone', name: 'Avocado' },
        { symbolId: 'd-mushroom', archetype: 'mushroom', name: 'Mushroom' },
        { symbolId: 'd-garlic', archetype: 'allium', name: 'Garlic' },
      ],
    },
    {
      title: 'Camera Vision & Clinical AI Labs',
      subtitle:
        'Upload photos or capture live produce for instant freshness and edibility analysis, and generate whole-food meal plans calibrated to your body weight.',
      badge: 'AI & CAMERA LABS',
      badgeColor: '#1E482F',
      doodles: [
        { symbolId: 'd-broccoli', archetype: 'crucifer', name: 'Broccoli' },
        { symbolId: 'd-banana', archetype: 'tropical', name: 'Banana' },
        { symbolId: 'd-watermelon', archetype: 'melon', name: 'Watermelon' },
      ],
    },
  ];

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-[#FAF6E9] rounded-3xl border-2 border-[#233022]/15 shadow-2xl p-6 overflow-hidden">
        {/* Header bar */}
        <div className="flex items-center justify-between pb-3">
          <div className="px-3 py-1 rounded-full bg-[#FFFDF5] border border-[#233022]/15 text-[11px] font-bold font-mono text-[#4A4E42]">
            STEP {currentStep + 1} OF {steps.length}
          </div>
          <button
            onClick={() => setShowTourModal(false)}
            className="w-8 h-8 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-[#4A4E42] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Doodles Row */}
        <div className="flex items-center justify-center gap-3 my-4">
          {step.doodles.map((d, idx) => (
            <div
              key={idx}
              className="w-18 h-18 rounded-2xl bg-[#FFFDF5] border border-[#233022]/10 flex items-center justify-center shadow-xs"
            >
              <ProduceDoodle symbolId={d.symbolId} archetype={d.archetype} name={d.name} size={48} />
            </div>
          ))}
        </div>

        {/* Text Section */}
        <div className="text-center my-3 px-2">
          <div className="inline-block px-3 py-1 rounded-full text-[11px] font-bold tracking-wider mb-2" style={{ backgroundColor: `${step.badgeColor}18`, color: step.badgeColor }}>
            {step.badge}
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#233022]">
            {step.title}
          </h3>
          <p className="text-sm text-[#4A4E42] mt-2 leading-relaxed">
            {step.subtitle}
          </p>
        </div>

        {/* Step indicator dots */}
        <div className="flex items-center justify-center gap-1.5 my-4">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentStep(i)}
              className={`h-2 rounded-full transition-all ${
                i === currentStep ? 'w-6 bg-[#233022]' : 'w-2 bg-[#233022]/20'
              }`}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          {currentStep > 0 ? (
            <button
              onClick={() => setCurrentStep((c) => c - 1)}
              className="flex-1 h-11 rounded-full border border-[#233022]/25 text-[#233022] hover:bg-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <button
              onClick={() => setShowTourModal(false)}
              className="flex-1 h-11 rounded-full text-[#7D8370] hover:text-[#233022] font-semibold text-xs transition-colors"
            >
              Skip Tour
            </button>
          )}

          <button
            onClick={() => {
              if (currentStep < steps.length - 1) {
                setCurrentStep((c) => c + 1);
              } else {
                setShowTourModal(false);
              }
            }}
            className="flex-1.5 h-11 rounded-full bg-[#233022] hover:bg-[#1B4332] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>{currentStep === steps.length - 1 ? 'Start Exploring!' : 'Next'}</span>
            {currentStep === steps.length - 1 ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
