import React from 'react';
import { Clock, MessageSquare, Video, Volume2, CheckCircle2, Play, Sparkles } from 'lucide-react';
import { VIDEO_SCENES, TOTAL_SCRIPT_WORDS, TOTAL_DURATION_SECONDS } from '../data/vlogData';
import { VideoScene } from '../types';

interface ScriptStoryboardProps {
  activeSceneId: number;
  onSelectScene: (timestamp: number) => void;
}

export const ScriptStoryboard: React.FC<ScriptStoryboardProps> = ({
  activeSceneId,
  onSelectScene,
}) => {
  return (
    <div className="space-y-6">
      {/* Header & Production Overview */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              17-Second Video Production Storyboard
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Featuring Slavic lifestyle creator <strong>Koralina</strong> exploring Insaengnecut in Seoul
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-slate-600 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200/60 self-start sm:self-auto">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-rose-500" />
              <span>
                Length: <strong className="font-mono tabular-nums text-slate-900">{TOTAL_DURATION_SECONDS}.0s</strong>
              </span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
              <span>
                Spoken Script: <strong className="font-mono tabular-nums text-slate-900">{TOTAL_SCRIPT_WORDS} words</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Verification Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="text-[11px] text-slate-500 font-medium">Main Character</div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>Koralina (Ginger / Slavic)</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="text-[11px] text-slate-500 font-medium">Vlog Delivery</div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>Warm & Conversational</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="text-[11px] text-slate-500 font-medium">Duration Extended</div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>17.0s (Relaxed Pacing)</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="text-[11px] text-slate-500 font-medium">Subtitles</div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>White, Max 2 Lines</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Scenes Cards */}
      <div className="space-y-4">
        {VIDEO_SCENES.map((scene: VideoScene) => {
          const isCurrent = activeSceneId === scene.id;

          return (
            <div
              key={scene.id}
              className={`rounded-2xl transition-all border p-5 ${
                isCurrent
                  ? 'bg-rose-50/40 border-rose-300 ring-2 ring-rose-200/60 shadow-md'
                  : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-xs'
              }`}
            >
              {/* Scene Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center font-mono">
                    0{scene.id}
                  </span>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-rose-600">
                      Phase {scene.id}: {scene.phase}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      {scene.timeRange[0]}s – {scene.timeRange[1]}s ({scene.durationSec}s)
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => onSelectScene(scene.timeRange[0])}
                  className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Preview Scene</span>
                </button>
              </div>

              {/* Scene Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* Visual Thumbnail */}
                <div className="md:col-span-3">
                  <div className="relative aspect-[9/16] w-28 md:w-full max-h-48 rounded-xl overflow-hidden border border-slate-200 shadow-inner group">
                    <img
                      src={scene.imageSrc}
                      alt={scene.imageAlt}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2">
                      <span className="text-[10px] font-mono text-white/90">
                        {scene.timeRange[0]}s - {scene.timeRange[1]}s
                      </span>
                    </div>
                  </div>
                </div>

                {/* Script & Voice-over details */}
                <div className="md:col-span-9 space-y-3.5">
                  {/* Spoken Voice-over Box */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span className="font-semibold text-slate-700 flex items-center gap-1">
                        <Volume2 className="w-3.5 h-3.5 text-rose-500" />
                        Conversational Vlog Voice-Over (Koralina)
                      </span>
                      <span className="font-mono text-slate-500">
                        {scene.wordCount} words · Natural Influencer Tone
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-sm font-medium text-slate-900 leading-relaxed italic">
                      "{scene.voiceOverText}"
                    </div>
                  </div>

                  {/* Subtitle Lines (Max 2 lines, White text rule) */}
                  <div>
                    <div className="text-xs font-semibold text-slate-700 mb-1">
                      Rendered Subtitles (White, Max 2 Lines):
                    </div>
                    <div className="p-2.5 bg-slate-900 text-white rounded-lg text-xs font-medium space-y-0.5">
                      <div>Line 1: {scene.subtitles.line1}</div>
                      {scene.subtitles.line2 && (
                        <div>Line 2: {scene.subtitles.line2}</div>
                      )}
                    </div>
                  </div>

                  {/* Visual Action & SFX */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="font-semibold text-slate-700 block mb-1">
                        Visual Action:
                      </span>
                      <span className="text-slate-600 leading-normal">
                        {scene.visualAction}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="font-semibold text-slate-700 block mb-1">
                        Sound & SFX:
                      </span>
                      <span className="text-slate-600 leading-normal">
                        {scene.sfxNotes}
                      </span>
                    </div>
                  </div>

                  {/* Cultural Context Note */}
                  {scene.culturalNote && (
                    <div className="text-xs text-slate-500 flex items-start gap-1.5 pt-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-700 font-medium">Blogger Cultural Note:</strong>{' '}
                        {scene.culturalNote}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
