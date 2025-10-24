import { useState, useEffect } from "react";
import { getPlayerResultFromWorkerQueue, getPlayerTimeSinceLastMatch } from "../util/faceit_utils";
import { addSelectedPlayerToWorkerQueue } from "../util/function_utils";
import { useSelectedPlayerContext, type WatchedPlayer } from "../contexts/SelectedPlayerContext";

interface MatchPlayer {
  id: string;
  nickname: string;
  avatar: string;
  country: string;
  status: string; // Ex: ONGOING, READY
  createdAt: string;
  match_id: string;
  games: { name: string; skill_level: number }[];
}

interface UseMatchTrackerHookResult {
  playersInMatches: MatchPlayer[];
  playersRecentMatches: MatchPlayer[];
  loadingPlayerMatches: boolean;
  loadingPlayerRecentMatches: boolean;
  fetchAllMatches: (players: WatchedPlayer[]) => Promise<void>;
  fetchTimeSinceLastGame: (players: WatchedPlayer[]) => Promise<void>;
  removeMatchPlayer: (nickname: string) => void;
}

export function useMatchTrackerHook(): UseMatchTrackerHookResult {
  const { selectedPlayers, selectedPlayersRef } = useSelectedPlayerContext();

  const [playersInMatches, setPlayerInMatches] = useState<MatchPlayer[]>([]);
  const [playersRecentMatches, setPlayersRecentMatches] = useState<MatchPlayer[]>([]);

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

    const foundPlayers: MatchPlayer[] = [];
    results.forEach(({ res, player_id }) => {
      if (res && Object.keys(res).length > 0) {
        const match = res.match;
        if (!notAllowedStatuses.includes(match.status)) {
          Object.values(match.teams).forEach((team: any) => {
            const player = team.roster.find((p: any) => p.player_id === player_id);
            if (player) {
              const extraData = players.find(sp => sp.player_id === player.player_id);
              let status = Math.floor(Date.now() / 1000);
              switch (match.status) {
                case "READY": status = match.configured_at; break;
                case "ONGOING": status = match.started_at; break;
              }
              foundPlayers.push({
                id: player.player_id,
                ...player,
                ...extraData,
                status: match.status,
                createdAt: status,
                match_id: match.match_id,
              } as MatchPlayer);
            }
          });
        }
      }
    });

    setPlayerInMatches((prev) => {
      const uniquePlayersMap = new Map<string, MatchPlayer>();
      [...prev, ...foundPlayers].forEach(p => uniquePlayersMap.set(p.id, p));
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

    const foundPlayers: MatchPlayer[] = [];
    results.forEach(({ response, player_id }) => {
      if (response && response.items.length > 0) {
        const lastMatch = response.items[0];
        for (const factionKey of ["faction1", "faction2"]) {
          const team = lastMatch.teams[factionKey];
          if (team && Array.isArray(team.players)) {
            const playerFound = team.players.find((p:any)=> p.player_id === player_id);
            if (playerFound) {
              foundPlayers.push({
                id: playerFound.player_id,
                ...playerFound,
                status: "FINISHED",
                createdAt: lastMatch.finished_at,
                match_id: lastMatch.match_id,
                games: [{ name: "cs2", skill_level: playerFound.skill_level }],
              } as MatchPlayer);
            }
          }
        }
      }
    });

    setPlayersRecentMatches((prev) => {
      const uniquePlayersMap = new Map<string, MatchPlayer>();
      [...prev, ...foundPlayers].forEach(p => uniquePlayersMap.set(p.id, p));
      return Array.from(uniquePlayersMap.values());
    });

    setLoadingPlayerRecentMatches(false);
  };

  useEffect(() => {
    if (selectedPlayersRef.current.length > 0) {
      fetchAllMatches();
      fetchTimeSinceLastGame();
      const interval = setInterval(() => {
        addSelectedPlayerToWorkerQueue(selectedPlayersRef.current)
          .then(() => {
            fetchAllMatches();
            fetchTimeSinceLastGame();
          });
      }, 60_000);

      return () => clearInterval(interval);
    }
  }, [selectedPlayersRef]);

  const removeMatchPlayer = (nickname: string) => {
    setPlayerInMatches(prev => prev.filter(p => p.nickname !== nickname));
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
