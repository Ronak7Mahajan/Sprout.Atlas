import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import {
  ProduceItem,
  ScanResult,
  RainbowColorDef,
  RainbowLogEntry,
  CorkboardItem,
  QuizQuestion,
  UserProfile,
  SubscriptionState,
} from '../types/produce';
import { allProduceItems, getProduceById } from '../data/produceCatalog';
import {
  auth,
  signInWithGoogle,
  loginWithEmail,
  registerWithEmail,
  loginAnonymously,
  logOut,
  onAuthStateChanged,
  saveUserDataToCloud,
  loadUserDataFromCloud,
  seedAllProducesToFirestore,
  FirebaseUser,
} from '../lib/firebase';

export const RAINBOW_COLORS: RainbowColorDef[] = [
  { key: 'RED', displayName: 'Red', hexColor: '#D6482F', sampleProduce: 'Strawberry / Tomato', phytonutrient: 'Lycopene & Anthocyanins' },
  { key: 'ORANGE', displayName: 'Orange', hexColor: '#E79B1F', sampleProduce: 'Carrot / Sweet Potato', phytonutrient: 'Alpha & Beta-Carotenes' },
  { key: 'YELLOW', displayName: 'Yellow', hexColor: '#EAB308', sampleProduce: 'Banana / Lemon', phytonutrient: 'Bioflavonoids & Lutein' },
  { key: 'GREEN', displayName: 'Green', hexColor: '#2E6B47', sampleProduce: 'Broccoli / Spinach', phytonutrient: 'Chlorophyll & Sulforaphane' },
  { key: 'BLUE_PURPLE', displayName: 'Blue & Purple', hexColor: '#6E3B6E', sampleProduce: 'Blueberry / Grape', phytonutrient: 'Resveratrol & Anthocyanins' },
  { key: 'WHITE_BROWN', displayName: 'White & Brown', hexColor: '#8D6E63', sampleProduce: 'Garlic / Potato', phytonutrient: 'Allicin & Quercetin' },
];

interface AppContextType {
  // Navigation
  currentTab: 'home' | 'explore' | 'labs' | 'view';
  setCurrentTab: (tab: 'home' | 'explore' | 'labs' | 'view') => void;
  activeGuideId: number | null;
  setActiveGuideId: (id: number | null) => void;
  exploreCategoryFilter: string;
  setExploreCategoryFilter: (cat: string) => void;
  exploreSearchQuery: string;
  setExploreSearchQuery: (q: string) => void;

  // Dialogs
  showQuizModal: boolean;
  setShowQuizModal: (show: boolean) => void;
  showTourModal: boolean;
  setShowTourModal: (show: boolean) => void;
  showAccountModal: boolean;
  setShowAccountModal: (show: boolean) => void;
  showPaywallModal: boolean;
  setShowPaywallModal: (show: boolean) => void;

  // Saved items
  savedItemIds: number[];
  toggleSaveItem: (id: number) => void;
  isItemSaved: (id: number) => boolean;

  // Scans
  scanHistory: ScanResult[];
  addScanResult: (res: ScanResult) => void;
  clearScanHistory: () => void;

  // Corkboard & Quiz
  corkboardShuffleSeed: number;
  shuffleCorkboard: () => void;
  weeklyCorkboardItems: CorkboardItem[];
  weekLabel: string;
  todayQuiz: QuizQuestion;
  quizStreak: number;
  isQuizAnsweredToday: boolean;
  submitQuizAnswer: (chosenIndex: number) => boolean;

  // Rainbow challenge
  rainbowLogs: Record<string, RainbowLogEntry>;
  toggleRainbowColor: (key: string) => void;
  rainbowStreak: number;

  // Profile & Firebase
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  firebaseUser: FirebaseUser | null;
  isFirebaseAuthLoading: boolean;
  signInGoogle: () => Promise<void>;
  signInEmail: (email: string, pass: string) => Promise<void>;
  signUpEmail: (email: string, pass: string, name?: string) => Promise<void>;
  signInGuest: () => Promise<void>;
  signOutUser: () => Promise<void>;
  seedFirestoreCatalog: () => Promise<{ success: boolean; count: number; error?: string }>;
  isSeedingFirestore: boolean;
  firestoreSeedProgress: { current: number; total: number } | null;

  // Subscription / Pro
  subscription: SubscriptionState;
  activatePlan: (planType: 'monthly' | 'annual' | 'lifetime' | 'trial', email?: string) => void;
  redeemPromoCode: (code: string) => { success: boolean; message: string };
  recordAiUsage: () => boolean;
  remainingAiRuns: number;

  // Reset to brand new user
  resetToNewUserState: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_PREFIX = 'sprout_atlas_v3_';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation state
  const [currentTab, setCurrentTab] = useState<'home' | 'explore' | 'labs' | 'view'>('home');
  const [activeGuideId, setActiveGuideId] = useState<number | null>(null);
  const [exploreCategoryFilter, setExploreCategoryFilter] = useState<string>('All');
  const [exploreSearchQuery, setExploreSearchQuery] = useState<string>('');

  // Modals - Start with Tour Modal open for new person onboarding
  const [showQuizModal, setShowQuizModal] = useState<boolean>(false);
  const [showTourModal, setShowTourModal] = useState<boolean>(() => {
    try {
      return !localStorage.getItem(`${STORAGE_PREFIX}has_seen_tour`);
    } catch {
      return true;
    }
  });
  const [showAccountModal, setShowAccountModal] = useState<boolean>(false);
  const [showPaywallModal, setShowPaywallModal] = useState<boolean>(false);

  // Saved guides - Start fresh with 0 saved bookmarks
  const [savedItemIds, setSavedItemIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}saved`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Scan History - Start fresh with 0 scans
  const [scanHistory, setScanHistory] = useState<ScanResult[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}scans`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // Corkboard seed
  const [corkboardShuffleSeed, setCorkboardShuffleSeed] = useState<number>(0);

  // Streaks - Start at 0 for fresh user
  const [quizStreak, setQuizStreak] = useState<number>(() => {
    return parseInt(localStorage.getItem(`${STORAGE_PREFIX}quiz_streak`) || '0', 10);
  });
  const [rainbowStreak, setRainbowStreak] = useState<number>(() => {
    return parseInt(localStorage.getItem(`${STORAGE_PREFIX}rainbow_streak`) || '0', 10);
  });

  const todayDateString = new Date().toISOString().split('T')[0];
  const [lastQuizCompletedDate, setLastQuizCompletedDate] = useState<string>(() => {
    return localStorage.getItem(`${STORAGE_PREFIX}last_quiz_date`) || '';
  });
  const isQuizAnsweredToday = lastQuizCompletedDate === todayDateString;

  // Rainbow Logs - Start clean with all unlogged
  const [rainbowLogs, setRainbowLogs] = useState<Record<string, RainbowLogEntry>>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}rainbow_${todayDateString}`);
      if (saved) return JSON.parse(saved);
    } catch {}
    const initial: Record<string, RainbowLogEntry> = {};
    RAINBOW_COLORS.forEach((c) => {
      initial[c.key] = { key: c.key, isLogged: false };
    });
    return initial;
  });

  // User Profile - Pristine new explorer profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}profile`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      name: 'Explorer',
      title: 'Field Botanist & Forager',
      avatar: '🌱',
      email: '',
    };
  });

  // Subscription State - Clean Seedling Free Starter Plan
  const [subscription, setSubscription] = useState<SubscriptionState>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}sub`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      isPro: false,
      planType: 'free',
      activePlanTitle: 'Seedling — Free Explorer',
      expirationDateFormatted: '',
      remainingDays: 0,
      durationSummary: 'Free Explorer (5 AI Runs / Day)',
      dailyAiLimit: 5,
      usedAiCredits: 0,
    };
  });

  // Firebase Auth State
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isFirebaseAuthLoading, setIsFirebaseAuthLoading] = useState<boolean>(true);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      setIsFirebaseAuthLoading(false);
      if (user) {
        setUserProfile((prev) => ({
          ...prev,
          name: user.displayName || user.email?.split('@')[0] || prev.name,
          email: user.email || prev.email,
        }));

        // Load cloud data from Firestore
        const cloudData = await loadUserDataFromCloud(user.uid);
        if (cloudData) {
          if (Array.isArray(cloudData.savedItemIds) && cloudData.savedItemIds.length > 0) {
            setSavedItemIds(cloudData.savedItemIds);
          }
          if (typeof cloudData.quizStreak === 'number') {
            setQuizStreak(cloudData.quizStreak);
          }
          if (typeof cloudData.rainbowStreak === 'number') {
            setRainbowStreak(cloudData.rainbowStreak);
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const signInGoogle = async () => {
    setIsFirebaseAuthLoading(true);
    try {
      const cred = await signInWithGoogle();
      if (cred.user) {
        setUserProfile((prev) => ({
          ...prev,
          name: cred.user.displayName || prev.name,
          email: cred.user.email || prev.email,
        }));
      }
    } finally {
      setIsFirebaseAuthLoading(false);
    }
  };

  const signInEmail = async (email: string, pass: string) => {
    setIsFirebaseAuthLoading(true);
    try {
      await loginWithEmail(email, pass);
    } finally {
      setIsFirebaseAuthLoading(false);
    }
  };

  const signUpEmail = async (email: string, pass: string, name?: string) => {
    setIsFirebaseAuthLoading(true);
    try {
      const cred = await registerWithEmail(email, pass);
      if (cred.user && name) {
        setUserProfile((prev) => ({
          ...prev,
          name,
          email: cred.user.email || prev.email,
        }));
      }
    } finally {
      setIsFirebaseAuthLoading(false);
    }
  };

  const signInGuest = async () => {
    setIsFirebaseAuthLoading(true);
    try {
      await loginAnonymously();
    } finally {
      setIsFirebaseAuthLoading(false);
    }
  };

  const signOutUser = async () => {
    await logOut();
    setFirebaseUser(null);
  };

  // Seeding state
  const [isSeedingFirestore, setIsSeedingFirestore] = useState<boolean>(false);
  const [firestoreSeedProgress, setFirestoreSeedProgress] = useState<{ current: number; total: number } | null>(null);

  const seedFirestoreCatalog = async () => {
    setIsSeedingFirestore(true);
    setFirestoreSeedProgress({ current: 0, total: allProduceItems.length });
    try {
      const result = await seedAllProducesToFirestore(allProduceItems, (current, total) => {
        setFirestoreSeedProgress({ current, total });
      });
      return result;
    } finally {
      setIsSeedingFirestore(false);
    }
  };

  // Sync to Firestore when user is authenticated
  useEffect(() => {
    if (firebaseUser) {
      saveUserDataToCloud(firebaseUser.uid, {
        savedItemIds,
        quizStreak,
        rainbowStreak,
        userProfile,
      });
    }
  }, [firebaseUser, savedItemIds, quizStreak, rainbowStreak, userProfile]);

  // Persist items
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}saved`, JSON.stringify(savedItemIds));
  }, [savedItemIds]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}scans`, JSON.stringify(scanHistory));
  }, [scanHistory]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}profile`, JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}sub`, JSON.stringify(subscription));
  }, [subscription]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}rainbow_${todayDateString}`, JSON.stringify(rainbowLogs));
  }, [rainbowLogs, todayDateString]);

  // First time launch tour
  useEffect(() => {
    const hasSeen = localStorage.getItem(`${STORAGE_PREFIX}has_seen_tour`);
    if (!hasSeen) {
      setShowTourModal(true);
      localStorage.setItem(`${STORAGE_PREFIX}has_seen_tour`, 'true');
    }
  }, []);

  const toggleSaveItem = (id: number) => {
    setSavedItemIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const isItemSaved = (id: number) => savedItemIds.includes(id);

  const addScanResult = (res: ScanResult) => {
    setScanHistory((prev) => [res, ...prev]);
  };

  const clearScanHistory = () => {
    setScanHistory([]);
  };

  const shuffleCorkboard = () => {
    setCorkboardShuffleSeed((s) => s + 1);
  };

  // Generate 6 distinct corkboard items
  const { weekLabel, weeklyCorkboardItems } = React.useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime() + (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60000;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const weekNumber = Math.ceil(dayOfYear / 7);

    const seed = (now.getFullYear() * 100 + weekNumber + corkboardShuffleSeed * 10007) >>> 0;
    const all = allProduceItems;

    let a = seed;
    const nextFloat = () => {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    const rotations = [-4.5, 3.8, -3.5, 4.2, -3.8, 4.0];
    const tapeRotations = [3.5, -3.5, 4.0, -3.8, 4.2, -4.0];
    const pinColors = ['#D6482F', '#2E7D32', '#D4AF37', '#00897B', '#E65100', '#6A1B9A'];
    const pinStyles: Array<'PUSHPIN' | 'WASHI_TAPE' | 'BRASS_TACK'> = [
      'PUSHPIN',
      'WASHI_TAPE',
      'BRASS_TACK',
      'WASHI_TAPE',
      'PUSHPIN',
      'BRASS_TACK',
    ];

    const offset = Math.floor(nextFloat() * all.length);
    const selected: CorkboardItem[] = [];
    const usedIds = new Set<number>();

    for (let i = 0; i < 6; i++) {
      const idx = (offset + i * 37) % all.length;
      let item = all[idx];
      let searchOffset = 1;
      while (usedIds.has(item.id) && searchOffset < all.length) {
        item = all[(idx + searchOffset) % all.length];
        searchOffset++;
      }
      usedIds.add(item.id);

      selected.push({
        id: item.id,
        name: item.name,
        archetype: item.archetype,
        symbolId: item.symbolId,
        rotation: rotations[i] ?? 0,
        tapeRotation: tapeRotations[i] ?? 0,
        pinColor: pinColors[i] ?? '#D6482F',
        pinStyle: pinStyles[i] ?? 'PUSHPIN',
        scientific: item.scientific || item.name,
        funFactSnippet: item.nutrients[0] || item.origin || 'Botanical Harvest',
      });
    }

    const label = corkboardShuffleSeed === 0 ? `Week ${weekNumber} Harvest` : `Curated Board #${corkboardShuffleSeed}`;
    return { weekLabel: label, weeklyCorkboardItems: selected };
  }, [corkboardShuffleSeed]);

  // Generate today's botanical quiz
  const todayQuiz = React.useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const daySeed = (now.getFullYear() * 1000 + dayOfYear) >>> 0;
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    let a = daySeed;
    const nextFloat = () => {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    const targetIdx = Math.floor(nextFloat() * allProduceItems.length);
    const target = allProduceItems[targetIdx] || allProduceItems[0];

    const clue1 = target.scientific
      ? `Botanically classified as ${target.scientific}, belonging to the ${target.category.toLowerCase().replace(/s$/, '')} family.`
      : `A prized ${target.type.toLowerCase()} with a distinctive ${target.archetype} botanical structure.`;

    const clue2 =
      target.nutrients.length > 0
        ? `Rich whole-food source of ${target.nutrients.slice(0, 3).join(', ')}.`
        : `Grown in ${target.origin || 'temperate zones'} with peak availability in ${target.season || 'summer'}.`;

    const clue3 =
      target.trivia && target.trivia.length > 20
        ? target.trivia
        : target.characteristics.split('.')[0] + '.';

    // Distractors
    const distractors: string[] = [];
    const usedIds = new Set<number>([target.id]);
    const sameCat = allProduceItems.filter((i) => i.category === target.category && i.id !== target.id);
    for (const item of sameCat) {
      if (distractors.length < 3 && !usedIds.has(item.id)) {
        distractors.push(item.name);
        usedIds.add(item.id);
      }
    }
    while (distractors.length < 3) {
      const rand = allProduceItems[Math.floor(nextFloat() * allProduceItems.length)];
      if (!usedIds.has(rand.id)) {
        distractors.push(rand.name);
        usedIds.add(rand.id);
      }
    }

    const correctIndex = Math.floor(nextFloat() * 4);
    const options: string[] = [];
    let dIdx = 0;
    for (let i = 0; i < 4; i++) {
      if (i === correctIndex) {
        options.push(target.name);
      } else {
        options.push(distractors[dIdx++] || 'Specimen');
      }
    }

    return {
      specimenName: target.name,
      archetype: target.archetype,
      clues: [clue1, clue2, clue3],
      options,
      correctIndex,
      funFact: target.trivia || target.blurb,
      produceId: target.id,
      symbolId: target.symbolId,
      dateString: dateStr,
      dayNumber: dayOfYear,
    };
  }, []);

  const submitQuizAnswer = (chosenIndex: number): boolean => {
    const isCorrect = chosenIndex === todayQuiz.correctIndex;
    if (isCorrect && !isQuizAnsweredToday) {
      const newStreak = quizStreak + 1;
      setQuizStreak(newStreak);
      setLastQuizCompletedDate(todayDateString);
      localStorage.setItem(`${STORAGE_PREFIX}quiz_streak`, newStreak.toString());
      localStorage.setItem(`${STORAGE_PREFIX}last_quiz_date`, todayDateString);
    }
    return isCorrect;
  };

  const toggleRainbowColor = (key: string) => {
    setRainbowLogs((prev) => {
      const current = prev[key] || { key: key as any, isLogged: false };
      const newLogged = !current.isLogged;
      const sample = RAINBOW_COLORS.find((r) => r.key === key)?.sampleProduce || 'Specimen';
      return {
        ...prev,
        [key]: {
          key: key as any,
          isLogged: newLogged,
          produceName: newLogged ? sample : null,
          loggedTime: newLogged ? 'Just now' : null,
        },
      };
    });
  };

  const updateUserProfile = (patch: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...patch }));
  };

  const activatePlan = (planType: string, email?: string) => {
    const days = 365;
    const now = new Date();
    const expiry = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    const expiryStr = expiry.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    setSubscription({
      isPro: true,
      planType: 'bloom',
      activePlanTitle: 'Bloom Pro — Full Access',
      expirationDateFormatted: expiryStr,
      remainingDays: days,
      durationSummary: 'Bloom Pro (500 Daily AI Runs & All New Features)',
      dailyAiLimit: 500,
      usedAiCredits: 0,
    });
    if (email) {
      setUserProfile((prev) => ({ ...prev, email }));
    }
  };

  const redeemPromoCode = (inputCode: string) => {
    const clean = inputCode.trim().toUpperCase();
    const validCodes = ['SPROUT30', 'BLOOM', 'BLOOM500', 'SPROUT', 'PRO'];
    if (validCodes.includes(clean)) {
      const days = 365;
      const expiry = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
      const expiryStr = expiry.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      setSubscription({
        isPro: true,
        planType: 'bloom',
        activePlanTitle: 'Bloom Pro — Full Access',
        expirationDateFormatted: expiryStr,
        remainingDays: days,
        durationSummary: `Bloom Pro (500 Daily AI Runs & All New Features)`,
        dailyAiLimit: 500,
        usedAiCredits: 0,
      });
      return {
        success: true,
        message: `Promo code accepted! Bloom Pro activated with 500 daily AI runs and full access to all new features.`,
      };
    }
    return {
      success: false,
      message: 'Invalid promo code. Please enter a valid promo code.',
    };
  };

  const recordAiUsage = (): boolean => {
    if (subscription.usedAiCredits >= subscription.dailyAiLimit) {
      return false;
    }
    setSubscription((prev) => ({
      ...prev,
      usedAiCredits: prev.usedAiCredits + 1,
    }));
    return true;
  };

  const remainingAiRuns = Math.max(0, subscription.dailyAiLimit - subscription.usedAiCredits);

  const resetToNewUserState = () => {
    try {
      // Clear all local storage keys
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('sprout_atlas')) {
          localStorage.removeItem(key);
        }
      });
    } catch {}

    setSavedItemIds([]);
    setScanHistory([]);
    setQuizStreak(0);
    setRainbowStreak(0);
    setLastQuizCompletedDate('');

    const freshRainbow: Record<string, RainbowLogEntry> = {};
    RAINBOW_COLORS.forEach((c) => {
      freshRainbow[c.key] = { key: c.key, isLogged: false };
    });
    setRainbowLogs(freshRainbow);

    setUserProfile({
      name: 'Explorer',
      title: 'Field Botanist & Forager',
      avatar: '🌱',
      email: '',
    });

    setSubscription({
      isPro: false,
      planType: 'free',
      activePlanTitle: 'Seedling — Free Explorer',
      expirationDateFormatted: '',
      remainingDays: 0,
      durationSummary: 'Free Explorer (5 AI Runs / Day)',
      dailyAiLimit: 5,
      usedAiCredits: 0,
    });

    setActiveGuideId(null);
    setCurrentTab('home');
    setShowAccountModal(false);
    setShowQuizModal(false);
    setShowPaywallModal(false);
    setShowTourModal(true);
  };

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        activeGuideId,
        setActiveGuideId,
        exploreCategoryFilter,
        setExploreCategoryFilter,
        exploreSearchQuery,
        setExploreSearchQuery,

        showQuizModal,
        setShowQuizModal,
        showTourModal,
        setShowTourModal,
        showAccountModal,
        setShowAccountModal,
        showPaywallModal,
        setShowPaywallModal,

        savedItemIds,
        toggleSaveItem,
        isItemSaved,

        scanHistory,
        addScanResult,
        clearScanHistory,

        corkboardShuffleSeed,
        shuffleCorkboard,
        weeklyCorkboardItems,
        weekLabel,
        todayQuiz,
        quizStreak,
        isQuizAnsweredToday,
        submitQuizAnswer,

        rainbowLogs,
        toggleRainbowColor,
        rainbowStreak,

        userProfile,
        updateUserProfile,
        firebaseUser,
        isFirebaseAuthLoading,
        signInGoogle,
        signInEmail,
        signUpEmail,
        signInGuest,
        signOutUser,
        seedFirestoreCatalog,
        isSeedingFirestore,
        firestoreSeedProgress,

        subscription,
        activatePlan,
        redeemPromoCode,
        recordAiUsage,
        remainingAiRuns,

        resetToNewUserState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
