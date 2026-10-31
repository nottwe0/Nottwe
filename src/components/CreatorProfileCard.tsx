import React, { useState } from 'react';
import {
  MapPin,
  CheckCircle,
  Share2,
  Bookmark,
  Heart,
  Play,
  Film,
  Camera,
  Sparkles,
  ExternalLink,
  Users,
} from 'lucide-react';
import { CREATOR_PROFILE, VIDEO_SCENES } from '../data/vlogData';

interface CreatorProfileCardProps {
  onPlayVlog?: () => void;
}

export const CreatorProfileCard: React.FC<CreatorProfileCardProps> = ({ onPlayVlog }) => {
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [activeMediaTab, setActiveMediaTab] = useState<'vlogs' | 'strips' | 'about'>('vlogs');

  const highlights = [
    { id: '1', title: 'Photo Booths', icon: '📸', count: '14 vlogs' },
    { id: '2', title: 'Hongdae Life', icon: '🌸', count: '28 vlogs' },
    { id: '3', title: 'K-Slang 101', icon: '💬', count: '19 vlogs' },
    { id: '4', title: 'Student Tips', icon: '🎓', count: '22 vlogs' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
      {/* Profile Header Banner */}
      <div className="h-32 bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 relative">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute bottom-3 right-4 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-medium border border-white/20">
          📍 Hongdae & Sinchon, Seoul
        </div>
      </div>

      {/* Main Profile Info Section */}
      <div className="px-6 pb-6 pt-0 relative">
        {/* Avatar & Action Buttons Row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 mb-4">
          {/* Avatar with Red/Ginger Hair Profile Photo */}
          <div className="relative w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-rose-50 ring-2 ring-slate-100">
            <img
              src={CREATOR_PROFILE.avatarSrc}
              alt={CREATOR_PROFILE.accountName}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Social Action Buttons */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 ${
                isFollowing
                  ? 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                  : 'bg-rose-500 hover:bg-rose-600 text-white'
              }`}
            >
              {isFollowing ? (
                <>
                  <span>Following</span>
                  <span className="text-emerald-600 font-bold">✓</span>
                </>
              ) : (
                <>
                  <span>+ Follow</span>
                </>
              )}
            </button>

            <button
              onClick={onPlayVlog}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Watch Latest 17s Vlog</span>
            </button>
          </div>
        </div>

        {/* Creator Name & Handle */}
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900">
              {CREATOR_PROFILE.accountName}
            </h2>
            <span
              className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold"
              title="Verified Creator"
            >
              ✓
            </span>
            <span className="text-xs text-rose-600 font-medium">
              Foreign Lifestyle Creator
            </span>
          </div>

          <div className="text-xs font-mono text-slate-500 mt-0.5">
            {CREATOR_PROFILE.username} · {CREATOR_PROFILE.pronouns}
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-slate-700 mt-3 leading-relaxed max-w-2xl">
          {CREATOR_PROFILE.bio}
        </p>

        {/* Follower Stats Strip */}
        <div className="flex items-center gap-6 mt-4 pt-3 border-t border-slate-100 text-xs">
          <div>
            <strong className="text-slate-900 font-bold text-sm">
              {CREATOR_PROFILE.followers}
            </strong>{' '}
            <span className="text-slate-500">Followers</span>
          </div>
          <span className="text-slate-300">·</span>
          <div>
            <strong className="text-slate-900 font-bold text-sm">
              {CREATOR_PROFILE.likes}
            </strong>{' '}
            <span className="text-slate-500">Likes</span>
          </div>
          <span className="text-slate-300">·</span>
          <div>
            <strong className="text-slate-900 font-bold text-sm">
              {CREATOR_PROFILE.following}
            </strong>{' '}
            <span className="text-slate-500">Following</span>
          </div>
        </div>

        {/* Story Highlight Bubbles */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="text-xs font-semibold text-slate-500 mb-2.5">
            Featured Series & Highlights
          </div>
          <div className="flex items-center gap-4 overflow-x-auto pb-1">
            {highlights.map((h) => (
              <div
                key={h.id}
                className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-rose-400 to-amber-300 group-hover:scale-105 transition-transform">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xl shadow-xs">
                    {h.icon}
                  </div>
                </div>
                <span className="text-[11px] font-medium text-slate-700">
                  {h.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pinned Video Showcase Card */}
        <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              Pinned Viral Vlog · 17-Second Episode
            </span>
            <span className="font-mono text-emerald-600 font-bold">142K Views</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3 rounded-lg border border-slate-200">
            <div className="relative w-20 aspect-[9/16] rounded-md overflow-hidden shrink-0 border border-slate-200">
              <img
                src={VIDEO_SCENES[0].imageSrc}
                alt="Pinned Vlog Thumbnail"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <Play className="w-4 h-4 text-white fill-current" />
              </div>
            </div>

            <div className="flex-1 text-xs">
              <h4 className="font-bold text-slate-900 text-sm">
                Insaengnecut (인생네컷) 4-Cut Photo Booth Tour
              </h4>
              <p className="text-slate-600 mt-1 line-clamp-2">
                "Today I want to show you one super popular thing in Korea—these cute photo booths called Insaengnecut!"
              </p>
              <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-500">
                <span>⏱️ 17 seconds</span>
                <span>📸 Hongdae Street</span>
                <span>🎵 Original Audio</span>
              </div>
            </div>

            <button
              onClick={onPlayVlog}
              className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shrink-0"
            >
              Play Video
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
