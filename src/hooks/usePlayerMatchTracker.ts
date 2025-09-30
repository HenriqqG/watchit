// src/hooks/usePlayerMatchTracker.ts

import { useState, useEffect } from "react";
import { getPlayerInONGOINGMatch } from "../util/faceit_utils";

interface MatchPlayer {
  id: string;
  nickname: string;
  avatar: string;
  country: string;
  status: string; // Ex: ONGOING, READY
  createdAt: string;
  match_id: string;
  // Adicione outras propriedades necessárias
  games: { name: string; skill_level: number }[];
}

interface WatchedPlayer {
  player_id: string;
  nickname: string;
  // ... outras propriedades
}

interface UsePlayerMatchTrackerResult {
  playersInMatches: MatchPlayer[];
  loadingPlayerMatches: boolean;
  fetchAllMatches: (players: WatchedPlayer[]) => Promise<void>;
  removeMatchPlayer: (nickname: string) => void;
}

/**
 * Hook para rastrear partidas em andamento (ONGOING) dos jogadores observados.
 */
export function usePlayerMatchTracker(
  selectedPlayers: WatchedPlayer[],
  selectedPlayersRef: React.MutableRefObject<WatchedPlayer[]>
): UsePlayerMatchTrackerResult {
  const [playersInMatches, setPlayerInMatches] = useState<MatchPlayer[]>([]);
  const [loadingPlayerMatches, setLoadingPlayerMatches] = useState(false);

  const fetchAllMatches = (players: WatchedPlayer[]): Promise<void> => {
    if (players.length === 0) {
      setPlayerInMatches([]);
      setLoadingPlayerMatches(false);
      return Promise.resolve();
    }

    setLoadingPlayerMatches(true);
    setPlayerInMatches([]);

    return Promise.all(
      players.map((sp) =>
        getPlayerInONGOINGMatch(sp.player_id).then((res) => ({
          res,
          player_id: sp.player_id,
        }))
      )
    )
      .then((results) => {
        const foundPlayers: MatchPlayer[] = [];

        results.forEach(({ res, player_id }) => {
          if (res && res.payload) {
            Object.keys(res.payload).forEach((status) => {
              const matches = res.payload[status] || [];
              matches.forEach((match: any) => {
                Object.values(match.teams).forEach((team: any) => {
                  const player = team.roster.find((p: any) => p.id === player_id);
                  if (player) {
                    const extraData = players.find(
                      (sp) => sp.player_id === player.id
                    );
                    foundPlayers.push({
                      ...player,
                      ...extraData,
                      status,
                      createdAt: match.createdAt,
                      match_id: match.id,
                    } as MatchPlayer);
                  }
                });
              });
            });
          }
        });

        setPlayerInMatches((prev) => {
          const uniquePlayersMap = new Map<string, MatchPlayer>();
          [...prev, ...foundPlayers].forEach((p) =>
            uniquePlayersMap.set(p.id, p)
          );
          return Array.from(uniquePlayersMap.values());
        });
      })
      .finally(() => setLoadingPlayerMatches(false));
  };

  useEffect(() => {
    if (selectedPlayers.length > 0) {
      const interval = setInterval(() => {
        fetchAllMatches(selectedPlayersRef.current);
      }, 60_000);

      return () => clearInterval(interval);
    }
  }, [selectedPlayers.length]);

  const removeMatchPlayer = (nickname: string) => {
    setPlayerInMatches((prev) =>
      prev.filter((player) => player.nickname !== nickname)
    );
  };

  return {
    playersInMatches,
    loadingPlayerMatches,
    fetchAllMatches,
    removeMatchPlayer,
  };
}