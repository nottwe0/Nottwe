import React, { useState } from 'react';
import {
  Play,
  Film,
  BookOpen,
  Camera,
  CheckCircle2,
  Sparkles,
  MapPin,
  Heart,
  Volume2,
  User,
} from 'lucide-react';
import { VideoPlayer } from './components/VideoPlayer';
import { ScriptStoryboard } from './components/ScriptStoryboard';
import { CulturalGuide } from './components/CulturalGuide';
import { PhotoBoothSimulator } from './components/PhotoBoothSimulator';
import { CreatorProfileCard } from './components/CreatorProfileCard';
import { VIDEO_SCENES, TOTAL_SCRIPT_WORDS, TOTAL_DURATION_SECONDS, CREATOR_PROFILE } from './data/vlogData';
import { VideoScene } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'storyboard' | 'profile' | 'culture' | 'simulator'>('storyboard');
  const [currentScene, setCurrentScene] = useState<VideoScene>(VIDEO_SCENES[0]);
  const [targetSeekTime, setTargetSeekTime] = useState<number | null>(null);

  const handleSeekScene = (time: number) => {
    setTargetSeekTime(time);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* 
        TOP BAR CONTRACT:
        Zone 1: Brand title, one line
        Zone 2: 4-5 nav links, single-line
        Zone 3: 1 primary action
      */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Title */}
          <a
            href="/"
            className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-rose-400 shadow-xs">
              <img
                src={CREATOR_PROFILE.avatarSrc}
                alt={CREATOR_PROFILE.accountName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <span>Koralina in Seoul · 인생네컷</span>
          </a>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => {
                setActiveTab('storyboard');
                setTargetSeekTime(0);
              }}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'storyboard' ? 'text-slate-900 font-semibold' : ''
              }`}
            >
              17s Video & Storyboard
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'profile' ? 'text-slate-900 font-semibold' : ''
              }`}
            >
              Koralina's Account
            </button>
            <button
              onClick={() => setActiveTab('culture')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'culture' ? 'text-slate-900 font-semibold' : ''
              }`}
            >
              Culture & Slang
            </button>
            <button
              onClick={() => setActiveTab('simulator')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'simulator' ? 'text-slate-900 font-semibold' : ''
              }`}
            >
              Photo Booth Simulator
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleSeekScene(0)}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Watch 17s Vlog</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Creator Context Intro Header */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <span className="font-semibold text-rose-600">Foreign Lifestyle Creator</span>
                <span aria-hidden="true">·</span>
                <span>Hongdae, Seoul</span>
                <span aria-hidden="true">·</span>
                <span>Audience: International University Students</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Insaengnecut: 17-Second Korean Photo Booth Experience
              </h1>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto text-xs font-medium text-slate-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>
                Creator: <strong>{CREATOR_PROFILE.accountName}</strong>
              </span>
              <span className="text-slate-300">·</span>
              <span>{TOTAL_DURATION_SECONDS}.0s Extended Vlog</span>
            </div>
          </div>
        </section>

        {/* 2-Column Split: Video Player on Left + Interactive Workspace on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 9:16 Vertical Video Player */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full sticky top-24">
              <VideoPlayer
                onSceneChange={(scene) => setCurrentScene(scene)}
                targetTimestamp={targetSeekTime}
                onTargetConsumed={() => setTargetSeekTime(null)}
                onOpenProfile={() => setActiveTab('profile')}
              />

              {/* Quick Info Card under player */}
              <div className="w-full max-w-[400px] mt-4 p-3.5 bg-white rounded-2xl border border-slate-200/80 text-xs text-slate-600 space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between font-semibold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                    Current Scene ({currentScene.timeRange[0]}s–{currentScene.timeRange[1]}s):
                  </span>
                  <span className="font-mono text-rose-600">{currentScene.phase}</span>
                </div>
                <p className="text-slate-600 italic leading-relaxed">
                  "{currentScene.voiceOverText}"
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Tabbed Content (Storyboard / Profile / Culture / Simulator) */}
          <div className="lg:col-span-7 space-y-6">
            {/* View Selector Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl text-xs font-medium">
              <button
                onClick={() => setActiveTab('storyboard')}
                className={`flex-1 py-2 px-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'storyboard'
                    ? 'bg-white text-slate-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Film className="w-4 h-4 text-rose-500" />
                <span>17s Storyboard</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-2 px-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'profile'
                    ? 'bg-white text-slate-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-4 h-4 text-purple-500" />
                <span>Koralina's Account</span>
              </button>

              <button
                onClick={() => setActiveTab('culture')}
                className={`flex-1 py-2 px-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'culture'
                    ? 'bg-white text-slate-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span>Culture & Slang</span>
              </button>

              <button
                onClick={() => setActiveTab('simulator')}
                className={`flex-1 py-2 px-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'simulator'
                    ? 'bg-white text-slate-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Camera className="w-4 h-4 text-emerald-500" />
                <span>4-Cut Studio</span>
              </button>
            </div>

            {/* Tab Views */}
            {activeTab === 'storyboard' && (
              <ScriptStoryboard
                activeSceneId={currentScene.id}
                onSelectScene={handleSeekScene}
              />
            )}

            {activeTab === 'profile' && (
              <CreatorProfileCard onPlayVlog={() => handleSeekScene(0)} />
            )}

            {activeTab === 'culture' && <CulturalGuide />}

            {activeTab === 'simulator' && <PhotoBoothSimulator />}
          </div>
        </div>

        {/* Creator & Revision Audit Summary */}
        <section className="mt-12 pt-8 border-t border-slate-200">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
              Vlog Revision Specifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div>
                <span className="font-bold text-slate-900 block mb-1">
                  1. Creator Character (Koralina)
                </span>
                <p className="text-slate-600 leading-relaxed">
                  Slavic young woman with natural ginger/red hair living in Seoul. Profile photo and in-video footage show her genuine international creator presence in Hongdae.
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-900 block mb-1">
                  2. Conversational Voice-Over & Script
                </span>
                <p className="text-slate-600 leading-relaxed">
                  Warm, engaging influencer delivery: "Today I want to show you one super popular thing in Korea—these cute photo booths called Insaengnecut!" with natural cadence and breathing room.
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-900 block mb-1">
                  3. Extended 17-Second Timeline & Social Interface
                </span>
                <p className="text-slate-600 leading-relaxed">
                  Extended to 17.0s so sentences finish comfortably without rushing. Features clear social overlay with real avatar, account name "Koralina", verified badge, and follow toggle.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>Insaengnecut (인생네컷) 17-Second Seoul Lifestyle Vlog</span>
            <span aria-hidden="true">·</span>
            <span>Created by Koralina (@koralina.in.seoul)</span>
          </div>
          <div>
            Built for international students exploring Korean culture and trends.
          </div>
        </div>
      </footer>
    </div>
  );
}
