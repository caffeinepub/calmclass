import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Emotion, type UserProfile } from "../backend.d";
import { useActor } from "./useActor";

export { Emotion };

export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

export function useMoodHistory() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["moodHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMoodHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useStudyHistory() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["studyHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStudyHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useStudyRecommendations(emotion: Emotion | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["recommendations", emotion],
    queryFn: async () => {
      if (!actor || !emotion) return [];
      return actor.getStudyRecommendations(emotion);
    },
    enabled: !!actor && !isFetching && !!emotion,
  });
}

export function useLogMood() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (emotion: Emotion) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.logMood(emotion);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moodHistory"] });
    },
  });
}

export function useCreateStudySession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      subject,
      emotion,
      durationMinutes,
    }: {
      subject: string;
      emotion: Emotion;
      durationMinutes: bigint;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.createStudySession(subject, emotion, durationMinutes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studyHistory"] });
    },
  });
}

export function useInitializeRecommendations() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not authenticated");
      return actor.initializeRecommendations();
    },
  });
}
