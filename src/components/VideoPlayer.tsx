import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Music,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Maximize2,
  Minimize2,
  Sparkles,
  MapPin,
  Camera,
  Check,
  UserCheck,
  UserPlus,
  Sliders,
} from 'lucide-react';
import { VIDEO_SCENES, TOTAL_DURATION_SECONDS, CREATOR_PROFILE } from '../data/vlogData';
import { VideoScene } from '../types';
import { vlogAudio } from '../utils/audioEngine';

interface VideoPlayerProps {
  onSceneChange?: (scene: VideoScene) => void;
  targetTimestamp?: number | null;
  onTargetConsumed?: () => void;
  onOpenProfile?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  onSceneChange,
  targetTimestamp,
  onTargetConsumed,
  onOpenProfile,
}) => {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [bgmEnabled, setBgmEnabled] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [showVlogOverlay, setShowVlogOverlay] = useState<boolean>(true);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(24810);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isFlashActive, setIsFlashActive] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showVoiceSettings, setShowVoiceSettings] = useState<boolean>(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');
  const [creatorEdition, setCreatorEdition] = useState<'koralina' | 'minji'>('koralina');

  const getSceneImage = (sceneId: number) => {
    if (creatorEdition === 'minji') {
      if (sceneId === 1) return '/images/scene1_minji_booth.jpg';
      if (sceneId === 2) return '/images/scene2_minji_inside.jpg';
      return '/images/scene3_minji_strip.jpg';
    }
    if (sceneId === 1) return '/images/scene1_street_booth.jpg';
    if (sceneId === 2) return '/images/scene2_photobooth_inside.jpg';
    return '/images/scene3_photostrip_printed.jpg';
  };

  const currentAvatar =
    creatorEdition === 'minji' ? '/images/scene1_minji_booth.jpg' : '/images/creator_avatar.jpg';
  const currentCreatorName = creatorEdition === 'minji' ? 'Minji' : 'Koralina';
  const currentHandle = creatorEdition === 'minji' ? '@minji.in.seoul' : '@koralina.in.seoul';

  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const prevSceneIdRef = useRef<number>(1);
  const flashTriggeredRef = useRef<{ [key: string]: boolean }>({});

  // Fetch voices for voice customization
  useEffect(() => {
    const updateVoices = () => {
      const v = vlogAudio.getAvailableVoices();
      setAvailableVoices(v);
      const curr = vlogAudio.getSelectedVoice();
      if (curr) setSelectedVoiceName(curr.name);
    };
    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Determine current active scene based on currentTime
  const currentScene: VideoScene =
    VIDEO_SCENES.find(
      (s) => currentTime >= s.timeRange[0] && currentTime < s.timeRange[1]
    ) || VIDEO_SCENES[VIDEO_SCENES.length - 1];

  // Sync external seek requests (e.g. from storyboard clicks)
  useEffect(() => {
    if (targetTimestamp !== null && targetTimestamp !== undefined) {
      setCurrentTime(targetTimestamp);
      flashTriggeredRef.current = {};
      if (onTargetConsumed) onTargetConsumed();
    }
  }, [targetTimestamp, onTargetConsumed]);

  // Notify parent of scene change
  useEffect(() => {
    if (onSceneChange && currentScene) {
      onSceneChange(currentScene);
    }
  }, [currentScene.id, onSceneChange]);

  // Voiceover and scene transition triggers
  const triggerSceneAudio = useCallback(
    (scene: VideoScene) => {
      if (voiceEnabled && !isMuted) {
        vlogAudio.speakSceneScript(scene.voiceOverText);
      }
      if (scene.id === 3) {
        vlogAudio.playPrintSound();
      }
    },
    [voiceEnabled, isMuted]
  );

  // Play / Pause handling
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false);
      vlogAudio.stopBGM();
      vlogAudio.stopSpeech();
    } else {
      if (currentTime >= TOTAL_DURATION_SECONDS) {
        setCurrentTime(0);
        flashTriggeredRef.current = {};
      }
      setIsPlaying(true);
      if (bgmEnabled && !isMuted) {
        vlogAudio.startBGM();
      }
      triggerSceneAudio(currentScene);
    }
  }, [isPlaying, currentTime, bgmEnabled, isMuted, triggerSceneAudio, currentScene]);

  // Playback timer loop (17.0s total duration)
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    lastTimeRef.current = performance.now();

    const loop = (now: number) => {
      const deltaSec = ((now - lastTimeRef.current) / 1000) * playbackSpeed;
      lastTimeRef.current = now;

      setCurrentTime((prev) => {
        const next = prev + deltaSec;

        // Photo booth flashes in Scene 2 (5.5s to 11.5s)
        const flashTimes = [7.0, 8.2, 9.4, 10.6];
        flashTimes.forEach((t) => {
          const key = `flash-${t}`;
          if (prev < t && next >= t && !flashTriggeredRef.current[key]) {
            flashTriggeredRef.current[key] = true;
            setIsFlashActive(true);
            vlogAudio.playCameraShutter();
            setTimeout(() => setIsFlashActive(false), 220);
          }
        });

        // Countdown beeps before each shot in Scene 2
        const beepTimes = [6.7, 7.9, 9.1, 10.3];
        beepTimes.forEach((bt) => {
          const key = `beep-${bt}`;
          if (prev < bt && next >= bt && !flashTriggeredRef.current[key]) {
            flashTriggeredRef.current[key] = true;
            vlogAudio.playCountdownBeep(false);
          }
        });

        // Detect scene transition
        const newScene = VIDEO_SCENES.find(
          (s) => next >= s.timeRange[0] && next < s.timeRange[1]
        );
        if (newScene && newScene.id !== prevSceneIdRef.current) {
          prevSceneIdRef.current = newScene.id;
          triggerSceneAudio(newScene);
        }

        // Loop or finish
        if (next >= TOTAL_DURATION_SECONDS) {
          setIsPlaying(false);
          vlogAudio.stopBGM();
          vlogAudio.stopSpeech();
          return TOTAL_DURATION_SECONDS;
        }

        return next;
      });

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, triggerSceneAudio]);

  const handleRestart = () => {
    setCurrentTime(0);
    flashTriggeredRef.current = {};
    prevSceneIdRef.current = 1;
    vlogAudio.stopSpeech();
    if (isPlaying) {
      if (bgmEnabled && !isMuted) {
        vlogAudio.startBGM();
      }
      triggerSceneAudio(VIDEO_SCENES[0]);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progress = Math.max(0, Math.min(1, clickX / rect.width));
    const target = progress * TOTAL_DURATION_SECONDS;
    setCurrentTime(target);
    flashTriggeredRef.current = {};
    const newScene =
      VIDEO_SCENES.find((s) => target >= s.timeRange[0] && target < s.timeRange[1]) ||
      VIDEO_SCENES[0];
    prevSceneIdRef.current = newScene.id;
    if (isPlaying) {
      triggerSceneAudio(newScene);
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    vlogAudio.setMute(nextMuted);
    if (!nextMuted && isPlaying && bgmEnabled) {
      vlogAudio.startBGM();
    }
  };

  const handleToggleVoice = () => {
    const nextVoice = !voiceEnabled;
    setVoiceEnabled(nextVoice);
    vlogAudio.setVoiceEnabled(nextVoice);
    if (nextVoice && isPlaying) {
      triggerSceneAudio(currentScene);
    }
  };

  const handleToggleBgm = () => {
    const nextBgm = !bgmEnabled;
    setBgmEnabled(nextBgm);
    if (nextBgm) {
      if (isPlaying && !isMuted) vlogAudio.startBGM();
    } else {
      vlogAudio.stopBGM();
    }
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef
        .current.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(() => {});
    } else {
      document
        .exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(() => {});
    }
  };

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const voiceName = e.target.value;
    setSelectedVoiceName(voiceName);
    const chosen = availableVoices.find((v) => v.name === voiceName);
    if (chosen) {
      vlogAudio.setVoice(chosen);
      if (isPlaying) {
        triggerSceneAudio(currentScene);
      }
    }
  };

  const progressPercent = (currentTime / TOTAL_DURATION_SECONDS) * 100;

  return (
    <div
      ref={containerRef}
      className={`relative mx-auto flex flex-col items-center select-none ${
        isFullscreen ? 'w-full h-full bg-black justify-center' : 'w-full max-w-[400px]'
      }`}
    >
      {/* 9:16 Video Container */}
      <div
        className="relative w-full aspect-[9/16] rounded-3xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-800 flex items-center justify-center cursor-pointer group"
        onClick={togglePlay}
      >
        {/* Scene Background Images with smooth transitions & Ken Burns motion */}
        {VIDEO_SCENES.map((scene) => {
          const isActive = currentScene.id === scene.id;
          const motionClass =
            scene.id === 1 ? 'scene-motion-1' : scene.id === 2 ? 'scene-motion-2' : 'scene-motion-3';

          return (
            <div
              key={scene.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={getSceneImage(scene.id)}
                alt={scene.imageAlt}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover ${isPlaying ? motionClass : ''}`}
              />
            </div>
          );
        })}

        {/* Ambient Gradient Scrims for text contrast */}
        <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/50" />

        {/* Simulated Camera Flash Effect during photo booth shots */}
        {isFlashActive && (
          <div className="absolute inset-0 z-40 bg-white/95 animate-shutter pointer-events-none flex items-center justify-center">
            <Camera className="w-16 h-16 text-slate-800/40" />
          </div>
        )}

        {/* Scene 2 Photo Booth Shot Counter Badge */}
        {currentScene.id === 2 && (
          <div className="absolute top-16 left-4 z-30 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/75 backdrop-blur-md border border-white/20 text-white text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>
              SHOT {Math.min(4, Math.max(1, Math.floor((currentTime - 5.5) / 1.5) + 1))}/4
            </span>
            <span className="text-white/60">·</span>
            <span className="text-amber-300 font-bold">READY!</span>
          </div>
        )}

        {/* Top Vlog Status Bar */}
        {showVlogOverlay && (
          <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between text-white text-xs font-medium pointer-events-none">
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="font-mono tracking-wider">VLOG REC</span>
              <span className="text-white/40">|</span>
              <span className="font-mono tabular-nums">
                {currentTime.toFixed(1)}s / {TOTAL_DURATION_SECONDS}.0s
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-white/90">
              <MapPin className="w-3 h-3 text-rose-400" />
              <span>Hongdae, Seoul</span>
            </div>
          </div>
        )}

        {/* Center Big Play/Pause Button when paused */}
        {!isPlaying && (
          <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none bg-black/25 backdrop-blur-[2px]">
            <div className="w-16 h-16 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-xl transform group-hover:scale-105 transition-transform">
              <Play className="w-7 h-7 ml-1 fill-current" />
            </div>
          </div>
        )}

        {/* Right-Hand Social Engagement Stack */}
        {showVlogOverlay && (
          <div
            className="absolute right-3 bottom-28 z-30 flex flex-col items-center gap-3.5 text-white pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Real Profile Photo for Koralina with Red Hair + Follow Indicator */}
            <div
              className="relative group/avatar cursor-pointer"
              onClick={() => onOpenProfile && onOpenProfile()}
              title="View Koralina's Profile"
            >
              <div className="w-11 h-11 rounded-full border-2 border-rose-400 overflow-hidden shadow-lg ring-2 ring-black/40">
                <img
                  src={currentAvatar}
                  alt={currentCreatorName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFollowing(!isFollowing);
                }}
                className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shadow-md transition-colors ${
                  isFollowing ? 'bg-slate-700 text-white' : 'bg-rose-500 text-white hover:bg-rose-600'
                }`}
                title={isFollowing ? 'Following' : 'Follow Koralina'}
              >
                {isFollowing ? <Check className="w-2.5 h-2.5" /> : '+'}
              </button>
            </div>

            {/* Like Button */}
            <button
              onClick={() => {
                setIsLiked(!isLiked);
                setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
              }}
              className="flex flex-col items-center gap-0.5 text-white hover:text-rose-400 transition-colors"
              aria-label="Like video"
            >
              <div
                className={`p-2 rounded-full bg-black/35 backdrop-blur-md ${
                  isLiked ? 'text-rose-500' : 'text-white'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-500' : ''}`} />
              </div>
              <span className="text-[11px] font-semibold font-mono tabular-nums">
                {(likeCount / 1000).toFixed(1)}k
              </span>
            </button>

            {/* Comment Button */}
            <button
              onClick={() => {}}
              className="flex flex-col items-center gap-0.5 text-white hover:text-slate-200 transition-colors"
              aria-label="Comments"
            >
              <div className="p-2 rounded-full bg-black/35 backdrop-blur-md">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold font-mono tabular-nums">682</span>
            </button>

            {/* Bookmark Button */}
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className="flex flex-col items-center gap-0.5 text-white hover:text-amber-400 transition-colors"
              aria-label="Save to bookmarks"
            >
              <div
                className={`p-2 rounded-full bg-black/35 backdrop-blur-md ${
                  isBookmarked ? 'text-amber-400' : 'text-white'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-amber-400' : ''}`} />
              </div>
              <span className="text-[11px] font-semibold font-mono tabular-nums">3.4k</span>
            </button>

            {/* Share Button */}
            <button
              onClick={() => {}}
              className="flex flex-col items-center gap-0.5 text-white hover:text-slate-200 transition-colors"
              aria-label="Share video"
            >
              <div className="p-2 rounded-full bg-black/35 backdrop-blur-md">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold">Share</span>
            </button>
          </div>
        )}

        {/* 
          CLEAR SOCIAL MEDIA ACCOUNT INTERFACE:
          Displays Koralina's verified account with real photo, handle, bio tag, and follow button
        */}
        {showVlogOverlay && (
          <div
            className="absolute left-3 bottom-20 z-30 max-w-[270px] text-left text-white pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Account Banner Row */}
            <div className="flex items-center gap-2 mb-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10 w-fit">
              <div className="w-7 h-7 rounded-full overflow-hidden border border-rose-400 shrink-0">
                <img
                  src={currentAvatar}
                  alt={currentCreatorName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-xs text-white leading-none">
                    {currentCreatorName}
                  </span>
                  <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[8px] font-bold">
                    ✓
                  </span>
                </div>
                <span className="text-[10px] text-white/70 font-mono leading-none mt-0.5">
                  {currentHandle}
                </span>
              </div>

              {/* Follow Button on Banner */}
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`ml-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all ${
                  isFollowing
                    ? 'bg-white/20 text-white hover:bg-white/30'
                    : 'bg-rose-500 text-white hover:bg-rose-600 shadow-xs'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>

            {/* Vlog Caption */}
            <p className="text-xs text-white/95 leading-relaxed drop-shadow-md">
              Living in Seoul! You HAVE to try these cute four-cut photo booths with your bestie 📸✨
              <span className="text-rose-300 font-medium"> #Insaengnecut #LifeInKorea #Hongdae</span>
            </p>

            {/* Audio Track Tag */}
            <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-white/80 bg-black/30 backdrop-blur-xs px-2 py-0.5 rounded-full w-fit">
              <Music
                className="w-3 h-3 text-rose-300 animate-spin"
                style={{ animationDuration: '4s' }}
              />
              <span className="truncate">Koralina · Original Seoul Vlog Audio</span>
            </div>
          </div>
        )}

        {/* 
          MANDATORY CONSTRAINT: English subtitles at bottom (white, max 2 lines)
          With crisp contrast drop-shadow
        */}
        <div className="absolute bottom-5 left-3 right-3 z-30 pointer-events-none flex flex-col items-center justify-center text-center">
          <div className="px-3.5 py-1.5 rounded-xl bg-black/55 backdrop-blur-[4px] border border-white/15 max-w-[95%]">
            <p
              className="text-white font-semibold text-sm sm:text-base leading-snug tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
              style={{
                textShadow: '0 1px 2px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.85)',
              }}
            >
              {currentScene.subtitles.line1}
            </p>
            {currentScene.subtitles.line2 && (
              <p
                className="text-white font-semibold text-sm sm:text-base leading-snug tracking-wide mt-0.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                style={{
                  textShadow: '0 1px 2px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.85)',
                }}
              >
                {currentScene.subtitles.line2}
              </p>
            )}
          </div>
        </div>

        {/* Video Scrubber Overlay on bottom edge (17.0s duration) */}
        <div
          className="absolute bottom-0 left-0 right-0 h-2.5 bg-white/20 hover:h-3.5 transition-all z-30 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handleSeek(e);
          }}
        >
          <div
            className="h-full bg-rose-500 relative transition-all"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md transform scale-0 group-hover:scale-100 transition-transform" />
          </div>

          {/* Scene cut notches at 5.5s (32.3%) and 11.5s (67.6%) */}
          <div className="absolute top-0 bottom-0 left-[32.35%] w-0.5 bg-black/60 pointer-events-none" />
          <div className="absolute top-0 bottom-0 left-[67.64%] w-0.5 bg-black/60 pointer-events-none" />
        </div>
      </div>

      {/* Control Panel Below Video */}
      <div className="w-full mt-3 bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-sm text-slate-700">
        {/* Main Controls Row */}
        <div className="flex items-center justify-between gap-2">
          {/* Play/Pause & Restart */}
          <div className="flex items-center gap-1">
            <button
              onClick={togglePlay}
              className="p-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center justify-center min-w-[36px] min-h-[36px]"
              aria-label={isPlaying ? 'Pause' : 'Play'}
              title={isPlaying ? 'Pause' : 'Play (17s Vlog)'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={handleRestart}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
              aria-label="Restart video"
              title="Restart from 0:00"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="text-xs font-mono tabular-nums text-slate-600 ml-1 font-semibold">
              {currentTime.toFixed(1)}s / {TOTAL_DURATION_SECONDS}.0s
            </div>
          </div>

          {/* Audio & Settings Buttons */}
          <div className="flex items-center gap-1">
            {/* Speed Selector */}
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-xs font-mono">
              {[0.75, 1.0, 1.25].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-1.5 py-1 rounded transition-colors ${
                    playbackSpeed === spd
                      ? 'bg-white text-slate-900 font-bold shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title={`${spd}x Speed`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            {/* Voiceover Speech Toggle */}
            <button
              onClick={handleToggleVoice}
              className={`p-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 min-h-[36px] ${
                voiceEnabled ? 'bg-rose-50 text-rose-700 font-semibold' : 'bg-slate-100 text-slate-400'
              }`}
              title={voiceEnabled ? "Koralina's voice enabled" : 'Voiceover muted'}
            >
              {voiceEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>

            {/* Voice Settings Dropdown Toggle */}
            <button
              onClick={() => setShowVoiceSettings(!showVoiceSettings)}
              className={`p-2 rounded-lg text-xs transition-colors flex items-center justify-center min-h-[36px] ${
                showVoiceSettings ? 'bg-slate-200 text-slate-900' : 'text-slate-500 hover:bg-slate-100'
              }`}
              title="Customize Voice Settings"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>

            {/* BGM Toggle */}
            <button
              onClick={handleToggleBgm}
              className={`p-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 min-h-[36px] ${
                bgmEnabled ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-400'
              }`}
              title={bgmEnabled ? 'Lofi BGM enabled' : 'Lofi BGM disabled'}
            >
              <Music className="w-4 h-4" />
            </button>

            {/* Master Mute Toggle */}
            <button
              onClick={handleToggleMute}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors min-h-[36px] flex items-center justify-center"
              title={isMuted ? 'Unmute all audio' : 'Mute all audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={handleToggleFullscreen}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors min-h-[36px] flex items-center justify-center"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Voice Selection Panel when expanded */}
        {showVoiceSettings && (
          <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 animate-fadeIn">
            <div className="flex items-center justify-between text-slate-700 font-semibold">
              <span>Influencer Voice Model:</span>
              <span className="text-[10px] text-slate-400">Warm Conversational Inflection</span>
            </div>
            <select
              value={selectedVoiceName}
              onChange={handleVoiceChange}
              className="w-full p-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-500"
            >
              {availableVoices.length > 0 ? (
                availableVoices.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))
              ) : (
                <option value="">Default Friendly Voice Engine</option>
              )}
            </select>
          </div>
        )}

        {/* Scene Jump Bar (17.0s) */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="text-slate-500 font-medium">Quick Jump:</div>
          <div className="flex items-center gap-1.5">
            {VIDEO_SCENES.map((scene) => (
              <button
                key={scene.id}
                onClick={() => {
                  setCurrentTime(scene.timeRange[0]);
                  flashTriggeredRef.current = {};
                  prevSceneIdRef.current = scene.id;
                  if (isPlaying) triggerSceneAudio(scene);
                }}
                className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
                  currentScene.id === scene.id
                    ? 'bg-rose-50 text-rose-700 font-semibold border border-rose-200'
                    : 'text-slate-600 hover:bg-slate-100 border border-transparent'
                }`}
              >
                <span>
                  {scene.timeRange[0]}s–{scene.timeRange[1]}s
                </span>
                <span className="text-[11px] text-slate-400">({scene.phase})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Vlog UI toggle & Creator Edition Switcher */}
        <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
          <span>Social Media Interface:</span>
          <button
            onClick={() => setShowVlogOverlay(!showVlogOverlay)}
            className="text-xs font-medium text-slate-700 hover:text-slate-900 underline underline-offset-2"
          >
            {showVlogOverlay ? 'Hide Social Overlay' : 'Show Social Overlay'}
          </button>
        </div>

        {/* Creator Edition Switcher */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <span className="font-medium">Vlog Edition / Creator:</span>
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
            <button
              onClick={() => setCreatorEdition('koralina')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                creatorEdition === 'koralina'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Koralina (인생네컷)
            </button>
            <button
              onClick={() => setCreatorEdition('minji')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                creatorEdition === 'minji'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Minji (Hongdae)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
