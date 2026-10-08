import React from 'react';

interface ProduceDoodleProps {
  symbolId?: string | null;
  archetype?: string;
  name: string;
  size?: number | string;
  className?: string;
}

// Simple deterministic hash for procedural seeds
function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export const ProduceDoodle: React.FC<ProduceDoodleProps> = ({
  symbolId,
  archetype = 'fruit',
  name,
  size = 48,
  className = '',
}) => {
  const normName = name.toLowerCase().trim();
  const dimension = typeof size === 'number' ? `${size}px` : size;

  // 1. BESPOKE SPROUT LOGO
  if (symbolId === 'd-sprout' || normName === 'sprout') {
    return (
      <svg width={dimension} height={dimension} viewBox="0 0 100 100" className={className} fill="none">
        {/* Hypocotyl Stem */}
        <path d="M50 86 C48 68 52 50 50 26" stroke="#1E482F" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M50 86 C48 68 52 50 50 26" stroke="#2E6B47" strokeWidth="2.5" strokeLinecap="round" />
        {/* Left Cotyledon Leaf */}
        <path d="M50 48 C32 46 18 34 16 16 C38 16 51 28 52 46 Z" fill="#2E6B47" stroke="#1E482F" strokeWidth="2" />
        <path d="M48 44 C36 34 26 24 18 18" stroke="#86EFAC" strokeWidth="1.8" strokeLinecap="round" />
        {/* Right Cotyledon Leaf */}
        <path d="M50 48 C68 46 82 34 84 16 C62 16 49 28 48 46 Z" fill="#4ADE80" stroke="#1E482F" strokeWidth="2" />
        <path d="M52 44 C64 34 74 24 82 18" stroke="#DCFCE7" strokeWidth="1.8" strokeLinecap="round" />
        {/* Dewdrop */}
        <circle cx="28" cy="24" r="3" fill="#FFFFFF" fillOpacity="0.85" />
      </svg>
    );
  }

  // 2. AVOCADO
  if (symbolId === 'd-avocado' || normName.includes('avocado')) {
    return (
      <svg width={dimension} height={dimension} viewBox="0 0 100 100" className={className} fill="none">
        {/* Dark Emerald Pebbled Skin */}
        <path d="M50 14 C68 16 80 34 78 54 C76 78 64 92 48 92 C30 90 20 74 22 52 C24 30 34 14 50 14 Z" fill="#1E3821" stroke="#142616" strokeWidth="2.5" />
        {/* Vibrant Lime Layer */}
        <path d="M50 20 C64 22 74 36 72 54 C70 74 60 86 48 86 C34 84 26 70 28 52 C30 32 38 20 50 20 Z" fill="#8BBF42" />
        {/* Creamy Buttery Core */}
        <path d="M50 28 C60 30 68 40 66 54 C64 70 56 80 48 80 C38 78 32 68 34 52 C36 38 42 28 50 28 Z" fill="#E9E598" />
        {/* Mahogany Seed */}
        <circle cx="49" cy="58" r="14.5" fill="#5A361C" opacity="0.3" />
        <circle cx="49" cy="57" r="13" fill="#6E3B1F" stroke="#4A2510" strokeWidth="1.5" />
        <circle cx="46" cy="54" r="7" fill="#8B4D28" />
        <circle cx="45" cy="52" r="3" fill="#FFFFFF" fillOpacity="0.85" />
      </svg>
    );
  }

  // 3. APPLE
  if (symbolId === 'd-apple' || normName.includes('apple') && !normName.includes('pine')) {
    const isGreen = normName.includes('granny') || normName.includes('green');
    const primary = isGreen ? '#7CB342' : '#D63B2F';
    const highlight = isGreen ? '#AED581' : '#F59E0B';
    return (
      <svg width={dimension} height={dimension} viewBox="0 0 100 100" className={className} fill="none">
        {/* Apple Body */}
        <path d="M50 27 C68 24 84 38 82 58 C80 78 65 91 50 89 C35 91 18 78 18 58 C16 38 32 24 50 27 Z" fill={primary} stroke="#233022" strokeWidth="2.5" />
        <path d="M50 28 C38 30 26 42 24 58 C24 74 36 84 50 88 C42 80 32 70 32 56 C32 42 42 32 50 28 Z" fill={highlight} fillOpacity="0.4" />
        {/* Stem */}
        <path d="M50 28 C52 16 60 9 68 10" stroke="#5D3A1A" strokeWidth="3" strokeLinecap="round" />
        {/* Leaf */}
        <path d="M58 18 C72 8 84 14 82 22 C70 26 60 22 58 18 Z" fill="#2E7D32" stroke="#1B5E20" strokeWidth="1.5" />
        {/* Shine */}
        <circle cx="36" cy="38" r="3.5" fill="#FFFFFF" fillOpacity="0.8" />
      </svg>
    );
  }

  // 4. STRAWBERRY
  if (symbolId === 'd-strawberry' || normName.includes('strawberry')) {
    return (
      <svg width={dimension} height={dimension} viewBox="0 0 100 100" className={className} fill="none">
        {/* Body */}
        <path d="M50 26 C74 24 84 46 76 68 C68 84 54 94 50 94 C46 94 32 84 24 68 C16 46 26 24 50 26 Z" fill="#E52D27" stroke="#233022" strokeWidth="2.5" />
        {/* Calyx Star */}
        <path d="M50 24 L36 18 L44 24 L28 28 L42 28 L50 32 L58 28 L72 28 L56 24 L64 18 Z" fill="#388E3C" stroke="#1B5E20" strokeWidth="1.5" />
        <path d="M50 24 C52 14 46 8 46 8" stroke="#2E7D32" strokeWidth="2.5" strokeLinecap="round" />
        {/* Seeds */}
        {[
          [38, 38], [50, 36], [62, 38],
          [30, 50], [44, 48], [58, 48], [70, 50],
          [36, 62], [50, 60], [64, 62],
          [42, 74], [56, 74], [48, 84]
        ].map(([cx, cy], idx) => (
          <circle key={idx} cx={cx} cy={cy} r="1.6" fill="#FDE047" stroke="#B45309" strokeWidth="0.8" />
        ))}
      </svg>
    );
  }

  // 5. BROCCOLI
  if (symbolId === 'd-broccoli' || normName.includes('broccoli') || normName.includes('broccolini')) {
    return (
      <svg width={dimension} height={dimension} viewBox="0 0 100 100" className={className} fill="none">
        {/* Stalk */}
        <path d="M42 58 L38 92 L62 92 L58 58 Z" fill="#C8E6C9" stroke="#233022" strokeWidth="2.5" />
        <path d="M46 68 L45 88 M54 68 L55 88" stroke="#81C784" strokeWidth="1.5" strokeLinecap="round" />
        {/* Florets */}
        {[
          [50, 26, 16],
          [34, 36, 14],
          [66, 36, 14],
          [24, 50, 12],
          [44, 46, 14],
          [56, 46, 14],
          [76, 50, 12]
        ].map(([cx, cy, r], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r={r} fill="#2E7D32" stroke="#233022" strokeWidth="1.5" />
            <circle cx={cx - 1.5} cy={cy - 1.5} r={r - 3} fill="#43A047" />
          </g>
        ))}
      </svg>
    );
  }

  // 6. LEMON & CITRUS
  if (symbolId === 'd-lemon' || normName.includes('lemon') || symbolId === 'd-lime' || normName.includes('lime')) {
    const isLime = symbolId === 'd-lime' || normName.includes('lime');
    const col = isLime ? '#7CB342' : '#FDE047';
    const strokeCol = isLime ? '#1B5E20' : '#CA8A04';
    return (
      <svg width={dimension} height={dimension} viewBox="0 0 100 100" className={className} fill="none">
        <path d="M20 50 C16 44 14 44 12 50 C14 56 16 54 20 50 C28 24 72 24 80 50 C84 44 86 44 88 50 C86 56 84 54 80 50 C72 76 28 76 20 50 Z" fill={col} stroke="#233022" strokeWidth="2.5" />
        <path d="M30 46 C36 34 64 34 70 46" stroke="#FEF08A" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
        {[ [36, 52], [48, 48], [62, 54], [44, 60], [56, 62] ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.3" fill={strokeCol} opacity="0.6" />
        ))}
      </svg>
    );
  }

  // 7. TOMATO
  if (symbolId === 'd-tomato' || normName.includes('tomato')) {
    return (
      <svg width={dimension} height={dimension} viewBox="0 0 100 100" className={className} fill="none">
        <path d="M50 28 C74 26 84 44 82 64 C80 82 66 92 50 92 C34 92 20 82 18 64 C16 44 26 26 50 28 Z" fill="#E53935" stroke="#233022" strokeWidth="2.5" />
        <path d="M32 42 C34 52 32 66 26 72" stroke="#FF8A80" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
        <circle cx="34" cy="42" r="2.5" fill="#FFFFFF" fillOpacity="0.85" />
        {/* Calyx & Stem */}
        <path d="M50 28 L38 22 L44 28 L34 34 L44 32 L50 36 L56 32 L66 34 L56 28 L62 22 Z" fill="#388E3C" stroke="#233022" strokeWidth="1.5" />
        <path d="M50 28 Q52 16 46 10" stroke="#2E7D32" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  // 8. BANANA
  if (symbolId === 'd-banana' || normName.includes('banana')) {
    return (
      <svg width={dimension} height={dimension} viewBox="0 0 100 100" className={className} fill="none">
        <path d="M20 24 C26 48 48 76 82 74 C78 84 44 88 18 54 C12 42 14 30 20 24 Z" fill="#FACC15" stroke="#233022" strokeWidth="2.5" />
        <path d="M20 24 C22 46 46 74 80 74" stroke="#EAB308" strokeWidth="1.8" fill="none" />
        <path d="M20 24 L24 14" stroke="#65A30D" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="81" cy="74" r="2.5" fill="#713F12" />
      </svg>
    );
  }

  // 9. CARROT
  if (symbolId === 'd-carrot' || normName.includes('carrot')) {
    return (
      <svg width={dimension} height={dimension} viewBox="0 0 100 100" className={className} fill="none">
        {/* Fronds */}
        <path d="M44 22 Q36 12 28 4 M38 14 L32 12 M42 18 L34 18" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M50 20 Q50 10 50 2 M50 12 L44 8 M50 12 L56 8" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M56 22 Q64 12 72 4 M62 14 L68 12 M58 18 L66 18" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" />
        {/* Root */}
        <path d="M48 24 C66 26 74 42 68 62 C62 82 48 94 44 94 C40 94 36 84 38 68 C40 52 34 30 48 24 Z" fill="#EA580C" stroke="#233022" strokeWidth="2.5" />
        <path d="M44 38 Q53 40 62 38 M42 50 Q50 52 58 50 M42 64 Q48 66 54 64" stroke="#C2410C" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  // 10. WATERMELON
  if (symbolId === 'd-watermelon' || normName.includes('watermelon')) {
    return (
      <svg width={dimension} height={dimension} viewBox="0 0 100 100" className={className} fill="none">
        {/* Outer Rind */}
        <path d="M12 32 C24 82 76 82 88 32 L80 36 C70 74 30 74 20 36 Z" fill="#15803D" stroke="#233022" strokeWidth="2" />
        {/* Pale Rind */}
        <path d="M20 36 C30 74 70 74 80 36 L76 38 C68 70 32 70 24 38 Z" fill="#BBF7D0" />
        {/* Ruby Flesh */}
        <path d="M24 38 C32 70 68 70 76 38 L50 16 Z" fill="#EF4444" stroke="#233022" strokeWidth="2" />
        {/* Seeds */}
        {[ [40, 42], [60, 42], [50, 52], [36, 54], [64, 54], [44, 64], [56, 64] ].map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx="1.6" ry="2.4" fill="#1E293B" transform={`rotate(${i % 2 === 0 ? 15 : -15} ${x} ${y})`} />
        ))}
      </svg>
    );
  }

  // 11. ONION & GARLIC
  if (symbolId === 'd-onion' || symbolId === 'd-garlic' || normName.includes('onion') || normName.includes('garlic')) {
    const isGarlic = symbolId === 'd-garlic' || normName.includes('garlic');
    const isRed = normName.includes('red');
    const col = isGarlic ? '#F8FAFC' : isRed ? '#86198F' : '#FDE68A';
    const strokeSub = isGarlic ? '#CBD5E1' : isRed ? '#C026D3' : '#D97706';
    return (
      <svg width={dimension} height={dimension} viewBox="0 0 100 100" className={className} fill="none">
        <path d="M50 16 C70 18 82 36 78 56 C74 78 64 88 50 88 C36 88 26 78 22 56 C18 36 30 18 50 16 Z" fill={col} stroke="#233022" strokeWidth="2.5" />
        <path d="M50 16 Q34 50 46 88 M50 16 L50 88 M50 16 Q66 50 54 88" stroke={strokeSub} strokeWidth="1.5" opacity="0.6" />
        <path d="M50 16 L48 6 M50 16 L54 8" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M46 88 L42 96 M50 88 L50 98 M54 88 L58 96" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  // 12. BLUEBERRY & BERRIES
  if (symbolId === 'd-blueberry' || normName.includes('blueberry') || normName.includes('berry') && archetype === 'berry') {
    return (
      <svg width={dimension} height={dimension} viewBox="0 0 100 100" className={className} fill="none">
        <circle cx="50" cy="52" r="32" fill="#1E3A8A" stroke="#233022" strokeWidth="2.5" />
        <circle cx="46" cy="48" r="28" fill="#3B82F6" opacity="0.4" />
        {/* Crown */}
        <path d="M50 24 L44 28 L38 26 L40 32 L36 38 L44 38 L50 44 L56 38 L64 38 L60 32 L62 26 L56 28 Z" fill="#172554" stroke="#0F172A" strokeWidth="1.2" />
        <circle cx="34" cy="46" r="2.5" fill="#FFFFFF" fillOpacity="0.7" />
      </svg>
    );
  }

  // 13. GRAPE
  if (symbolId === 'd-grape' || normName.includes('grape') && !normName.includes('fruit')) {
    return (
      <svg width={dimension} height={dimension} viewBox="0 0 100 100" className={className} fill="none">
        <path d="M50 28 L50 12 Q66 10 72 18" stroke="#5D3A1A" strokeWidth="3" strokeLinecap="round" />
        <path d="M50 18 Q32 10 24 20 Q32 28 50 18 Z" fill="#15803D" stroke="#14532D" strokeWidth="1.5" />
        {[
          [40, 38], [60, 38],
          [30, 52], [50, 50], [70, 52],
          [40, 66], [60, 66],
          [50, 80]
        ].map(([cx, cy], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="11" fill="#7E22CE" stroke="#233022" strokeWidth="1.5" />
            <circle cx={cx - 2} cy={cy - 2} r="8" fill="#A855F7" opacity="0.4" />
          </g>
        ))}
      </svg>
    );
  }

  // 14. EGGPLANT
  if (symbolId === 'd-eggplant' || normName.includes('eggplant')) {
    return (
      <svg width={dimension} height={dimension} viewBox="0 0 100 100" className={className} fill="none">
        <path d="M50 26 C64 28 72 46 76 66 C80 86 66 94 50 94 C34 94 20 86 24 66 C28 46 36 28 50 26 Z" fill="#4A148C" stroke="#233022" strokeWidth="2.5" />
        <path d="M34 46 C32 60 36 76 42 84" stroke="#7B1FA2" strokeWidth="3.5" strokeLinecap="round" opacity="0.5" />
        <circle cx="36" cy="46" r="2.5" fill="#FFFFFF" fillOpacity="0.8" />
        {/* Calyx & Stem */}
        <path d="M50 26 L36 36 L44 26 L30 24 L42 22 L50 20 L58 22 L70 24 L56 26 L64 36 Z" fill="#15803D" stroke="#233022" strokeWidth="1.5" />
        <path d="M50 20 Q52 12 46 8" stroke="#166534" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    );
  }

  // 15. PROCEDURAL BOTANICAL GENERATOR (For all other 480+ varieties)
  const seed = hashString(name);
  const colorPalette = (() => {
    switch (archetype) {
      case 'citrus': return { bg: '#F59E0B', sub: '#FCD34D', leaf: '#15803D' };
      case 'berry': return { bg: '#BE185D', sub: '#F472B6', leaf: '#15803D' };
      case 'root': return { bg: '#C2410C', sub: '#FDBA74', leaf: '#16A34A' };
      case 'crucifer': return { bg: '#15803D', sub: '#86EFAC', leaf: '#14532D' };
      case 'leafy': return { bg: '#16A34A', sub: '#BBF7D0', leaf: '#14532D' };
      case 'stone': return { bg: '#EA580C', sub: '#FED7AA', leaf: '#15803D' };
      case 'pome': return { bg: '#DC2626', sub: '#FCA5A5', leaf: '#15803D' };
      case 'tropical': return { bg: '#D97706', sub: '#FDE68A', leaf: '#15803D' };
      case 'nightshade': return { bg: '#DC2626', sub: '#FECACA', leaf: '#15803D' };
      case 'allium': return { bg: '#E2E8F0', sub: '#F8FAFC', leaf: '#16A34A' };
      case 'gourd': return { bg: '#EA580C', sub: '#FED7AA', leaf: '#15803D' };
      case 'mushroom': return { bg: '#78350F', sub: '#FEF3C7', leaf: '#78350F' };
      default: return { bg: '#10B981', sub: '#A7F3D0', leaf: '#047857' };
    }
  })();

  const angle = (seed % 15) - 7;

  return (
    <svg width={dimension} height={dimension} viewBox="0 0 100 100" className={className} fill="none">
      <g transform={`rotate(${angle} 50 50)`}>
        {/* Soft Shadow */}
        <ellipse cx="50" cy="88" rx="26" ry="6" fill="#233022" opacity="0.1" />
        {/* Main Botanical Body */}
        <circle cx="50" cy="52" r="30" fill={colorPalette.bg} stroke="#233022" strokeWidth="2.5" />
        <ellipse cx="44" cy="46" rx="22" ry="24" fill={colorPalette.sub} opacity="0.35" />
        {/* Botanical stem & leaf */}
        <path d="M50 22 C52 12 58 6 64 6" stroke="#5D3A1A" strokeWidth="3" strokeLinecap="round" />
        <path d="M54 14 C66 8 76 14 74 22 C62 24 54 20 54 14 Z" fill={colorPalette.leaf} stroke="#14532D" strokeWidth="1.5" />
        {/* Highlight */}
        <circle cx="38" cy="40" r="3" fill="#FFFFFF" fillOpacity="0.75" />
      </g>
    </svg>
  );
};
