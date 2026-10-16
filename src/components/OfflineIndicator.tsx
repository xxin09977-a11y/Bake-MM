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
      className="fixed bottom-16 md:bottom-4 right-4 z-50 flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-mono font-bold bg-white/85 dark:bg-[#0c0f17]/85 backdrop-blur-xl text-black dark:text-white border border-black/10 dark:border-white/15 transition-all shadow-lg"
    >
      {isOnline ? (
        <>
          <Wifi className="w-4 h-4 shrink-0" />
          <span>ONLINE</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4 shrink-0" />
          <div className="flex flex-col">
            <span>OFFLINE ACTIVE</span>
            <span className="text-[10px] text-[#737373] dark:text-[#A3A3A3] font-normal">
              Zero network required
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export const OfflineBadge: React.FC = () => {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-white/50 dark:bg-white/[0.04] backdrop-blur-md text-black dark:text-white border border-black/[0.08] dark:border-white/10 shadow-xs">
      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
      <span>100% Offline Guide</span>
    </div>
  );
};
