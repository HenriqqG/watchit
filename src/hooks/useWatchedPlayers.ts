// src/hooks/useWatchedPlayers.ts

import { useState, useEffect, useRef } from "react";

interface WatchedPlayer {
  player_id: string;
  nickname: string;
  avatar: string;
  country: string;
  games: { name: string; skill_level: number }[];
}

interface UseWatchedPlayersResult {
  selectedPlayers: WatchedPlayer[];
  selectedPlayersRef: React.MutableRefObject<WatchedPlayer[]>;
  handlePlayerSelection: (item: any) => boolean;
  removeFromList: (nickname: string) => void;
}

export function useWatchedPlayers(
  onPlayerAdd: () => void,
  onPlayerRemove: () => void,
  onError: () => void,
  onListLoadedOrUpdated: (players: WatchedPlayer[]) => void 
): UseWatchedPlayersResult {
  const [selectedPlayers, setSelectedPlayers] = useState<WatchedPlayer[]>([]);
  const selectedPlayersRef = useRef<WatchedPlayer[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("selectedPlayers");
    if (stored) {
      try {
        const parsed: WatchedPlayer[] = JSON.parse(stored);
        selectedPlayersRef.current = parsed;
        setSelectedPlayers(parsed);
        if (parsed.length > 0) {
          onListLoadedOrUpdated(parsed);
        }
      } catch (e) {
        console.error("Error Loading Selected Players", e);
      }
    }
  }, []);

  useEffect(() => {
    selectedPlayersRef.current = selectedPlayers;
    localStorage.setItem("selectedPlayers", JSON.stringify(selectedPlayers));
  }, [selectedPlayers]);

  const handlePlayerSelection = (item: any): boolean => {
    if (
      selectedPlayers.filter((i) => item.player_id == i.player_id).length > 0
    ) {
      onError();
      return false;
    }
    setSelectedPlayers((prev) => {
      const updated = [...prev, item];
      onListLoadedOrUpdated(updated); 
      return updated;
    });
    onPlayerAdd();
    return true;
  };

  const removeFromList = (nickname: string) => {
    setSelectedPlayers((prev) => {
      const updated = prev.filter((player) => player.nickname !== nickname);
      onListLoadedOrUpdated(updated);
      return updated;
    });
    onPlayerRemove();
  };

  return {
    selectedPlayers,
    selectedPlayersRef,
    handlePlayerSelection,
    removeFromList,
  };
}