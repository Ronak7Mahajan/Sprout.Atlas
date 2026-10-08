import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Check, Sparkles, KeyRound, ShieldCheck, ArrowRight, Zap, Eye, Brain, BookOpen } from 'lucide-react';

export const PaywallModal: React.FC = () => {
  const {
    showPaywallModal,
    setShowPaywallModal,
    subscription,
    redeemPromoCode,
  } = useApp();

  const [promoInput, setPromoInput] = useState<string>('');
  const [promoStatus, setPromoStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [isSuccessView, setIsSuccessView] = useState<boolean>(false);

  if (!showPaywallModal) return null;

  const handleApplyPromo = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!promoInput.trim()) return;
    const res = redeemPromoCode(promoInput);
    setPromoStatus(res);
    if (res.success) {
      setTimeout(() => {
        setIsSuccessView(true);
      }, 600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#FAF6E9] rounded-3xl border-2 border-[#233022]/15 shadow-2xl p-5 sm:p-7 overflow-hidden my-4 max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 shrink-0 border-b border-[#233022]/10">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-bold text-[#233022]">
              Sprout <span className="text-[#2E6B47] italic">Atlas</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#1B5E20] text-[10px] font-bold font-mono border border-[#86EFAC]">
              BLOOM PRO
            </span>
          </div>

          <button
            onClick={() => {
              setIsSuccessView(false);
              setShowPaywallModal(false);
            }}
            className="w-8 h-8 rounded-full bg-[#F2ECD8] hover:bg-[#233022]/10 flex items-center justify-center text-[#4A4E42] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccessView ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#DCFCE7] text-[#16A34A] border-2 border-[#86EFAC] flex items-center justify-center mx-auto shadow-sm">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#233022]">
              Welcome to Bloom Pro!
            </h3>
            <p className="text-sm text-[#4A4E42] max-w-xs mx-auto leading-relaxed">
              Your Bloom Pro membership is active. You now have 500 daily AI runs and full access to all new botanical features.
            </p>
            <div className="bg-[#FFFDF5] border border-[#233022]/10 rounded-2xl p-4 text-xs text-left max-w-sm mx-auto space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-[#7D8370]">Active Plan:</span>
                <span className="font-bold text-[#2E6B47]">{subscription.activePlanTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7D8370]">Daily AI Quota:</span>
                <span className="font-bold text-[#16A34A]">500 Runs / Day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7D8370]">Access:</span>
                <span className="font-bold text-[#233022]">All New Features Unlocked</span>
              </div>
            </div>
            <button
              onClick={() => {
                setIsSuccessView(false);
                setShowPaywallModal(false);
              }}
              className="px-6 h-11 rounded-full bg-[#2E6B47] text-white font-bold text-sm shadow-sm hover:bg-[#1E482F] transition-all cursor-pointer"
            >
              Start Exploring Now
            </button>
          </div>
        ) : (
          <div className="overflow-y-auto space-y-5 pr-1 pt-2">
            {/* Title */}
            <div className="text-center">
              <span className="text-[10px] font-bold tracking-widest uppercase font-mono text-[#2E6B47]">
                Upgrade Membership
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#233022] mt-1 leading-snug">
                Unlock <span className="text-[#2E6B47] italic">Bloom Pro</span> Access
              </h2>
              <p className="text-xs text-[#5B6A54] mt-1 max-w-sm mx-auto">
                Get 500 daily AI runs and unlimited access to all advanced features.
              </p>
            </div>

            {/* Exclusive Bloom Plan Card */}
            <div className="bg-gradient-to-br from-[#F5FEF7] via-[#FFFDF5] to-[#E8F5E9] p-5 rounded-3xl border-2 border-[#2E6B47] shadow-sm relative space-y-4">
              <div className="flex items-center justify-between border-b border-[#2E6B47]/15 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#2E6B47] text-white flex items-center justify-center text-xl shadow-xs">
                    🌸
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#233022]">Bloom Pro</h3>
                    <span className="text-xs font-semibold text-[#2E6B47] block font-mono">
                      Full Botanical Access
                    </span>
                  </div>
                </div>

                <div className="bg-[#E8F5E9] border border-[#86EFAC] text-[#16A34A] text-xs font-bold px-3 py-1 rounded-full font-mono flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>500 AI Runs / Day</span>
                </div>
              </div>

              {/* Feature Highlights */}
              <div className="space-y-2.5 text-xs text-[#233022]">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#E8F5E9] text-[#2E6B47] flex items-center justify-center shrink-0 mt-0.5">
                    <Zap className="w-3 h-3" />
                  </div>
                  <div>
                    <span className="font-bold block">500 Daily AI Runs</span>
                    <span className="text-[11px] text-[#5B6A54]">
                      High-capacity allowance for visual freshness scans and nutrition tutor inquiries.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#E8F5E9] text-[#2E6B47] flex items-center justify-center shrink-0 mt-0.5">
                    <Eye className="w-3 h-3" />
                  </div>
                  <div>
                    <span className="font-bold block">Access to All New Features</span>
                    <span className="text-[11px] text-[#5B6A54]">
                      Multimodal Camera Freshness Scanner, Botanical Nutrition Tutor, Clinical Whole-Food Meal Planner & Rainbow Phytonutrient Tracker.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#E8F5E9] text-[#2E6B47] flex items-center justify-center shrink-0 mt-0.5">
                    <BookOpen className="w-3 h-3" />
                  </div>
                  <div>
                    <span className="font-bold block">Complete 500+ Specimen Atlas</span>
                    <span className="text-[11px] text-[#5B6A54]">
                      Full access to chemical treatment profiles, washing protocols, and storage rules.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Promo Code Input Section (No Prices) */}
            <form onSubmit={handleApplyPromo} className="space-y-3 bg-[#FFFDF5] p-4 rounded-2xl border border-[#233022]/15 shadow-2xs">
              <label className="block text-xs font-bold text-[#233022] font-mono flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-[#2E6B47]" />
                <span>Enter Access Promo Code</span>
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type promo code here..."
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-[#233022]/20 font-mono font-bold uppercase bg-[#FAF6E9] text-[#233022] focus:outline-none focus:border-[#2E6B47]"
                  required
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#2E6B47] hover:bg-[#1E482F] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <span>Redeem</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {promoStatus && (
                <div
                  className={`p-2.5 rounded-xl text-xs font-mono flex items-center gap-2 ${
                    promoStatus.success
                      ? 'bg-[#E8F5E9] text-[#1E482F] border border-[#86EFAC]'
                      : 'bg-[#FEE2E2] text-[#991B1B] border border-[#DC2626]/20'
                  }`}
                >
                  {promoStatus.success ? (
                    <Check className="w-4 h-4 text-[#16A34A] shrink-0" />
                  ) : (
                    <X className="w-4 h-4 text-[#DC2626] shrink-0" />
                  )}
                  <span className="text-[11px]">{promoStatus.message}</span>
                </div>
              )}
            </form>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#7D8370] text-center pt-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2E6B47]" />
              <span>Enter your access voucher code above to unlock Bloom Pro</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
