export interface ProduceItem {
  id: number;
  name: string;
  scientific?: string;
  category: string;
  archetype: string;
  type: 'Fruit' | 'Vegetable';
  blurb: string;
  symbolId?: string | null;
  nutrients: string[];
  characteristics: string;
  ripenessCues: string[];
  cleaningSteps: string[];
  treatment: string;
  botanicalFacts: string;
  season?: string;
  storage?: string;
  waterContent?: string;
  glycemicIndex?: string;
  origin?: string;
  trivia?: string;
}

export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface ScanResult {
  id: string;
  produceName: string;
  dateGroup: string;
  time: string;
  confidence: ConfidenceLevel;
  quality: string;
  ripenessStage: string;
  shelfLifeDays: string;
  freshnessCues: string;
  isEdible: boolean;
  edibilityVerdict: string;
  symbolId?: string | null;
}

export interface DietaryCategory {
  id: string;
  name: string;
  macro: string;
  philosophy: string;
  rule: string;
  rotation: string;
  token: string;
}

export interface MealItem {
  id: string;
  cat: string;
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  name: string;
  portionDetails: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  highlights: string;
  prepTimeMin: number;
}

export type RainbowColorKey =
  | 'RED'
  | 'ORANGE'
  | 'YELLOW'
  | 'GREEN'
  | 'BLUE_PURPLE'
  | 'WHITE_BROWN';

export interface RainbowColorDef {
  key: RainbowColorKey;
  displayName: string;
  hexColor: string;
  sampleProduce: string;
  phytonutrient: string;
}

export interface RainbowLogEntry {
  key: RainbowColorKey;
  isLogged: boolean;
  produceName?: string | null;
  loggedTime?: string | null;
}

export interface CorkboardItem {
  id: number;
  name: string;
  archetype: string;
  symbolId?: string | null;
  rotation: number;
  tapeRotation: number;
  pinColor: string;
  pinStyle: 'PUSHPIN' | 'WASHI_TAPE' | 'BRASS_TACK';
  scientific: string;
  funFactSnippet: string;
}

export interface QuizQuestion {
  specimenName: string;
  archetype: string;
  clues: string[];
  options: string[];
  correctIndex: number;
  funFact: string;
  produceId: number;
  symbolId?: string | null;
  dateString: string;
  dayNumber: number;
}

export interface AiMeal {
  name: string;
  slot: string;
  portionDetails: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  prepTimeMin: number;
  produceIngredients: string[];
  nutrients: string;
}

export interface AiMealPlan {
  title: string;
  dietaryFocus: string;
  summary: string;
  macroSummary: string;
  breakfast: AiMeal;
  lunch: AiMeal;
  dinner: AiMeal;
  snack: AiMeal;
  focusedNutrients?: string;
  currentWeight?: string;
  targetWeight?: string;
  medications?: string;
  clinicalPrecautions?: string;
}

export interface ImageAnalysisResult {
  produceName: string;
  confidenceScore: number;
  isEdible: boolean;
  edibilityVerdict: string;
  freshDaysRemaining: string;
  shelfLifeDaysCount: number;
  freshnessVerdict: string;
  ripenessState: string;
  spoilageRiskAnalysis: string;
  visualObservations: string[];
  washingRecommendation: string;
  storageTip: string;
  matchedGuideId?: number | null;
}

export interface UserProfile {
  name: string;
  title: string;
  avatar: string;
  email?: string;
}

export interface SubscriptionState {
  isPro: boolean;
  planType: 'free' | 'monthly' | 'annual' | 'lifetime' | 'trial' | 'promo' | 'bloom';
  activePlanTitle: string;
  expirationDateFormatted?: string;
  remainingDays: number;
  durationSummary: string;
  dailyAiLimit: number;
  usedAiCredits: number;
}
