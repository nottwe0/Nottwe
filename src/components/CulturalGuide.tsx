import React, { useState } from 'react';
import { Sparkles, Heart, Users, Glasses, Camera, Info, HelpCircle } from 'lucide-react';
import { CULTURE_GUIDE_ITEMS, POPULAR_POSES } from '../data/vlogData';

export const CulturalGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'culture' | 'poses' | 'student-tips'>('culture');

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Insaengnecut & Korean Photo Booth Culture
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              A lifestyle guide for international university students visiting or living in South Korea
            </p>
          </div>

          {/* Segmented Control Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start sm:self-auto text-xs font-medium">
            <button
              onClick={() => setActiveTab('culture')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'culture'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Why It's Loved
            </button>
            <button
              onClick={() => setActiveTab('poses')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'poses'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Iconic Poses
            </button>
            <button
              onClick={() => setActiveTab('student-tips')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'student-tips'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Student Tips
            </button>
          </div>
        </div>

        {/* Highlight Word Banner */}
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="p-2 rounded-xl bg-rose-500 text-white shadow-xs shrink-0">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <div className="text-xs text-rose-700 font-semibold tracking-wide">
                KOREAN PHRASE BREAKDOWN
              </div>
              <div className="text-base font-bold text-slate-900">
                인생네컷 (In·saeng·ne·cut)
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                <strong>인생 (Insaeng)</strong> = "Life" / "Once-in-a-lifetime best" ·{' '}
                <strong>네컷 (Necut)</strong> = "Four cuts / frames"
              </p>
            </div>
          </div>
          <div className="text-xs text-slate-500 bg-white/80 backdrop-blur-xs px-3 py-2 rounded-lg border border-rose-200/50 self-start md:self-auto">
            "Your lifetime's four best memories in one printed strip"
          </div>
        </div>
      </div>

      {/* Tab 1: Why Korean 20-Somethings Love It */}
      {activeTab === 'culture' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CULTURE_GUIDE_ITEMS.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-rose-600 font-semibold">{item.tag}</span>
                  <span className="font-mono text-slate-400 text-[11px]">{item.koreanText}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  {item.romanization}: {item.meaning}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-2">
                  {item.explanation}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Korean Gen Z Trend</span>
                <span>Seoul Lifestyle</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Iconic 4-Cut Poses Guide */}
      {activeTab === 'poses' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {POPULAR_POSES.map((pose) => {
            const Icon =
              pose.iconName === 'Heart'
                ? Heart
                : pose.iconName === 'Users'
                ? Users
                : pose.iconName === 'Glasses'
                ? Glasses
                : Sparkles;

            return (
              <div
                key={pose.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-xs text-rose-600 font-mono font-medium">
                    {pose.koreanName}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    {pose.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {pose.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50 -mx-5 -mb-5 p-3 rounded-b-2xl">
                  <div className="text-[11px] text-slate-500 font-medium">
                    💡 <strong>Pro Tip:</strong> {pose.funFact}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: Practical Tips for International Students */}
      {activeTab === 'student-tips' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600" />
            First Time in a Korean Photo Studio? Here's What You Need to Know
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
              <span className="font-bold text-slate-900 block text-sm">
                1. Payment & Pricing
              </span>
              <p className="text-slate-600 leading-relaxed">
                Standard sets cost <strong>4,000 to 5,000 KRW</strong> (~$3–$4 USD) and print
                <strong>two identical strips (1+1)</strong> by default. Booths accept credit cards (Visa/Mastercard), T-money transit cards, and cash.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
              <span className="font-bold text-slate-900 block text-sm">
                2. Free Lobby Amenities
              </span>
              <p className="text-slate-600 leading-relaxed">
                Booths are unstaffed 24/7. Feel free to use the hair curlers, straighteners, mirrors, and prop walls before you pay or enter the actual photo curtain.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
              <span className="font-bold text-slate-900 block text-sm">
                3. The QR Code Timer
              </span>
              <p className="text-slate-600 leading-relaxed">
                Remember to check <strong>"Agree to QR Code"</strong> on the touch screen before shooting! You have 3 days to scan the printed strip and save your video recording before the link expires.
              </p>
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Top student photo spots in Seoul:</strong> Hongdae Main Street, Sinchon Yonsei-ro, Seongsu Yeonmujang-gil, Hyehwa Daehangno, and Gangnam Station Exit 11.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
