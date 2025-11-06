import React from "react";
import { Suspense, useEffect, useMemo, useState } from "react";

import { Box, Button, Flex, Select, Text, TextField } from "@radix-ui/themes";
import { Snackbar, Alert } from "@mui/material";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

import { useAuthStore } from "../../../store/AuthStore";
import { useSnackbars } from "../../../hooks/useSnackbars";
import { useLanguage } from "../../../contexts/LanguageContext";

import { tl } from "../../../translations/translation";

import Loading from "../../../components/general-components/Loading";
import { GameStateBadges } from "../../../components/general-components/GameStateBagdes";
import { InstallExtension } from "../../../components/general-components/InstallExtensionButton";

import FaceitLogin from "../../login/FaceitLogin";
import { fetchDataFromExtension, isHighLevelMatch } from "../../../util/function_utils";
import { sendBatchPlayerToWorkerQueue } from "../../../util/faceit_utils";

import svgs from "../../../assets/faceitLevels/faceitLevels";
import type { FaceitLiveMatchesResponse, Payload, Roster, } from "../../../types/responses/FaceitLiveMatchesResponse";

const SuperMatchCard = React.lazy(() =>
    import("../../../components/supermatch-components/SuperMatchCard").then(m => ({ default: m.SuperMatchCard }))
);

export function SuperMatchVisualizer() {

    const { loading, isAuthenticated } = useAuthStore();

    if (loading) {
        return <Loading></Loading>;
    }

    const { currentLanguage } = useLanguage();

    const [isExtensionInstalled, setExtensionInstalled] = useState(true);

    const { notification, handleClose, openNotification } = useSnackbars();

    const [liveHighLevelMatches, setLiveHighLevelMatches] = useState<Payload[]>([]);
    const [loadingMatches, setLoadingMatches] = useState(true);

    const [disableSync, setDisableSync] = useState(false);

    const [nicknameFilter, setNicknameFilter] = useState("");

    const effectRan = React.useRef(false);

    const [entityId, setEntityId] = useState<string | null>(null);

    useEffect(() => {
        if (effectRan.current) return;
        effectRan.current = true;

        const storedEntityId = localStorage.getItem("entityId");
        const entityId = storedEntityId ?? "73557c8e-4b67-4ac8-bae0-e910b49a5fa0";

        if (!storedEntityId) {
            localStorage.setItem("entityId", entityId);
        }

        setEntityId(entityId);

        userHasExtension().then((installed) => {
            setExtensionInstalled(installed);
        });

    }, []);

    useEffect(() => {
        if (!isExtensionInstalled || !isAuthenticated) {
            // ||  !user?.isSubscriber
            return;
        }

        if (entityId) {
            _fetchDataFromExtension(entityId);
            _handleFaceitSync();
        }
    }, [isExtensionInstalled, isAuthenticated, entityId]);

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
                    const matches = response.payload.filter(isHighLevelMatch);
                    setLiveHighLevelMatches(matches);
                    setLoadingMatches(false);

                    const everyActivePlayer: string[] = matches.flatMap((match) =>
                        Object.values(match.teams).flatMap((team) =>
                            team.roster.map((player: Roster) => player.id)
                        )
                    );
                    //sendBatchPlayerToWorkerQueue(everyActivePlayer);
                }
            }).catch(err => {
                console.error("Erro:", err);
                openNotification(tl(currentLanguage, 'notifications.error_loading_supermatches'), 'warning')
                setLoadingMatches(false);
            });
    }

    function syncSuperMatchesWFaceit() {
        setLoadingMatches(true);
        const entityId = localStorage.getItem("entityId");

        _handleFaceitSync();

        if (entityId) {
            _fetchDataFromExtension(entityId);
        }
    }

    function _handleFaceitSync() {
        setDisableSync(true);
        setTimeout(() => {
            setDisableSync(false);
            openNotification(tl(currentLanguage, 'notifications.sync_now'), 'info');
        }, 60_000);
    }

    function handleNicknameFilterChange(event: React.ChangeEvent<HTMLInputElement>) {
        setNicknameFilter(event.target.value);
    }

    const filteredSuperMatches = useMemo(() => {
        return liveHighLevelMatches.filter((match) => {
            return Object.values(match.teams).some((team) =>
                team.roster.some((player: Roster) =>
                    player.nickname.toLowerCase().includes(nicknameFilter.toLowerCase())
                )
            );
        });
    }, [liveHighLevelMatches, nicknameFilter]);

    const handleRegionChange = (id: String) => {
        const region = regions.find((region) => region.id == id);
        if (!region) {
            return;
        }

        setSelectedRegion(region);

        const currentEntityId = localStorage.getItem("entityId");
        if (currentEntityId === region.id) return;
        localStorage.setItem("entityId", region.id);

        try {
            syncSuperMatchesWFaceit();
        } catch (error) {
            console.error("Erro ao sincronizar com Faceit:", error);
        }
    }

    const regions = useMemo(() => [
        { id: "73557c8e-4b67-4ac8-bae0-e910b49a5fa0", name: tl(currentLanguage, "supermatch_region_southamerica") },
        { id: "3aced33b-f21c-450c-91d5-10535164e0ab", name: tl(currentLanguage, "supermatch_region_northamerica") },
        { id: "f4148ddd-bce8-41b8-9131-ee83afcdd6dd", name: tl(currentLanguage, "supermatch_region_europe") }
    ], [currentLanguage]);

    const [selectedRegion, setSelectedRegion] = useState(regions[0]);

    useEffect(() => {
        const storedEntityId = localStorage.getItem("entityId") ?? regions[0].id;
        const region = regions.find(r => r.id === storedEntityId) || regions[0];
        setSelectedRegion(region);
    }, [regions]);

    const handleMatchTypeChange = (id: String) => {
        const typeSelected = matchType.find((type) => type.id == id);
        if (!typeSelected) {
            return;
        }

        setSelectedMatchType(typeSelected);

        try {
            //syncSuperMatchesWFaceit();
        } catch (error) {
            console.error("Erro ao sincronizar com Faceit:", error);
        }
    }

    const matchType = useMemo(() => [
        { id: "all", name: tl(currentLanguage, "live_supermatches_page.match_type_all") },
        { id: "super", name: tl(currentLanguage, "live_supermatches_page.match_type_supermatch") }
    ], [currentLanguage]);

    const [selectedMatchType, setSelectedMatchType] = useState(matchType[0]);

    return (
        <>
            <main className="flex items-center justify-center pt-16 pb-4 play-regular flex-col">
                <section className="w-full">

                    {!isExtensionInstalled ? (
                        <div className="flex-1 flex flex-col items-center gap-9 min-h-0 pb-20">
                            <Flex direction="row" className="mt-5">
                                <Flex direction="column" align="center">
                                    <Text>
                                        {tl(currentLanguage, 'live_supermatches_page.extension_not_installed')}
                                    </Text>
                                    <Text>
                                        {tl(currentLanguage, 'live_supermatches_page.install_extension')}
                                    </Text>
                                    <InstallExtension />
                                    <Text>
                                        {tl(currentLanguage, 'live_supermatches_page.extension_enable')}
                                    </Text>
                                </Flex>
                            </Flex>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center gap-9 min-h-0 pb-20">

                            {!isAuthenticated ? (
                                <Flex direction="column" align="center">
                                    {tl(currentLanguage, 'live_supermatches_page.login_needed')}
                                    <Box className="p-3">
                                        <FaceitLogin />
                                    </Box>
                                </Flex>
                            ) : (
                                <>
                                    {/* { !user?.isSubscriber ? (
                                        <Box>
                                        </Box>
                                    ) : () } */}
                                    <>
                                        <Flex className="w-[90%]" direction="row" justify="end">
                                            <Button color="orange" variant="soft" onClick={syncSuperMatchesWFaceit} disabled={disableSync}>
                                                {loadingMatches ? tl(currentLanguage, 'live_supermatches_page.synchronizing') : tl(currentLanguage, 'live_supermatches_page.synchronize_w_faceit')}
                                                <div className={loadingMatches ? 'animate-spin' : ''}>
                                                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M1.84998 7.49998C1.84998 4.66458 4.05979 1.84998 7.49998 1.84998C10.2783 1.84998 11.6515 3.9064 12.2367 5H10.5C10.2239 5 10 5.22386 10 5.5C10 5.77614 10.2239 6 10.5 6H13.5C13.7761 6 14 5.77614 14 5.5V2.5C14 2.22386 13.7761 2 13.5 2C13.2239 2 13 2.22386 13 2.5V4.31318C12.2955 3.07126 10.6659 0.849976 7.49998 0.849976C3.43716 0.849976 0.849976 4.18537 0.849976 7.49998C0.849976 10.8146 3.43716 14.15 7.49998 14.15C9.44382 14.15 11.0622 13.3808 12.2145 12.2084C12.8315 11.5806 13.3133 10.839 13.6418 10.0407C13.7469 9.78536 13.6251 9.49315 13.3698 9.38806C13.1144 9.28296 12.8222 9.40478 12.7171 9.66014C12.4363 10.3425 12.0251 10.9745 11.5013 11.5074C10.5295 12.4963 9.16504 13.15 7.49998 13.15C4.05979 13.15 1.84998 10.3354 1.84998 7.49998Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                                                    </svg>
                                                </div>
                                            </Button>
                                        </Flex>

                                        {loadingMatches ? (
                                            <Loading />
                                        ) : (
                                            <>
                                                {liveHighLevelMatches.length > 0 && (
                                                    <Flex className="w-[50%]" direction="column" justify="center">
                                                        <Flex direction="row" className="w-[90%] gap-5 mb-5" align="center">
                                                            <Flex direction="column" align="start" className="w-[25%]">
                                                                <Box className="w-full">
                                                                    {tl(currentLanguage, 'live_supermatches_page.look_for_specific_region')}
                                                                    <Select.Root
                                                                        disabled={disableSync}
                                                                        value={selectedRegion.id}
                                                                        onValueChange={handleRegionChange}>
                                                                        <Select.Trigger style={{ "width": "100%", "marginTop": "0.75rem" }} variant="surface" id="region">
                                                                            <Flex align="center" gap="2">
                                                                                <Box>{selectedRegion.name}</Box>
                                                                            </Flex>
                                                                        </Select.Trigger>
                                                                        <Select.Content position="popper">
                                                                            {regions.map(region => (
                                                                                <Select.Item
                                                                                    key={region.id}
                                                                                    value={region.id}>
                                                                                    <Flex align="center" gap="2">
                                                                                        <Box>{region.name}</Box>
                                                                                    </Flex>
                                                                                </Select.Item>
                                                                            ))}
                                                                        </Select.Content>
                                                                    </Select.Root>
                                                                </Box>
                                                            </Flex>
                                                            {liveHighLevelMatches.length >= 4 && (
                                                                <Box className="w-[75%]">
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
                                                            <Flex direction="column" align="start" className="w-[25%]">
                                                                <Box className="w-full">
                                                                    {tl(currentLanguage, 'live_supermatches_page.match_type')}
                                                                    <Select.Root
                                                                        disabled={disableSync}
                                                                        value={selectedMatchType.id}
                                                                        onValueChange={handleMatchTypeChange}>
                                                                        <Select.Trigger style={{ "width": "100%", "marginTop": "0.75rem" }} variant="surface" id="region">
                                                                            <Flex align="center" gap="2">
                                                                                <Box>{selectedMatchType.name}</Box>
                                                                            </Flex>
                                                                        </Select.Trigger>
                                                                        <Select.Content position="popper">
                                                                            {matchType.map(type => (
                                                                                <Select.Item
                                                                                    key={type.id}
                                                                                    value={type.id}>
                                                                                    <Flex align="center" gap="2">
                                                                                        <Box>{type.name}</Box>
                                                                                    </Flex>
                                                                                </Select.Item>
                                                                            ))}
                                                                        </Select.Content>
                                                                    </Select.Root>
                                                                </Box>
                                                            </Flex>
                                                        </Flex>
                                                        <Flex direction="row" className="w-full pb-3" justify="center">
                                                            <Flex direction="column" align="center">
                                                                <GameStateBadges />
                                                                <Text size="1" color="gray" className="pt-3">{tl(currentLanguage, 'live_supermatches_page.hover_cards')}</Text>
                                                            </Flex>
                                                        </Flex>

                                                    </Flex>
                                                )}

                                                <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,500px))] max-w-lvw gap-4">
                                                    <Suspense fallback={<Loading />}>
                                                        {filteredSuperMatches.map((match) => (
                                                            <SuperMatchCard
                                                                key={match.id}
                                                                match={match}
                                                                svgs={svgs}
                                                                currentLanguage={currentLanguage}
                                                            />
                                                        ))}                                                    </Suspense>
                                                </div>
                                                {liveHighLevelMatches.length === 0 && (
                                                    <Box>{tl(currentLanguage, 'live_supermatches_page.nothing_here')}</Box>
                                                )}
                                            </>
                                        )}
                                    </>
                                </>
                            )}
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
    );
}