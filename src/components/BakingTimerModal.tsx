/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Timer, Play, Pause, RotateCcw, X, Bell, BellRing } from 'lucide-react';

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
  timerTitle = 'မုန့်ဖုတ်ချိန် မှတ်သားစက်',
}) => {
  const [totalSeconds, setTotalSeconds] = useState(initialMinutes * 60);
  const [remainingSeconds, setRemainingSeconds] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Sync when initialMinutes changes
  useEffect(() => {
    setTotalSeconds(initialMinutes * 60);
    setRemainingSeconds(initialMinutes * 60);
    setIsRunning(false);
    setHasFinished(false);
  }, [initialMinutes, isOpen]);

  // Audio tone generator using Web Audio API
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

      // Play 3 gentle beeps
      [0, 0.25, 0.5].forEach(delay => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime + delay); // A5 note
        gain.gain.setValueAtTime(0.3, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.2);
      });
    } catch {
      // Audio might be blocked if user hasn't interacted
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-orange-100 text-orange-600">
              <Timer className="w-5 h-5" />
            </span>
            <h3 className="font-bold text-stone-900 text-base">{timerTitle}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Circular Display */}
        <div className="my-6 flex flex-col items-center justify-center">
          <div className="relative w-44 h-44 rounded-full flex items-center justify-center bg-orange-50/70 border-4 border-orange-200 shadow-inner">
            <div
              className="absolute inset-0 rounded-full border-4 border-orange-500 transition-all"
              style={{
                clipPath: `inset(0 0 ${100 - progressPercent}% 0)`,
              }}
            />
            <div className="text-center z-10">
              <div className="text-4xl font-extrabold tracking-tight text-stone-800 font-mono">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>
              <div className="text-xs font-medium text-stone-500 mt-1">
                {hasFinished ? 'အချိန်ပြည့်ပါပြီ!' : isRunning ? 'ဖုတ်နေပါသည်...' : 'ခေတ္တရပ်ထားသည်'}
              </div>
            </div>
          </div>

          {hasFinished && (
            <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-rose-600 animate-bounce">
              <BellRing className="w-4 h-4" />
              <span>မုန့်ဖုတ်ချိန် ပြည့်ပါပြီ! စစ်ဆေးပါ</span>
            </div>
          )}
        </div>

        {/* Preset Buttons */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[5, 12, 20, 30, 45].map(preset => (
            <button
              key={preset}
              onClick={() => handleSetCustomMinutes(preset)}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition cursor-pointer ${
                totalSeconds === preset * 60
                  ? 'bg-orange-600 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {preset} မိနစ်
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => {
              setRemainingSeconds(totalSeconds);
              setIsRunning(false);
              setHasFinished(false);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>အစမှ ပြန်စ</span>
          </button>

          <button
            onClick={() => {
              if (hasFinished) {
                setRemainingSeconds(totalSeconds);
                setHasFinished(false);
              }
              setIsRunning(!isRunning);
            }}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold shadow-md hover:shadow transition active:scale-95 cursor-pointer"
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" />
                <span>ခေတ္တရပ်မည်</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>စတင်မည်</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
