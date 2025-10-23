import { useState, useEffect, useRef } from "react";
import { getPlayerProfile, sendPlayerToWorkerQueue } from "../util/faceit_utils";
import { addSelectedPlayerToWorkerQueue } from "../util/function_utils";

interface WatchedPlayer {
  player_id: string;
  nickname: string;
  avatar: string;
  country: string;
  games: { name: string; skill_level: number }[];
  cover_image: string;
}

interface UsePlayerHookResult {
  selectedPlayers: WatchedPlayer[];
  selectedPlayersRef: React.MutableRefObject<WatchedPlayer[]>;
  handlePlayerSelect: (item: any) => boolean;
  handlePlayerRemove: (nickname: string) => void;
}

export function usePlayerHook(
  onPlayerAdd: () => void,
  onPlayerRemove: () => void,
  onError: () => void,
  onErrorMaxLength: () => void,
  onChoosingPlayer: () => void,
  onListLoadedOrUpdated: (players: WatchedPlayer[]) => void,
  onListLoadedOrUpdatedRecentGames: (players: WatchedPlayer[]) => void,
): UsePlayerHookResult {
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
          addSelectedPlayerToWorkerQueue(parsed)
            .then(() => {
              onListLoadedOrUpdated(parsed);
            });
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

  const handlePlayerSelect = (item: any): boolean => {
    if (selectedPlayers.filter((i) => item.player_id == i.player_id).length > 0) {
      onError();
      return false;
    }

    if (selectedPlayers.length == 30) {
      onErrorMaxLength();
      return false;
    }

    onChoosingPlayer();
    sendPlayerToWorkerQueue(item.player_id)
      .then(() => {
        getPlayerProfile(item.player_id)
          .then((response) => {
            setSelectedPlayers((prev) => {
              const updated = [...prev, {
                ...item, cover_image: response?.cover_image,
                games: [{ name: "cs2", skill_level: response?.games.cs2?.skill_level }]
              }];
              onListLoadedOrUpdated(updated);
              onListLoadedOrUpdatedRecentGames(updated);
              return updated;
            });
          }).finally(() => {
            onPlayerAdd();
            return true;
          });
      });
    return true;
  };

  const handlePlayerRemove = (nickname: string) => {
    setSelectedPlayers((prev) => {
      const updated = prev.filter((player) => player.nickname !== nickname);
      addSelectedPlayerToWorkerQueue(updated).then(() => {
        onListLoadedOrUpdated(updated);
        onListLoadedOrUpdatedRecentGames(updated);
      });
      return updated;
    });
    onPlayerRemove();
  };

  return {
    selectedPlayers,
    selectedPlayersRef,
    handlePlayerSelect,
    handlePlayerRemove
  };
}