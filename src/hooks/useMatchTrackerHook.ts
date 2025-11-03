import { useState, useEffect } from "react";

import { useSelectedPlayerContext } from "../contexts/SelectedPlayerContext";

import { getPlayerResultFromWorkerQueue, getPlayerTimeSinceLastMatch } from "../util/faceit_utils";
import { addSelectedPlayerToWorkerQueue } from "../util/function_utils";

import type { WatchITPlayerSelected } from "../types/WatchITPlayerSelected";
import type { WatchITPlayerInMatch } from "../types/WatchITPlayerInMatch";

interface UseMatchTrackerHookResult {
  playersInMatches: WatchITPlayerInMatch[];
  playersRecentMatches: WatchITPlayerInMatch[];
  loadingPlayerMatches: boolean;
  loadingPlayerRecentMatches: boolean;
  fetchAllMatches: (players: WatchITPlayerSelected[]) => Promise<void>;
  fetchTimeSinceLastGame: (players: WatchITPlayerSelected[]) => Promise<void>;
  removeMatchPlayer: (nickname: string) => void;
}

export function useMatchTrackerHook(): UseMatchTrackerHookResult {
  const { selectedPlayersRef } = useSelectedPlayerContext();

  const [playersInMatches, setPlayerInMatches] = useState<WatchITPlayerInMatch[]>([]);
  const [playersRecentMatches, setPlayersRecentMatches] = useState<WatchITPlayerInMatch[]>([]);

  const [loadingPlayerMatches, setLoadingPlayerMatches] = useState(false);
  const [loadingPlayerRecentMatches, setLoadingPlayerRecentMatches] = useState(false);

  const notAllowedStatuses = ["SCHEDULED", "FINISHED", "CANCELLED"];

  const fetchAllMatches = async (): Promise<void> => {
    const players = selectedPlayersRef.current;
    if (players.length === 0) {
      setPlayerInMatches([]);
      setLoadingPlayerMatches(false);
      return;
    }

    setLoadingPlayerMatches(true);
    setPlayerInMatches([]);

    const results = await Promise.all(
      players.map((sp) =>
        getPlayerResultFromWorkerQueue(sp.player_id).then((res) => ({ res, player_id: sp.player_id }))
      )
    );

    const foundPlayers: WatchITPlayerInMatch[] = [];
    results.forEach(({ res, player_id }) => {
      if (res && Object.keys(res).length > 0) {
        const match = res.match;
        if (!notAllowedStatuses.includes(match.status)) {
          Object.values(match.teams).forEach((team: any) => {
            const player = team.roster.find((p: any) => p.player_id === player_id);
            if (player) {
              const playerFound = players.find(sp => sp.player_id === player.player_id);
              let time = Math.floor(Date.now() / 1000);
              switch (match.status) {
                case "READY": time = match.configured_at; break;
                case "ONGOING": time = match.started_at; break;
              }
              foundPlayers.push({
                player: playerFound,
                match_status: match.status,
                createdAt: time,
                match_id: match.match_id,
              } as WatchITPlayerInMatch);
            }
          });
        }
      }
    });

    setPlayerInMatches((prev) => {
      const uniquePlayersMap = new Map<string, WatchITPlayerInMatch>();
      [...prev, ...foundPlayers].forEach(p => uniquePlayersMap.set(p.player.player_id, p));
      return Array.from(uniquePlayersMap.values());
    });

    setLoadingPlayerMatches(false);
  };

  const fetchTimeSinceLastGame = async (): Promise<void> => {
    const players = selectedPlayersRef.current;
    if (players.length === 0) {
      setPlayersRecentMatches([]);
      setLoadingPlayerRecentMatches(false);
      return;
    }

    setLoadingPlayerRecentMatches(true);
    setPlayersRecentMatches([]);

    const results = await Promise.all(
      players.map(sp =>
        getPlayerTimeSinceLastMatch(sp.player_id).then(response => ({ response, player_id: sp.player_id }))
      )
    );

    const foundPlayers: WatchITPlayerInMatch[] = [];
    results.forEach(({ response, player_id }) => {
      if (response && response.items.length > 0) {
        const lastMatch = response.items[0];
        for (const factionKey of ["faction1", "faction2"]) {
          const team = lastMatch.teams[factionKey];
          if (team && Array.isArray(team.players)) {
            const playerFound = team.players.find((p: any) => p.player_id === player_id);
            if (playerFound) {
              foundPlayers.push({
                player: playerFound,
                match_status: "FINISHED",
                createdAt: lastMatch.finished_at,
                match_id: lastMatch.match_id,
              } as WatchITPlayerInMatch);
            }
          }
        }
      }
    });

    setPlayersRecentMatches((prev) => {
      const uniquePlayersMap = new Map<string, WatchITPlayerInMatch>();
      [...prev, ...foundPlayers].forEach(p => uniquePlayersMap.set(p.player.player_id, p));
      return Array.from(uniquePlayersMap.values());
    });

    setLoadingPlayerRecentMatches(false);
  };

useEffect(() => {
  if (selectedPlayersRef.current.length > 0) {
    let isRunning = false;

    fetchAllMatches();
    fetchTimeSinceLastGame();

    const interval = setInterval(async () => {
      if (isRunning) return;
      isRunning = true;

      try {
        addSelectedPlayerToWorkerQueue(selectedPlayersRef.current);

        await new Promise(resolve => setTimeout(resolve, 2_000));

        await fetchAllMatches();
        await fetchTimeSinceLastGame();
      } finally {
        isRunning = false;
      }
    }, 60_000);

    return () => clearInterval(interval);
  }
}, [selectedPlayersRef]);

  const removeMatchPlayer = (nickname: string) => {
    setPlayerInMatches(prev => prev.filter(p => p.player.nickname !== nickname));
    setPlayersRecentMatches(prev => prev.filter(p => p.player.nickname !== nickname));
  };

  return {
    playersInMatches,
    playersRecentMatches,
    loadingPlayerMatches,
    loadingPlayerRecentMatches,
    fetchAllMatches,
    fetchTimeSinceLastGame,
    removeMatchPlayer,
  };
}
