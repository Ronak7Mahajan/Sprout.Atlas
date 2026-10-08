import { ProduceItem } from '../types/produce';
import { catalogChunk1 } from './catalogChunk1';
import { catalogChunk2 } from './catalogChunk2';
import { catalogChunk3 } from './catalogChunk3';
import { catalogChunk4 } from './catalogChunk4';
import { catalogChunk5 } from './catalogChunk5';

export const categoryColors: Record<string, string> = {
  All: '#233022',
  'Tropical Fruits': '#E79B1F',
  'Citrus Fruits': '#E79B1F',
  Melons: '#5A9E4A',
  'Berries & Small Fruits': '#6E3B6E',
  'Stone Fruits (Drupes)': '#F3A35C',
  'Pome Fruits': '#C3D24E',
  'Grapes & Vine Fruits': '#6E3B6E',
  'Exotic & Specialty Fruits': '#D6428F',
  'Leafy Greens': '#3F7D4C',
  'Cruciferous Vegetables': '#A8C85A',
  Alliums: '#DCD3AE',
  'Root & Tuber Vegetables': '#B1552F',
  Nightshades: '#D6482F',
  'Gourds & Squashes': '#E0A95E',
  'Podded Vegetables & Legumes': '#6A9E42',
  'Stems & Shoots': '#7FAE4C',
  'Edible Culinary Herbs': '#4C7A3E',
  'Culinary Mushrooms': '#C9A06A',
  'Sea Vegetables': '#2C4A34',
};

export const allCategories: string[] = ['All', ...Object.keys(categoryColors).filter((c) => c !== 'All')];

export const allProduceItems: ProduceItem[] = [
  ...catalogChunk1,
  ...catalogChunk2,
  ...catalogChunk3,
  ...catalogChunk4,
  ...catalogChunk5,
];

// Round-robin jumbled items across categories for an inspiring, diverse discovery feed
export const jumbledAllItems: ProduceItem[] = (() => {
  const categories = allCategories.filter((c) => c !== 'All');
  const buckets: Record<string, ProduceItem[]> = {};
  for (const cat of categories) {
    buckets[cat] = allProduceItems.filter((item) => item.category === cat);
  }

  const result: ProduceItem[] = [];
  let hasMore = true;
  while (hasMore) {
    hasMore = false;
    for (const cat of categories) {
      const bucket = buckets[cat];
      if (bucket && bucket.length > 0) {
        result.push(bucket.shift()!);
        hasMore = true;
      }
    }
  }

  // Any remaining unclassified
  const addedIds = new Set(result.map((i) => i.id));
  for (const item of allProduceItems) {
    if (!addedIds.has(item.id)) {
      result.push(item);
    }
  }

  return result;
})();

export function getProduceById(id: number): ProduceItem | undefined {
  return allProduceItems.find((item) => item.id === id);
}

export function getProduceByCategory(category: string): ProduceItem[] {
  if (category === 'All') return allProduceItems;
  return allProduceItems.filter((item) => item.category === category);
}

export function getRelatedProduce(item: ProduceItem, count: number = 4): ProduceItem[] {
  return allProduceItems
    .filter((i) => i.category === item.category && i.id !== item.id)
    .slice(0, count);
}

// Levenshtein distance calculation for fault-tolerant fuzzy search
function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

export function searchFuzzyProduce(query: string, category: string = 'All'): ProduceItem[] {
  const q = query.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
  const pool = category === 'All' ? allProduceItems : allProduceItems.filter((i) => i.category === category);

  if (!q) return pool;

  return pool.filter((item) => {
    const nameNorm = item.name.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
    if (nameNorm.includes(q)) return true;

    // Check blurb and nutrients
    if (item.blurb.toLowerCase().includes(q)) return true;
    if (item.nutrients.some((n) => n.toLowerCase().includes(q))) return true;

    // Levenshtein fuzzy word match
    const words = nameNorm.split(' ');
    const threshold = q.length <= 4 ? 1 : q.length <= 7 ? 2 : 3;
    return words.some((w) => levenshtein(q, w) <= threshold);
  });
}
