import React from 'react';
import { useApp } from '../../context/AppContext';
import { ProduceDoodle } from '../doodles/ProduceDoodle';
import { Flame, Star, Sparkles, ArrowLeft, User } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentTab,
    setCurrentTab,
    activeGuideId,
    setActiveGuideId,
    quizStreak,
    setShowQuizModal,
    setShowAccountModal,
    setShowPaywallModal,
    subscription,
    userProfile,
    firebaseUser,
  } = useApp();

  const handleLogoClick = () => {
    setActiveGuideId(null);
    setCurrentTab('home');
  };

  const monogram = React.useMemo(() => {
    const name = (firebaseUser?.displayName || userProfile.name || '').trim();
    const parts = name.split(' ').filter(Boolean);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    if (parts.length === 1 && parts[0].length >= 2) return parts[0].slice(0, 2).toUpperCase();
    return 'EX';
  }, [firebaseUser, userProfile.name]);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF6E9]/95 backdrop-blur-md border-b border-[#233022]/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between">
        {/* Left: Brand Zone with Back Button if Guide is open */}
        <div className="flex items-center gap-3">
          {activeGuideId !== null && (
            <button
              onClick={() => setActiveGuideId(null)}
              className="p-2 -ml-2 rounded-full hover:bg-[#233022]/5 text-[#233022] transition-colors flex items-center justify-center min-w-[44px] min-h-[44px]"
              aria-label="Back to previous screen"
            >
              <ArrowLeft className="w-5 h-5 text-[#233022]" />
            </button>
          )}

          <button
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-[#E6F4EA] border border-[#2E6B47]/20 flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
              <ProduceDoodle symbolId="d-sprout" name="Sprout" size={26} />
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#233022]">
                Sprout <span className="text-[#2E6B47] italic font-medium">Atlas</span>
              </span>
            </div>
          </button>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => {
              setActiveGuideId(null);
              setCurrentTab('home');
            }}
            className={`text-sm font-semibold transition-colors py-1 ${
              currentTab === 'home' && activeGuideId === null
                ? 'text-[#2E6B47] border-b-2 border-[#2E6B47]'
                : 'text-[#4A4E42] hover:text-[#233022]'
            }`}
          >
            Pulse
          </button>
          <button
            onClick={() => {
              setActiveGuideId(null);
              setCurrentTab('explore');
            }}
            className={`text-sm font-semibold transition-colors py-1 ${
              currentTab === 'explore'
                ? 'text-[#2E6B47] border-b-2 border-[#2E6B47]'
                : 'text-[#4A4E42] hover:text-[#233022]'
            }`}
          >
            Explore
          </button>
          <button
            onClick={() => {
              setActiveGuideId(null);
              setCurrentTab('labs');
            }}
            className={`text-sm font-semibold transition-colors py-1 ${
              currentTab === 'labs'
                ? 'text-[#2E6B47] border-b-2 border-[#2E6B47]'
                : 'text-[#4A4E42] hover:text-[#233022]'
            }`}
          >
            Labs
          </button>
          <button
            onClick={() => {
              setActiveGuideId(null);
              setCurrentTab('view');
            }}
            className={`text-sm font-semibold transition-colors py-1 ${
              currentTab === 'view'
                ? 'text-[#2E6B47] border-b-2 border-[#2E6B47]'
                : 'text-[#4A4E42] hover:text-[#233022]'
            }`}
          >
            Journal
          </button>
        </nav>

        {/* Right: Actions Zone (Pro Pill, Quiz Streak, Sign In / Profile) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Pro Badge */}
          <button
            onClick={() => setShowPaywallModal(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
              subscription.isPro
                ? 'bg-[#E8F5E9] text-[#1E482F] border-[#A5D6A7] hover:bg-[#C8E6C9]'
                : 'bg-[#FFF3E0] text-[#B45309] border-[#FDBA74] hover:bg-[#FFE0B2]'
            } min-h-[36px]`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{subscription.isPro ? 'PRO' : 'UPGRADE'}</span>
          </button>

          {/* Daily Quiz Streak Button */}
          <button
            onClick={() => setShowQuizModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 border border-[#233022]/15 text-[#233022] hover:bg-white transition-all shadow-2xs min-h-[36px]"
            title="Daily Specimen Quiz"
          >
            <Flame className="w-4 h-4 text-[#D97706]" />
            <span className="text-xs font-bold font-mono text-[#92400E]">{quizStreak}d</span>
          </button>

          {/* Sign In / Account Profile Button */}
          {firebaseUser ? (
            <button
              onClick={() => setShowAccountModal(true)}
              className="relative w-9 h-9 rounded-full bg-[#E4F0E5] border border-[#2E6B47]/30 flex items-center justify-center text-[#1E482F] font-bold text-xs hover:ring-2 hover:ring-[#2E6B47]/40 transition-all ml-1 shadow-2xs cursor-pointer"
              title={`Botanist Profile (${firebaseUser.displayName || firebaseUser.email || userProfile.name})`}
            >
              <span>{monogram}</span>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#16A34A] border-2 border-white rounded-full" />
            </button>
          ) : (
            <button
              onClick={() => setShowAccountModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2E6B47] hover:bg-[#1E482F] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer min-h-[36px] ml-0.5"
              title="Sign In to Sprout Atlas"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
