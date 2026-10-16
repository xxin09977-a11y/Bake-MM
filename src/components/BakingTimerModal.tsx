/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Timer, Play, Pause, RotateCcw, X, BellRing } from 'lucide-react';

interface BakingTimerProps {
  isOpen: boolean;
  onClose: () => void;
  initialMinutes?: number;
  timerTitle?: string;
}

export const BakingTimerModal: React.FC<BakingTimerProps> = ({
  isOpen,
  onClose,
  initialMinutes = 25,
  timerTitle = 'Baking Timer',
}) => {
  const [totalSeconds, setTotalSeconds] = useState(initialMinutes * 60);
  const [remainingSeconds, setRemainingSeconds] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    setTotalSeconds(initialMinutes * 60);
    setRemainingSeconds(initialMinutes * 60);
    setIsRunning(false);
    setHasFinished(false);
  }, [initialMinutes, isOpen]);

  const playBuzzer = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      [0, 0.25, 0.5].forEach(delay => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime + delay);
        gain.gain.setValueAtTime(0.3, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.2);
      });
    } catch {
      // Audio fallback
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setHasFinished(true);
            playBuzzer();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, remainingSeconds]);

  if (!isOpen) return null;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const progressPercent = totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 0;

  const handleSetCustomMinutes = (mins: number) => {
    setTotalSeconds(mins * 60);
    setRemainingSeconds(mins * 60);
    setIsRunning(false);
    setHasFinished(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-md p-3 sm:p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white/85 dark:bg-[#0c0f17]/85 backdrop-blur-2xl p-5 sm:p-6 border border-black/10 dark:border-white/15 min-w-0 overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-black/[0.08] dark:border-white/10 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="p-1.5 rounded-lg bg-black text-white dark:bg-white dark:text-black shrink-0 shadow-xs">
              <Timer className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-black dark:text-white text-sm uppercase tracking-wider truncate">{timerTitle}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#737373] hover:text-black dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Circular Display */}
        <div className="my-5 sm:my-6 flex flex-col items-center justify-center">
          <div className="relative w-40 h-40 sm:w-44 sm:h-44 rounded-full flex items-center justify-center bg-black/[0.03] dark:bg-white/[0.04] backdrop-blur-md border border-black/15 dark:border-white/20 shadow-inner">
            <div
              className="absolute inset-0 rounded-full border-2 border-dashed border-black/30 dark:border-white/30 transition-all"
              style={{
                clipPath: `inset(0 0 ${100 - progressPercent}% 0)`,
              }}
            />
            <div className="text-center z-10">
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black dark:text-white font-mono">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] mt-1">
                {hasFinished ? 'TIME EXPIRED' : isRunning ? 'BAKING ACTIVE' : 'PAUSED'}
              </div>
            </div>
          </div>

          {hasFinished && (
            <div className="mt-3 flex items-center gap-2 text-xs font-mono font-bold text-black dark:text-white animate-pulse">
              <BellRing className="w-4 h-4" />
              <span>TIMER COMPLETE · CHECK OVEN</span>
            </div>
          )}
        </div>

        {/* Preset Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mb-5 sm:mb-6">
          {[5, 12, 20, 30, 45].map(preset => (
            <button
              key={preset}
              onClick={() => handleSetCustomMinutes(preset)}
              className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all cursor-pointer ${
                totalSeconds === preset * 60
                  ? 'bg-black text-white dark:bg-white dark:text-black font-bold shadow-xs'
                  : 'border border-black/[0.08] dark:border-white/10 bg-white/40 dark:bg-white/[0.04] text-[#737373] hover:text-black dark:hover:text-white hover:bg-white/80 dark:hover:bg-white/[0.08]'
              }`}
            >
              {preset}M
            </button>
          ))}
        </div>

        {/* Controls: Solid primary & Outlined secondary */}
        <div className="flex items-center justify-center gap-2.5">
          <button
            onClick={() => {
              setRemainingSeconds(totalSeconds);
              setIsRunning(false);
              setHasFinished(false);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-black/[0.12] dark:border-white/20 text-black dark:text-white text-xs font-bold hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-all cursor-pointer uppercase tracking-wider font-mono"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={() => {
              if (hasFinished) {
                setRemainingSeconds(totalSeconds);
                setHasFinished(false);
              }
              setIsRunning(!isRunning);
            }}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 text-xs font-bold transition-all active:scale-95 cursor-pointer uppercase tracking-wider font-mono shadow-md"
          >
            {isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BakingTimerModal;
