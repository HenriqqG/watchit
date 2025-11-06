import { Card, Box, Flex, Inset, Text, Avatar } from "@radix-ui/themes";

import { ElapsedTime } from "../../components/general-components/ElapsedTime";
import { tl, type Language } from "../../translations/translation";
import { ChartNoAxesColumnDecreasing, ChartNoAxesColumnIncreasing, CircleStar, Zap } from "lucide-react";

interface SuperMatchCardProps {
    match: any;
    svgs: Record<string, any>;
    currentLanguage: Language;
}

const renderPlayer = (player: any, svgs: Record<string, any>) => (
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
                        src={`${svgs[`./lvl${player.gameSkillLevel}.svg`]}`}
                    />
                </Flex>
            </Flex>
        </Box>
    </Flex>
);

export function SuperMatchCard({ match, svgs, currentLanguage }: SuperMatchCardProps) {

    const map_pick = match.voting?.map.entities.find((map: any) => map.game_map_id == match.voting?.map.pick[0]);

    const getBorderColor = (state: string) => {
        switch (state) {
            case "ONGOING": return "border-amber-600";
            case "READY": return "border-green-500";
            case "FINISHED": return "border-gray-700";
            default: return "border-yellow-300";
        }
    };

    const borderColor = getBorderColor(match.state);

    const getScore = (faction: 'faction1' | 'faction2') => match.results ? match.results[0].factions[faction].score : "0";
    const score1 = getScore('faction1');
    const score2 = getScore('faction2');
    const score1Color = match.results ? (score1 > score2 ? "text-green-400 font-bold" : (score1 < score2 ? "text-red-500 font-bold" : "")) : "";
    const score2Color = match.results ? (score2 > score1 ? "text-green-400 font-bold" : (score2 < score1 ? "text-red-500 font-bold" : "")) : "";
    const faction1Rating = match.teams.faction1?.stats?.rating || 0;
    const faction2Rating = match.teams.faction2?.stats?.rating || 0;
    const isSuper = match.tags.includes("super");
    const isPremium = match.tags.includes("premium");


    return (
        <Card className={`w-full min-h-[410px] border-2 bg-no-repeat bg-cover perspective-1000 overflow-hidden group ${borderColor}`}
            style={{ backgroundImage: `url(${map_pick?.image_lg})` }}>

            <Box className="relative w-full h-full transition-transform duration-700 transform-style-preserve-3d will-change-transform group-hover:rotate-y-180 cursor-pointer"
                onClick={() => window.open(`https://www.faceit.com/en/cs2/room/${match.id}`, "_blank")}>

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
                            <Flex direction="row" justify="center" align="center" className="w-full mt-1 ">
                                {isSuper ?
                                    (
                                        <Flex className="bg-[#121212] px-2 py-1 rounded-xl border-orange-700 border-1 gap-15">
                                            <Flex className="gap-3">
                                                <Text size="1" className="text-orange-500 play-regular">{faction1Rating}</Text>
                                                <ChartNoAxesColumnIncreasing size="15" className="text-orange-800" />
                                            </Flex>
                                            {isPremium ? (
                                                <Flex>
                                                    <CircleStar size="15" className="text-orange-500 mr-1"></CircleStar>
                                                    <Text size="1" className="text-orange-500 play-regular">Premium Super Match</Text>
                                                </Flex>
                                            ) : (
                                                <Flex>
                                                    <Zap size="15" className="text-orange-500 mr-1"></Zap>
                                                    <Text size="1" className="text-orange-500 play-regular">Super Match</Text>
                                                </Flex>
                                            )}
                                            <Flex className="gap-3">
                                                <ChartNoAxesColumnDecreasing size="15" className="text-orange-800" />
                                                <Text size="1" className="text-orange-500 play-regular">{faction2Rating}</Text>
                                            </Flex>
                                        </Flex>
                                    ) : (
                                        <Flex className="bg-[#121212] px-2 py-1 rounded-xl border-white border-1 gap-60">
                                            <Flex className="gap-3">
                                                <Text size="1" className="text-white play-regular">{faction1Rating}</Text>
                                                <ChartNoAxesColumnIncreasing size="15" className="text-white" />
                                            </Flex>
                                            <Flex className="gap-3">
                                                <ChartNoAxesColumnDecreasing size="15" className="text-white" />
                                                <Text size="1" className="text-white play-regular">{faction2Rating}</Text>
                                            </Flex>
                                        </Flex>
                                    )
                                }
                            </Flex>
                        </Inset>

                        <Flex direction="row" justify="between" className="p-1">
                            <Flex className="w-full" direction="column">
                                <Flex direction="row" justify="between" align='center'>
                                    <Text size="1" className="pr-2">{match.teams.faction1.name}</Text>

                                    <Avatar size="2" src={match.teams.faction1.avatar} radius="full" fallback="T" />
                                    <Text size="5" className={score1Color}>{score1}</Text>
                                </Flex>

                            </Flex>
                            <Text size="5" className="pl-4 pr-4">x</Text>
                            <Flex className="w-full" direction="column">
                                <Flex direction="row" justify="between" align='center'>
                                    <Text size="5" className={score2Color}>{score2}</Text>
                                    <Avatar size="2" src={match.teams.faction2.avatar} radius="full" loading="lazy" decoding="async" fallback="T" />

                                    <Text size="1" className="pr-2">{match.teams.faction2.name}</Text>
                                </Flex>
                            </Flex>
                        </Flex>

                        <Flex direction="row" justify="center">
                            <ElapsedTime startTime={match.startedAt || match.readyAt || match.configuredAt || match.createdAt} />
                        </Flex>


                        <Flex direction="row" justify="between" className="p-4">
                            {Object.entries(match.teams).map(([factionKey, team]: [string, any]) => {
                                const parties: Record<string, any[]> = team.roster.reduce(
                                    (acc: Record<string, any[]>, player: any) => {
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
                                                    {members.map((player) => renderPlayer(player, svgs))}
                                                </Box>
                                            ) : (
                                                renderPlayer(members[0], svgs)
                                            )
                                        )}
                                    </Flex>
                                );
                            })}
                        </Flex>
                    </Flex>
                </div>

                <div className={`absolute w-full h-full backface-hidden border-2 text-white rounded-lg flex items-center justify-center rotate-y-180 ${borderColor}`}>
                    <Text className="pr-3">{tl(currentLanguage, 'live_supermatches_page.open_faceit')}</Text>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 13C12.5523 13 13 12.5523 13 12V3C13 2.44771 12.5523 2 12 2H3C2.44771 2 2 2.44771 2 3V6.5C2 6.77614 2.22386 7 2.5 7C2.77614 7 3 6.77614 3 6.5V3H12V12H8.5C8.22386 12 8 12.2239 8 12.5C8 12.7761 8.22386 13 8.5 13H12ZM9 6.5C9 6.5001 9 6.50021 9 6.50031V6.50035V9.5C9 9.77614 8.77614 10 8.5 10C8.22386 10 8 9.77614 8 9.5V7.70711L2.85355 12.8536C2.65829 13.0488 2.34171 13.0488 2.14645 12.8536C1.95118 12.6583 1.95118 12.3417 2.14645 12.1464L7.29289 7H5.5C5.22386 7 5 6.77614 5 6.5C5 6.22386 5.22386 6 5.5 6H8.5C8.56779 6 8.63244 6.01349 8.69139 6.03794C8.74949 6.06198 8.80398 6.09744 8.85143 6.14433C8.94251 6.23434 8.9992 6.35909 8.99999 6.49708L8.99999 6.49738" fill="currentColor">
                        </path>
                    </svg>
                </div>
            </Box>
        </Card>
    );
}