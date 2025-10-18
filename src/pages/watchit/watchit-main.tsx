import { Flex, Box, Badge, Strong, Slider } from "@radix-ui/themes";
import { useEffect, useMemo, useState } from "react";
import { PlayerCard } from "../../components/PlayerCard";
import { WatchedPlayerCard } from "../../components/WatchedPlayerCard";
import { PlayerSearchDialog } from "../../components/PlayerSearchDialog";
import { Snackbar, Alert } from "@mui/material";

import { useSearchHook } from "../../hooks/useSearchHook";
import { usePlayerHook } from "../../hooks/usePlayerHook";
import { useMatchTrackerHook } from "../../hooks/useMatchTrackerHook";
import { useSnackbars } from "../../hooks/useSnackbars";
import React from "react";
import { formatTimeDisplay } from "../../util/function_utils";
import Loading from "../../components/general-components/Loading";
import { tl } from "../../translations/translation"; 
import { useLanguage } from "../../contexts/LanguageContext";
import { GameStateBadges } from "../../components/general-components/GameStateBagdes";
import { useSelectedPlayerContext } from "../../contexts/SelectedPlayerContext";

const avoidDefaultDomBehavior = (e: any) => e.preventDefault();

export function WatchITMain() {

  const { currentLanguage } = useLanguage();

  const { notification, handleClose, openNotification } = useSnackbars();
  const { setUsername, returnedList, loadingPlayers, clearList, clearSearchInput } = useSearchHook();

  const { selectedPlayers, selectedPlayersRef } = useSelectedPlayerContext();

  const [playersInMatchState, setPlayersInMatchState] = useState<any[]>([]);
  const playersInMatchStateRef = React.useRef<any[]>([]);

  const handleInput = (keyPressed: any) => {
    setUsername(keyPressed.target.value);
  }

  const { playersInMatches, playersRecentMatches, loadingPlayerMatches, loadingPlayerRecentMatches,
     fetchAllMatches, fetchTimeSinceLastGame, removeMatchPlayer } = useMatchTrackerHook();

  const { handlePlayerSelect: addPlayer, handlePlayerRemove: removeWatchedPlayer } = usePlayerHook({
    onPlayerAdd: () => openNotification(tl(currentLanguage, 'notifications.player_added'), 'success'),
    onPlayerRemove: () => openNotification(tl(currentLanguage, 'notifications.player_removed'), 'success'),
    onError: () => openNotification(tl(currentLanguage, 'notifications.player_already_added'), 'error'),
    onErrorMaxLength: () => openNotification(tl(currentLanguage, 'notifications.max_players_reached'), 'error'),
    onChoosingPlayer: () => openNotification(tl(currentLanguage, 'notifications.adding_player_to_list'), 'info'),
    onListLoadedOrUpdated: fetchAllMatches,
    onListLoadedOrUpdatedRecentGames: fetchTimeSinceLastGame
  });

  const handlePlayerSelection = (item: any) => {
    handleClose();
    const added = addPlayer(item);
    if (added) {
      clearList();
      clearSearchInput();
    }
  };

  const removeFromList = (nickname: string) => {
    removeWatchedPlayer(nickname);
    removeMatchPlayer(nickname);
  };

  const [open, setOpen] = useState(false);

  useEffect(() => {
    playersInMatchStateRef.current = playersInMatches;
    setPlayersInMatchState(playersInMatches);
  }, [playersInMatches]);

  const [sliderValue, setSliderValue] = useState([25]);
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
    const timeLimitMs = (timeLimitMinutes + 1) * 60 * 1000;
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
          <div className="max-w-[50%] w-full space-y-6 px-4">
            <PlayerSearchDialog
              open={open}
              setOpen={setOpen}
              returnedList={returnedList}
              onInput={handleInput}
              onSelect={handlePlayerSelection}
              cleanList={clearList}
              avoidDefaultDomBehavior={avoidDefaultDomBehavior}
              loadingPlayers={loadingPlayers}
            />
          </div>

          {selectedPlayers.length != 0 && (
            <Box>
              {tl(currentLanguage, 'labels.watchlist_title')} ( {selectedPlayers.length} / 20 )
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

          {!loadingPlayerMatches && selectedPlayers.length == 0 && (
            <Flex align="center" direction="column" className="w-full">
              <Box>
                <Box><Strong>{tl(currentLanguage, 'instructions.title')}</Strong></Box>
                <br />
                <Box>{tl(currentLanguage, 'instructions.step1')}</Box>
                <br />
                <Box>{tl(currentLanguage, 'instructions.step2')}</Box>
                <br />
                <Box>{tl(currentLanguage, 'instructions.step3')}</Box>
                <br />
                <Box>{tl(currentLanguage, 'instructions.step4')}</Box>
                <br />
                <Box>{tl(currentLanguage, 'instructions.step5')}</Box>
              </Box>
            </Flex>
          )}

          {!loadingPlayerMatches && playersInMatches.length > 0 && (<GameStateBadges></GameStateBadges>)}

          <div className="grid sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-8 gap-4 mb-35">
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

          {selectedPlayers.length != 0 && (
            <Flex className="w-full" direction={'column'} align={'center'}> 
              {tl(currentLanguage, 'labels.slider_label')}
              <Box className="sm:w-[90%] md:w-[60%] lg:w-[45%] xl:w-[25%]">
                <Flex className="w-full" direction="row" align="center">
                  <Slider className="bg-gray-500 ml-3 mr-3" color="orange" variant="classic"
                    max={100} step={1} value={sliderValue}
                    onValueChange={handleValueChange} />
                  <Badge color="orange" size="2" style={{ textAlign: 'center' }}>
                     {formatTimeDisplay(sliderCurrentValue)}
                  </Badge>
                </Flex>
              </Box>
            </Flex>
          )}

          {filteredPlayers.length == 0 && selectedPlayers.length != 0 && (
            <Flex align="center" direction="column" className="w-full">
              <Box>{tl(currentLanguage, 'labels.empty_filtered_list')}</Box>
            </Flex>
          )}

          {loadingPlayerRecentMatches && <Loading />}

          <div className="grid sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-8 gap-4 mb-35">
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
        <Snackbar
          open={notification.open}
          autoHideDuration={4000}
          onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity={notification.severity}
            variant="filled"
            sx={{ width: '100%' }}>
            {notification.message}
          </Alert>
        </Snackbar>
      </section>
    </main>
  );
}