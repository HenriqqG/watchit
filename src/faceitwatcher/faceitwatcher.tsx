/* eslint-disable @typescript-eslint/no-explicit-any */
import logoDark from "./brandlogo-faceit-white-orange.png"
import watcher from "./watcher.png"
import { Flex, Box } from '@radix-ui/themes'
import { useEffect, useRef, useState } from "react";
import { getPlayerInONGOINGMatch, getPlayersByUsername } from "../util/faceit_utils";
import { PlayerCard } from "../components/PlayerCard";
import { WatchedPlayerCard } from "../components/WatchedPlayerCard";
import { PlayerSearchDialog } from "../components/PlayerSearchDialog";


export function FaceitWatcher() {
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [loadingPlayerMatches, setLoadingPlayerMatches] = useState(false);

  const [open, setOpen] = useState(false);

  const [username, setUsername] = useState("");
  const [returnedList, setList] = useState<any[]>([]);

  const [selectedPlayers, setSelectedPlayers] = useState<any[]>([]);
  const selectedPlayersRef = useRef<any[]>([]);
  const columns = splitIntoColumns(selectedPlayers, 5, 5);

  const [player_id, setPlayerID] = useState("");
  const [playersInMatches, setPlayerInMatches] = useState<any[]>([]);
  const playersInMatchesRef = useRef<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("selectedPlayers");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        selectedPlayersRef.current = parsed;
        setSelectedPlayers(parsed);
        if (parsed.length > 0) {
          fetchAllMatches(parsed);
        }
      } catch (e) {
        console.error("Error Loading Selected Players", e);
      }
    }
  }, []);

  useEffect(() => {
    if (username) {
      setLoadingPlayers(true);
      const timeout = setTimeout(() => {
        getPlayersByUsername(username).then((res) => {
          if (res) {
            const modifiedList = res.items.map((player) => ({
              ...player,
              games: player.games.filter((game: any) => game.name === "cs2"),
            }));
            setList(modifiedList);
          }
        }).finally(() => setLoadingPlayers(false));
      }, 500);
      return () => {
        clearTimeout(timeout);
        setLoadingPlayers(false);
      };
    }
  }, [username]);

  useEffect(() => {
    if (player_id) {
      setLoadingPlayerMatches(true);
      const timeout = setTimeout(() => {
        getPlayerInONGOINGMatch(player_id).then((res) => {
          if (res && res.payload) {
            const foundPlayers: any = [];

            Object.keys(res.payload).forEach((status) => {
              const matches = res.payload[status] || [];
              matches.forEach((match) => {
                Object.values(match.teams).forEach((team: any) => {
                  const player = team.roster.find((p: any) => p.id === player_id);
                  if (player) {
                    const extraData = selectedPlayersRef.current?.find((sp) => sp.player_id === player.id);
                    foundPlayers.push({
                      ...player,
                      ...extraData,
                      status,
                      createdAt: match.createdAt
                    });
                  }
                });
              });
            });

            setPlayerInMatches((prev) => {
              const uniquePlayersMap = new Map<string, any>();
              [...prev, ...foundPlayers].forEach((p) => uniquePlayersMap.set(p.id, p));
              return Array.from(uniquePlayersMap.values());
            });
          }
        }).finally(() => setLoadingPlayerMatches(false));
      }, 500);
      return () => {
        clearTimeout(timeout);
        setLoadingPlayerMatches(false);
      };
    }
  }, [player_id]);

  useEffect(() => {
    if (selectedPlayersRef.current.length > 0) {
      const interval = setInterval(() => {
        fetchAllMatches(selectedPlayersRef.current);
      }, 60_000);

      return () => clearInterval(interval);
    }
  }, [selectedPlayersRef.current]);

  useEffect(() => {
    selectedPlayersRef.current = selectedPlayers;
    localStorage.setItem("selectedPlayers", JSON.stringify(selectedPlayers));
  }, [selectedPlayers]);

  useEffect(() => {
    playersInMatchesRef.current = playersInMatches;
  }, [playersInMatches]);

  const avoidDefaultDomBehavior = (e: any) => {
    e.preventDefault();
  };

  const onInput = (keyPressed: any) => {
    setUsername(keyPressed.target.value);
  }

  const cleanList = () => {
    setList([]);
  }

  const handlePlayerSelection = (item: any) => {
    if (selectedPlayers.filter((i) => item.player_id == i.player_id).length > 0) {
      return;
    }
    setList([]);
    setSelectedPlayers([...selectedPlayers, item]);
    setPlayerID(item.player_id);
  }

  const removeFromList = (nickname: string) => {
    setSelectedPlayers((prev) => {
      const updated = prev.filter((player) => player.nickname !== nickname);
      selectedPlayersRef.current = updated;
      return updated;
    });
    setPlayerInMatches((prev) => {
      const updated = prev.filter((player) => player.nickname !== nickname);
      playersInMatchesRef.current = updated;
      return updated;
    });
    setPlayerID("");
  }

  const fetchAllMatches = (players: any[]) => {
    setLoadingPlayerMatches(true);

    return Promise.all(
      players.map((sp) =>
        getPlayerInONGOINGMatch(sp.player_id).then((res) => ({
          res,
          player_id: sp.player_id,
        }))
      )
    ).then((results) => {
      const foundPlayers: any[] = [];

      results.forEach(({ res, player_id }) => {
        if (res && res.payload) {
          Object.keys(res.payload).forEach((status) => {
            const matches = res.payload[status] || [];
            matches.forEach((match) => {
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
                  });
                }
              });
            });
          });
        }
      });

      setPlayerInMatches((prev) => {
        const uniquePlayersMap = new Map<string, any>();
        [...prev, ...foundPlayers].forEach((p) =>
          uniquePlayersMap.set(p.id, p)
        );
        return Array.from(uniquePlayersMap.values());
      });
    }).finally(() => setLoadingPlayerMatches(false));
  };

  function splitIntoColumns<T>(items: T[], itemsPerColumn: number, maxColumns: number): T[][] {
    const columns: T[][] = [];
    for (let col = 0; col < maxColumns; col++) {
      const start = col * itemsPerColumn;
      const end = start + itemsPerColumn;
      const columnItems = items.slice(start, end);
      if (columnItems.length > 0) columns.push(columnItems);
    }
    return columns;
  }

  return (<main className="flex items-center justify-center pt-16 pb-4">
    <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
      <header className="flex flex-row items-center gap-9">
        <div className="w-[500px] max-w-[100vw]">
          <img src={logoDark}
            alt="React Router"
            className="hidden w-full dark:block" />
        </div>
        <div className="w-[40px] h-[40px]">
          <img src={watcher}
            alt="React Router"
            className="hidden w-full dark:block" />
        </div>
      </header>
      <div className="max-w-[50%] w-full space-y-6 px-4">
        <PlayerSearchDialog
          open={open}
          setOpen={setOpen}
          returnedList={returnedList}
          onInput={onInput}
          onSelect={handlePlayerSelection}
          cleanList={cleanList}
          avoidDefaultDomBehavior={avoidDefaultDomBehavior}
          loadingPlayers={loadingPlayers}
        />
      </div>
      <Box>
        <Flex className="w-full gap-6" align="start">
          {columns.map((col, colIndex) => (
            <Flex key={colIndex} direction="column" gap="3">
              {col.map((item, key) => (
                <WatchedPlayerCard
                  key={key}
                  avatar={item.avatar}
                  nickname={item.nickname}
                  country={item.country}
                  skillLevel={item.games[0].skill_level}
                  onRemoveFromList={removeFromList} />
              ))}
            </Flex>
          ))}
        </Flex>
      </Box>
      {loadingPlayerMatches && (
        <div className="flex justify-center items-center py-6">
          <div className='h-3 w-3 mr-1 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
          <div className='h-3 w-3 mr-1 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
          <div className='h-3 w-3 bg-gray-300 rounded-full animate-bounce'></div>
        </div>
      )
      }
      <div className="grid grid-cols-12 gap-4">
        {!loadingPlayerMatches && playersInMatches.map((player) => (
          <PlayerCard
            key={player.id}
            avatar={player.avatar}
            nickname={player.nickname}
            skill_level={player.games[0].skill_level}
            countryFlag={`https://flagcdn.com/w20/${player.country.toLowerCase() || "br"}.png`}
            status={player.status}
            createdAt={player.createdAt}
          />
        ))}
      </div>
      {/* { JSON.stringify(playersInMatches, null, 2) } */}
    </div>
  </main>);
}