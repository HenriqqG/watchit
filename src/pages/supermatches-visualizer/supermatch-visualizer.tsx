import { useEffect, useMemo, useState } from "react";
import { fetchDataFromExtension } from "../../util/function_utils";
import type { FaceitLiveMatchesResponse, Payload, Roster, } from "../../layouts/responses/FaceitLiveMatchesResponse";
import Loading from "../../components/general-components/Loading";
import { Avatar, Box, Button, Card, Flex, Inset, Text, TextField } from "@radix-ui/themes";
import { Snackbar, Alert } from "@mui/material";
import { useSnackbars } from "../../hooks/useSnackbars";
import { useLanguage } from "../../contexts/LanguageContext";
import { tl } from "../../translations/translation";
import { GameStateBadges } from "../../components/general-components/GameStateBagdes";
import svgs from "../../assets/faceitLevels/faceitLevels";
import { ElapsedTime } from "../../components/general-components/ElapsedTime";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import React from "react";
import { sendBatchPlayerToWorkerQueue } from "../../util/faceit_utils";

export function SuperMatchVisualizer() {
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

        userHasExtension().then((installed) => {
            if (installed) {
                setDisableSync(true);
                _fetchDataFromExtension(entityId);
                const interval = setInterval(() => {
                    setDisableSync(false);
                }, 60_000);

                return () => clearInterval(interval);
            }
            setExtensionInstalled(installed);
        });
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
        setDisableSync(true);
        const interval = setInterval(() => {
            setDisableSync(false);
        }, 60_000);

        return () => clearInterval(interval);
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
                    <div className="flex-1 flex flex-col items-center gap-16 min-h-0 pb-20">
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
                            {!loadingMatches && hasLoadedMatches && (<Flex className="w-[90%]" direction="row" justify="center">
                                <Flex direction="column" className="w-[50%]">
                                    {liveSuperMatches.length >= 9 && (
                                        <Box className="w-full mb-5">
                                            {tl(currentLanguage, 'live_supermatches_page.look_for_specific_player')}
                                            <TextField.Root
                                                placeholder={tl(currentLanguage, 'dialogs.player_search.placeholder')}
                                                className="w-full"
                                                onInput={handleNicknameFilterChange}>
                                                <TextField.Slot>
                                                    <MagnifyingGlassIcon height="16" width="16" />
                                                </TextField.Slot>
                                            </TextField.Root>
                                        </Box>
                                    )}
                                    <Flex direction="row" className="w-full" justify="center"><GameStateBadges></GameStateBadges></Flex>
                                </Flex>
                            </Flex>)}
                            <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,500px))] max-w-lvw gap-4">
                                {!loadingMatches && hasLoadedMatches &&
                                    filteredSuperMatches.map((match) => (
                                        <>
                                            <Card className={`w-full border-2 bg-no-repeat bg-cover ${match.state == "ONGOING" ? "border-amber-600" : match.state == "READY" ? "border-green-500" : match.state == "FINISHED" ? "border-gray-700" : "border-yellow-300"}`}
                                                style={{ backgroundImage: `url(${match.voting?.map.entities.find((map) => map.game_map_id == match.voting?.map.pick[0])?.image_lg})` }}>
                                                <Flex direction="column">
                                                    <Inset clip="padding-box" side="top" pb="current">
                                                        <img
                                                            src={`${match.voting?.map.entities.find((map) => map.game_map_id == match.voting?.map.pick[0])?.image_lg ?? " "}`}
                                                            alt={`${match.voting?.map.entities.find((map) => map.game_map_id == match.voting?.map.pick[0])?.game_map_id ?? ""}`}
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
                                                                                ? "text-red-400 font-bold"
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
                                                                                ? "text-red-400 font-bold"
                                                                                : ""
                                                                        : ""}>
                                                                    {match.results ? match.results[0].factions.faction2.score : "0"}
                                                                </Text>
                                                                <Text size="1" className="pr-2">{match.teams.faction2.name}</Text>
                                                                <Avatar size="2"
                                                                    src={match.teams.faction2.avatar}
                                                                    radius="full"
                                                                    fallback="T" />
                                                            </Flex>
                                                        </Box>
                                                    </Flex>
                                                    <Flex direction="row" justify="center">
                                                        <ElapsedTime startTime={match.configuredAt || match.readyAt || match.startedAt || match.createdAt}></ElapsedTime>
                                                    </Flex>
                                                    <Flex direction="row" justify="between" className="p-4">
                                                        {Object.entries(match.teams).map(([key, team]) => (
                                                            <Flex key={key} direction="column">
                                                                {team.roster.map((player: Roster) => (
                                                                    <Flex direction="row">
                                                                        <Box className="w-full">
                                                                            <Flex direction="row" justify="between" align='center'>
                                                                                <Text size="2" className="pr-3">{player.nickname}</Text>
                                                                                <img width="17" height="17" className="rounded-full" src={`${svgs[`./lvl${player.gameSkillLevel}.svg`]}`} />
                                                                            </Flex>
                                                                        </Box>
                                                                    </Flex>
                                                                ))}
                                                            </Flex>
                                                        ))}
                                                    </Flex>
                                                </Flex>
                                            </Card>
                                        </>
                                    ))}
                            </div>
                            {!loadingMatches && !hasLoadedMatches && (<Box>{tl(currentLanguage, 'live_supermatches_page.nothing_here')}<a href="https://www.faceit.com/" className="hover:underline" target="_blank">FACEIT</a>!</Box>)}
                        </>)}
                        {!isExtensionInstalled && (<>
                            <Box>{tl(currentLanguage, 'live_supermatches_page.extension_not_installed')}</Box>
                        </>)}
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
        </>
    )
}