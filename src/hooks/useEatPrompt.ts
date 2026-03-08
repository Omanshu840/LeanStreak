"use client";

import { logEatPrompt } from "@/lib/supabase/eatPrompts";
import { SUGGESTIONS, type EatReason } from "@/data/eatPrompts";
import { useSession } from "@/hooks/useSession";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { queryKeys } from "@/lib/query/queryKeys";

type Step = "select" | "suggestion" | "confirm";

export function useEatPrompt() {
  const { user } = useSession();
  const queryClient = useQueryClient();

  const [step, setStep] = useState<Step>("select");
  const [reason, setReason] = useState<EatReason | null>(null);
  const [error, setError] = useState<string | null>(null);

  const userId = user?.id;

  const logReasonMutation = useMutation({
    mutationFn: async (selected: EatReason) => {
      const suggestion = SUGGESTIONS[selected].title;
      const acknowledged = selected === "hungry";

      const { error } = await logEatPrompt(userId!, selected, suggestion, acknowledged);
      if (error) throw error;
    },
    onMutate: () => setError(null),
    onError: () => setError("Could not save your response."),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.eatPrompt.weekly(userId!),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.streak.summary(userId!),
      });
    },
  });

  async function selectReason(selected: EatReason) {
    if (!userId) return;

    setReason(selected);

    try {
      await logReasonMutation.mutateAsync(selected);
    } finally {
      setStep(selected === "hungry" ? "confirm" : "suggestion");
    }
  }

  function continueToConfirm() {
    setStep("confirm");
  }

  function reset() {
    setStep("select");
    setReason(null);
  }

  return {
    step,
    reason,
    submitting: logReasonMutation.isPending,
    error,
    selectReason,
    continueToConfirm,
    reset,
  };
}
