import { useState } from "react";
import { Tabs, Box } from "@radix-ui/themes";
import { WatchITMain } from "./watchit/watchit-main";
import { SuperMatchVisualizer } from "./supermatches-visualizer/supermatch-visualizer";
import { useLanguage } from "../../contexts/LanguageContext";
import { tl } from "../../translations/translation";

export default function MainPage() {
    const { currentLanguage } = useLanguage();

    const [activeTab, setActiveTab] = useState("wit");

    return (
        <>
            {/* <Flex className="w-full" style={{justifyContent: 'center'}}>
                <Box className="w-[970px] h-[90px] justify-center py-2 border-1 rounded-xs border-orange-700 bg-gray-900">
                    970x90px - Banner Topo
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