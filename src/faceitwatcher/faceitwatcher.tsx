/* eslint-disable @typescript-eslint/no-explicit-any */
import logoDark from "../assets/brandlogo-faceit-white-orange.png"
import watcher from "../assets/watcher.png"
import { Flex, Box, Badge, Strong } from '@radix-ui/themes'
import { useEffect, useRef, useState } from "react";
import { getPlayerInONGOINGMatch, getPlayersByUsername } from "../util/faceit_utils";
import { PlayerCard } from "../components/PlayerCard";
import { WatchedPlayerCard } from "../components/WatchedPlayerCard";
import { PlayerSearchDialog } from "../components/PlayerSearchDialog";
import { Footer } from "../components/Footer";
import { Snackbar, Alert, type SnackbarCloseReason } from "@mui/material";


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

  const [successSnackBarOpen, setSucessSnackBarOpen] = useState(false);
  const [successRemoveSnackBarOpen, setRemoveSucessSnackBarOpen] = useState(false);
  const [errorSnackBarOpen, setErrorSnackBarOpen] = useState(false);

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
            const modifiedList = res.items.map((player) => {
              const cs2 = player.games.find((g:any) => g.name === "cs2") || { name:"cs2", skill_level: 0 }
              const csgo = player.games.find((g:any) => g.name === "csgo") || { name:"csgo", skill_level: 0 }

              if (!cs2 && !csgo) return { ...player, games: [] };

              let trueSkill = cs2.skill_level || csgo.skill_level;
              if(cs2.skill_level > 0 && csgo.skill_level > 0){
                trueSkill = cs2.skill_level * 2 - csgo.skill_level;
                if (trueSkill > 10) trueSkill = 10;
              }

              return {
                ...player,
                games: [
                  {
                    name: "cs2",
                    skill_level: trueSkill
                  }
                ]
              };
            });
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
                      createdAt: match.createdAt,
                      match_id: match.id
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
    setSucessSnackBarOpen(false);
    setErrorSnackBarOpen(false);
    setList([]);
  }

  const handlePlayerSelection = (item: any) => {
    setSucessSnackBarOpen(false);
    setErrorSnackBarOpen(false);

    if (selectedPlayers.filter((i) => item.player_id == i.player_id).length > 0) {
      setErrorSnackBarOpen(true);
      return;
    }
    setList([]);
    setSelectedPlayers([...selectedPlayers, item]);
    setPlayerID(item.player_id);
    setSucessSnackBarOpen(true);
  }

  const removeFromList = (nickname: string) => {
    setRemoveSucessSnackBarOpen(false);

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
    setRemoveSucessSnackBarOpen(true);
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
                    match_id: match.id
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

  const handleClose = ( event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason ) => {
    if (reason === 'clickaway') {
      return;
    }

    setRemoveSucessSnackBarOpen(false);
    setSucessSnackBarOpen(false);
    setErrorSnackBarOpen(false);
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

  return (<main className="flex items-center justify-center pt-16 pb-4 play-regular">
    <div className="flex-1 flex flex-col items-center gap-16 min-h-0 pb-20">
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
      <div className="play-regular">Track Faceit players in real time and manage your matchmaking blocks with ease.</div>
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
          handleSuccessSnackBar={successSnackBarOpen}
          handleErrorSnackBar={errorSnackBarOpen}
          handleSnackBarClose={handleClose}
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
      {!loadingPlayerMatches && playersInMatches.length > 0 && 
        (<Flex gap="2" justify="end">
          <Badge color="orange">On Going</Badge>
          <Badge color="green">Ready</Badge>
          <Badge color="yellow">Configuring/Voting</Badge>
        </Flex>)}
        {!loadingPlayerMatches && selectedPlayers.length == 0 && 
        (<Flex align="center" direction="column" className="w-full">
          <Box></Box>
          <Box>
            <Box>How to Use <Strong>WatchIt:</Strong></Box>
            <br/>
            <Box>1. Search for a Player: Look up the player you want to add.</Box>
            <br/>
            <Box>2. Select the Player: Click their card to add them to your watched list.</Box>
            <br/>
            <Box>3. Track Matches: If the player is in a match, it will appear here.</Box>
            <br/>
            <Box>4. Access Details: Open the player profile or matchroom if they’re in a game.</Box>
            <br/>
            <Box>5. Manage List: Remove players from your watched list anytime.</Box>
          </Box>
          <Box></Box>
        </Flex>
        )}
      <div className="grid sm:grid-cols-2 md:grid-cols-6 grid-cols-12 gap-4">
        {!loadingPlayerMatches && playersInMatches.map((player) => (
          <PlayerCard
            key={player.id}
            avatar={player.avatar}
            nickname={player.nickname}
            skill_level={player.games[0].skill_level}
            countryFlag={`https://flagcdn.com/w20/${player.country.toLowerCase() || "br"}.png`}
            status={player.status}
            createdAt={player.createdAt}
            match_id={player.match_id}
          />
        ))}
      </div>
    </div>
    <Box>
      <Footer></Footer>
    </Box>
    <Snackbar open={successRemoveSnackBarOpen} autoHideDuration={4000} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity="success"
        variant="filled"
        sx={{ width: '100%' }}>
        Player removed from the WatchIT List.
      </Alert>
    </Snackbar>
  </main>);
}