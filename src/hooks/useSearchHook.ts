import { useState, useEffect } from "react";
import { getPlayersByUsername } from "../util/faceit_utils";
import type { WatchITPlayerSelected } from "../types/WatchITPlayerSelected";

interface Game {
  name: string;
  skill_level: number;
}

interface UseSearchHookResult {
  setUsername: (username: string) => void;
  returnedList: WatchITPlayerSelected[];
  loadingPlayers: boolean;
  clearList: () => void;
  clearSearchInput: () => void;
}

export function useSearchHook(): UseSearchHookResult {
  const [username, setUsername] = useState("");
  const [returnedList, setList] = useState<WatchITPlayerSelected[]>([]);
  const [loadingPlayers, setLoadingPlayers] = useState(false);

  useEffect(() => {
    if (username) {
      setLoadingPlayers(true);
      const timeout = setTimeout(() => {
        getPlayersByUsername(username)
          .then((res) => {
            if (res && res.items) {
              const modifiedList: WatchITPlayerSelected[] = res.items.map((player: any) => {
                const cs2 =
                  player.games.find((g: any) => g.name === "cs2") ||
                  ({ name: "cs2", skill_level: 0 } as Game);

                return {
                  ...player,
                  skill_level: cs2.skill_level
                } as WatchITPlayerSelected;
              });
              setList(modifiedList);
            }
          })
          .finally(() => setLoadingPlayers(false));
      }, 500);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [username]);

  const clearList = () => {
    setList([]);
  };

  const clearSearchInput = () =>{
    setUsername("");
  }

  return {
    setUsername,
    returnedList,
    loadingPlayers,
    clearList,
    clearSearchInput
  };
}