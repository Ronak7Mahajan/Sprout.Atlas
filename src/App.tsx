import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { HomeScreen } from './screens/HomeScreen';
import { ExploreScreen } from './screens/ExploreScreen';
import { LabsScreen } from './screens/LabsScreen';
import { ViewScreen } from './screens/ViewScreen';
import { GuideDetailScreen } from './screens/GuideDetailScreen';
import { QuizModal } from './components/dialogs/QuizModal';
import { TourModal } from './components/dialogs/TourModal';
import { PaywallModal } from './components/dialogs/PaywallModal';
import { AccountModal } from './components/dialogs/AccountModal';

const AppContent: React.FC = () => {
  const { currentTab, activeGuideId } = useApp();

  return (
    <div className="min-h-screen bg-[#FAF6E9] text-[#233022] flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 pt-4 pb-20 md:pb-12">
        {activeGuideId !== null ? (
          <GuideDetailScreen produceId={activeGuideId} />
        ) : (
          <>
            {currentTab === 'home' && <HomeScreen />}
            {currentTab === 'explore' && <ExploreScreen />}
            {currentTab === 'labs' && <LabsScreen />}
            {currentTab === 'view' && <ViewScreen />}
          </>
        )}
      </main>

      <BottomNav />

      {/* Global Interactive Modals */}
      <QuizModal />
      <TourModal />
      <PaywallModal />
      <AccountModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
