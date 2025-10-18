import { createContext, useContext, useState, useRef, type ReactNode } from "react";

interface PlayerContextProps {
  selectedPlayers: WatchedPlayer[];
  selectedPlayersRef: React.MutableRefObject<WatchedPlayer[]>;
  setSelectedPlayers: (players: WatchedPlayer[]) => void;
}

export interface WatchedPlayer { player_id: string; nickname: string; avatar: string; country: string; games: { name: string; skill_level: number }[]; cover_image: string; }

const SelectedPlayerContext = createContext<PlayerContextProps | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [selectedPlayers, setSelectedPlayersState] = useState<WatchedPlayer[]>(() => {
    const stored = localStorage.getItem("selectedPlayers");
    return stored ? JSON.parse(stored) : [];
  });
  const selectedPlayersRef = useRef<WatchedPlayer[]>(selectedPlayers);

  const setSelectedPlayers = (players: WatchedPlayer[]) => {
    selectedPlayersRef.current = players;
    setSelectedPlayersState(players);
    localStorage.setItem("selectedPlayers", JSON.stringify(players));
  };

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
