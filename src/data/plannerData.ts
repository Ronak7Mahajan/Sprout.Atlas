import { DietaryCategory, MealItem } from '../types/produce';

export const plannerCategories: DietaryCategory[] = [
  {
    id: "CAT-01",
    name: "Heavy (Whole-Food High Protein)",
    macro: "40% Protein | 25% Net Carbs | 35% Fats (Min 2.0g/kg Protein)",
    philosophy: "Dense, unprocessed animal & plant whole proteins; zero refined sugar, zero protein powders, zero processed bars, zero artificial sweeteners. Pure real-food power.",
    rule: "If user is on ACE-inhibitors/ARBs or renal impairment, protein is capped at 1.4g/kg and potassium-heavy foods are monitored.",
    rotation: "Main protein source must rotate every day (e.g. Day 1: Beef/Eggs -> Day 2: Salmon/Chicken -> Day 3: Bison/Turkey -> Day 4: Fish/Lentils). No repeating primary protein consecutively.",
    token: "Heavy"
  },
  {
    id: "CAT-02",
    name: "Longevity & Cellular Autophagy",
    macro: "18% Protein | 45% Complex Carbs | 37% Fats (mTOR cycling)",
    philosophy: "Periodic low-protein fasting-mimicking framework; sirtuin-activating polyphenols, spermidine-rich botanicals, caloric density moderation.",
    rule: "If on Metformin or SGLT2i, ensure adequate complex carbs to avoid hypoglycemia; avoids grapefruit if on statins.",
    rotation: "Carbohydrate sources rotate between tubers, ancient grains, and legumes across consecutive days.",
    token: "Longevity"
  },
  {
    id: "CAT-03",
    name: "Neuro-Fuel & Cognitive Peak",
    macro: "25% Protein | 30% Low-GI Carbs | 45% Brain Fats",
    philosophy: "DHA-rich marine lipids, acetylcholine precursors (choline), lutein, flavanols, and steady low-glycemic fuel to eliminate brain fog and mental crashes.",
    rule: "If user is taking MAOIs or SSRIs, tyramine-heavy aged foods and tryptophan imbalances are screened and moderated.",
    rotation: "Omega-3 fish and poultry alternate on consecutive days; brain-berry antioxidant profiles alternate between dark berries and citrus flavonoids.",
    token: "Neuro-Fuel"
  },
  {
    id: "CAT-04",
    name: "Metabolic Reset (Clean Keto)",
    macro: "25% Protein | 5% Net Carbs (<30g/day) | 70% Healthy Fats",
    philosophy: "Therapeutic carbohydrate restriction to induce physiological ketosis, restore insulin sensitivity, and utilize ketone bodies for cellular energy.",
    rule: "If on SGLT2i inhibitors or insulin, ketosis requires strict clinical hydration and physician clearance to avoid euglycemic DKA.",
    rotation: "Cruciferous vegetables and leafy green choices rotate daily; healthy cooking fat sources alternate between olive oil, avocado oil, and grass-fed ghee.",
    token: "Metabolic Reset"
  },
  {
    id: "CAT-05",
    name: "Microbiome Shield & Anti-Inflammatory",
    macro: "22% Protein | 48% Prebiotic Carbs | 30% Polyphenol Fats",
    philosophy: "30+ diverse plant species per week; prebiotic soluble fibers, resistant starches, and live fermented probiotic cultures to rebuild gut epithelial lining.",
    rule: "If taking immunosuppressants or active IBD flare, raw unpasteurized ferments are substituted with cooked prebiotic fiber.",
    rotation: "No identical legume or grain source repeated two days in a row; ferment source alternates daily (e.g. Kimchi -> Sauerkraut -> Miso -> Kefir).",
    token: "Microbiome Shield"
  }
];

export const plannerMeals: MealItem[] = [
  // HEAVY
  {
    id: "HVY-001",
    cat: "Heavy",
    type: "Breakfast",
    name: "Grass-Fed Steak & Pastured Eggs Power Plate",
    portionDetails: "180g Grass-fed tenderloin steak, 3 pastured whole eggs, 1/2 sliced avocado, 1 cup baby spinach sautéed in extra virgin olive oil",
    calories: 640,
    protein: 54,
    carbs: 3,
    fats: 44,
    fiber: 5,
    highlights: "Heme Iron, Choline, Vitamin B12, Creatine, Lutein",
    prepTimeMin: 15
  },
  {
    id: "HVY-002",
    cat: "Heavy",
    type: "Breakfast",
    name: "Greek Yogurt, Nut Butter & Raw Seed Superbowl",
    portionDetails: "250g Plain 0% Greek Yogurt, 2 tbsp pure almond butter (100% almonds), 1 tbsp chia seeds, 1 tbsp hemp hearts, 1/2 cup organic blueberries",
    calories: 480,
    protein: 42,
    carbs: 16,
    fats: 22,
    fiber: 8,
    highlights: "Complete dairy protein, Calcium, Alpha-Linolenic Acid (Omega-3), Anthocyanins",
    prepTimeMin: 5
  },
  {
    id: "HVY-003",
    cat: "Heavy",
    type: "Lunch",
    name: "Pan-Seared Wild Salmon with Roasted Asparagus & Quinoa",
    portionDetails: "200g Wild Sockeye salmon fillet, 150g roasted asparagus spears, 1/2 cup cooked organic quinoa, lemon-olive oil drizzle",
    calories: 610,
    protein: 52,
    carbs: 22,
    fats: 32,
    fiber: 6,
    highlights: "Astaxanthin, Potassium, Folate, Marine Omega-3 Fatty Acids",
    prepTimeMin: 20
  },
  {
    id: "HVY-004",
    cat: "Heavy",
    type: "Lunch",
    name: "Herb-Roasted Chicken Breast with Sweet Potato & Broccolini",
    portionDetails: "220g Free-range chicken breast, 150g baked sweet potato cubes, 1 cup steamed broccolini, 1 tbsp extra virgin olive oil",
    calories: 580,
    protein: 56,
    carbs: 30,
    fats: 21,
    fiber: 7,
    highlights: "Niacin (B3), Sulforaphane, Potassium, Beta-Carotene",
    prepTimeMin: 25
  },
  {
    id: "HVY-005",
    cat: "Heavy",
    type: "Dinner",
    name: "Grass-Fed Ribeye Steak with Garlic Herb Mushrooms & Asparagus",
    portionDetails: "250g Grass-fed ribeye steak, 1 cup button & shiitake mushrooms pan-seared in grass-fed butter, 150g grilled asparagus",
    calories: 720,
    protein: 58,
    carbs: 5,
    fats: 52,
    fiber: 5,
    highlights: "Creatine, Carnosine, Ergothioneine, Vitamin B12, Heme Iron",
    prepTimeMin: 20
  },
  {
    id: "HVY-006",
    cat: "Heavy",
    type: "Snack",
    name: "Pastured Hard-Boiled Eggs with Guacamole & Hemp Seeds",
    portionDetails: "3 Pastured hard-boiled eggs, 3 tbsp fresh guacamole, 1 tbsp raw shelled hemp hearts, pinch of Celtic sea salt",
    calories: 360,
    protein: 24,
    carbs: 4,
    fats: 26,
    fiber: 4,
    highlights: "Choline, Lutein, Zeaxanthin, Essential Fatty Acids",
    prepTimeMin: 5
  },

  // LONGEVITY
  {
    id: "LNG-001",
    cat: "Longevity",
    type: "Breakfast",
    name: "Sirtuin-Activating Matcha Walnut Chia Pudding",
    portionDetails: "3 tbsp Chia seeds soaked in unsweetened almond milk, 1 tsp ceremonial matcha, 25g raw walnuts, 1/3 cup wild blueberries",
    calories: 380,
    protein: 12,
    carbs: 16,
    fats: 26,
    fiber: 14,
    highlights: "EGCG, Polyphenols, Alpha-Linolenic Acid, Sirtuin activators",
    prepTimeMin: 10
  },
  {
    id: "LNG-002",
    cat: "Longevity",
    type: "Lunch",
    name: "Mediterranean Sardine & Warm Puy Lentil Salad",
    portionDetails: "1 Can wild sardines, 1 cup cooked French green lentils, diced red onion, parsley, capers, 1.5 tbsp extra virgin olive oil",
    calories: 510,
    protein: 36,
    carbs: 32,
    fats: 24,
    fiber: 11,
    highlights: "Spermidine, Hydroxytyrosol, Resveratrol, Marine Omega-3s",
    prepTimeMin: 15
  },
  {
    id: "LNG-003",
    cat: "Longevity",
    type: "Dinner",
    name: "Tempeh & Shiitake Mushroom Stir-Fry with Bok Choy",
    portionDetails: "180g Organic fermented tempeh, 1 cup fresh shiitake mushrooms, 2 cups bok choy, fresh ginger-garlic tamari glaze",
    calories: 460,
    protein: 34,
    carbs: 22,
    fats: 24,
    fiber: 10,
    highlights: "Beta-Glucans, Isoflavones, Ergothioneine, Glucosinolates",
    prepTimeMin: 20
  },
  {
    id: "LNG-004",
    cat: "Longevity",
    type: "Snack",
    name: "Sprouted Pumpkin Seeds & Wild Blackberries",
    portionDetails: "35g Raw sprouted pumpkin seeds, 1/2 cup fresh wild blackberries",
    calories: 220,
    protein: 12,
    carbs: 12,
    fats: 14,
    fiber: 6,
    highlights: "Zinc, Magnesium, Ellagic Acid",
    prepTimeMin: 2
  },

  // NEURO-FUEL
  {
    id: "NRO-001",
    cat: "Neuro-Fuel",
    type: "Breakfast",
    name: "DHA Brain Bowl with Pastured Eggs, Avocado & Mackerel",
    portionDetails: "2 Pastured poached eggs, 100g wild mackerel fillet, 1/2 sliced avocado, 1 cup baby spinach with cold-pressed olive oil",
    calories: 520,
    protein: 38,
    carbs: 4,
    fats: 38,
    fiber: 5,
    highlights: "Choline, Marine DHA/EPA, Vitamin D3, Lutein",
    prepTimeMin: 15
  },
  {
    id: "NRO-002",
    cat: "Neuro-Fuel",
    type: "Lunch",
    name: "Rosemary-Crusted Wild Salmon with Blueberry Walnut Salad",
    portionDetails: "180g Wild salmon, 2 cups baby arugula, 1/2 cup fresh blueberries, 30g raw walnuts, extra virgin olive oil dressing",
    calories: 580,
    protein: 44,
    carbs: 14,
    fats: 36,
    fiber: 6,
    highlights: "Rosmarinic acid, Anthocyanins, DHA, Neuro-protective polyphenols",
    prepTimeMin: 18
  },
  {
    id: "NRO-003",
    cat: "Neuro-Fuel",
    type: "Dinner",
    name: "Grass-Fed Beef Liver & Caramelized Onion Skillet with Greens",
    portionDetails: "150g Organic grass-fed calf liver, 1 sliced yellow onion, 2 cups sautéed lacinato kale in ghee, steamed sweet potato",
    calories: 490,
    protein: 42,
    carbs: 26,
    fats: 18,
    fiber: 5,
    highlights: "Concentrated Vitamin A, Vitamin B12, Bioavailable Choline, Copper",
    prepTimeMin: 20
  },
  {
    id: "NRO-004",
    cat: "Neuro-Fuel",
    type: "Snack",
    name: "Walnut Halves & 90% Dark Single-Origin Cacao",
    portionDetails: "30g Raw halved walnuts, 20g organic 90% dark chocolate",
    calories: 280,
    protein: 7,
    carbs: 8,
    fats: 24,
    fiber: 5,
    highlights: "Alpha-Linolenic Acid, Epicatechin, Polyphenols",
    prepTimeMin: 2
  },

  // METABOLIC RESET
  {
    id: "MET-001",
    cat: "Metabolic Reset",
    type: "Breakfast",
    name: "Smoked Salmon & Pastured Butter Omelet with Herbs",
    portionDetails: "3 Pastured eggs, 80g wild smoked salmon, 1 tbsp grass-fed butter, dill, capers, 1/2 avocado",
    calories: 510,
    protein: 36,
    carbs: 2,
    fats: 38,
    fiber: 4,
    highlights: "Zero insulin spike, Choline, High bioavailability lipids",
    prepTimeMin: 12
  },
  {
    id: "MET-002",
    cat: "Metabolic Reset",
    type: "Lunch",
    name: "Grass-Fed Ribeye Salad with Gorgonzola & Macadamias",
    portionDetails: "180g Sliced grilled grass-fed ribeye, 2 cups romaine lettuce, 30g raw macadamia nuts, 20g aged gorgonzola, olive oil",
    calories: 680,
    protein: 44,
    carbs: 3,
    fats: 54,
    fiber: 4,
    highlights: "Palmitoleic acid (Omega-7), CLA, Ketogenic ratio",
    prepTimeMin: 15
  },
  {
    id: "MET-003",
    cat: "Metabolic Reset",
    type: "Dinner",
    name: "Crispy Skin Duck Breast with Sautéed Asparagus & Ghee",
    portionDetails: "200g Pan-roasted duck breast, 150g asparagus sautéed in grass-fed ghee, fresh thyme",
    calories: 620,
    protein: 42,
    carbs: 4,
    fats: 48,
    fiber: 4,
    highlights: "Monounsaturated fat profile, Potassium, Low-carb drive",
    prepTimeMin: 25
  },
  {
    id: "MET-004",
    cat: "Metabolic Reset",
    type: "Snack",
    name: "Avocado Halves Filled with Wild Sardines & Olive Oil",
    portionDetails: "1 Whole avocado halved, 1 can sardines, lemon juice, cracked black pepper",
    calories: 380,
    protein: 26,
    carbs: 3,
    fats: 29,
    fiber: 7,
    highlights: "Zero carb surge, EPA/DHA, Oleic Acid",
    prepTimeMin: 3
  },

  // MICROBIOME SHIELD
  {
    id: "MIC-001",
    cat: "Microbiome Shield",
    type: "Breakfast",
    name: "Fermented Kimchi & Pastured Egg Golden Scramble",
    portionDetails: "3 Pastured eggs scrambled in ghee, 1/2 cup unpasteurized artisan kimchi, 1/2 sliced avocado, toasted sesame seeds",
    calories: 420,
    protein: 24,
    carbs: 6,
    fats: 30,
    fiber: 5,
    highlights: "Live lactic acid bacteria (L. plantarum), Capsaicin, Choline",
    prepTimeMin: 10
  },
  {
    id: "MIC-002",
    cat: "Microbiome Shield",
    type: "Lunch",
    name: "Rainbow Diversity Bowl with Salmon & 7 Plant Varieties",
    portionDetails: "150g Wild salmon, purple cabbage, shredded carrots, baby spinach, roasted beets, pumpkin seeds, tahini-lemon dressing",
    calories: 540,
    protein: 40,
    carbs: 24,
    fats: 30,
    fiber: 9,
    highlights: "Polyphenols, Beta-Carotene, Betalains, Plant diversity",
    prepTimeMin: 20
  },
  {
    id: "MIC-003",
    cat: "Microbiome Shield",
    type: "Dinner",
    name: "Prebiotic Sunchoke, Leek & Lentil Slow Stew",
    portionDetails: "1 cup Cooked French lentils, 100g roasted sunchokes (Jerusalem artichokes), 1 sliced leek, garlic, fresh rosemary, olive oil",
    calories: 460,
    protein: 22,
    carbs: 52,
    fats: 16,
    fiber: 16,
    highlights: "High Inulin fructooligosaccharides, Resistant starch, Kaempferol",
    prepTimeMin: 30
  },
  {
    id: "MIC-004",
    cat: "Microbiome Shield",
    type: "Snack",
    name: "Raw Kefir Smoothie with Green Banana Flour & Blueberries",
    portionDetails: "250ml Plain goat milk kefir, 1 tbsp green banana flour (resistant starch type 2), 1/2 cup wild blueberries",
    calories: 260,
    protein: 14,
    carbs: 22,
    fats: 9,
    fiber: 7,
    highlights: "Probiotics, Resistant starch prebiotic, Anthocyanins",
    prepTimeMin: 3
  }
];

export function getPresetDayPlan(catToken: string): MealItem[] {
  const slots: Array<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'> = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
  return slots.map((slot) => {
    const matching = plannerMeals.filter((m) => m.cat === catToken && m.type === slot);
    if (matching.length > 0) {
      return matching[Math.floor(Math.random() * matching.length)];
    }
    return plannerMeals.find((m) => m.type === slot) || plannerMeals[0];
  });
}
