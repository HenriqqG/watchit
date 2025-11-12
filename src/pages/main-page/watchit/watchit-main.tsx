import React from "react";

import { Suspense, useEffect, useMemo, useState } from "react";
import { Flex, Box, Badge, Strong, Slider } from "@radix-ui/themes";
import { Snackbar, Alert } from "@mui/material";

import { useSearchHook } from "../../../hooks/useSearchHook";
import { usePlayerHook } from "../../../hooks/usePlayerHook";
import { useMatchTrackerHook } from "../../../hooks/useMatchTrackerHook";
import { useSnackbars } from "../../../hooks/useSnackbars";
import { useExtensionMessages } from "../../../hooks/useExtensionMessages";

import { useLanguage } from "../../../contexts/LanguageContext";
import { useSelectedPlayerContext } from "../../../contexts/SelectedPlayerContext";

import { getProjectVersion } from "../../../util/healthcheck_utils";
import { formatTimeDisplay } from "../../../util/function_utils";

import { tl } from "../../../translations/translation";

import Loading from "../../../components/general-components/Loading";
import { GameStateBadges } from "../../../components/general-components/GameStateBagdes";
import { WatchedPlayerCard } from "../../../components/main-page-components/WatchedPlayerCard";
import { PlayerSearchDialog } from "../../../components/main-page-components/PlayerSearchDialog";
import AdSenseAd from "../../../components/general-components/AdSenseAd";
const PlayerCard = React.lazy(() =>
  import("../../../components/main-page-components/PlayerCard").then(m => ({ default: m.PlayerCard }))
);

const avoidDefaultDomBehavior = (e: any) => e.preventDefault();

export function WatchITMain() {
  const LIST_MAX_VALUE = 30;

  useEffect(() => {
    const currentVersion = localStorage.getItem("currentVersion") ?? "0.0.1";
    getProjectVersion().then((response) => {
      console.log(`WatchIT - Version: ${response?.version}`);
      if (response && response.version !== currentVersion) {
        localStorage.setItem("currentVersion", response.version);
        window.location.reload();
      }
    });
  }, []);

  const { currentLanguage } = useLanguage();

  const { notification, handleClose, openNotification } = useSnackbars();
  const { setUsername, returnedList, loadingPlayers, clearList, clearSearchInput } = useSearchHook();

  const { selectedPlayers } = useSelectedPlayerContext();

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

  useExtensionMessages(({ type, payload }) => {
    if (type === "addToWatchITList") {
      const added = addPlayer(payload);
      if (added) {
        clearList();
        clearSearchInput();
      }
    }
  });

  const [sliderValue, setSliderValue] = useState([25]);
  const sliderCurrentValue = sliderValue[0];

  const handleValueChange = (newValue: any) => {
    setSliderValue(newValue);
  };

  const filteredPlayers = useMemo(() => {
    if (loadingPlayerRecentMatches || !playersInMatchState) return [];

    const MAX_MINUTES = 60;
    const timeLimitMinutes = (sliderCurrentValue / 100) * MAX_MINUTES;
    const timeLimitMs = (timeLimitMinutes + 1) * 60 * 1000;
    const nowEpoch = Date.now();

    return playersRecentMatches.filter((player) => {
      const playerEpoch = new Date(player.createdAt).getTime();
      const timeDifference = nowEpoch - (playerEpoch * 1000);

      const isPlaying = playersInMatchState.some((p) => p.player.player_id === player.player.player_id);

      return timeDifference <= timeLimitMs && !isPlaying;
    });
  }, [sliderValue, playersRecentMatches, loadingPlayerRecentMatches, playersInMatchState]);

  return (
    <main className="flex items-center justify-center pt-16 pb-4 play-regular flex-col">
      <div className="w-full max-w-[lvh] flex flex-col lg:flex-row lg:justify-center">
        <section className="xl:w-[88%]">
          <div className="flex-1 flex flex-col items-center gap-16 min-h-0 pb-20">
            <div className="max-w-[89%] w-full space-y-6 px-4">
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

            {selectedPlayers.length > 0 && (
              <>
                <Box className="sm:px-10">
                  {tl(currentLanguage, 'labels.watchlist_title')} ( {selectedPlayers.length} / {LIST_MAX_VALUE} )
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,500px))] max-w-lvw gap-4 mt-3 sm:justify-center">
                    {selectedPlayers.map((player, key) => (
                      <WatchedPlayerCard
                        key={key}
                        avatar={player.avatar}
                        nickname={player.nickname}
                        country={player.country}
                        skillLevel={player.skill_level}
                        onRemoveFromList={removeFromList} />
                    ))}
                  </div>
                </Box>
              </>
            )}

            {loadingPlayerMatches ? (
              <div className="flex flex-row min-h-[500px] justify-center">
                <Loading />
              </div>
            ) : (
              <>
                {selectedPlayers.length === 0 && (
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

                {playersInMatches.length > 0 && (
                  <>
                    <GameStateBadges />
                    <div className="grid sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-8 gap-4 mb-35 sm:px-10">
                      {playersInMatches.map((match) => (
                        <Suspense fallback={<Loading />}>
                          <PlayerCard
                            key={match.player.player_id}
                            avatar={match.player.avatar}
                            nickname={match.player.nickname}
                            skill_level={match.player.skill_level}
                            countryFlag={`https://flagcdn.com/w20/${match.player.country?.toLowerCase() || "br"}.png`}
                            status={match.match_status}
                            epochString={match.createdAt}
                            match_id={match.match_id}
                          />
                        </Suspense>
                      ))}
                    </div>
                  </>
                )}

                {selectedPlayers.length > 0 && playersInMatches.length === 0 && (
                  <>
                    <GameStateBadges />
                    <Flex align="center" direction="column" className="w-full min-h-[420px]">
                      <Box>{tl(currentLanguage, 'labels.empty_ongoing_games')}</Box>
                    </Flex>
                  </>
                )}
              </>
            )}
          </div>
        </section>
        {/* <aside className="xl:w-[12%] hidden lg:block justify-end">
          <Box className="w-[300px] h-[250px] bg-gray-900 flex items-center justify-center border border-orange-700">
            <p>300x250px - Banner Lateral</p>
            <AdSenseAd 
              slot="8800068919"
              format="rectangle" 
              style={{ width: '300px', height: '250px' }}/>
          </Box>
          <Box className="w-[300px] h-[600px] bg-gray-900 flex items-center justify-center border border-orange-700">
            <p>300x600px - Banner Lateral</p>
            <AdSenseAd 
              slot="7567427039"
              format="vertical"
              style={{ width: '300px', height: '600px' }}/>
          </Box>
        </aside> */}
      </div>
      <div className="w-full max-w-[100%] flex flex-col lg:flex-row lg:justify-center lg:gap-8">
        <div className="flex-1 flex flex-col items-center gap-16 min-h-0 pb-20">
          {selectedPlayers.length > 0 && (
            <>
              <Flex className="w-full" style={{justifyContent: 'center'}}>
                {/* <Box className="w-[728px] h-[90px] bg-gray-900 flex justify-center py-4 border-1 rounded-xs border-orange-700">
                  <p>728x90px - Banner Divisão</p>
                  <AdSenseAd 
                    slot="5045915910"
                    format="horizontal" 
                    style={{ width: '728px', height: '90px' }}/>
                </Box> */}
              </Flex>
              <Flex className="w-full" direction={'column'} align={'center'}>
                {tl(currentLanguage, 'labels.slider_label')}
                <Box className="w-full xl:w-[25%]">
                  <Flex className="w-full px-5" direction="row" align="center">
                    <Slider className="bg-gray-500 ml-3 mr-3" color="orange" variant="classic"
                      max={100} step={1} value={sliderValue}
                      onValueChange={handleValueChange} />
                    <Badge color="orange" size="2" style={{ textAlign: 'center' }}>
                      {formatTimeDisplay(sliderCurrentValue)}
                    </Badge>
                  </Flex>
                </Box>
              </Flex>

              {loadingPlayerRecentMatches ? (
                <div className="flex flex-row min-h-[420px] justify-center">
                  <Loading />
                </div>
              ) : (
                <>
                  {filteredPlayers.length === 0 ? (
                    <Flex align="center" direction="column" className="w-[90%] min-h-[420px]">
                      <Box>{tl(currentLanguage, 'labels.empty_filtered_list')}</Box>
                    </Flex>
                  ) : (
                    <div className="grid sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-8 gap-4 mb-35 sm:px-10">
                      {filteredPlayers.map((match) => (
                        <Suspense fallback={<Loading />}>
                          <PlayerCard
                            key={match.player.player_id}
                            avatar={match.player.avatar}
                            nickname={match.player.nickname}
                            skill_level={match.player.skill_level}
                            countryFlag={undefined}
                            status={match.match_status}
                            epochString={match.createdAt}
                            match_id={match.match_id}
                          />
                        </Suspense>
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
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