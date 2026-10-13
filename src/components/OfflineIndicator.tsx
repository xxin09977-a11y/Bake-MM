/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff, ShieldCheck } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowStatus(true);
      const timer = setTimeout(() => setShowStatus(false), 3000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowStatus(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showStatus && isOnline) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold shadow-lg backdrop-blur-md transition-all ${
        isOnline
          ? 'bg-emerald-600/95 text-white'
          : 'bg-amber-600/95 text-white border border-amber-400'
      }`}
    >
      {isOnline ? (
        <>
          <Wifi className="w-4 h-4 text-emerald-200" />
          <span>Connected Online</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4 text-amber-200 animate-pulse" />
          <div className="flex flex-col">
            <span>Offline Mode</span>
            <span className="text-[10px] text-amber-100 font-normal">
              Fully operational with offline local storage
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export const OfflineBadge: React.FC = () => {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100/90 text-amber-900 border border-amber-200/80">
      <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
      <span>100% Offline (No Internet Needed)</span>
    </div>
  );
};
