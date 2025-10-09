import { useState, useEffect } from "react";
import { getPlayerInONGOINGMatch, getPlayerTimeSinceLastMatch } from "../util/faceit_utils";

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

interface WatchedPlayer {
  player_id: string;
  nickname: string;
}

interface UsePlayerMatchTrackerResult {
  playersInMatches: MatchPlayer[];
  playersRecentMatches: MatchPlayer[];
  loadingPlayerMatches: boolean;
  loadingPlayerRecentMatches: boolean;
  fetchAllMatches: (players: WatchedPlayer[]) => Promise<void>;
  fetchTimeSinceLastGame: (players: WatchedPlayer[]) => Promise<void>;
  removeMatchPlayer: (nickname: string) => void;
}

export function usePlayerMatchTracker(
  selectedPlayers: WatchedPlayer[],
  selectedPlayersRef: React.MutableRefObject<WatchedPlayer[]>
): UsePlayerMatchTrackerResult {

  const [playersInMatches, setPlayerInMatches] = useState<MatchPlayer[]>([]);
  const [playersRecentMatches, setPlayersRecentMatches] = useState<MatchPlayer[]>([]);

  const [loadingPlayerMatches, setLoadingPlayerMatches] = useState(false);
  const [loadingPlayerRecentMatches, setLoadingPlayerRecentMatches] = useState(false);

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
    ).then((results) => {
      const foundPlayers: MatchPlayer[] = [];

      results.forEach(({ res, player_id }) => {
        if (res && res.payload) {
          Object.keys(res.payload).forEach((status) => {
            if (status != "SCHEDULED") {
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
            }
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
    }).finally(() => setLoadingPlayerMatches(false));
  };

  useEffect(() => {
    if (selectedPlayers.length > 0) {
      const interval = setInterval(() => {
        fetchAllMatches(selectedPlayersRef.current);
        fetchTimeSinceLastGame(selectedPlayersRef.current);
      }, 60_000);

      return () => clearInterval(interval);
    }
  }, [selectedPlayers.length]);

  const removeMatchPlayer = (nickname: string) => {
    setPlayerInMatches((prev) =>
      prev.filter((player) => player.nickname !== nickname)
    );
  };

  const fetchTimeSinceLastGame = (players: WatchedPlayer[]): Promise<void> => {
    if (players.length === 0) {
      setPlayersRecentMatches([]);
      setLoadingPlayerRecentMatches(false);
      return Promise.resolve();
    }

    setLoadingPlayerRecentMatches(true);
    setPlayersRecentMatches([]);

    return Promise.all(
      players.map((sp) =>
        getPlayerTimeSinceLastMatch(sp.player_id).then((response) => ({
          response,
          player_id: sp.player_id,
        })
        ))
    ).then((results) => {
      const foundPlayers: MatchPlayer[] = [];

      results.forEach(({ response, player_id }) => {
        if (response && response.items.length > 0) {
          const lastMatch = response.items[0];

          for (const factionKey of ['faction1', 'faction2']) {
            const team = lastMatch.teams[factionKey];

            if (team && Array.isArray(team.players)) {
              const playerFound = team.players.filter((player: any) => player.player_id === player_id)[0];
              
              if (playerFound) {
                foundPlayers.push({
                  id: playerFound.player_id,
                  ...playerFound,
                  status: "FINISHED",
                  createdAt: lastMatch.finished_at,
                  match_id: lastMatch.match_id,
                  games: [{ name: "cs2", skill_level: playerFound.skill_level }]
                } as MatchPlayer);
              }
            }
          }
        }
      })

      setPlayersRecentMatches((prev) => {
        const uniquePlayersMap = new Map<string, MatchPlayer>();
        [...prev, ...foundPlayers].forEach((p) =>
          uniquePlayersMap.set(p.id, p)
        );
        return Array.from(uniquePlayersMap.values());
      });
    }).finally(() => setLoadingPlayerRecentMatches(false));
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