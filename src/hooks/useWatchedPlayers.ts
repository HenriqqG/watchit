// src/hooks/useWatchedPlayers.ts

import { useState, useEffect, useRef } from "react";
import { getPlayerProfile } from "../util/faceit_utils";

interface WatchedPlayer {
  player_id: string;
  nickname: string;
  avatar: string;
  country: string;
  games: { name: string; skill_level: number }[];
  cover_image: string;
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
  onErrorMaxLength: () => void,
  onListLoadedOrUpdated: (players: WatchedPlayer[]) => void,
  onListLoadedOrUpdatedRecentGames: (players: WatchedPlayer[]) => void
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
          onListLoadedOrUpdatedRecentGames(parsed);
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
    if (selectedPlayers.filter((i) => item.player_id == i.player_id).length > 0) {
      onError();
      return false;
    }

    if (selectedPlayers.length == 20) {
      onErrorMaxLength();
      return false;
    }

    getPlayerProfile(item.player_id)
      .then((response) => {
        setSelectedPlayers((prev) => {
          const updated = [...prev, {...item, cover_image: response?.cover_image, games:[{name: "cs2", skill_level: response?.games.cs2?.skill_level}]}];
          onListLoadedOrUpdated(updated);
          onListLoadedOrUpdatedRecentGames(updated);
          return updated;
        });
      }).finally(() => {
        onPlayerAdd();
        return true;
      });
    return true;
  };

  const removeFromList = (nickname: string) => {
    setSelectedPlayers((prev) => {
      const updated = prev.filter((player) => player.nickname !== nickname);
      onListLoadedOrUpdated(updated);
      onListLoadedOrUpdatedRecentGames(updated);
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