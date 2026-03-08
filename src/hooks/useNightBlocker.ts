"use client";

import {
  logNightEatingEvent,
  fetchTonightLogs,
  fetchWeeklyNightLogs,
  buildNightWeekly,
  type NightDaySummary,
} from "@/lib/supabase/nightEating";
import { useSession } from "@/hooks/useSession";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/queryKeys";
import { getTodayKey } from "@/lib/query/dayKey";

const BLOCK_HOUR = 21;
const BLOCK_MINUTE = 30;

function isNightTime(): boolean {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  return hour > BLOCK_HOUR || (hour === BLOCK_HOUR && minute >= BLOCK_MINUTE);
}

function minutesUntilBlockTime(): number {
  const now = new Date();
  const blockToday = new Date();
  blockToday.setHours(BLOCK_HOUR, BLOCK_MINUTE, 0, 0);

  if (now >= blockToday) return 0;
  return Math.ceil((blockToday.getTime() - now.getTime()) / 60000);
}

function formatTimeRemaining(minutes: number): string {
  if (minutes <= 0) return "Kitchen is closed";
  if (minutes < 60) return `${minutes}m until kitchen closes`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return remainingMinutes > 0
    ? `${hours}h ${remainingMinutes}m until kitchen closes`
    : `${hours}h until kitchen closes`;
}

interface NightDashboard {
  weeklyData: NightDaySummary[];
  alreadyShown: boolean;
  tonightIgnored: boolean;
}

async function fetchNightDashboard(userId: string): Promise<NightDashboard> {
  const [tonight, weekly] = await Promise.all([
    fetchTonightLogs(userId),
    fetchWeeklyNightLogs(userId),
  ]);

  return {
    weeklyData: buildNightWeekly(weekly),
    alreadyShown: tonight.length > 0,
    tonightIgnored: tonight.some((log) => log.ignored_warning),
  };
}

export function useNightBlocker() {
  const { user } = useSession();
  const queryClient = useQueryClient();

  const [isNight, setIsNight] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [minsRemaining, setMinsRemaining] = useState(minutesUntilBlockTime());

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const checkRef = useRef<NodeJS.Timeout | null>(null);

  const dayKey = getTodayKey();
  const userId = user?.id;

  const nightQuery = useQuery({
    queryKey: userId ? queryKeys.night.dashboard(userId, dayKey) : ["night", "anonymous"],
    queryFn: () => fetchNightDashboard(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60,
    refetchInterval: isNight ? 1000 * 60 * 5 : false,
  });

  const alreadyShown = nightQuery.data?.alreadyShown ?? false;
  const tonightIgnored = nightQuery.data?.tonightIgnored ?? false;

  const logNightMutation = useMutation({
    mutationFn: async (ignoredWarning: boolean) => {
      const { error } = await logNightEatingEvent(userId!, ignoredWarning);
      if (error) throw error;
      return ignoredWarning;
    },
    onSuccess: () => {
      setShowModal(false);

      queryClient.invalidateQueries({ queryKey: queryKeys.night.dashboard(userId!, dayKey) });
      queryClient.invalidateQueries({ queryKey: queryKeys.streak.summary(userId!) });
    },
  });

  useEffect(() => {
    function tick() {
      const night = isNightTime();
      const minutes = minutesUntilBlockTime();
      setIsNight(night);
      setMinsRemaining(minutes);
    }

    tick();
    intervalRef.current = setInterval(tick, 60_000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (!userId || alreadyShown) return;

    if (isNightTime()) {
      const timer = setTimeout(() => setShowModal(true), 0);
      return () => clearTimeout(timer);
    }

    const msUntilBlock = minutesUntilBlockTime() * 60_000;
    if (msUntilBlock <= 0) {
      const timer = setTimeout(() => {
        setIsNight(true);
        setShowModal(true);
      }, 0);
      return () => clearTimeout(timer);
    }

    checkRef.current = setTimeout(() => {
      setIsNight(true);
      setShowModal(true);
    }, msUntilBlock);

    return () => {
      if (checkRef.current) clearTimeout(checkRef.current);
    };
  }, [userId, alreadyShown]);

  async function handleSkip() {
    if (!userId) return;
    await logNightMutation.mutateAsync(false);
  }

  async function handleIgnore() {
    if (!userId) return;
    await logNightMutation.mutateAsync(true);
  }

  function triggerManual() {
    if (isNightTime()) setShowModal(true);
  }

  const timeLabel = formatTimeRemaining(minsRemaining);

  return {
    isNight,
    showModal,
    alreadyShown,
    tonightIgnored,
    submitting: logNightMutation.isPending,
    minsRemaining,
    timeLabel,
    weeklyData: nightQuery.data?.weeklyData ?? [],
    loadingStats: nightQuery.isPending,
    handleSkip,
    handleIgnore,
    triggerManual,
    setShowModal,
  };
}
