import { useEffect, useMemo, useState } from "react";
import { fetchDataFromExtension } from "../../../util/function_utils";
import type { FaceitLiveMatchesResponse, Payload, Roster, } from "../../../layouts/responses/FaceitLiveMatchesResponse";
import Loading from "../../../components/general-components/Loading";
import { Avatar, Box, Button, Card, Flex, Inset, Text, TextField } from "@radix-ui/themes";
import { Snackbar, Alert } from "@mui/material";
import { useSnackbars } from "../../../hooks/useSnackbars";
import { useLanguage } from "../../../contexts/LanguageContext";
import { tl } from "../../../translations/translation";
import { GameStateBadges } from "../../../components/general-components/GameStateBagdes";
import svgs from "../../../assets/faceitLevels/faceitLevels";
import { ElapsedTime } from "../../../components/general-components/ElapsedTime";
import { DownloadIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import React from "react";
import { sendBatchPlayerToWorkerQueue } from "../../../util/faceit_utils";
import { useAuthStore } from "../../../store/AuthStore";
import FaceitLogin from "../../login/FaceitLogin";

export function SuperMatchVisualizer() {

    const { user, loading } = useAuthStore();

    if (loading) {
        return <Loading></Loading>;
    }

    const { currentLanguage } = useLanguage();

    const [isExtensionInstalled, setExtensionInstalled] = useState(true);

    const { notification, handleClose, openNotification } = useSnackbars();

    const [liveSuperMatches, setLiveSuperMatches] = useState<Payload[]>([]);
    const [hasLoadedMatches, setMatchesLoaded] = useState(false);
    const [loadingMatches, setLoadingMatches] = useState(true);

    const [disableSync, setDisableSync] = useState(false);

    const [nicknameFilter, setNicknameFilter] = useState("");

    const [nicknameFilterState, setNicknameFilterState] = useState<string>("");
    const nicknameFilterStateRef = React.useRef<string>("");

    const effectRan = React.useRef(false);

    useEffect(() => {
        if (effectRan.current) return;
        effectRan.current = true;

        let entityId = localStorage.getItem("entityId") ?? "73557c8e-4b67-4ac8-bae0-e910b49a5fa0";
        if (user) {
            userHasExtension().then((installed) => {
                if (installed) {
                    _fetchDataFromExtension(entityId);
                    _handleFaceitSync();
                }
                setExtensionInstalled(installed);
            });
        }

    }, []);

    useEffect(() => {
        nicknameFilterStateRef.current = nicknameFilter;
        setNicknameFilterState(nicknameFilter);
    }, [nicknameFilter]);

    function userHasExtension() {
        return new Promise<boolean>((resolve) => {
            const timeout = setTimeout(() => {
                window.removeEventListener("message", onMessage);
                resolve(false);
            }, 500);

            const onMessage = (event: MessageEvent) => {
                if (event.data?.type === "EXT_RESPONSE") {
                    clearTimeout(timeout);
                    window.removeEventListener("message", onMessage);
                    resolve(true);
                }
            };

            window.addEventListener("message", onMessage);
            window.postMessage("EXT_CHECK", "*");
        });
    }

    function _fetchDataFromExtension(entityId: string) {
        const payload = {
            action: "getFaceitLiveMatchesData",
            entityId,
        };
        fetchDataFromExtension(payload)
            .then((data) => {
                const response = data as FaceitLiveMatchesResponse;
                if (response && response.payload) {
                    let superMatches = response.payload
                        .filter((match) => match.tags.includes("super") && match.state != "CHECK_IN");
                    superMatches = superMatches.filter((match) => {
                        return Object.values(match.teams).every((team) =>
                            team.roster.every((player: Roster) => player.gameSkillLevel >= 10)
                        );
                    });
                    setLiveSuperMatches(superMatches);
                    setMatchesLoaded(true);
                    setLoadingMatches(false);

                    const everyActivePlayer: string[] = superMatches.flatMap((match) =>
                        Object.values(match.teams).flatMap((team) =>
                            team.roster.map((player: Roster) => player.id)
                        )
                    );
                    sendBatchPlayerToWorkerQueue(everyActivePlayer);
                }
            }).catch(err => {
                console.error("Erro:", err);
                setMatchesLoaded(false);
                openNotification(tl(currentLanguage, 'notifications.error_loading_supermatches'), 'warning')
                setLoadingMatches(false);
            });
    }

    function syncSuperMatchesWFaceit() {
        setLoadingMatches(true);
        _fetchDataFromExtension("73557c8e-4b67-4ac8-bae0-e910b49a5fa0");
        _handleFaceitSync();
    }

    function _handleFaceitSync() {
        setDisableSync(true);
        const timeout = setTimeout(() => {
            setDisableSync(false);
            openNotification(tl(currentLanguage, 'notifications.sync_now'), 'info');
        }, 60_000);

        return () => clearTimeout(timeout);
    }

    function handleNicknameFilterChange(event: React.ChangeEvent<HTMLInputElement>) {
        setNicknameFilter(event.target.value);
    }

    const filteredSuperMatches = useMemo(() => {
        return liveSuperMatches.filter((match) => {
            return Object.values(match.teams).some((team) =>
                team.roster.some((player: Roster) =>
                    player.nickname.toLowerCase().includes(nicknameFilterState.toLowerCase())
                )
            );
        });
    }, [liveSuperMatches, nicknameFilterState]);

    return (
        <>
            <main className="flex items-center justify-center pt-16 pb-4 play-regular flex-col">
                <section className="w-full">
                    {user && (
                        <div className="flex-1 flex flex-col items-center gap-9 min-h-0 pb-20">
                            {isExtensionInstalled && (<>
                                <Flex className="w-[90%]" direction="row" justify="end">
                                    <Button color="orange" variant="soft" onClick={syncSuperMatchesWFaceit} disabled={disableSync}>
                                        {loadingMatches ? tl(currentLanguage, 'live_supermatches_page.synchronizing') : tl(currentLanguage, 'live_supermatches_page.synchronize_w_faceit')}
                                        <div className={loadingMatches ? 'animate-spin' : ''}>
                                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1.84998 7.49998C1.84998 4.66458 4.05979 1.84998 7.49998 1.84998C10.2783 1.84998 11.6515 3.9064 12.2367 5H10.5C10.2239 5 10 5.22386 10 5.5C10 5.77614 10.2239 6 10.5 6H13.5C13.7761 6 14 5.77614 14 5.5V2.5C14 2.22386 13.7761 2 13.5 2C13.2239 2 13 2.22386 13 2.5V4.31318C12.2955 3.07126 10.6659 0.849976 7.49998 0.849976C3.43716 0.849976 0.849976 4.18537 0.849976 7.49998C0.849976 10.8146 3.43716 14.15 7.49998 14.15C9.44382 14.15 11.0622 13.3808 12.2145 12.2084C12.8315 11.5806 13.3133 10.839 13.6418 10.0407C13.7469 9.78536 13.6251 9.49315 13.3698 9.38806C13.1144 9.28296 12.8222 9.40478 12.7171 9.66014C12.4363 10.3425 12.0251 10.9745 11.5013 11.5074C10.5295 12.4963 9.16504 13.15 7.49998 13.15C4.05979 13.15 1.84998 10.3354 1.84998 7.49998Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
                                            </svg>
                                        </div>
                                    </Button>
                                </Flex>
                                {loadingMatches && (<Loading></Loading>)}
                                {!loadingMatches && hasLoadedMatches && (
                                    <Flex className="w-[90%]" direction="row" justify="center">
                                        <Flex direction="column" className="w-[50%]" align="center">
                                            {liveSuperMatches.length > 0 && (
                                                <>
                                                    {liveSuperMatches.length >= 4 && (
                                                        <Box className="w-full mb-5">
                                                            {tl(currentLanguage, 'live_supermatches_page.look_for_specific_player')}
                                                            <TextField.Root
                                                                placeholder={tl(currentLanguage, 'dialogs.player_search.placeholder')}
                                                                className="w-full mt-3"
                                                                onInput={handleNicknameFilterChange}>
                                                                <TextField.Slot>
                                                                    <MagnifyingGlassIcon height="16" width="16" />
                                                                </TextField.Slot>
                                                            </TextField.Root>
                                                        </Box>
                                                    )}
                                                    <Flex direction="row" className="w-full pb-3" justify="center">
                                                        <GameStateBadges></GameStateBadges>
                                                    </Flex>
                                                    <Text size="1" color="gray">{tl(currentLanguage, 'live_supermatches_page.hover_cards')}</Text>
                                                </>
                                            )}
                                        </Flex>
                                    </Flex>)}
                                <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,500px))] max-w-lvw gap-4">
                                    {!loadingMatches && hasLoadedMatches &&
                                        filteredSuperMatches.map((match, index) => {
                                            const map_pick = match.voting?.map.entities.find((map) => map.game_map_id == match.voting?.map.pick[0]);
                                            return (
                                                <>
                                                    <Card key={index} className={`w-full min-h-[380px] border-2 bg-no-repeat bg-cover perspective-1000 overflow-hidden group
                                                     ${match.state == "ONGOING" ? "border-amber-600" :
                                                            match.state == "READY" ? "border-green-500" :
                                                                match.state == "FINISHED" ? "border-gray-700" : "border-yellow-300"}`}
                                                        style={{ backgroundImage: `url(${map_pick?.image_lg})` }}>
                                                        <Box className="relative w-full h-full transition-transform duration-700 transform-style-preserve-3d will-change-transform group-hover:rotate-y-180 cursor-pointer" onClick={() =>
                                                            window.open(`https://www.faceit.com/en/cs2/room/${match.id}`, "_blank")}>
                                                            <div className="absolute w-full h-full backface-hidden">
                                                                <Flex direction="column" className="backdrop-brightness-60 rounded-lg border-gray-800">
                                                                    <Inset clip="padding-box" side="top" pb="current">
                                                                        <img
                                                                            src={`${map_pick?.image_lg ?? " "}`}
                                                                            alt={`${map_pick?.game_map_id ?? " "}`}
                                                                            style={{
                                                                                display: "block",
                                                                                objectFit: "cover",
                                                                                width: "100%",
                                                                                height: 80,
                                                                                backgroundColor: "var(--gray-5)",
                                                                            }}
                                                                        />
                                                                    </Inset>
                                                                    <Flex direction="row" justify="between" className="p-1">
                                                                        <Box className="w-full">
                                                                            <Flex direction="row" justify="between" align='center'>
                                                                                <Text size="1" className="pr-2">{match.teams.faction1.name}</Text>
                                                                                <Avatar size="2"
                                                                                    src={match.teams.faction1.avatar}
                                                                                    radius="full"
                                                                                    fallback="T" />
                                                                                <Text size="5"
                                                                                    className={match.results
                                                                                        ? match.results[0].factions.faction1.score >
                                                                                            match.results[0].factions.faction2.score
                                                                                            ? "text-green-400 font-bold"
                                                                                            : match.results[0].factions.faction1.score <
                                                                                                match.results[0].factions.faction2.score
                                                                                                ? "text-red-500 font-bold"
                                                                                                : ""
                                                                                        : ""}>
                                                                                    {match.results ? match.results[0].factions.faction1.score : "0"}
                                                                                </Text>
                                                                            </Flex>
                                                                        </Box>
                                                                        <Text size="5" className="pl-4 pr-4">x</Text>
                                                                        <Box className="w-full">
                                                                            <Flex direction="row" justify="between" align='center'>
                                                                                <Text size="5"
                                                                                    className={match.results
                                                                                        ? match.results[0].factions.faction2.score >
                                                                                            match.results[0].factions.faction1.score
                                                                                            ? "text-green-400 font-bold"
                                                                                            : match.results[0].factions.faction2.score <
                                                                                                match.results[0].factions.faction1.score
                                                                                                ? "text-red-500 font-bold"
                                                                                                : ""
                                                                                        : ""}>
                                                                                    {match.results ? match.results[0].factions.faction2.score : "0"}
                                                                                </Text>
                                                                                <Avatar size="2"
                                                                                    src={match.teams.faction2.avatar}
                                                                                    radius="full"
                                                                                    fallback="T" />
                                                                                <Text size="1" className="pr-2">{match.teams.faction2.name}</Text>

                                                                            </Flex>
                                                                        </Box>
                                                                    </Flex>
                                                                    <Flex direction="row" justify="center">
                                                                        <ElapsedTime startTime={match.startedAt || match.readyAt || match.configuredAt || match.createdAt}></ElapsedTime>
                                                                    </Flex>
                                                                    <Flex direction="row" justify="between" className="p-4">
                                                                        {Object.entries(match.teams).map(([factionKey, team]) => {
                                                                            const parties: Record<string, Roster[]> = team.roster.reduce(
                                                                                (acc: Record<string, Roster[]>, player: Roster) => {
                                                                                    const partyId = player.partyId || player.id;
                                                                                    if (!acc[partyId]) acc[partyId] = [];
                                                                                    acc[partyId].push(player);
                                                                                    return acc;
                                                                                }, {});
                                                                            return (
                                                                                <Flex key={factionKey} direction="column" className="w-[45%]">
                                                                                    {Object.entries(parties).map(([partyId, members]) =>
                                                                                        members.length > 1 ? (
                                                                                            <Box key={partyId}
                                                                                                className="w-full rounded-lg mb-2"
                                                                                                style={{
                                                                                                    borderRight: `${factionKey === 'faction1' ? `2px ${map_pick?.game_map_id ? "black" : "white"} solid` : '0px'} `,
                                                                                                    borderLeft: `${factionKey === 'faction2' ? `2px ${map_pick?.game_map_id ? "black" : "white"} solid` : '0px'} `,
                                                                                                }}>
                                                                                                {members.map((player) => (
                                                                                                    <Flex key={player.id} direction="row" className="p-2 w-[90%]">
                                                                                                        <Box className="w-full">
                                                                                                            <Flex direction="row" justify="between" align="center">
                                                                                                                <Text size="2" className="pr-2 min-w-[75%]">
                                                                                                                    {player.nickname}
                                                                                                                </Text>
                                                                                                                <Flex direction="row">
                                                                                                                    <Text className="pr-1 pt-1" size="1" trim="both" align="center">
                                                                                                                        {player.elo}
                                                                                                                    </Text>
                                                                                                                    <img
                                                                                                                        width="20"
                                                                                                                        height="20"
                                                                                                                        className="rounded-full"
                                                                                                                        src={`${svgs[`./lvl${player.gameSkillLevel}.svg`]}`} />
                                                                                                                </Flex>
                                                                                                            </Flex>
                                                                                                        </Box>
                                                                                                    </Flex>
                                                                                                ))}
                                                                                            </Box>
                                                                                        ) : (
                                                                                            <Flex key={members[0].id} direction="row" className="p-2 w-[90%]">
                                                                                                <Box className="w-full">
                                                                                                    <Flex direction="row" justify="between" align="center">
                                                                                                        <Text size="2" className="pr-2 min-w-[75%]">
                                                                                                            {members[0].nickname}
                                                                                                        </Text>
                                                                                                        <Flex direction="row">
                                                                                                            <Text className="pr-1 pt-1" size="1" trim="both" align="center">
                                                                                                                {members[0].elo}
                                                                                                            </Text>
                                                                                                            <img width="20"
                                                                                                                height="20"
                                                                                                                className="rounded-full"
                                                                                                                src={`${svgs[`./lvl${members[0].gameSkillLevel}.svg`]}`} />
                                                                                                        </Flex>
                                                                                                    </Flex>
                                                                                                </Box>
                                                                                            </Flex>
                                                                                        )
                                                                                    )}
                                                                                </Flex>
                                                                            );
                                                                        })}
                                                                    </Flex>
                                                                </Flex>
                                                            </div>
                                                            <div className={`absolute w-full h-full backface-hidden border-2 text-white rounded-lg flex items-center justify-center rotate-y-180 
                                                            ${match.state == "ONGOING" ? "border-amber-600" :
                                                                    match.state == "READY" ? "border-green-500" :
                                                                        match.state == "FINISHED" ? "border-gray-700" : "border-yellow-300"}`}>
                                                                <Text className="pr-3">{tl(currentLanguage, 'live_supermatches_page.open_faceit')}</Text>
                                                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12 13C12.5523 13 13 12.5523 13 12V3C13 2.44771 12.5523 2 12 2H3C2.44771 2 2 2.44771 2 3V6.5C2 6.77614 2.22386 7 2.5 7C2.77614 7 3 6.77614 3 6.5V3H12V12H8.5C8.22386 12 8 12.2239 8 12.5C8 12.7761 8.22386 13 8.5 13H12ZM9 6.5C9 6.5001 9 6.50021 9 6.50031V6.50035V9.5C9 9.77614 8.77614 10 8.5 10C8.22386 10 8 9.77614 8 9.5V7.70711L2.85355 12.8536C2.65829 13.0488 2.34171 13.0488 2.14645 12.8536C1.95118 12.6583 1.95118 12.3417 2.14645 12.1464L7.29289 7H5.5C5.22386 7 5 6.77614 5 6.5C5 6.22386 5.22386 6 5.5 6H8.5C8.56779 6 8.63244 6.01349 8.69139 6.03794C8.74949 6.06198 8.80398 6.09744 8.85143 6.14433C8.94251 6.23434 8.9992 6.35909 8.99999 6.49708L8.99999 6.49738" fill="currentColor">
                                                                    </path>
                                                                </svg>
                                                            </div>
                                                        </Box>
                                                    </Card>
                                                </>
                                            )
                                        })}
                                </div>
                                {!loadingMatches && hasLoadedMatches && liveSuperMatches.length == 0 && (
                                    <Box>{tl(currentLanguage, 'live_supermatches_page.nothing_here')}</Box>
                                )}
                            </>)}
                            {!isExtensionInstalled && (<>
                                <Flex direction="row" className="mt-5">
                                    <Flex direction="column">
                                        <Text>
                                            {tl(currentLanguage, 'live_supermatches_page.extension_not_installed')}
                                        </Text>
                                        <Text>
                                            {tl(currentLanguage, 'live_supermatches_page.install_extension')}

                                        </Text>
                                        <Flex direction="row" justify="center" className="pt-5">
                                            <Button size="4" color="orange" variant="soft" radius="small" className="cursor-pointer" onClick={() =>
                                                window.open(`https://chromewebstore.google.com/detail/watchit-smart-blocking-fo/dcpnlnlnjbgbeglkmmghoifgobadmjmo?authuser=5&hl=pt-BR`, "_blank")}>
                                                <DownloadIcon width="25" height="25"></DownloadIcon>
                                                <p className="play-regular">{tl(currentLanguage, 'live_supermatches_page.install_extension.button')}</p>
                                            </Button>
                                        </Flex>
                                    </Flex>
                                </Flex>
                            </>)}
                        </div>
                    )}
                    {!user && (
                        <div className="flex-1 flex flex-col items-center gap-9 min-h-0 pb-20">
                            <Flex direction="column" align="center">
                                {tl(currentLanguage, 'live_supermatches_page.login_needed')}
                                <Box className="p-3">
                                    <FaceitLogin></FaceitLogin>
                                </Box>
                            </Flex>
                        </div>
                    )}
                </section>
                <section>
                    <Snackbar
                        open={notification.open}
                        autoHideDuration={10_000}
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
        </>
    )
}