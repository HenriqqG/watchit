import { createContext, useContext, useState, useRef, type ReactNode, useEffect } from "react";

import type { WatchITPlayerSelected } from "../types/WatchITPlayerSelected";
import { useAuthStore } from "../store/AuthStore";
import { getWatchITListByUser, setWatchITListByUser } from "../util/faceit_utils";

interface PlayerContextProps {
  selectedPlayers: WatchITPlayerSelected[];
  selectedPlayersRef: React.MutableRefObject<WatchITPlayerSelected[]>;
  setSelectedPlayers: (players: WatchITPlayerSelected[]) => void;
}

const SelectedPlayerContext = createContext<PlayerContextProps | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuthStore();

  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [selectedPlayers, setSelectedPlayersState] = useState<WatchITPlayerSelected[]>(() => {
    const stored = localStorage.getItem("selectedPlayers");
    if (!stored) return [];

    try {
      const parsed = JSON.parse(stored);
      
      const migrated = parsed.map((player: any) => {
        let finalSkillLevel = player.skill_level;
        if (player.games && Array.isArray(player.games)) {
          const cs2 = player.games.find((g: any) => g.name === "cs2");
          if (cs2) {
            finalSkillLevel = cs2.skill_level;
          }
        }
        return {
          player_id: player.player_id,
          nickname: player.nickname,
          country: player.country,
          avatar: player.avatar,
          skill_level: Number(finalSkillLevel) || 0,
          cover_image: player.cover_image
        };
      });
      localStorage.setItem("selectedPlayers", JSON.stringify(migrated));

      setInitialLoadComplete(true);
      return migrated;
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (isAuthenticated && selectedPlayers.length === 0 && !initialLoadComplete) {
      getWatchITListByUser()
        .then((response) => {
          if (response) {
            setSelectedPlayersState(response);
            localStorage.setItem("selectedPlayers", JSON.stringify(response));
          }
        })
        .finally(() => {
          setInitialLoadComplete(true);
        });
    }
  }, [isAuthenticated, selectedPlayers.length, initialLoadComplete]);

  const selectedPlayersRef = useRef<WatchITPlayerSelected[]>(selectedPlayers);

  const setSelectedPlayers = (players: WatchITPlayerSelected[]) => {
    selectedPlayersRef.current = players;
    setSelectedPlayersState(players);
    localStorage.setItem("selectedPlayers", JSON.stringify(players));
    setWatchITListByUser(players);
  };

  useEffect(() => {
    selectedPlayersRef.current = selectedPlayers;
  }, [selectedPlayers]);

  return (
    <SelectedPlayerContext.Provider value={{ selectedPlayers, selectedPlayersRef, setSelectedPlayers }}>
      {children}
    </SelectedPlayerContext.Provider>
  );
}

export function useSelectedPlayerContext() {
  const context = useContext(SelectedPlayerContext);
  if (!context) throw new Error("usePlayerContext must be used within PlayerProvider");
  return context;
}
