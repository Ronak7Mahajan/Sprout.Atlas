import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getProduceById } from '../data/produceCatalog';
import { ProduceDoodle } from '../components/doodles/ProduceDoodle';
import { ProduceItem, ScanResult } from '../types/produce';
import {
  Star,
  History,
  TrendingUp,
  Flame,
  Sparkles,
  Camera,
  Trash2,
  ArrowRight,
  User,
  Calendar,
} from 'lucide-react';

export const ViewScreen: React.FC = () => {
  const {
    savedItemIds,
    toggleSaveItem,
    scanHistory,
    clearScanHistory,
    setActiveGuideId,
    quizStreak,
    rainbowStreak,
    userProfile,
    setShowAccountModal,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'saved' | 'scans' | 'progress'>('saved');

  const savedItems = savedItemIds.map((id: number) => getProduceById(id)).filter(Boolean) as ProduceItem[];

  return (
    <div className="space-y-6 pb-24">
      {/* Top Header & Botanist Badge */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2E6B47]">
              Field Journal & Records
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#233022]">Your Journal</h1>
          </div>

          <button
            onClick={() => setShowAccountModal(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#233022]/15 hover:border-[#2E6B47] text-xs font-semibold text-[#233022] shadow-2xs transition-colors"
          >
            <span className="w-5 h-5 rounded-full bg-[#E8F5E9] text-[#1E482F] flex items-center justify-center font-bold text-[10px]">
              {userProfile.avatar}
            </span>
            <span>{userProfile.name}</span>
          </button>
        </div>

        {/* 3 Segmented Sub-tabs */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-white rounded-2xl border border-[#233022]/15 shadow-2xs">
          {[
            { id: 'saved', label: 'Saved Guides', icon: Star, count: savedItems.length },
            { id: 'scans', label: 'Scan History', icon: History, count: scanHistory.length },
            { id: 'progress', label: 'Progress', icon: TrendingUp },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#233022] text-white shadow-xs'
                    : 'text-[#4A4E42] hover:text-[#233022] hover:bg-[#FAF6E9]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-[#4A4E42]'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. SAVED GUIDES                                               */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-[#5B6A54]">
              {savedItems.length} Bookmarked Specimens
            </span>
          </div>

          {savedItems.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-[#233022]/15 p-6">
              <Star className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-[#233022]">
                No Bookmarked Guides Yet
              </h3>
              <p className="text-xs text-[#5B6A54] max-w-xs mx-auto">
                Tap the star icon or bookmark button on any produce guide in the Atlas to pin it to your journal.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {savedItems.map((item: ProduceItem) => (
                <div
                  key={item!.id}
                  className="bg-white rounded-2xl p-3.5 border border-[#233022]/15 hover:border-[#2E6B47] transition-all shadow-2xs hover:shadow-xs flex flex-col justify-between group relative"
                >
                  {/* Remove Star Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveItem(item!.id);
                    }}
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-[#FAF6E9] hover:bg-[#FEE2E2] flex items-center justify-center text-[#D97706] hover:text-[#DC2626] transition-colors"
                    title="Remove from saved"
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>

                  <div
                    onClick={() => setActiveGuideId(item!.id)}
                    className="cursor-pointer space-y-2"
                  >
                    <div className="w-14 h-14 rounded-xl bg-[#F0FDF4] border border-[#2E6B47]/20 flex items-center justify-center p-1.5 transition-transform group-hover:scale-105">
                      <ProduceDoodle
                        symbolId={item!.symbolId}
                        archetype={item!.archetype}
                        name={item!.name}
                        size={44}
                      />
                    </div>

                    <h3 className="font-bold text-sm text-[#233022] truncate pr-6">{item!.name}</h3>
                    <p className="text-xs text-[#5B6A54] line-clamp-2 leading-snug">
                      {item!.blurb}
                    </p>
                  </div>

                  <div
                    onClick={() => setActiveGuideId(item!.id)}
                    className="mt-3 pt-2 border-t border-[#233022]/10 flex items-center justify-between text-[11px] text-[#2E6B47] font-semibold cursor-pointer"
                  >
                    <span>View Guide</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. SCAN HISTORY                                               */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'scans' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-[#5B6A54]">
              {scanHistory.length} Recorded Freshness Scans
            </span>
            {scanHistory.length > 0 && (
              <button
                onClick={clearScanHistory}
                className="text-xs text-[#DC2626] hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear history</span>
              </button>
            )}
          </div>

          {scanHistory.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-[#233022]/15 p-6">
              <Camera className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-[#233022]">No Scans Recorded</h3>
              <p className="text-xs text-[#5B6A54] max-w-xs mx-auto">
                Use the AI Camera Scanner in Labs to evaluate fruit ripeness and test food safety.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {scanHistory.map((scan: ScanResult) => (
                <div
                  key={scan.id}
                  className="bg-white rounded-2xl p-4 border border-[#233022]/15 flex items-center justify-between shadow-2xs hover:border-[#2E6B47] transition-all"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-[#FAF6E9] border border-[#233022]/10 flex items-center justify-center shrink-0">
                      <ProduceDoodle symbolId={scan.symbolId} name={scan.produceName} size={28} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-[#233022]">{scan.produceName}</h4>
                        <span
                          className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${
                            scan.isEdible
                              ? 'bg-[#E8F5E9] text-[#1E482F]'
                              : 'bg-[#FEE2E2] text-[#991B1B]'
                          }`}
                        >
                          {scan.isEdible ? 'SAFE TO EAT' : 'DISCARD'}
                        </span>
                      </div>
                      <p className="text-xs text-[#5B6A54] mt-0.5">
                        {scan.dateGroup} at {scan.time} · {scan.ripenessStage}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-[#2E6B47] block">
                      {scan.shelfLifeDays}
                    </span>
                    <span className="text-[10px] text-[#7D8370]">{scan.quality}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. PROGRESS & STREAKS                                         */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'progress' && (
        <div className="space-y-5">
          {/* Streak Banner Cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-[#233022] text-white rounded-3xl p-5 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-[#D97706]">
                <Flame className="w-5 h-5" />
                <span className="text-xs font-mono font-bold uppercase">Quiz Streak</span>
              </div>
              <div className="text-3xl font-bold font-serif text-[#FDE68A]">{quizStreak}</div>
              <p className="text-xs text-[#CDD6C4]">Consecutive daily botanical challenges solved</p>
            </div>

            <div className="bg-[#233022] text-white rounded-3xl p-5 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-[#E79B1F]">
                <Sparkles className="w-5 h-5" />
                <span className="text-xs font-mono font-bold uppercase">Rainbow Streak</span>
              </div>
              <div className="text-3xl font-bold font-serif text-[#FDE68A]">{rainbowStreak}</div>
              <p className="text-xs text-[#CDD6C4]">Days of 6-color phytonutrient logging</p>
            </div>
          </div>

          {/* 7-Day Activity Heatmap Card */}
          <div className="bg-white rounded-3xl p-5 border border-[#233022]/15 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-[#5B6A54]">
                7-Day Field Activity
              </span>
              <span className="text-xs text-[#2E6B47] font-semibold">Active Botanist</span>
            </div>

            <div className="grid grid-cols-7 gap-2 pt-2 text-center text-xs font-mono">
              {[
                { day: 'Mon', level: 0.6 },
                { day: 'Tue', level: 0.8 },
                { day: 'Wed', level: 0.4 },
                { day: 'Thu', level: 1.0 },
                { day: 'Fri', level: 0.7 },
                { day: 'Sat', level: 0.5 },
                { day: 'Sun', level: 0.9 },
              ].map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <div className="w-full h-16 bg-[#FAF6E9] rounded-xl flex items-end p-1">
                    <div
                      style={{ height: `${d.level * 100}%` }}
                      className="w-full rounded-lg bg-[#2E6B47] transition-all"
                    />
                  </div>
                  <span className="text-[11px] text-[#7D8370]">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Botanist Badge Credentials */}
          <div className="bg-[#FFFDF5] border border-[#233022]/10 rounded-2xl p-4 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-[#233022] block">Level 3 Master Forager</span>
              <span className="text-[#5B6A54]">24 species identified across 6 categories</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#E8F5E9] text-[#1E482F] font-bold text-xs">
              🎖️ Verified
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
