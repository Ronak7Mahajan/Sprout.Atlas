import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProduceDoodle } from '../components/doodles/ProduceDoodle';
import { allProduceItems } from '../data/produceCatalog';
import { CorkboardItem } from '../types/produce';
import {
  Search,
  Flame,
  Sparkles,
  Shuffle,
  BookOpen,
  Apple,
  Thermometer,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  Clock,
  Droplets,
  Layers,
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const {
    setCurrentTab,
    setActiveGuideId,
    setExploreCategoryFilter,
    setExploreSearchQuery,
    setShowQuizModal,
    weeklyCorkboardItems,
    weekLabel,
    shuffleCorkboard,
    quizStreak,
    todayQuiz,
    isQuizAnsweredToday,
  } = useApp();

  const [activeHeroTab, setActiveHeroTab] = useState<'atlas' | 'quiz'>('atlas');
  const [searchInput, setSearchInput] = useState<string>('');
  const [activeAnatomyTab, setActiveAnatomyTab] = useState<'nutrition' | 'storage' | 'terroir' | 'detox'>('nutrition');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setExploreSearchQuery(searchInput.trim());
      setExploreCategoryFilter('All');
      setCurrentTab('explore');
    }
  };

  const handleCategoryClick = (cat: string) => {
    setExploreCategoryFilter(cat);
    setExploreSearchQuery('');
    setCurrentTab('explore');
  };

  const sampleGuides = [
    { item: allProduceItems.find((i) => i.id === 157)!, tag: 'Stone Fruit' }, // Avocado
    { item: allProduceItems.find((i) => i.id === 91)!, tag: 'Berry' }, // Strawberry
    { item: allProduceItems.find((i) => i.id === 276)!, tag: 'Cruciferous' }, // Broccoli
    { item: allProduceItems.find((i) => i.id === 166)!, tag: 'Pome' }, // Gala Apple
    { item: allProduceItems.find((i) => i.id === 331)!, tag: 'Root Veg' }, // Carrot
    { item: allProduceItems.find((i) => i.id === 55)!, tag: 'Citrus' }, // Lemon
    { item: allProduceItems.find((i) => i.id === 374)!, tag: 'Nightshade' }, // Tomato
  ].filter((s) => Boolean(s.item));

  const categoryChips = [
    { label: 'Fruits', cat: 'Tropical Fruits', symbolId: 'd-banana', archetype: 'tropical' },
    { label: 'Leafy & green', cat: 'Leafy Greens', symbolId: 'd-spinach', archetype: 'leafy' },
    { label: 'Roots & tubers', cat: 'Root & Tuber Vegetables', symbolId: 'd-carrot', archetype: 'root' },
    { label: 'Nightshades', cat: 'Nightshades', symbolId: 'd-tomato', archetype: 'nightshade' },
    { label: 'Citrus', cat: 'Citrus Fruits', symbolId: 'd-lemon', archetype: 'citrus' },
    { label: 'Stone & pit', cat: 'Stone Fruits (Drupes)', symbolId: 'd-peach', archetype: 'stone' },
    { label: 'Berries', cat: 'Berries & Small Fruits', symbolId: 'd-strawberry', archetype: 'berry' },
    { label: 'Gourds', cat: 'Gourds & Squashes', symbolId: 'd-zucchini', archetype: 'gourd' },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* 1. HERO CAROUSEL / SLIDE BOARD */}
      <section className="pt-2">
        {/* Switcher & Streak Banner */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="inline-flex p-1 rounded-full bg-white/80 border border-[#10B981]/25 backdrop-blur-xs shadow-2xs">
            <button
              onClick={() => setActiveHeroTab('atlas')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeHeroTab === 'atlas'
                  ? 'bg-gradient-to-r from-[#10B981] to-[#047857] text-white shadow-xs'
                  : 'text-[#4A4E42] hover:text-[#233022]'
              }`}
            >
              <span>Atlas</span>
            </button>
            <button
              onClick={() => setActiveHeroTab('quiz')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeHeroTab === 'quiz'
                  ? 'bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white shadow-xs'
                  : 'text-[#4A4E42] hover:text-[#233022]'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Daily Quiz</span>
            </button>
          </div>

          <button
            onClick={() => setShowQuizModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#FEF3C7] to-[#FDE68A] border border-[#F59E0B]/40 text-[#92400E] text-xs font-bold shadow-2xs hover:shadow-xs transition-all"
          >
            <Flame className="w-4 h-4 text-[#D97706]" />
            <span>{quizStreak}-Day Streak</span>
          </button>
        </div>

        {/* Hero Card 1: Atlas Explorer */}
        {activeHeroTab === 'atlas' && (
          <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#F5FEF7] via-[#DCFCE7]/70 to-[#A7F3D0]/60 border-2 border-[#10B981]/40 shadow-sm overflow-hidden">
            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 text-[#065F46] text-[10px] font-bold font-mono tracking-wider uppercase">
                  <Sparkles className="w-3 h-3" />
                  <span>Botanical Field Atlas · 500+ Guides</span>
                </span>

                {/* Overlapping Specimen Avatars */}
                <div className="flex -space-x-2">
                  <div className="w-9 h-9 rounded-full bg-white border-2 border-white shadow-xs flex items-center justify-center">
                    <ProduceDoodle symbolId="d-avocado" name="Avocado" size={24} />
                  </div>
                  <div className="w-9 h-9 rounded-full bg-white border-2 border-white shadow-xs flex items-center justify-center">
                    <ProduceDoodle symbolId="d-strawberry" name="Strawberry" size={24} />
                  </div>
                  <div className="w-9 h-9 rounded-full bg-white border-2 border-white shadow-xs flex items-center justify-center">
                    <ProduceDoodle symbolId="d-lemon" name="Lemon" size={24} />
                  </div>
                </div>
              </div>

              <div>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#233022]">
                  Know Your Produce
                </h1>
                <p className="text-sm sm:text-base text-[#4A4E42] mt-1 leading-relaxed">
                  A field guide for the grocery aisle. Look up ripeness benchmarks, 1% baking soda washing protocols, pesticide profiles, and nutritional biochemistry.
                </p>
              </div>

              {/* Live Search Input */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="relative flex items-center">
                  <Search className="w-5 h-5 text-[#2E6B47] absolute left-4 pointer-events-none" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search 500+ fruits & veggies (e.g. avocado, kale, mango) — typos okay"
                    className="w-full h-13 pl-11 pr-24 rounded-full bg-white border border-[#233022]/15 shadow-sm text-sm font-medium text-[#233022] placeholder:text-[#7D8370] focus:outline-none focus:ring-2 focus:ring-[#2E6B47]/50"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 h-10 px-5 rounded-full bg-[#2E6B47] hover:bg-[#1E482F] text-white text-xs font-bold transition-all shadow-2xs"
                  >
                    Search
                  </button>
                </div>
              </form>


              {/* Micro Value Metrics Ribbon */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#10B981]/25 text-xs text-[#233022]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#047857]" />
                  <span className="font-semibold">500+ Hand-Curated Guides</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#1D4ED8]" />
                  <span className="font-semibold">19 Plant Families</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#B45309]" />
                  <span className="font-semibold">AI Multimodal Vision</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hero Card 2: Today's Botanical Quiz */}
        {activeHeroTab === 'quiz' && (
          <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#F4FBF6] via-[#E3F7EB] to-[#C7EED6] border-2 border-[#22C55E]/50 shadow-sm overflow-hidden">
            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#22C55E]/20 border border-[#22C55E]/40 text-[#065F46] text-[10px] font-bold font-mono tracking-wider uppercase">
                  <HelpCircle className="w-3 h-3" />
                  <span>Today's Mystery Challenge</span>
                </span>

                <div className="w-12 h-12 rounded-full bg-[#DCFCE7] border border-[#22C55E] flex items-center justify-center shadow-xs">
                  {isQuizAnsweredToday ? (
                    <ProduceDoodle symbolId={todayQuiz.symbolId} name={todayQuiz.specimenName} size={34} />
                  ) : (
                    <span className="font-mono text-xl font-black text-[#065F46]">?</span>
                  )}
                </div>
              </div>

              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#233022]">
                  {isQuizAnsweredToday ? `Identified: ${todayQuiz.specimenName}!` : 'Mystery Botanical Specimen'}
                </h2>
                <p className="text-sm text-[#4A4E42] mt-1 leading-relaxed">
                  Three progressive clues, one mystery fruit or vegetable. Guess correctly to build your field botanist streak.
                </p>
              </div>

              {/* Primary Clue Box */}
              <div className="bg-white/90 border border-[#10B981]/30 rounded-2xl p-4">
                <span className="text-[11px] font-mono font-bold text-[#047857] block mb-1">
                  Primary Clue:
                </span>
                <p className="text-sm italic text-[#233022] font-serif leading-relaxed">
                  "{todayQuiz.clues[0]}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => setShowQuizModal(true)}
                  className="px-6 h-11 rounded-full bg-[#047857] hover:bg-[#065F46] text-white font-bold text-xs transition-all shadow-sm flex items-center gap-2"
                >
                  <span>{isQuizAnsweredToday ? 'Review Solution' : 'Solve Quiz Now'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveHeroTab('atlas')}
                  className="px-4 h-11 rounded-full border border-[#233022]/20 hover:bg-white text-xs font-semibold text-[#233022] transition-colors"
                >
                  Back to Atlas
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 2. SEASONAL CORKBOARD (Tactile Wood Frame + 6 Polaroid Slides with Pushpins & Washi Tape) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#D6482F] shadow-xs" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#233022]">
              Seasonal Corkboard
            </span>
          </div>
          <button
            onClick={shuffleCorkboard}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 hover:bg-white border border-[#8D6E63]/30 text-[#3E2723] text-xs font-bold transition-all shadow-2xs"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Shuffle</span>
          </button>
        </div>

        {/* Wooden Frame Container */}
        <div className="p-3 sm:p-4 rounded-3xl bg-gradient-to-br from-[#8D6E63] via-[#5D4037] to-[#3E2723] shadow-md border-2 border-[#3E2723]">
          {/* Cork Surface with Texture */}
          <div className="relative rounded-2xl bg-gradient-to-br from-[#EAD9B8] via-[#DECA9F] to-[#BF9F6A] p-4 sm:p-6 shadow-inner overflow-hidden border border-[#A1887F]/40">
            {/* Ambient Corner Screws */}
            <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-gradient-to-br from-[#FFF9C4] to-[#B45309] border border-[#78350F]" />
            <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-gradient-to-br from-[#FFF9C4] to-[#B45309] border border-[#78350F]" />
            <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-gradient-to-br from-[#FFF9C4] to-[#B45309] border border-[#78350F]" />
            <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-gradient-to-br from-[#FFF9C4] to-[#B45309] border border-[#78350F]" />

            {/* Polaroid Pins Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 pt-2 pb-4">
              {weeklyCorkboardItems.map((item: CorkboardItem) => (
                <div
                  key={item.id}
                  onClick={() => setActiveGuideId(item.id)}
                  style={{ transform: `rotate(${item.rotation}deg)` }}
                  className="group relative cursor-pointer transition-transform hover:scale-105 hover:z-20"
                >
                  {/* Fastener: Pushpin or Washi Tape */}
                  {item.pinStyle === 'WASHI_TAPE' ? (
                    <div
                      style={{ transform: `rotate(${item.tapeRotation}deg)` }}
                      className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-4 bg-[#E8D68A]/90 border border-[#D4C175] shadow-xs rounded-xs z-10"
                    />
                  ) : item.pinStyle === 'BRASS_TACK' ? (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-[#FFF7C2] via-[#E6C158] to-[#997A24] border border-[#6B5416] shadow-sm z-10" />
                  ) : (
                    <div
                      style={{ backgroundColor: item.pinColor }}
                      className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border border-white/60 shadow-sm z-10"
                    />
                  )}

                  {/* Polaroid White Card */}
                  <div className="bg-white rounded-xl p-2.5 sm:p-3 shadow-md border border-[#E8E0D2] flex flex-col items-center">
                    <div className="w-full aspect-square rounded-lg bg-gradient-to-b from-[#F9FAF8] to-[#F0F5EE] border border-[#E0E8DC] flex items-center justify-center p-2 mb-2">
                      <ProduceDoodle
                        symbolId={item.symbolId}
                        archetype={item.archetype}
                        name={item.name}
                        size={64}
                      />
                    </div>
                    <span className="font-bold text-xs sm:text-sm text-[#2C2523] truncate max-w-full text-center">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-[#7D8370] truncate max-w-full mt-0.5">
                      {item.funFactSnippet}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Harvest Label Banner */}
            <div className="text-center pt-2">
              <span className="inline-block px-4 py-1 rounded-full bg-[#3E2723]/80 text-[#FFF8E1] text-[11px] font-bold tracking-wide">
                🌱 {weekLabel} · Rotates weekly with harvest
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORY QUICK-STRIP */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#233022]">
            Browse by Family
          </span>
          <button
            onClick={() => handleCategoryClick('All')}
            className="text-xs font-semibold text-[#2E6B47] hover:underline"
          >
            View all 19
          </button>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
          {categoryChips.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => handleCategoryClick(cat.cat)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-[#233022]/15 hover:border-[#2E6B47] text-xs font-semibold text-[#233022] shadow-2xs whitespace-nowrap transition-all hover:bg-[#FAF6E9]"
            >
              <ProduceDoodle symbolId={cat.symbolId} archetype={cat.archetype} name={cat.label} size={22} />
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 4. THE ATLAS BROWSE GRID (8 Curated Specimens) */}
      <section className="space-y-4">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase text-[#2E6B47]">
            Featured Specimens
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#233022] mt-0.5">
            Open any guide, learn the whole story.
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {sampleGuides.map(({ item, tag }) => (
            <div
              key={item.id}
              onClick={() => setActiveGuideId(item.id)}
              className="bg-white rounded-2xl p-3.5 border border-[#233022]/15 hover:border-[#2E6B47] transition-all cursor-pointer shadow-2xs hover:shadow-xs flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div className="w-14 h-14 rounded-xl bg-[#F0FDF4] border border-[#2E6B47]/20 flex items-center justify-center p-1.5 transition-transform group-hover:scale-105">
                    <ProduceDoodle
                      symbolId={item.symbolId}
                      archetype={item.archetype}
                      name={item.name}
                      size={44}
                    />
                  </div>
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#1E482F]">
                    {tag}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-[#233022] truncate">{item.name}</h3>
                <p className="text-xs text-[#5B6A54] line-clamp-2 mt-1 leading-snug">
                  {item.blurb}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#233022]/10 flex items-center justify-between text-[11px] text-[#2E6B47] font-semibold">
                <span>View Guide</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}

          {/* 8th Card: 470+ more guides trigger */}
          <div
            onClick={() => {
              setExploreCategoryFilter('All');
              setExploreSearchQuery('');
              setCurrentTab('explore');
            }}
            className="bg-[#F2ECD8] rounded-2xl p-4 border border-[#233022]/15 hover:border-[#2E6B47] transition-all cursor-pointer flex flex-col items-center justify-center text-center group"
          >
            <span className="font-serif text-3xl font-bold text-[#2E6B47]">470+</span>
            <span className="text-xs font-bold text-[#233022] mt-1">More Guides</span>
            <span className="text-[11px] text-[#5B6A54] mt-0.5">Explore full library</span>
            <div className="w-8 h-8 rounded-full bg-white mt-3 flex items-center justify-center text-[#2E6B47] shadow-2xs group-hover:bg-[#2E6B47] group-hover:text-white transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. SPECIMEN ANATOMY INFOGRAPHIC (Interactive Scientific Dissection) */}
      <section className="bg-white rounded-3xl p-5 sm:p-7 border border-[#233022]/15 shadow-xs space-y-4">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2E6B47]">
            Visual Botanical Anatomy
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#233022] mt-0.5">
            Inside Every Specimen Guide
          </h3>
        </div>

        {/* 4 Interactive Anatomical Pills */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-[#FAF6E9] rounded-2xl border border-[#233022]/10 text-center">
          {[
            { id: 'nutrition', label: 'Nutrition', icon: Apple },
            { id: 'storage', label: 'Storage', icon: Thermometer },
            { id: 'terroir', label: 'Terroir', icon: Layers },
            { id: 'detox', label: 'Detox Rinse', icon: Droplets },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeAnatomyTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveAnatomyTab(tab.id as any)}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#2E6B47] text-white shadow-xs'
                    : 'text-[#4A4E42] hover:text-[#233022]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Specimen Card: Hass Avocado Example */}
        <div className="bg-[#FAF6E9] rounded-2xl p-4 sm:p-5 border border-[#233022]/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white border border-[#2E6B47]/20 flex items-center justify-center shadow-xs">
                <ProduceDoodle symbolId="d-avocado" name="Avocado" size={36} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-base text-[#233022]">Hass Avocado</h4>
                  <span className="px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#047857] text-[10px] font-bold font-mono">
                    IN SEASON
                  </span>
                </div>
                <span className="text-xs text-[#5B6A54] italic font-serif">
                  Persea americana · Lauraceae
                </span>
              </div>
            </div>

            <button
              onClick={() => setActiveGuideId(157)}
              className="text-xs font-bold text-[#2E6B47] hover:underline"
            >
              Open Guide →
            </button>
          </div>

          {activeAnatomyTab === 'nutrition' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-[#233022]/10">
                <span className="text-[#5B6A54] block font-mono">Healthy Monounsaturated Fats</span>
                <span className="font-bold text-sm text-[#233022]">High (15g / 100g)</span>
                <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-[#10B981] w-[88%]" />
                </div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#233022]/10">
                <span className="text-[#5B6A54] block font-mono">Dietary Fiber</span>
                <span className="font-bold text-sm text-[#233022]">7g / 100g (High Prebiotic)</span>
                <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-[#3B82F6] w-[75%]" />
                </div>
              </div>
            </div>
          )}

          {activeAnatomyTab === 'storage' && (
            <div className="space-y-2 text-xs">
              <div className="bg-white p-3 rounded-xl border border-[#233022]/10 flex items-start gap-3">
                <Thermometer className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#233022] block">Countertop (Until Yields)</span>
                  <span className="text-[#5B6A54]">
                    Store at room temp (68°F / 20°C) with stem button attached until soft give under palm.
                  </span>
                </div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#233022]/10 flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#233022] block">Crisper Drawer (Ripe Preservation)</span>
                  <span className="text-[#5B6A54]">
                    Transfer ripe fruit to fridge at 38°F (3°C) to pause softening for 4-5 days.
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeAnatomyTab === 'terroir' && (
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-[#233022]/10">
                <span className="text-[#5B6A54] block font-mono">Peak Harvest Cycle</span>
                <span className="font-bold text-sm text-[#233022]">Feb — Sep</span>
                <span className="text-[11px] text-[#2E6B47] block mt-1">California & Mexico</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#233022]/10">
                <span className="text-[#5B6A54] block font-mono">Soil & Climate</span>
                <span className="font-bold text-sm text-[#233022]">Subtropical</span>
                <span className="text-[11px] text-[#D97706] block mt-1">Well-drained volcanic soil</span>
              </div>
            </div>
          )}

          {activeAnatomyTab === 'detox' && (
            <div className="bg-white p-3.5 rounded-xl border border-[#233022]/10 space-y-2 text-xs">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#233022] block">1% Baking Soda Scrub</span>
                  <span className="text-[#5B6A54] leading-relaxed block mt-0.5">
                    Wash thick pebbled skins under cool running water before slicing. Slicing through unwashed rinds drags surface microbes and pesticide residues straight into edible pulp.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 6. MANIFESTO & FOOTER */}
      <footer className="border-t border-[#233022]/15 pt-6 text-center space-y-2 text-xs text-[#7D8370]">
        <p className="font-serif italic text-sm text-[#4A4E42]">
          "Field-sketched guides, not stock photography. Whole food science, not diet dogma."
        </p>
        <p className="font-mono text-[11px]">
          © 2026 Sprout Atlas · Built to end produce confusion and grocery waste.
        </p>
      </footer>
    </div>
  );
};
