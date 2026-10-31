import React, { useState, useRef } from 'react';
import { Camera, Download, Sparkles, RefreshCw, Check, Heart, Smile } from 'lucide-react';
import { PHOTO_STRIP_FRAMES } from '../data/vlogData';
import { vlogAudio } from '../utils/audioEngine';

interface SimulatorPose {
  id: number;
  label: string;
  sub: string;
  image: string;
}

const PRESET_POSES: SimulatorPose[] = [
  {
    id: 1,
    label: 'Hongdae Arrival',
    sub: 'Koralina outside Insaengnecut',
    image: '/src/assets/images/scene1_koralina_street_hook_1792391949048.jpg',
  },
  {
    id: 2,
    label: 'Bunny & Heart Shades',
    sub: 'Ring light double V-sign',
    image: '/src/assets/images/scene2_koralina_booth_explain_1792391950686.jpg',
  },
  {
    id: 3,
    label: 'Bestie Laughs',
    sub: 'Fun candid booth moment',
    image: '/src/assets/images/scene2_koralina_booth_explain_1792391950686.jpg',
  },
  {
    id: 4,
    label: 'Fresh Printed Strip',
    sub: 'Life 4-cut physical keepsake',
    image: '/src/assets/images/scene3_koralina_strip_close_1792391951712.jpg',
  },
];

export const PhotoBoothSimulator: React.FC = () => {
  const [selectedFrame, setSelectedFrame] = useState(PHOTO_STRIP_FRAMES[0]);
  const [activeProps, setActiveProps] = useState<string[]>(['Bunny Ears', 'Heart Glasses']);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [currentShotIndex, setCurrentShotIndex] = useState<number>(0);
  const [customTitle, setCustomTitle] = useState<string>('KORALINA IN SEOUL · 인생네컷');

  const stripCanvasRef = useRef<HTMLDivElement>(null);

  const availableProps = [
    { id: 'bunny', label: 'Bunny Ears', icon: '🐰' },
    { id: 'glasses', label: 'Heart Glasses', icon: '🕶️' },
    { id: 'heart', label: 'Heart Cheek', icon: '💖' },
    { id: 'crown', label: 'Party Tiara', icon: '👑' },
    { id: 'sparkles', label: 'Star Glitter', icon: '✨' },
    { id: 'bear', label: 'Bear Ears', icon: '🐻' },
  ];

  const toggleProp = (label: string) => {
    setActiveProps((prev) =>
      prev.includes(label) ? prev.filter((p) => p !== label) : [...prev, label]
    );
  };

  const handleStartPhotoShoot = () => {
    setIsCapturing(true);
    setCurrentShotIndex(0);

    let currentShot = 0;

    const runSingleShot = () => {
      let count = 3;
      setCountdown(count);
      vlogAudio.playCountdownBeep(false);

      const interval = setInterval(() => {
        count--;
        if (count > 0) {
          setCountdown(count);
          vlogAudio.playCountdownBeep(false);
        } else {
          clearInterval(interval);
          setCountdown(null);
          vlogAudio.playCountdownBeep(true);
          vlogAudio.playCameraShutter();
          currentShot++;
          setCurrentShotIndex(currentShot);

          if (currentShot < 4) {
            setTimeout(runSingleShot, 900);
          } else {
            setTimeout(() => {
              setIsCapturing(false);
              vlogAudio.playPrintSound();
            }, 600);
          }
        }
      }, 750);
    };

    runSingleShot();
  };

  const handleDownloadStrip = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 1100;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = selectedFrame.bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Header Title
    ctx.fillStyle = selectedFrame.textColor;
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(customTitle, canvas.width / 2, 45);

    // Draw 4 frame boxes
    const frameHeight = 220;
    const frameWidth = 340;
    const startX = 30;

    for (let i = 0; i < 4; i++) {
      const startY = 65 + i * (frameHeight + 15);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(startX, startY, frameWidth, frameHeight);

      // Frame border
      ctx.strokeStyle = selectedFrame.accentBorder;
      ctx.lineWidth = 3;
      ctx.strokeRect(startX, startY, frameWidth, frameHeight);

      ctx.fillStyle = '#475569';
      ctx.font = '14px sans-serif';
      ctx.fillText(`Cut #0${i + 1}: Koralina's 4-Cut Strip`, canvas.width / 2, startY + frameHeight / 2);
    }

    // Footer Text
    ctx.fillStyle = selectedFrame.textColor;
    ctx.font = '12px sans-serif';
    ctx.fillText('인생네컷 · INSAENGNECUT SEOUL', canvas.width / 2, 1045);
    ctx.font = '10px monospace';
    ctx.fillText(`DATE: ${new Date().toISOString().slice(0, 10)} · 1+1 PRINT`, canvas.width / 2, 1068);

    const link = document.createElement('a');
    link.download = `koralina-insaengnecut-strip-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Camera className="w-5 h-5 text-rose-500" />
            Interactive 4-Cut Studio Simulator
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Test the authentic Korean photo booth workflow with Koralina's custom pastel frames & props
          </p>
        </div>

        <button
          onClick={handleStartPhotoShoot}
          disabled={isCapturing}
          className={`px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all shadow-sm flex items-center gap-2 ${
            isCapturing
              ? 'bg-slate-400 cursor-not-allowed'
              : 'bg-rose-500 hover:bg-rose-600 active:scale-95'
          }`}
        >
          {isCapturing ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Shooting {currentShotIndex + 1}/4...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Start 4-Cut Shoot</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Customization Controls */}
        <div className="lg:col-span-7 space-y-5">
          {/* Frame Style Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              1. Choose Frame Aesthetic
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PHOTO_STRIP_FRAMES.map((frame) => (
                <button
                  key={frame.id}
                  onClick={() => setSelectedFrame(frame)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedFrame.id === frame.id
                      ? 'border-slate-900 ring-2 ring-slate-900/10 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  style={{ backgroundColor: frame.bgColor }}
                >
                  <div
                    className="text-xs font-bold truncate"
                    style={{ color: frame.textColor }}
                  >
                    {frame.name}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
                    <span>Frame</span>
                    {selectedFrame.id === frame.id && (
                      <Check className="w-3 h-3 text-slate-900" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Prop Rack Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              2. Free Lobby Props & Stickers (Korean Sopum-Zon)
            </label>
            <div className="flex flex-wrap gap-2">
              {availableProps.map((prop) => {
                const isSelected = activeProps.includes(prop.label);
                return (
                  <button
                    key={prop.id}
                    onClick={() => toggleProp(prop.label)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-rose-50 text-rose-800 border-rose-300 font-semibold'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span>{prop.icon}</span>
                    <span>{prop.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title Customization */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              3. Strip Header Stamp
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 font-medium"
              placeholder="e.g. KORALINA IN SEOUL · 인생네컷"
            />
          </div>

          {/* Live Studio Simulation Viewfinder with Koralina */}
          <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-950 border border-slate-800 flex items-center justify-center">
            <img
              src={PRESET_POSES[currentShotIndex % PRESET_POSES.length].image}
              alt="Photo booth viewfinder"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-90"
            />

            {/* Viewfinder crosshairs */}
            <div className="absolute inset-0 pointer-events-none border-[16px] border-slate-950/40">
              <div className="w-full h-full border border-white/20 flex items-center justify-center">
                <div className="w-6 h-6 border-t border-l border-white/40 absolute top-4 left-4" />
                <div className="w-6 h-6 border-t border-r border-white/40 absolute top-4 right-4" />
                <div className="w-6 h-6 border-b border-l border-white/40 absolute bottom-4 left-4" />
                <div className="w-6 h-6 border-b border-r border-white/40 absolute bottom-4 right-4" />
              </div>
            </div>

            {/* Countdown Overlay */}
            {countdown !== null && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-30">
                <div className="text-7xl font-extrabold text-white font-mono animate-bounce drop-shadow-xl">
                  {countdown}
                </div>
              </div>
            )}

            {/* Current Active Props Badges */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 z-20">
              {activeProps.map((p) => (
                <span
                  key={p}
                  className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-medium border border-white/10"
                >
                  {p}
                </span>
              ))}
            </div>

            <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-rose-500/90 text-white text-[10px] font-mono font-bold">
              FRAME {currentShotIndex + 1}/4
            </div>
          </div>
        </div>

        {/* Right Column: Printed 4-Cut Strip Preview */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Physical Printed Strip Preview (1+1)
          </div>

          <div
            ref={stripCanvasRef}
            className="w-full max-w-[240px] p-4 rounded-xl shadow-xl transition-all border animate-strip-slide"
            style={{
              backgroundColor: selectedFrame.bgColor,
              borderColor: selectedFrame.accentBorder,
            }}
          >
            {/* Strip Header */}
            <div className="text-center pb-2 mb-2 border-b border-black/5">
              <div
                className="text-[11px] font-bold tracking-wider uppercase truncate"
                style={{ color: selectedFrame.textColor }}
              >
                {customTitle}
              </div>
              <div className="text-[9px] text-slate-500 font-mono">
                {new Date().toISOString().slice(0, 10)} · SEOUL HONGDAE
              </div>
            </div>

            {/* 4 Cuts */}
            <div className="space-y-2">
              {PRESET_POSES.map((pose, idx) => (
                <div
                  key={pose.id}
                  className="relative aspect-[4/3] rounded-lg overflow-hidden border border-black/10 bg-slate-100 group shadow-2xs"
                >
                  <img
                    src={pose.image}
                    alt={pose.label}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/60 text-white text-[8px] font-mono">
                    0{idx + 1}
                  </div>
                </div>
              ))}
            </div>

            {/* Strip Footer & QR Code */}
            <div className="mt-3 pt-2 border-t border-black/5 flex items-center justify-between">
              <div>
                <div
                  className="text-[10px] font-bold tracking-wide"
                  style={{ color: selectedFrame.textColor }}
                >
                  인생네컷
                </div>
                <div className="text-[8px] text-slate-400 font-mono">
                  INSAENGNECUT ORIGINAL
                </div>
              </div>

              {/* QR Code */}
              <div className="w-7 h-7 bg-white p-0.5 rounded border border-slate-300 flex items-center justify-center">
                <div className="w-full h-full grid grid-cols-3 gap-0.5 p-0.5 bg-slate-900 rounded-2xs">
                  <div className="bg-white rounded-2xs" />
                  <div className="bg-slate-900" />
                  <div className="bg-white rounded-2xs" />
                  <div className="bg-slate-900" />
                  <div className="bg-white rounded-2xs" />
                  <div className="bg-slate-900" />
                  <div className="bg-white rounded-2xs" />
                  <div className="bg-slate-900" />
                  <div className="bg-white rounded-2xs" />
                </div>
              </div>
            </div>
          </div>

          {/* Download Strip Action */}
          <button
            onClick={handleDownloadStrip}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download High-Res 4-Cut Strip</span>
          </button>
        </div>
      </div>
    </div>
  );
};
