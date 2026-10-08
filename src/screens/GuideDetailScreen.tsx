import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getProduceById, getRelatedProduce } from '../data/produceCatalog';
import { ProduceDoodle } from '../components/doodles/ProduceDoodle';
import {
  Heart,
  ArrowLeft,
  CheckCircle2,
  Droplets,
  Shield,
  HelpCircle,
  Sparkles,
  Thermometer,
  Layers,
  Leaf,
  Clock,
  AlertTriangle,
} from 'lucide-react';

interface GuideDetailScreenProps {
  produceId: number;
}

export const GuideDetailScreen: React.FC<GuideDetailScreenProps> = ({ produceId }) => {
  const {
    setActiveGuideId,
    toggleSaveItem,
    isItemSaved,
    setShowQuizModal,
  } = useApp();

  const [selectedTab, setSelectedTab] = useState<0 | 1 | 2>(0);

  const item = getProduceById(produceId) || getProduceById(157)!;
  const isSaved = isItemSaved(item.id);
  const relatedItems = getRelatedProduce(item, 4);

  // Automatically scroll to the top of the guide when a new specimen is loaded
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [produceId]);

  const handleOpenRelated = (id: number) => {
    setActiveGuideId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 pb-24">
      {/* 1. HERO PRESENTATION CARD */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#233022]/15 shadow-xs text-center space-y-4">
        {/* Back and Bookmark Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveGuideId(null)}
            className="flex items-center gap-1.5 text-xs font-bold text-[#4A4E42] hover:text-[#233022] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Atlas</span>
          </button>

          <button
            onClick={() => toggleSaveItem(item.id)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
              isSaved
                ? 'bg-[#FBECE8] text-[#C7432B] border-[#C7432B]/30'
                : 'bg-white text-[#4A4E42] border-[#233022]/15 hover:border-[#233022]/40'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current text-[#C7432B]' : ''}`} />
            <span>{isSaved ? 'Saved in Journal' : 'Save Guide'}</span>
          </button>
        </div>

        {/* Specimen Doodle Avatar */}
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#FAF6E9] border-2 border-[#2E6B47]/20 flex items-center justify-center mx-auto shadow-sm">
          <ProduceDoodle symbolId={item.symbolId} archetype={item.archetype} name={item.name} size={84} />
        </div>

        {/* Title & Taxonomy */}
        <div>
          {item.scientific && (
            <span className="text-xs font-serif italic text-[#2E6B47] block mb-1">
              {item.scientific}
            </span>
          )}
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#233022]">
            {item.name}
          </h1>
          <div className="flex items-center justify-center gap-2 text-xs text-[#7D8370] font-mono mt-2">
            <span>{item.category}</span>
            <span>·</span>
            <span>{item.type}</span>
            <span>·</span>
            <span>Specimen #{item.id}</span>
          </div>
        </div>

        {/* Hooking Intro Blurb */}
        <p className="text-sm sm:text-base text-[#4A4E42] max-w-xl mx-auto leading-relaxed">
          {item.blurb}
        </p>
      </div>

      {/* 2. SEGMENTED THREE-TAB SELECTOR */}
      <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-white rounded-2xl border border-[#233022]/15 shadow-2xs text-center">
        {[
          { id: 0, title: 'Information', subtitle: 'Nutrients & Profile', icon: Leaf },
          { id: 1, title: 'Identify & Wash', subtitle: 'Ripeness & Hygiene', icon: Droplets },
          { id: 2, title: 'Chemicals', subtitle: 'Treatments & Safety', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = selectedTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`py-2.5 px-1 rounded-xl transition-all flex flex-col items-center justify-center ${
                isSelected
                  ? 'bg-[#2E6B47] text-white shadow-xs'
                  : 'text-[#4A4E42] hover:text-[#233022] hover:bg-[#FAF6E9]'
              }`}
            >
              <Icon className="w-4 h-4 mb-1" />
              <span className="text-xs font-bold leading-tight">{tab.title}</span>
              <span
                className={`text-[10px] hidden sm:inline ${
                  isSelected ? 'text-white/80' : 'text-[#7D8370]'
                }`}
              >
                {tab.subtitle}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. ACTIVE TAB CONTENT */}
      {selectedTab === 0 && (
        <div className="space-y-5">
          {/* Botanical Overview Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#233022]/15 shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#233022] flex items-center gap-2">
              <Leaf className="w-5 h-5 text-[#2E6B47]" />
              <span>Botanical Overview & Classification</span>
            </h3>
            <p className="text-sm text-[#4A4E42] leading-relaxed">
              {item.characteristics}
            </p>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              <div className="bg-[#FAF6E9] p-3 rounded-xl border border-[#233022]/10 text-xs">
                <span className="text-[10px] font-mono text-[#7D8370] block uppercase">Water Content</span>
                <span className="font-bold text-[#233022] text-sm">{item.waterContent || '85-92%'}</span>
              </div>
              <div className="bg-[#FAF6E9] p-3 rounded-xl border border-[#233022]/10 text-xs">
                <span className="text-[10px] font-mono text-[#7D8370] block uppercase">Glycemic Index</span>
                <span className="font-bold text-[#233022] text-sm">{item.glycemicIndex || 'Low (GI < 45)'}</span>
              </div>
              <div className="bg-[#FAF6E9] p-3 rounded-xl border border-[#233022]/10 text-xs">
                <span className="text-[10px] font-mono text-[#7D8370] block uppercase">Peak Season</span>
                <span className="font-bold text-[#233022] text-sm">{item.season || 'Summer / Autumn'}</span>
              </div>
              <div className="bg-[#FAF6E9] p-3 rounded-xl border border-[#233022]/10 text-xs">
                <span className="text-[10px] font-mono text-[#7D8370] block uppercase">Origin</span>
                <span className="font-bold text-[#233022] text-sm">{item.origin || item.category}</span>
              </div>
            </div>
          </div>

          {/* Key Vitamins & Micronutrients Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#233022]/15 shadow-xs space-y-3">
            <h3 className="font-serif text-lg font-bold text-[#233022] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#E79B1F]" />
              <span>Key Vitamins & Bioactive Nutrients</span>
            </h3>
            <p className="text-xs text-[#5B6A54]">
              Essential vitamins, minerals, and bioactive antioxidants identified in this specimen:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {item.nutrients.map((nut, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#FAF6E9] border border-[#233022]/10 text-xs font-semibold text-[#233022]"
                >
                  <div className="w-2 h-2 rounded-full bg-[#2E6B47]" />
                  <span>{nut}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Did You Know? Botanical Trivia Card */}
          <div className="bg-[#233022] text-white rounded-3xl p-5 sm:p-7 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-[#FDE68A]">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">
                Did You Know? · Botanical Facts
              </span>
            </div>
            <p className="text-sm leading-relaxed text-[#E2EAD8]">
              {item.botanicalFacts || item.trivia}
            </p>
          </div>
        </div>
      )}

      {selectedTab === 1 && (
        <div className="space-y-5">
          {/* How to Pick at Peak Freshness */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#233022]/15 shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#233022] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#2E6B47]" />
              <span>How to Identify & Pick at Peak Freshness</span>
            </h3>
            <p className="text-xs text-[#5B6A54]">
              Sensory benchmarks to check before placing this specimen in your grocery cart:
            </p>

            <div className="space-y-2.5">
              {item.ripenessCues.map((cue, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-2xl bg-[#FAF6E9] border border-[#233022]/10 text-xs text-[#233022] leading-relaxed"
                >
                  <span className="w-5 h-5 rounded-full bg-[#E8F5E9] text-[#1E482F] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{cue}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cleaning & Washing Protocol */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#233022]/15 shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#233022] flex items-center gap-2">
              <Droplets className="w-5 h-5 text-[#0284C7]" />
              <span>Cleaning & Washing Protocol</span>
            </h3>
            <p className="text-xs text-[#5B6A54]">
              Proper mechanical friction and safe sanitization degrades surface residues while preserving cellular turgor:
            </p>

            <div className="space-y-2.5">
              {item.cleaningSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-2xl bg-[#FAF6E9] border border-[#233022]/10 text-xs text-[#233022] leading-relaxed"
                >
                  <span className="w-5 h-5 rounded-full bg-[#0284C7] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Optimal Storage */}
          <div className="bg-[#FFFDF5] rounded-3xl p-5 border border-[#233022]/15 space-y-2">
            <span className="text-xs font-mono font-bold uppercase text-[#D97706] block">
              Optimal Storage & Shelf-Life Extension
            </span>
            <p className="text-sm text-[#4A4E42] leading-relaxed">
              {item.storage || 'Cool dry pantry or refrigerator crisper drawer with appropriate humidity.'}
            </p>
          </div>
        </div>
      )}

      {selectedTab === 2 && (
        <div className="space-y-5">
          {/* Post-Harvest Chemicals & Treatments */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#233022]/15 shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#233022] flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#C7432B]" />
              <span>Chemicals & Post-Harvest Treatments</span>
            </h3>
            <p className="text-xs text-[#5B6A54]">
              Commercial produce is frequently treated during post-harvest sorting, transit, and storage:
            </p>

            <div className="p-4 rounded-2xl bg-[#FBECE8] border border-[#C7432B]/30 text-xs text-[#233022] leading-relaxed">
              {item.treatment}
            </div>
          </div>

          {/* Residue Profile & Food Safety Breakdown */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#233022]/15 shadow-xs space-y-3">
            <h3 className="font-serif text-lg font-bold text-[#233022]">
              Residue Profile & Removal Guidelines
            </h3>

            <div className="space-y-2.5 text-xs text-[#4A4E42]">
              <div className="p-3 bg-[#FAF6E9] rounded-xl border border-[#233022]/10">
                <span className="font-bold text-[#233022] block mb-1">Wax Coatings</span>
                <span>
                  Food-grade carnauba, shellac, or morpholine wax applied to prevent moisture evaporation. Traps pesticides underneath unless washed with an alkaline baking soda soak.
                </span>
              </div>

              <div className="p-3 bg-[#FAF6E9] rounded-xl border border-[#233022]/10">
                <span className="font-bold text-[#233022] block mb-1">Fungicides & Sprout Inhibitors</span>
                <span>
                  Commonly applied in packing houses (e.g. thiabendazole, imazalil, fludioxonil). Baking soda washes degrade up to 80% of surface residue within 12 minutes.
                </span>
              </div>

              <div className="p-3 bg-[#FAF6E9] rounded-xl border border-[#233022]/10">
                <span className="font-bold text-[#233022] block mb-1">Peel vs. Wash Recommendation</span>
                <span>
                  If non-organic and consuming skin, perform an alkaline soak. For thick-skinned varieties, peeling removes &gt;95% of hydrophobic residues.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. RELATED SPECIMENS CAROUSEL */}
      {relatedItems.length > 0 && (
        <div className="space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#233022] block">
            Related Specimens in {item.category}
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {relatedItems.map((rel) => (
              <button
                key={rel.id}
                type="button"
                onClick={() => handleOpenRelated(rel.id)}
                className="w-full bg-white rounded-2xl p-3 border border-[#233022]/15 hover:border-[#2E6B47] hover:bg-[#F9FCF9] transition-all cursor-pointer shadow-2xs hover:shadow-md text-center space-y-1.5 focus:outline-none focus:ring-2 focus:ring-[#2E6B47]/40 active:scale-97 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#FAF6E9] group-hover:bg-[#E8F5E9] transition-colors flex items-center justify-center mx-auto">
                  <ProduceDoodle symbolId={rel.symbolId} archetype={rel.archetype} name={rel.name} size={36} />
                </div>
                <h4 className="font-bold text-xs text-[#233022] group-hover:text-[#2E6B47] transition-colors truncate">
                  {rel.name}
                </h4>
                <p className="text-[10px] text-[#7D8370] line-clamp-1">{rel.blurb}</p>
                <span className="text-[10px] font-bold text-[#2E6B47] block pt-0.5 group-hover:underline">
                  View Guide →
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 5. DAILY QUIZ CALLOUT */}
      <div className="bg-[#233022] text-white rounded-3xl p-5 border border-white/10 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase text-[#FDE68A] block">
            Botanical Trivia Challenge
          </span>
          <h4 className="font-serif text-base font-bold mt-0.5">
            Test your knowledge on {item.name}?
          </h4>
          <p className="text-xs text-[#CDD6C4]">Play today's 3-clue daily challenge</p>
        </div>
        <button
          onClick={() => setShowQuizModal(true)}
          className="px-4 py-2 rounded-full bg-[#E79B1F] hover:bg-[#D97706] text-[#233022] font-bold text-xs shadow-xs"
        >
          Play Quiz
        </button>
      </div>
    </div>
  );
};
