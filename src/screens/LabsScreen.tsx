import React, { useState, useRef, useMemo } from 'react';
import { useApp, RAINBOW_COLORS } from '../context/AppContext';
import { ProduceDoodle } from '../components/doodles/ProduceDoodle';
import { ImageAnalysisResult, AiMealPlan, MealItem } from '../types/produce';
import { getPresetDayPlan, plannerCategories } from '../data/plannerData';
import {
  MessageSquare,
  Utensils,
  Palette,
  Camera,
  Upload,
  Send,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Shield,
  Trash2,
  ChevronRight,
  Flame,
  ArrowRight,
} from 'lucide-react';

export const LabsScreen: React.FC = () => {
  const {
    setActiveGuideId,
    rainbowLogs,
    toggleRainbowColor,
    rainbowStreak,
    addScanResult,
    scanHistory,
    remainingAiRuns,
    recordAiUsage,
    setShowPaywallModal,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'tutor' | 'planner' | 'rainbow' | 'scanner'>('planner');

  // -------------------------------------------------------------
  // 1. TUTOR CHAT STATE
  // -------------------------------------------------------------
  const [chatHistory, setChatHistory] = useState<Array<{ text: string; isUser: boolean }>>([
    {
      text: "Hello! I am your Sprout Atlas Botanical Science & Nutrition Tutor. Ask me anything about whole-food biology, pesticide removal, peel edibility, enzyme retention, or seasonal alternatives!",
      isUser: false,
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTutorThinking, setIsTutorThinking] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const handleSendChat = async (queryText?: string) => {
    const textToSend = queryText || chatInput.trim();
    if (!textToSend || isTutorThinking) return;

    if (remainingAiRuns <= 0) {
      setShowPaywallModal(true);
      return;
    }

    recordAiUsage();
    setChatInput('');
    const newHistory = [...chatHistory, { text: textToSend, isUser: true }];
    setChatHistory(newHistory);
    setIsTutorThinking(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend, history: newHistory }),
      });
      const data = await res.json();
      setChatHistory((prev: Array<{ text: string; isUser: boolean }>) => [
        ...prev,
        { text: data.reply || 'Consulting botanical facts...', isUser: false },
      ]);
    } catch {
      setChatHistory((prev: Array<{ text: string; isUser: boolean }>) => [
        ...prev,
        {
          text: 'Pesticides and surface waxes degrade significantly when submerged in a 1% sodium bicarbonate soak (1 tsp baking soda in 2 cups cold water) for 10-12 minutes.',
          isUser: false,
        },
      ]);
    } finally {
      setIsTutorThinking(false);
      setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  // -------------------------------------------------------------
  // 2. CLINICAL MEAL PLANNER STATE
  // -------------------------------------------------------------
  const [selectedArchetype, setSelectedArchetype] = useState<string>('Heavy');
  const [isIntakeExpanded, setIsIntakeExpanded] = useState<boolean>(false);
  const [selectedNutrients, setSelectedNutrients] = useState<string[]>([
    'High Bioavailable Protein',
    'Potassium & Magnesium',
  ]);
  const [currentWeight, setCurrentWeight] = useState('74');
  const [targetWeight, setTargetWeight] = useState('68');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  const [goalDirection, setGoalDirection] = useState('Lean Muscle Hypertrophy');
  const [selectedMedications, setSelectedMedications] = useState<string[]>(['None / No Active Prescriptions']);
  const [pantryIngredients, setPantryIngredients] = useState('');
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<AiMealPlan | null>(null);

  const activeCategoryDef = plannerCategories.find((c) => c.token === selectedArchetype) || plannerCategories[0];
  const presetMeals = React.useMemo(() => getPresetDayPlan(selectedArchetype), [selectedArchetype]);

  const handleGeneratePlan = async () => {
    if (remainingAiRuns <= 0) {
      setShowPaywallModal(true);
      return;
    }

    recordAiUsage();
    setIsGeneratingPlan(true);

    const payload = {
      focus: selectedArchetype,
      focusedNutrients: selectedNutrients.join(', '),
      currentWeight: `${currentWeight} ${weightUnit}`,
      targetWeight: `${targetWeight} ${weightUnit} (${goalDirection})`,
      medications: selectedMedications.join(', '),
      availableIngredients: pantryIngredients,
    };

    try {
      const res = await fetch('/api/gemini/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.plan) {
        setGeneratedPlan(data.plan);
      }
    } catch {
      // Fallback
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // -------------------------------------------------------------
  // 3. SCANNER STATE
  // -------------------------------------------------------------
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ImageAnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const b64 = reader.result as string;
      setScannedImage(b64);
      analyzeImage(b64, file.name);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (base64Data: string, specimenHint: string = '') => {
    if (remainingAiRuns <= 0) {
      setShowPaywallModal(true);
      return;
    }

    recordAiUsage();
    setIsScanning(true);

    try {
      const res = await fetch('/api/gemini/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Data,
          specimenHint,
        }),
      });
      const data = await res.json();
      if (data.result) {
        setScanResult(data.result);
        addScanResult({
          id: `scan-${Date.now()}`,
          produceName: data.result.produceName,
          dateGroup: 'Today',
          time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          confidence: data.result.confidenceScore >= 90 ? 'HIGH' : 'MEDIUM',
          quality: data.result.freshnessVerdict,
          ripenessStage: data.result.ripenessState,
          shelfLifeDays: data.result.freshDaysRemaining,
          freshnessCues: data.result.visualObservations?.join(' · ') || '',
          isEdible: data.result.isEdible,
          edibilityVerdict: data.result.edibilityVerdict,
          symbolId: null,
        });
      }
    } catch {
      // Offline fallback
    } finally {
      setIsScanning(false);
    }
  };

  const handlePresetScanTest = (name: string) => {
    // Canvas generated sample
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#FAF6E9';
      ctx.fillRect(0, 0, 300, 300);
      ctx.beginPath();
      ctx.arc(150, 150, 100, 0, Math.PI * 2);
      ctx.fillStyle = name.includes('Spoiled') ? '#7A5555' : name.includes('Banana') ? '#EAB308' : '#2E6B47';
      ctx.fill();
      ctx.fillStyle = '#233022';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(name, 150, 155);
    }
    const b64 = canvas.toDataURL('image/jpeg');
    setScannedImage(b64);
    analyzeImage(b64, name);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Top Header & Segmented Tabs */}
      <div className="space-y-3">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2E6B47]">
            Experimental Laboratory
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#233022]">Sprout Labs</h1>
        </div>

        {/* Daily Quota Ribbon */}
        <div className="p-3 bg-white rounded-2xl border border-[#233022]/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#2E6B47]" />
            <span className="font-bold text-[#233022]">Daily AI Engine Quota</span>
            <span className="text-[#5B6A54] hidden sm:inline">· Resets every 24 hours</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#1E482F]">
              {remainingAiRuns} / 20 Left
            </span>
          </div>
        </div>

        {/* 4 Segmented Tab Buttons */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-white rounded-2xl border border-[#233022]/15 shadow-2xs">
          {[
            { id: 'planner', label: 'Meal Planner', icon: Utensils },
            { id: 'tutor', label: 'Nutrition Tutor', icon: MessageSquare },
            { id: 'scanner', label: 'AI Scanner', icon: Camera },
            { id: 'rainbow', label: 'Rainbow', icon: Palette },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 ${
                  isSelected
                    ? 'bg-[#233022] text-white shadow-xs'
                    : 'text-[#4A4E42] hover:text-[#233022] hover:bg-[#FAF6E9]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[11px] sm:text-xs truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. CLINICAL MEAL PLANNER TAB                                  */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'planner' && (
        <div className="space-y-6">
          {/* Consultation Intake Form Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#233022]/15 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C7432B]">
                  Clinical Dietetic Consultation
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#233022]">
                  Whole-Food Meal Rotation
                </h2>
              </div>
              <button
                onClick={() => setGeneratedPlan(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-[#4A4E42]"
                title="Reset to Defaults"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Archetype Selector */}
            <div>
              <span className="text-xs font-bold text-[#233022] block mb-2">
                1. Select Dietary Focus Archetype:
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {plannerCategories.map((cat) => {
                  const isSelected = selectedArchetype === cat.token;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedArchetype(cat.token)}
                      className={`px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                        isSelected
                          ? 'bg-[#233022] text-white border-[#233022]'
                          : 'bg-[#FAF6E9] text-[#233022] border-[#233022]/15 hover:border-[#233022]/40'
                      }`}
                    >
                      {cat.token}
                    </button>
                  );
                })}
              </div>

              {/* Active Category Description Banner */}
              <div className="bg-[#FAF6E9] rounded-2xl p-3.5 mt-3 border border-[#233022]/10 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#233022]">{activeCategoryDef.name}</span>
                  <span className="font-mono font-bold text-[#C7432B]">{activeCategoryDef.macro}</span>
                </div>
                <p className="text-xs text-[#5B6A54] leading-relaxed">{activeCategoryDef.philosophy}</p>
              </div>
            </div>

            {/* Collapsible Biometrics & Prescriptions Drawer */}
            <div className="border border-[#233022]/15 rounded-2xl overflow-hidden">
              <button
                onClick={() => setIsIntakeExpanded(!isIntakeExpanded)}
                className="w-full p-3.5 bg-[#FAF6E9] hover:bg-[#F2ECD8] flex items-center justify-between text-left text-xs transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#233022]">Clinical Intake & Prescriptions Screen</span>
                  <span className="text-[#5B6A54] text-[11px]">
                    ({currentWeight} {weightUnit} → {targetWeight} {weightUnit})
                  </span>
                </div>
                <span className="text-xs font-bold text-[#2E6B47]">
                  {isIntakeExpanded ? 'Hide Options ▲' : 'Customize Intake ▼'}
                </span>
              </button>

              {isIntakeExpanded && (
                <div className="p-4 bg-white space-y-4 border-t border-[#233022]/10 text-xs">
                  {/* Step A: Focused Nutrients */}
                  <div>
                    <label className="font-bold text-[#233022] block mb-1.5">
                      Targeted Bioavailable Nutrients:
                    </label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {[
                        'High Bioavailable Protein',
                        'Potassium & Magnesium',
                        'Prebiotic Soluble Fiber',
                        'Polyphenols & Omega-3',
                        'Bioavailable Iron & B12',
                        'Low Glycemic Index',
                        'Sulforaphane & Antioxidants',
                      ].map((nut) => {
                        const isChecked = selectedNutrients.includes(nut);
                        return (
                          <button
                            key={nut}
                            onClick={() => {
                              setSelectedNutrients((prev: string[]) =>
                                isChecked ? prev.filter((n: string) => n !== nut) : [...prev, nut]
                              );
                            }}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                              isChecked
                                ? 'bg-[#E8F5E9] text-[#1E482F] border-[#A5D6A7]'
                                : 'bg-[#FAF6E9] text-[#4A4E42] border-[#233022]/10'
                            }`}
                          >
                            {isChecked && '✓ '}
                            {nut}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step B: Weight Trajectory */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-mono text-[#5B6A54] block mb-1">
                        Current Weight ({weightUnit})
                      </label>
                      <input
                        type="number"
                        value={currentWeight}
                        onChange={(e) => setCurrentWeight(e.target.value)}
                        className="w-full px-3 py-2 border border-[#233022]/20 rounded-xl font-bold text-sm bg-[#FAF6E9]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono text-[#5B6A54] block mb-1">
                        Target Goal ({weightUnit})
                      </label>
                      <input
                        type="number"
                        value={targetWeight}
                        onChange={(e) => setTargetWeight(e.target.value)}
                        className="w-full px-3 py-2 border border-[#C7432B]/40 rounded-xl font-bold text-sm bg-[#FAF6E9] text-[#C7432B]"
                      />
                    </div>
                  </div>

                  {/* Step C: Pharmacology Screen */}
                  <div>
                    <label className="font-bold text-[#233022] block mb-1">
                      Active Medications (Contraindication Screening):
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'None / No Active Prescriptions',
                        'Blood Pressure (ACE/ARBs)',
                        'Metformin / Insulin',
                        'Statins (Avoid Grapefruit)',
                        'Blood Thinners (Monitor Vit K)',
                      ].map((med) => {
                        const isChecked = selectedMedications.includes(med);
                        return (
                          <button
                            key={med}
                            onClick={() => {
                              if (med === 'None / No Active Prescriptions') {
                                setSelectedMedications(['None / No Active Prescriptions']);
                              } else {
                                const filtered = selectedMedications.filter(
                                  (m: string) => m !== 'None / No Active Prescriptions'
                                );
                                setSelectedMedications(
                                  isChecked ? filtered.filter((m: string) => m !== med) : [...filtered, med]
                                );
                              }
                            }}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                              isChecked
                                ? 'bg-[#FBECE8] text-[#C7432B] border-[#FDBA74]'
                                : 'bg-[#FAF6E9] text-[#4A4E42] border-[#233022]/10'
                            }`}
                          >
                            {isChecked && '✓ '}
                            {med}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step D: Pantry produce */}
                  <div>
                    <label className="text-[11px] font-bold text-[#233022] block mb-1">
                      On-Hand Pantry Ingredients (Optional):
                    </label>
                    <input
                      type="text"
                      value={pantryIngredients}
                      onChange={(e) => setPantryIngredients(e.target.value)}
                      placeholder="e.g. Sockeye salmon, avocados, sweet potatoes, broccoli..."
                      className="w-full px-3 py-2 border border-[#233022]/20 rounded-xl text-xs bg-[#FAF6E9]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Generate Action Button */}
            <button
              onClick={handleGeneratePlan}
              disabled={isGeneratingPlan}
              className="w-full h-12 rounded-full bg-[#C7432B] hover:bg-[#A5341E] text-white font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2"
            >
              {isGeneratingPlan ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Formulating Clinical Day Plan with Gemini...</span>
                </>
              ) : (
                <>
                  <Utensils className="w-4 h-4" />
                  <span>Generate Personalized Clinical Plan</span>
                </>
              )}
            </button>
          </div>

          {/* Plan Display: Generated or Preset */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2E6B47]">
                {generatedPlan ? 'AI CLINICAL MEAL PLAN & INTAKE PROFILE' : 'CURATED WHOLE-FOOD PRESETS'}
              </span>
              {generatedPlan && (
                <button
                  onClick={() => setGeneratedPlan(null)}
                  className="text-xs font-semibold text-[#C7432B] hover:underline"
                >
                  Reset to Presets
                </button>
              )}
            </div>

            {generatedPlan ? (
              <div className="space-y-4">
                {/* Clinical Header Banner */}
                <div className="bg-[#FFFDF5] border border-[#2E6B47] rounded-3xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold text-[#233022]">
                      {generatedPlan.title}
                    </h3>
                    <span className="px-2.5 py-1 rounded-full bg-[#E8F5E9] text-[#1E482F] text-[10px] font-bold font-mono">
                      CLINICAL MATCH
                    </span>
                  </div>
                  <p className="text-xs text-[#5B6A54] leading-relaxed">{generatedPlan.summary}</p>
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-[#C7432B] bg-[#FAF6E9] p-2.5 rounded-xl">
                    <span>{generatedPlan.macroSummary}</span>
                  </div>
                  {generatedPlan.clinicalPrecautions && (
                    <div className="bg-[#FEF3C7] text-[#92400E] p-2.5 rounded-xl text-xs flex items-start gap-2">
                      <Shield className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{generatedPlan.clinicalPrecautions}</span>
                    </div>
                  )}
                </div>

                {/* 4 Meals */}
                {[
                  generatedPlan.breakfast,
                  generatedPlan.lunch,
                  generatedPlan.dinner,
                  generatedPlan.snack,
                ].map((meal, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-4 border border-[#233022]/15 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold font-mono uppercase px-2.5 py-0.5 rounded-full bg-[#FAF6E9] text-[#2E6B47]">
                        {meal.slot}
                      </span>
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="font-bold text-[#233022]">{meal.calories} kcal</span>
                        <span className="text-[#7D8370]">· {meal.prepTimeMin}m prep</span>
                      </div>
                    </div>
                    <h4 className="font-serif font-bold text-base text-[#233022]">{meal.name}</h4>
                    <p className="text-xs text-[#5B6A54]">{meal.portionDetails}</p>

                    {/* Produce Tags */}
                    {meal.produceIngredients && meal.produceIngredients.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {meal.produceIngredients.map((ing: string, i: number) => (
                          <span
                            key={i}
                            className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#1E482F]"
                          >
                            🌱 {ing}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Macro Strip */}
                    <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#233022]/10 text-[11px] text-center font-mono">
                      <div>
                        <span className="text-[#7D8370] block">Protein</span>
                        <span className="font-bold text-[#C7432B]">{meal.protein}g</span>
                      </div>
                      <div>
                        <span className="text-[#7D8370] block">Carbs</span>
                        <span className="font-bold text-[#E79B1F]">{meal.carbs}g</span>
                      </div>
                      <div>
                        <span className="text-[#7D8370] block">Fats</span>
                        <span className="font-bold text-[#2E6B47]">{meal.fats}g</span>
                      </div>
                      <div>
                        <span className="text-[#7D8370] block">Fiber</span>
                        <span className="font-bold text-[#233022]">{meal.fiber}g</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {presetMeals.map((meal) => (
                  <div key={meal.id} className="bg-white rounded-2xl p-4 border border-[#233022]/15 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold font-mono uppercase px-2.5 py-0.5 rounded-full bg-[#FAF6E9] text-[#2E6B47]">
                        {meal.type}
                      </span>
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="font-bold text-[#233022]">{meal.calories} kcal</span>
                        <span className="text-[#7D8370]">· {meal.prepTimeMin}m prep</span>
                      </div>
                    </div>
                    <h4 className="font-serif font-bold text-base text-[#233022]">{meal.name}</h4>
                    <p className="text-xs text-[#5B6A54] leading-relaxed">{meal.portionDetails}</p>
                    <p className="text-[11px] text-[#2E6B47] font-medium pt-1">
                      ★ Highlights: {meal.highlights}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. NUTRITION TUTOR TAB                                        */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'tutor' && (
        <div className="bg-white rounded-3xl border border-[#233022]/15 shadow-xs overflow-hidden flex flex-col h-[600px]">
          {/* Tutor Header */}
          <div className="p-4 bg-[#FAF6E9] border-b border-[#233022]/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E6F4EA] flex items-center justify-center border border-[#2E6B47]/20">
                <ProduceDoodle symbolId="d-sprout" name="Sprout" size={26} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#233022]">Botanical Science Tutor</h3>
                <p className="text-xs text-[#5B6A54]">Powered by Gemini Whole-Food Intelligence</p>
              </div>
            </div>
            <button
              onClick={() =>
                setChatHistory([
                  {
                    text: 'Session refreshed. Ask me anything about produce biology, nutrients, storage, or food safety!',
                    isUser: false,
                  },
                ])
              }
              className="p-2 rounded-full hover:bg-slate-200 text-[#4A4E42]"
              title="Clear Thread"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 bg-[#FAF6E9]/60 border-b border-[#233022]/10 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              'Is mango skin edible?',
              'How to wash off apple wax?',
              'Why do onions make you cry?',
              'How to store avocados?',
            ].map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendChat(q)}
                className="px-3 py-1 rounded-full bg-white border border-[#233022]/15 text-xs text-[#233022] hover:border-[#2E6B47] whitespace-nowrap shadow-2xs"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FAF6E9]/30">
            {chatHistory.map((msg: { text: string; isUser: boolean }, i: number) => (
              <div key={i} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                    msg.isUser
                      ? 'bg-[#233022] text-white rounded-br-xs'
                      : 'bg-white border border-[#233022]/10 text-[#233022] rounded-bl-xs shadow-2xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTutorThinking && (
              <div className="flex justify-start">
                <div className="bg-white border border-[#233022]/10 rounded-2xl px-4 py-2.5 text-xs text-[#2E6B47] flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Consulting botanical research & food science...</span>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-white border-t border-[#233022]/10 flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              placeholder="Ask a produce question..."
              className="flex-1 px-4 py-2.5 rounded-full bg-[#FAF6E9] border border-[#233022]/15 text-xs sm:text-sm focus:outline-none focus:border-[#2E6B47]"
            />
            <button
              onClick={() => handleSendChat()}
              disabled={!chatInput.trim() || isTutorThinking}
              className="w-10 h-10 rounded-full bg-[#2E6B47] hover:bg-[#1E482F] disabled:bg-slate-200 text-white flex items-center justify-center transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. BOTANICAL VISION SCANNER TAB                               */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'scanner' && (
        <div className="space-y-6">
          {/* Uploader Card */}
          <div className="bg-[#233022] text-white rounded-3xl p-6 sm:p-8 space-y-4 text-center">
            <span className="text-[10px] font-mono font-bold tracking-wider text-[#FACC15] uppercase block">
              Gemini Vision AI Engine
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold">
              Freshness & Edibility Inspector
            </h2>
            <p className="text-xs sm:text-sm text-[#CDD6C4] max-w-md mx-auto leading-relaxed">
              Upload a photo or capture live produce to inspect botanical identity, calculate exact days of freshness remaining, evaluate mold/spoilage risks, and verify if it's safe to eat.
            </p>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isScanning}
                className="px-6 h-11 rounded-full bg-[#E79B1F] hover:bg-[#D97706] text-[#233022] font-bold text-xs transition-all shadow-sm flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Produce Photo</span>
              </button>
            </div>

            {/* Test Sample Presets */}
            <div className="pt-4 border-t border-white/10">
              <span className="text-[11px] text-[#CDD6C4] block mb-2 font-mono">
                Or test sample condition states:
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {[
                  'Hass Avocado (Fresh)',
                  'Honeycrisp Apple (10d)',
                  'Spotted Banana (1d)',
                  'Spoiled Strawberry (Mold Danger)',
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePresetScanTest(preset)}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-colors"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Analysis Processing Spinner */}
          {isScanning && (
            <div className="bg-white rounded-3xl p-8 border border-[#233022]/15 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-[#2E6B47] animate-spin mx-auto" />
              <h3 className="font-serif text-lg font-bold text-[#233022]">
                Analyzing Botanical Pathology & Freshness...
              </h3>
              <p className="text-xs text-[#5B6A54]">
                Evaluating cellular turgor, sugar spots, mycelial growth, and safe shelf life.
              </p>
            </div>
          )}

          {/* Result Card */}
          {scanResult && !isScanning && (
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#233022]/15 shadow-sm space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#2E6B47]" />
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#233022]">
                      {scanResult.produceName}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#2E6B47]">
                    Vision Confidence Match: {scanResult.confidenceScore}%
                  </span>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold font-mono ${
                      scanResult.isEdible
                        ? 'bg-[#E8F5E9] text-[#1E482F] border border-[#A5D6A7]'
                        : 'bg-[#FEE2E2] text-[#991B1B] border border-[#FCA5A5]'
                    }`}
                  >
                    {scanResult.freshnessVerdict}
                  </span>
                </div>
              </div>

              {/* Main Edibility & Days Banner */}
              <div
                className={`p-4 rounded-2xl border-2 space-y-2 ${
                  scanResult.isEdible
                    ? 'bg-[#F0FDF4] border-[#22C55E]'
                    : 'bg-[#FEF2F2] border-[#EF4444]'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  {scanResult.isEdible ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
                      <span className="text-[#16A34A]">{scanResult.edibilityVerdict}</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-[#DC2626]" />
                      <span className="text-[#DC2626]">{scanResult.edibilityVerdict}</span>
                    </>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs font-mono pt-1">
                  <span className="text-[#4B5563]">Remaining Freshness Window:</span>
                  <span className="font-bold text-[#111827]">{scanResult.freshDaysRemaining}</span>
                </div>
              </div>

              {/* Pathology Breakdown */}
              <div className="bg-[#FAF6E9] rounded-2xl p-4 border border-[#233022]/10 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-xs text-[#233022]">
                  <Shield className="w-3.5 h-3.5 text-[#2E6B47]" />
                  <span>Spoilage Risk & Pathology Analysis:</span>
                </div>
                <p className="text-xs text-[#5B6A54] leading-relaxed">
                  {scanResult.spoilageRiskAnalysis}
                </p>
              </div>

              {/* Visual Observations */}
              {scanResult.visualObservations && (
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-[#233022] block">
                    Botanical Visual Cues:
                  </span>
                  <div className="space-y-1">
                    {scanResult.visualObservations.map((obs: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-[#4A4E42]">
                        <span className="text-[#2E6B47] font-bold">·</span>
                        <span>{obs}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Washing & Storage Recommendations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-[#FFFDF5] p-3.5 rounded-xl border border-[#233022]/10">
                  <span className="font-bold text-[#2E6B47] block mb-1">
                    💧 Washing Protocol:
                  </span>
                  <p className="text-[#5B6A54] leading-relaxed">
                    {scanResult.washingRecommendation}
                  </p>
                </div>

                <div className="bg-[#FFFDF5] p-3.5 rounded-xl border border-[#233022]/10">
                  <span className="font-bold text-[#D97724] block mb-1">
                    📦 Storage Recommendation:
                  </span>
                  <p className="text-[#5B6A54] leading-relaxed">{scanResult.storageTip}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. RAINBOW CHALLENGE TAB                                      */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'rainbow' && (
        <div className="space-y-5">
          {/* Challenge Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#233022]/15 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D97724]">
                  Phytonutrient Diversity
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#233022]">Eat the Rainbow</h2>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FEF3C7] text-[#92400E] text-xs font-bold font-mono">
                <Flame className="w-3.5 h-3.5 text-[#D97706]" />
                <span>{rainbowStreak}-Day Streak</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#4A4E42] leading-relaxed">
              Consuming 6 different botanical color groups every day supplies diverse flavonoids, carotenoids, and polyphenols to nourish your gut microbiome and cellular defenses.
            </p>

            {/* Progress Bar */}
            {(() => {
              const loggedCount = Object.values(rainbowLogs).filter((l: any) => l.isLogged).length;
              const pct = Math.round((loggedCount / 6) * 100);
              return (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono font-bold">
                    <span className="text-[#233022]">{loggedCount} of 6 Color Groups Logged Today</span>
                    <span className="text-[#2E6B47]">{pct}% Complete</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                    {RAINBOW_COLORS.map((c) => {
                      const isL = rainbowLogs[c.key]?.isLogged;
                      return (
                        <div
                          key={c.key}
                          style={{ backgroundColor: isL ? c.hexColor : '#E2E8F0' }}
                          className="flex-1 border-r border-white/40 transition-colors"
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Color Group Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {RAINBOW_COLORS.map((color) => {
              const entry = rainbowLogs[color.key];
              const isLogged = entry?.isLogged;

              return (
                <div
                  key={color.key}
                  onClick={() => toggleRainbowColor(color.key)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    isLogged
                      ? 'bg-white border-[#2E6B47] shadow-xs'
                      : 'bg-white/80 border-[#233022]/10 hover:border-[#233022]/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-xs shrink-0"
                      style={{ backgroundColor: color.hexColor }}
                    >
                      {isLogged ? <CheckCircle2 className="w-5 h-5" /> : null}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#233022]">{color.displayName}</h4>
                      <p className="text-[11px] text-[#5B6A54]">{color.phytonutrient}</p>
                      <p className="text-[10px] text-[#7D8370] font-mono mt-0.5">
                        {isLogged ? `Logged (${entry?.produceName})` : `e.g. ${color.sampleProduce}`}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isLogged ? 'bg-[#2E6B47] border-[#2E6B47] text-white' : 'border-[#233022]/20'
                    }`}
                  >
                    {isLogged && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
