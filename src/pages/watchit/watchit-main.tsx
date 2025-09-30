import watchItLogo from "../../assets/watchitlogo.png";
import { Flex, Box, Badge, Strong } from "@radix-ui/themes";
import { useState } from "react";
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
import { splitIntoColumns } from "../../util/function_utils";
import { FeedbackToast } from "../../components/general-components/FeedbackToast";
import Loading from "../../components/general-components/Loading";

const avoidDefaultDomBehavior = (e: any) => e.preventDefault();


export function FaceitWatcher() {
  const {
    notification,
    handleClose,
    openNotification,
  } = useSnackbars();


  const { username, setUsername, returnedList, loadingPlayers, cleanList } = usePlayerSearch();

  const handleInput = (keyPressed: any) => {
    setUsername(keyPressed.target.value);
  }

  const [selectedPlayersState, setSelectedPlayersState] = useState<any[]>([]);
  const selectedPlayersRef = React.useRef<any[]>([]);

  const {
    playersInMatches,
    loadingPlayerMatches,
    fetchAllMatches,
    removeMatchPlayer,
  } = usePlayerMatchTracker(selectedPlayersState, selectedPlayersRef);

  const {
    selectedPlayers,
    handlePlayerSelection: addPlayer,
    removeFromList: removeWatchedPlayer,
  } = useWatchedPlayers(
    () => openNotification('Player added to the WatchIT List!', 'success'),
    () => openNotification('Player removed from the WatchIT List!', 'success'),
    () => openNotification('Player already added to the WatchIT List.', 'error'),
    fetchAllMatches
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

  const columns = splitIntoColumns(selectedPlayers, 5, 5);

  const [open, setOpen] = useState(false);

  return (
    <main className="flex items-center justify-center pt-16 pb-4 play-regular">
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
                      onRemoveFromList={removeFromList}/>
                  ))}
                </Flex>
              ))}
            </Flex>
          </Box>

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

          <div className="grid sm:grid-cols-2 md:grid-cols-6 grid-cols-12 gap-4">
            {!loadingPlayerMatches &&
              playersInMatches.map((player) => (
                <PlayerCard
                  key={player.id}
                  avatar={player.avatar}
                  nickname={player.nickname}
                  skill_level={player.games[0].skill_level}
                  countryFlag={`https://flagcdn.com/w20/${player.country?.toLowerCase() || "br"
                    }.png`}
                  status={player.status}
                  createdAt={player.createdAt}
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