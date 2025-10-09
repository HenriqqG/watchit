import watchItLogo from "../../assets/watchitlogo.png";
import { Flex, Box, Badge, Strong, Slider, Heading } from "@radix-ui/themes";
import { useEffect, useMemo, useState } from "react";
import { PlayerCard } from "../../components/PlayerCard";
import { WatchedPlayerCard } from "../../components/WatchedPlayerCard";
import { PlayerSearchDialog } from "../../components/PlayerSearchDialog";
import { Footer } from "../../components/general-components/Footer";
import { Snackbar, Alert } from "@mui/material";

import { usePlayerSearch } from "../../hooks/usePlayerSearch";
import { useWatchedPlayers } from "../../hooks/useWatchedPlayers";
import { usePlayerMatchTracker } from "../../hooks/usePlayerMatchTracker";
import { useSnackbars } from "../../hooks/useSnackbars";
import React from "react";
import { formatTimeDisplay, splitIntoColumns } from "../../util/function_utils";
import { FeedbackToast } from "../../components/general-components/FeedbackToast";
import Loading from "../../components/general-components/Loading";

const avoidDefaultDomBehavior = (e: any) => e.preventDefault();


export function FaceitWatcher() {
  const { notification, handleClose, openNotification } = useSnackbars();
  const { setUsername, returnedList, loadingPlayers, cleanList } = usePlayerSearch();

  const [selectedPlayersState, setSelectedPlayersState] = useState<any[]>([]);
  const selectedPlayersRef = React.useRef<any[]>([]);

  const [playersInMatchState, setPlayersInMatchState] = useState<any[]>([]);
  const playersInMatchStateRef = React.useRef<any[]>([]);

  const handleInput = (keyPressed: any) => {
    setUsername(keyPressed.target.value);
  }

  const { playersInMatches, playersRecentMatches, loadingPlayerMatches, loadingPlayerRecentMatches, fetchAllMatches, fetchTimeSinceLastGame, removeMatchPlayer } = usePlayerMatchTracker(selectedPlayersState, selectedPlayersRef);

  const { selectedPlayers, handlePlayerSelection: addPlayer, removeFromList: removeWatchedPlayer } =
    useWatchedPlayers(
      () => openNotification('Player added to the WatchIT List!', 'success'),
      () => openNotification('Player removed from the WatchIT List!', 'success'),
      () => openNotification('Player already added to the WatchIT List.', 'error'),
      () => openNotification('Max Watched Players reached. Remove one to add a new Player.', 'error'),
      fetchAllMatches,
      fetchTimeSinceLastGame
    );

  const handlePlayerSelection = (item: any) => {
    handleClose();
    const added = addPlayer(item);
    if (added) {
      cleanList();
    }
  };

  const removeFromList = (nickname: string) => {
    removeWatchedPlayer(nickname);
    removeMatchPlayer(nickname);
  };

  const columns = splitIntoColumns(selectedPlayers, 5, 4);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    selectedPlayersRef.current = selectedPlayers;
    setSelectedPlayersState(selectedPlayers);
  }, [selectedPlayers]);

  useEffect(() => {
    playersInMatchStateRef.current = playersInMatches;
    setPlayersInMatchState(playersInMatches);
  }, [playersInMatches]);

  const [sliderValue, setSliderValue] = useState([100]);
  const sliderCurrentValue = sliderValue[0];
  const handleValueChange = (newValue: any) => {
    setSliderValue(newValue);
  };

  const filteredPlayers = useMemo(() => {
    if (loadingPlayerRecentMatches || !playersInMatchState) {
      return [];
    }
    const MAX_MINUTES = 60;

    const timeLimitMinutes = (sliderCurrentValue / 100) * MAX_MINUTES;
    const timeLimitMs = timeLimitMinutes * 60 * 1000;
    const nowEpoch = Date.now();

    return playersRecentMatches.filter((player) => {
      const playerEpoch = new Date(player.createdAt).getTime() * 1000;
      const timeDifference = nowEpoch - playerEpoch;

      const isPlaying = playersInMatchState.some((playerInMatch) => playerInMatch.id == player.id);

      return timeDifference <= timeLimitMs && !isPlaying;
    });

  }, [sliderCurrentValue, playersRecentMatches, loadingPlayerRecentMatches, playersInMatchState]);

  return (
    <main className="flex items-center justify-center pt-16 pb-4 play-regular flex-col">
      <section className="w-full">
        <div className="flex-1 flex flex-col items-center gap-16 min-h-0 pb-20">
          <header className="flex flex-row items-center gap-9">
            <div className="w-[500px] max-w-[100vw]">
              <img
                src={watchItLogo}
                alt="WatchIt Logo"
                className="hidden w-full dark:block"
              />
            </div>
          </header>
          <div className="play-regular">Track Faceit players in real time and manage your matchmaking blocks with ease.</div>

          <div className="max-w-[50%] w-full space-y-6 px-4">
            <PlayerSearchDialog
              open={open}
              setOpen={setOpen}
              returnedList={returnedList}
              onInput={handleInput}
              onSelect={handlePlayerSelection}
              cleanList={cleanList}
              avoidDefaultDomBehavior={avoidDefaultDomBehavior}
              loadingPlayers={loadingPlayers}
              notification={notification}
              handleSnackBarClose={handleClose}
            />
          </div>

          {selectedPlayers.length != 0 && (
            <Box>
              Watched Players List ( {selectedPlayers.length}/20   )
              <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,500px))] max-w-lvw gap-4 mt-3">
                {selectedPlayers.map((item, key) => (
                  <WatchedPlayerCard
                    key={key}
                    avatar={item.avatar}
                    nickname={item.nickname}
                    country={item.country}
                    skillLevel={item.games[0].skill_level}
                    onRemoveFromList={removeFromList} />
                ))}
              </div>
            </Box>
          )}

          {loadingPlayerMatches && <Loading />}

          {!loadingPlayerMatches && playersInMatches.length > 0 &&
            (<Flex gap="2" justify="end">
              <Badge color="orange">On Going</Badge>
              <Badge color="green">Ready</Badge>
              <Badge color="yellow">Configuring/Voting</Badge>
            </Flex>)}


          {!loadingPlayerMatches && selectedPlayers.length == 0 && (
            <Flex align="center" direction="column" className="w-full">
              <Box>
                <Box>How to Use <Strong>WatchIt:</Strong></Box>
                <br />
                <Box>1. Search for a Player: Look up the player you want to add.</Box>
                <br />
                <Box>2. Select the Player: Click their card to add them to your watched list.</Box>
                <br />
                <Box>3. Track Matches: If the player is in a match, it will appear here.</Box>
                <br />
                <Box>4. Access Details: Open the player profile or matchroom if they’re in a game.</Box>
                <br />
                <Box>5. Manage List: Remove players from your watched list anytime.</Box>
              </Box>
            </Flex>
          )}

          <div className="grid sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {!loadingPlayerMatches &&
              playersInMatches.map((player) => (
                <PlayerCard
                  key={player.id}
                  avatar={player.avatar}
                  nickname={player.nickname}
                  skill_level={player.games[0].skill_level}
                  countryFlag={`https://flagcdn.com/w20/${player.country?.toLowerCase() || "br"}.png`}
                  status={player.status}
                  epochString={player.createdAt}
                  match_id={player.match_id}
                />
              ))}
          </div>

          <Flex direction="column" className="w-full">
            <Heading size="7">Played Recently</Heading>

            {selectedPlayers.length != 0 && (
              <Box className="sm:w-[100%] md:w-[60%] lg:w-[35%] xl:w-[25%]">
                <Flex className="w-full" direction="row" align="center">
                  <Slider className="bg-gray-500 mr-3" color="orange" variant="classic"
                    defaultValue={[100]} max={100} step={1} value={sliderValue}
                    onValueChange={handleValueChange} />
                  <Badge color="orange" size="2" style={{ textAlign: 'center' }}>
                    {formatTimeDisplay(sliderCurrentValue)}
                  </Badge>
                </Flex>
              </Box>
            )}

            {filteredPlayers.length == 0 && (
              <Flex align="center" direction="column" className="w-full">
                <Box>The player list is empty for now; try adjusting your filters.</Box>
              </Flex>
            )}
          </Flex>

          {loadingPlayerRecentMatches && <Loading />}

          <div className="grid sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {!loadingPlayerRecentMatches && filteredPlayers.map((player) => (
              <PlayerCard
                key={player.id}
                avatar={player.avatar}
                nickname={player.nickname}
                skill_level={player.games[0].skill_level}
                countryFlag={undefined}
                status={player.status}
                epochString={player.createdAt}
                match_id={player.match_id}
              />
            ))}
          </div>


        </div>
      </section>

      <section>
        <FeedbackToast />
        <Footer></Footer>
      </section>

      <section>
        <Snackbar open={notification.open && notification.message.includes('removed')}
          autoHideDuration={4000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity="success"
            variant="filled"
            sx={{ width: '100%' }}>
            Player removed from the WatchIT List.
          </Alert>
        </Snackbar>
      </section>
    </main>
  );
}