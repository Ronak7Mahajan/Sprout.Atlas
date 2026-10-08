import React from 'react';
import { useApp } from '../../context/AppContext';
import { Activity, Compass, FlaskConical, Bookmark } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentTab, setCurrentTab, activeGuideId, setActiveGuideId } = useApp();

  // If a guide detail is actively open on mobile, keep bottom bar minimal or allow direct jump
  const handleTabClick = (tab: 'home' | 'explore' | 'labs' | 'view') => {
    setActiveGuideId(null);
    setCurrentTab(tab);
  };

  const tabs = [
    { id: 'home', label: 'Pulse', icon: Activity },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'labs', label: 'Labs', icon: FlaskConical },
    { id: 'view', label: 'Journal', icon: Bookmark },
  ] as const;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFDF5]/95 backdrop-blur-md border-t border-[#233022]/10 pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-4 items-center h-16 px-2">
        {tabs.map((tab) => {
          const isSelected = currentTab === tab.id && activeGuideId === null;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className="flex flex-col items-center justify-center min-h-[48px] py-1 transition-all group focus:outline-none"
            >
              <div
                className={`w-12 h-7 rounded-full flex items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#10B981] to-[#047857] text-white shadow-xs'
                    : 'text-[#4A4E42] group-hover:text-[#233022]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'currentColor'}`} />
              </div>
              <span
                className={`text-[11px] font-semibold mt-1 transition-colors ${
                  isSelected ? 'text-[#047857] font-bold' : 'text-[#7D8370]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
