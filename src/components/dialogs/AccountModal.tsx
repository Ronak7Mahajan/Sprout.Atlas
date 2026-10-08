import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Check,
  HelpCircle,
  Sparkles,
  BookOpen,
  Camera,
  Flame,
  User,
  LogOut,
  Mail,
  Lock,
} from 'lucide-react';

export const AccountModal: React.FC = () => {
  const {
    showAccountModal,
    setShowAccountModal,
    userProfile,
    updateUserProfile,
    savedItemIds,
    scanHistory,
    quizStreak,
    subscription,
    setShowTourModal,
    setShowPaywallModal,
    firebaseUser,
    isFirebaseAuthLoading,
    signInGoogle,
    signInEmail,
    signUpEmail,
    signOutUser,
  } = useApp();

  const [name, setName] = useState(userProfile.name);
  const [title, setTitle] = useState(userProfile.title);
  const [avatar, setAvatar] = useState(userProfile.avatar);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Email form state
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  if (!showAccountModal) return null;

  const handleSaveProfile = () => {
    updateUserProfile({ name, title, avatar });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setShowAccountModal(false);
    }, 600);
  };

  const formatAuthError = (err: any): string => {
    const code = err?.code || '';
    if (code === 'auth/unauthorized-domain') {
      return `Domain authorization required: Add current domain (${window.location.hostname}) in Firebase Console > Authentication > Settings > Authorized domains.`;
    }
    if (code === 'auth/operation-not-allowed') {
      return `Provider not enabled: Please enable Google Sign-In or Email/Password in your Firebase Console > Authentication > Sign-in method.`;
    }
    if (code === 'auth/popup-blocked') {
      return `The sign-in popup was blocked by your browser. Please allow popups for this site and try again.`;
    }
    if (code === 'auth/popup-closed-by-user') {
      return `Sign-in popup was closed before completing. Please try again.`;
    }
    if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
      return `Invalid email or password. Please verify your credentials or click "Register here".`;
    }
    if (code === 'auth/email-already-in-use') {
      return `This email is already registered. Switch to "Sign In" to log in.`;
    }
    if (code === 'auth/weak-password') {
      return `Password is too weak. Please use at least 6 characters.`;
    }
    return err?.message || 'Authentication could not be completed. Please check your network and credentials.';
  };

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    try {
      await signInGoogle();
      setShowAccountModal(false);
    } catch (err: any) {
      setAuthError(formatAuthError(err));
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      if (isRegisterMode) {
        await signUpEmail(emailInput, passwordInput, name);
      } else {
        await signInEmail(emailInput, passwordInput);
      }
      setShowEmailForm(false);
      setShowAccountModal(false);
    } catch (err: any) {
      setAuthError(formatAuthError(err));
    }
  };

  const handleReplayTour = () => {
    setShowAccountModal(false);
    setShowTourModal(true);
  };

  const emblems = ['🌱', '🌿', '🍎', '🥑', '🥦', '🍓', '🍋', '🍇'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#FAF6E9] rounded-3xl border-2 border-[#233022]/15 shadow-2xl p-5 sm:p-6 overflow-hidden my-4 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 shrink-0">
          <div>
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#2E6B47]" />
              <span className="text-[10px] font-bold tracking-wider uppercase font-mono text-[#2E6B47]">
                {firebaseUser ? 'Botanist Profile & Account' : 'Botanist Sign In'}
              </span>
            </div>
            <h3 className="font-serif text-xl font-bold text-[#233022]">
              {firebaseUser ? 'Field Botanist Account' : 'Sign in to Sprout Atlas'}
            </h3>
          </div>
          <button
            onClick={() => setShowAccountModal(false)}
            className="w-8 h-8 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-[#4A4E42] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto space-y-4 pr-1">
          {/* Sign In / Auth Card */}
          <div className="bg-[#FFFDF5] border border-[#233022]/10 rounded-2xl p-4 shadow-2xs space-y-3">
            {firebaseUser ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#E8F5E9] border border-[#2E6B47]/20 flex items-center justify-center text-base">
                    {userProfile.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#233022]">
                      {firebaseUser.displayName || userProfile.name}
                    </h4>
                    <span className="text-[11px] text-[#5B6A54] block">
                      {firebaseUser.email || 'Logged In Account'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={signOutUser}
                  className="px-3 py-1.5 rounded-xl text-[#DC2626] hover:bg-[#FEE2E2]/60 transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {authError && (
                  <div className="p-3 bg-[#FEE2E2] border border-[#DC2626]/20 rounded-xl text-xs text-[#991B1B] space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <span>Authentication Notice:</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-[#7F1D1D]">
                      {authError}
                    </p>
                  </div>
                )}

                {!showEmailForm ? (
                  <div className="space-y-2">
                    <button
                      onClick={handleGoogleSignIn}
                      disabled={isFirebaseAuthLoading}
                      className="w-full h-10 rounded-full bg-white hover:bg-slate-50 border border-[#233022]/20 text-[#233022] font-bold text-xs shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span>Sign in with Google</span>
                    </button>

                    <button
                      onClick={() => setShowEmailForm(true)}
                      className="w-full h-9 rounded-full bg-[#FAF6E9] hover:bg-[#F2ECD8] border border-[#233022]/15 text-[#233022] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#5B6A54]" />
                      <span>Sign in with Email & Password</span>
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleEmailAuth} className="space-y-2.5 pt-1">
                    <div>
                      <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="Enter your email..."
                        required
                        className="w-full px-3 py-2 bg-[#FAF6E9] border border-[#233022]/20 rounded-xl text-xs text-[#233022] focus:outline-none focus:border-[#2E6B47]"
                      />
                    </div>
                    <div>
                      <input
                        type="password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="Password (min 6 characters)..."
                        required
                        className="w-full px-3 py-2 bg-[#FAF6E9] border border-[#233022]/20 rounded-xl text-xs text-[#233022] focus:outline-none focus:border-[#2E6B47]"
                      />
                    </div>
                    {authError && (
                      <p className="text-[11px] text-[#DC2626] font-medium leading-tight">
                        {authError}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={isFirebaseAuthLoading}
                        className="flex-1 h-9 rounded-full bg-[#2E6B47] text-white font-bold text-xs hover:bg-[#1E482F] cursor-pointer"
                      >
                        {isRegisterMode ? 'Create Account' : 'Sign In'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowEmailForm(false)}
                        className="px-3 h-9 rounded-full border border-[#233022]/20 text-xs font-semibold cursor-pointer"
                      >
                        Back
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsRegisterMode(!isRegisterMode)}
                      className="text-[11px] text-[#2E6B47] font-semibold hover:underline block text-center w-full cursor-pointer pt-1"
                    >
                      {isRegisterMode ? 'Already have an account? Sign in' : 'Need an account? Register here'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Membership Banner */}
          <div className="bg-[#FFFDF5] border border-[#233022]/10 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 font-bold text-sm text-[#233022]">
                <Sparkles className="w-4 h-4 text-[#D97706]" />
                <span>{subscription.activePlanTitle}</span>
              </div>
              <p className="text-xs text-[#5B6A54] mt-0.5 font-mono">{subscription.durationSummary}</p>
            </div>
            <button
              onClick={() => {
                setShowAccountModal(false);
                setShowPaywallModal(true);
              }}
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#E8F5E9] text-[#1E482F] hover:bg-[#C8E6C9] transition-colors cursor-pointer"
            >
              Manage
            </button>
          </div>

          {/* Stats Strip */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white rounded-xl p-2.5 border border-[#233022]/10">
              <BookOpen className="w-4 h-4 text-[#2E6B47] mx-auto mb-1" />
              <div className="text-lg font-bold font-mono text-[#233022]">{savedItemIds.length}</div>
              <div className="text-[10px] text-[#7D8370] uppercase font-mono">Saved</div>
            </div>
            <div className="bg-white rounded-xl p-2.5 border border-[#233022]/10">
              <Camera className="w-4 h-4 text-[#0284C7] mx-auto mb-1" />
              <div className="text-lg font-bold font-mono text-[#233022]">{scanHistory.length}</div>
              <div className="text-[10px] text-[#7D8370] uppercase font-mono">Scanned</div>
            </div>
            <div className="bg-white rounded-xl p-2.5 border border-[#233022]/10">
              <Flame className="w-4 h-4 text-[#D97706] mx-auto mb-1" />
              <div className="text-lg font-bold font-mono text-[#233022]">{quizStreak}d</div>
              <div className="text-[10px] text-[#7D8370] uppercase font-mono">Streak</div>
            </div>
          </div>

          {/* Edit Profile Fields */}
          <div className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase text-[#5B6A54] mb-1">
                Explorer Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#233022]/20 rounded-xl text-sm font-semibold text-[#233022] focus:outline-none focus:border-[#2E6B47]"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold uppercase text-[#5B6A54] mb-1">
                Field Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#233022]/20 rounded-xl text-sm text-[#233022] focus:outline-none focus:border-[#2E6B47]"
                placeholder="e.g. Forager & Plant Scientist"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold uppercase text-[#5B6A54] mb-1">
                Botanical Emblem
              </label>
              <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-[#233022]/20">
                {emblems.map((emb) => (
                  <button
                    key={emb}
                    onClick={() => setAvatar(emb)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-transform cursor-pointer ${
                      avatar === emb ? 'bg-[#E8F5E9] ring-2 ring-[#2E6B47] scale-110' : 'hover:bg-slate-50'
                    }`}
                  >
                    {emb}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleSaveProfile}
              className="w-full h-11 rounded-full bg-[#2E6B47] hover:bg-[#1E482F] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Profile Changes</span>
              )}
            </button>

            <button
              onClick={handleReplayTour}
              className="w-full h-10 rounded-full border border-[#233022]/20 text-[#4A4E42] hover:bg-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Replay App Guide & Tour</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
