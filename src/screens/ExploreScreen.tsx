import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ProduceItem } from '../types/produce';
import {
  allCategories,
  categoryColors,
  searchFuzzyProduce,
  jumbledAllItems,
  allProduceItems,
} from '../data/produceCatalog';
import { ProduceDoodle } from '../components/doodles/ProduceDoodle';
import { Search, X, Sparkles, ArrowRight } from 'lucide-react';

export const ExploreScreen: React.FC = () => {
  const {
    exploreCategoryFilter,
    setExploreCategoryFilter,
    exploreSearchQuery,
    setExploreSearchQuery,
    setActiveGuideId,
  } = useApp();

  const [visibleLimit, setVisibleLimit] = useState<number>(40);

  // Filter and search
  const matchedItems = useMemo(() => {
    if (!exploreSearchQuery.trim()) {
      if (exploreCategoryFilter === 'All') return jumbledAllItems;
      return allProduceItems.filter((i) => i.category === exploreCategoryFilter);
    }
    return searchFuzzyProduce(exploreSearchQuery, exploreCategoryFilter);
  }, [exploreSearchQuery, exploreCategoryFilter]);

  const visibleItems = useMemo(() => {
    return matchedItems.slice(0, visibleLimit);
  }, [matchedItems, visibleLimit]);

  const handleCategorySelect = (cat: string) => {
    setExploreCategoryFilter(cat);
    setVisibleLimit(40);
  };

  const handleClearSearch = () => {
    setExploreSearchQuery('');
    setVisibleLimit(40);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Sticky Filter Header */}
      <div className="sticky top-15 z-30 bg-[#FAF6E9]/95 backdrop-blur-md pt-2 pb-4 border-b border-[#233022]/10 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2E6B47]">
              {allProduceItems.length} Hand-Curated Profiles
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#233022]">
              Explore the Produce Atlas
            </h1>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono font-bold text-[#4A4E42]">
              {matchedItems.length} guides found
            </span>
          </div>
        </div>

        {/* Search Input Box */}
        <div className="relative">
          <Search className="w-5 h-5 text-[#2E6B47] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={exploreSearchQuery}
            onChange={(e) => {
              setExploreSearchQuery(e.target.value);
              setVisibleLimit(40);
            }}
            placeholder="Search avocado, kale, mango, kiwi... (typos supported)"
            className="w-full h-12 pl-11 pr-10 rounded-full bg-white border border-[#233022]/15 shadow-2xs text-sm font-medium text-[#233022] placeholder:text-[#7D8370] focus:outline-none focus:ring-2 focus:ring-[#2E6B47]/50"
          />
          {exploreSearchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Horizontal Filter Scroller */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {allCategories.map((cat) => {
            const isSelected = exploreCategoryFilter === cat;
            const dotColor = categoryColors[cat] || '#2E6B47';

            return (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-[#E6F4EA] text-[#1E482F] border-[#A5D6A7] shadow-2xs'
                    : 'bg-white text-[#4A4E42] border-[#233022]/15 hover:border-[#233022]/40 hover:bg-[#FFFDF5]'
                }`}
              >
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: dotColor }}
                />
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid Feed */}
      {matchedItems.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-white border border-[#233022]/15 flex items-center justify-center mx-auto">
            <ProduceDoodle symbolId="d-sprout" name="Sprout" size={36} />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#233022]">
            No produce guides match "{exploreSearchQuery}"
          </h3>
          <p className="text-sm text-[#4A4E42] max-w-sm mx-auto">
            Try a different spelling or select "All" categories to browse the complete library.
          </p>
          <button
            onClick={() => {
              setExploreSearchQuery('');
              setExploreCategoryFilter('All');
            }}
            className="px-5 py-2 rounded-full bg-[#2E6B47] text-white text-xs font-bold hover:bg-[#1E482F]"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {visibleItems.map((item: ProduceItem) => (
            <div
              key={item.id}
              onClick={() => setActiveGuideId(item.id)}
              className="bg-white rounded-2xl p-3.5 border border-[#233022]/15 hover:border-[#2E6B47] transition-all cursor-pointer shadow-2xs hover:shadow-xs flex flex-col justify-between group"
            >
              <div>
                {/* Header row: Doodle + Category Pill */}
                <div className="flex items-start justify-between mb-2">
                  <div className="w-14 h-14 rounded-xl bg-[#F0FDF4] border border-[#2E6B47]/20 flex items-center justify-center p-1.5 transition-transform group-hover:scale-105">
                    <ProduceDoodle
                      symbolId={item.symbolId}
                      archetype={item.archetype}
                      name={item.name}
                      size={44}
                    />
                  </div>
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#1E482F] truncate max-w-[100px]">
                    {item.category.split(' ')[0]}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-[#233022] truncate">{item.name}</h3>
                {item.scientific && (
                  <p className="text-[11px] text-[#2E6B47] italic font-serif truncate mt-0.5">
                    {item.scientific}
                  </p>
                )}
                <p className="text-xs text-[#5B6A54] line-clamp-2 mt-1.5 leading-snug">
                  {item.blurb}
                </p>
              </div>

              {/* Bottom footer: Key nutrient & Chevron */}
              <div className="mt-3 pt-2 border-t border-[#233022]/10 flex items-center justify-between text-[11px]">
                <span className="text-[#2E6B47] font-semibold truncate max-w-[80%]">
                  {item.nutrients[0] ? `· ${item.nutrients[0]}` : '· Botanical'}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#2E6B47] transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Load More & Show All */}
      {visibleLimit < matchedItems.length && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            onClick={() => setVisibleLimit((v: number) => v + 30)}
            className="px-6 h-12 rounded-full bg-[#FFFDF5] hover:bg-white border-2 border-[#233022]/15 text-[#2E6B47] font-bold text-xs sm:text-sm shadow-2xs hover:shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#2E6B47]" />
            <span>Load {Math.min(30, matchedItems.length - visibleLimit)} More</span>
          </button>

          <button
            onClick={() => setVisibleLimit(matchedItems.length)}
            className="px-6 h-12 rounded-full bg-[#2E6B47] hover:bg-[#1E482F] text-white font-bold text-xs sm:text-sm shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Show All ({matchedItems.length} Guides)</span>
          </button>
        </div>
      )}
    </div>
  );
};
