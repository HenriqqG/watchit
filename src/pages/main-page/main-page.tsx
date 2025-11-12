import { useState } from "react";
import { Helmet } from "react-helmet-async";

import { useLanguage } from "../../contexts/LanguageContext";
import { tl } from "../../translations/translation";

import { Tabs, Box, Flex } from "@radix-ui/themes";

import { WatchITMain } from "./watchit/watchit-main";
import { SuperMatchVisualizer } from "./supermatches-visualizer/supermatch-visualizer";
import AdSenseAd from "../../components/general-components/AdSenseAd";

export default function MainPage() {
    const { currentLanguage } = useLanguage();

    const [activeTab, setActiveTab] = useState("wit");

    return (
        <>
            <Helmet>
                {currentLanguage.id === "pt-br" ? (
                    <>
                        <title>WatchIT - Supermatches Ao Vivo e Lista de Bloqueios</title>
                        <meta name="description"
                            content="Explore as Supermatches em tempo real e gerencie melhor sua lista de bloqueios no WatchIT." />
                        <meta property="og:title" content="WatchIT - Supermatches Ao Vivo e Lista de Bloqueios" />
                        <meta property="og:description"
                            content="Acompanhe Supermatches ao vivo e controle sua lista de bloqueios de forma prática com o WatchIT." />
                        <meta property="og:image" content="https://watchit.gg/og-image.jpg" />
                        <meta property="og:url" content="https://watchit.gg/watch" />
                        <meta name="twitter:card" content="summary_large_image" />
                    </>
                ) : (
                    <>
                        <title>WatchIT - Live Supermatches & Your Block List</title>
                        <meta name="description"
                            content="Explore real-time Supermatch visualizations and your WatchIT List for better block management." />
                        <meta property="og:title" content="WatchIT - Live Supermatches & your Block List" />
                        <meta property="og:description"
                            content="Explore real-time Supermatch visualizations and your WatchIT List for better block management." />
                        <meta property="og:image" content="https://watchit.gg/og-image.jpg" />
                        <meta property="og:url" content="https://watchit.gg/watch" />
                        <meta name="twitter:card" content="summary_large_image" />
                    </>
                )}
            </Helmet>
            {/* <Flex className="w-full" style={{ justifyContent: 'center' }}>
                <Box className="w-[970px] h-[90px] justify-center py-2 border-1 rounded-xs border-orange-700 bg-gray-900">
                    <p>970x90px - Banner Topo</p>
                    <AdSenseAd
                        slot="5045915910"
                        format="auto"
                        style={{ width: '100%', height: '90px' }}/>
                </Box>
            </Flex> */}
            <Tabs.Root defaultValue="wit" value={activeTab} onValueChange={setActiveTab}>
                <Tabs.List justify="center" color="orange" style={{ boxShadow: "none" }}>
                    <Tabs.Trigger value="wit" onMouseOver={(e) => e.currentTarget.style.cursor = "pointer"}><p className="play-regular">{tl(currentLanguage, 'tabs.watchit_main_page')}</p></Tabs.Trigger>
                    <Tabs.Trigger value="sml" onMouseOver={(e) => e.currentTarget.style.cursor = "pointer"}><p className="play-regular">{tl(currentLanguage, 'tabs.live_supermatches_page')}</p></Tabs.Trigger>
                </Tabs.List>
                <Box>
                    <Tabs.Content value="wit">
                        <WatchITMain></WatchITMain>
                    </Tabs.Content>
                    <Tabs.Content value="sml">
                        <SuperMatchVisualizer></SuperMatchVisualizer>
                    </Tabs.Content>
                </Box>
            </Tabs.Root>
        </>
    )
}