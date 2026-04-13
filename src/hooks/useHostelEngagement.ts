import { useCallback, useEffect, useMemo, useState } from "react";

export type ReactionEmoji = "🔥" | "😍" | "🤩" | "👏" | "😎";

export interface HostelEngagement {
  liked: boolean;
  loved: boolean;
  reaction: ReactionEmoji | null;
}

type EngagementMap = Record<string, HostelEngagement>;

const SAVED_KEY = "savedHostels";
const ENGAGEMENT_KEY = "hostelEngagement";

const defaultEngagement: HostelEngagement = {
  liked: false,
  loved: false,
  reaction: null,
};

const parseSaved = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY) || "[]");
  } catch {
    return [];
  }
};

const parseEngagement = (): EngagementMap => {
  try {
    return JSON.parse(localStorage.getItem(ENGAGEMENT_KEY) || "{}");
  } catch {
    return {};
  }
};

export const useHostelEngagement = () => {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [engagementByHostel, setEngagementByHostel] = useState<EngagementMap>({});

  useEffect(() => {
    setSavedIds(parseSaved());
    setEngagementByHostel(parseEngagement());
  }, []);

  const persistSaved = useCallback((next: string[]) => {
    setSavedIds(next);
    localStorage.setItem(SAVED_KEY, JSON.stringify(next));
  }, []);

  const persistEngagement = useCallback((next: EngagementMap) => {
    setEngagementByHostel(next);
    localStorage.setItem(ENGAGEMENT_KEY, JSON.stringify(next));
  }, []);

  const toggleSaved = useCallback(
    (id: string) => {
      const isSaved = savedIds.includes(id);
      const next = isSaved ? savedIds.filter((savedId) => savedId !== id) : [...savedIds, id];
      persistSaved(next);
    },
    [persistSaved, savedIds],
  );

  const updateEngagement = useCallback(
    (id: string, updates: Partial<HostelEngagement>) => {
      const current = engagementByHostel[id] || defaultEngagement;
      const next = {
        ...engagementByHostel,
        [id]: {
          ...current,
          ...updates,
        },
      };
      persistEngagement(next);
    },
    [engagementByHostel, persistEngagement],
  );

  const toggleLike = useCallback(
    (id: string) => {
      const current = engagementByHostel[id] || defaultEngagement;
      updateEngagement(id, { liked: !current.liked });
    },
    [engagementByHostel, updateEngagement],
  );

  const toggleLove = useCallback(
    (id: string) => {
      const current = engagementByHostel[id] || defaultEngagement;
      updateEngagement(id, { loved: !current.loved });
    },
    [engagementByHostel, updateEngagement],
  );

  const setReaction = useCallback(
    (id: string, reaction: ReactionEmoji) => {
      const current = engagementByHostel[id] || defaultEngagement;
      const nextReaction = current.reaction === reaction ? null : reaction;
      updateEngagement(id, { reaction: nextReaction });
    },
    [engagementByHostel, updateEngagement],
  );

  const getEngagement = useCallback(
    (id: string): HostelEngagement => engagementByHostel[id] || defaultEngagement,
    [engagementByHostel],
  );

  const getPopularityScore = useCallback(
    (id: string) => {
      const engagement = getEngagement(id);
      const likeScore = engagement.liked ? 1 : 0;
      const loveScore = engagement.loved ? 2 : 0;
      const reactionScore = engagement.reaction ? 1 : 0;
      return likeScore + loveScore + reactionScore;
    },
    [getEngagement],
  );

  const stats = useMemo(() => {
    return Object.values(engagementByHostel).reduce(
      (acc, item) => {
        if (item.liked) acc.likes += 1;
        if (item.loved) acc.loves += 1;
        if (item.reaction) acc.reactions += 1;
        return acc;
      },
      { likes: 0, loves: 0, reactions: 0 },
    );
  }, [engagementByHostel]);

  return {
    savedIds,
    engagementByHostel,
    stats,
    toggleSaved,
    toggleLike,
    toggleLove,
    setReaction,
    getEngagement,
    getPopularityScore,
  };
};
