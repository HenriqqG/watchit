import { createContext, useContext, useState, useRef, type ReactNode, useEffect } from "react";

import type { WatchITPlayerSelected } from "../types/WatchITPlayerSelected";

interface PlayerContextProps {
  selectedPlayers: WatchITPlayerSelected[];
  selectedPlayersRef: React.MutableRefObject<WatchITPlayerSelected[]>;
  setSelectedPlayers: (players: WatchITPlayerSelected[]) => void;
}

const SelectedPlayerContext = createContext<PlayerContextProps | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [selectedPlayers, setSelectedPlayersState] = useState<WatchITPlayerSelected[]>(() => {
    const stored = localStorage.getItem("selectedPlayers");
    if (!stored) return [];

    try {
      const parsed = JSON.parse(stored);

      const migrated = parsed.map((player: any) => {
        if (player.games && Array.isArray(player.games)) {
          const cs2 = player.games.find((g: any) => g.name === "cs2");
          return {
            ...player,
            skill_level: cs2?.skill_level ?? null,
          };
        }
        return player;
      });

      localStorage.setItem("selectedPlayers", JSON.stringify(migrated));

      return migrated;
    } catch {
      return [];
    }
  });
  const selectedPlayersRef = useRef<WatchITPlayerSelected[]>(selectedPlayers);

  const setSelectedPlayers = (players: WatchITPlayerSelected[]) => {
    selectedPlayersRef.current = players;
    setSelectedPlayersState(players);
    localStorage.setItem("selectedPlayers", JSON.stringify(players));
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
