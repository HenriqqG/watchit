import { useState, useEffect } from "react";
import { getPlayersByUsername } from "../util/faceit_utils";

interface Game {
  name: string;
  skill_level: number;
}

interface Player {
  player_id: string;
  nickname: string;
  avatar: string;
  country: string;
  games: Game[];
}

interface UsePlayerSearchResult {
  setUsername: (username: string) => void;
  returnedList: Player[];
  loadingPlayers: boolean;
  cleanList: () => void;
}

export function usePlayerSearch(): UsePlayerSearchResult {
  const [username, setUsername] = useState("");
  const [returnedList, setList] = useState<Player[]>([]);
  const [loadingPlayers, setLoadingPlayers] = useState(false);

  useEffect(() => {
    if (username) {
      setLoadingPlayers(true);
      const timeout = setTimeout(() => {
        getPlayersByUsername(username)
          .then((res) => {
            if (res && res.items) {
              const modifiedList: Player[] = res.items.map((player: any) => {
                const cs2 =
                  player.games.find((g: any) => g.name === "cs2") ||
                  ({ name: "cs2", skill_level: 0 } as Game);

                return {
                  ...player,
                  games: [{ name: "cs2", skill_level: cs2.skill_level }],
                };
              });
              setList(modifiedList);
            }
          })
          .finally(() => setLoadingPlayers(false));
      }, 500);
      return () => {
        clearTimeout(timeout);
        setLoadingPlayers(false);
      };
    }
  }, [username]);

  const cleanList = () => {
    setList([]);
  };

  return {
    setUsername,
    returnedList,
    loadingPlayers,
    cleanList,
  };
}