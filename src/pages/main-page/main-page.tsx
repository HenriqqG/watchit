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
        <Tabs.Root defaultValue="wit" value={activeTab} onValueChange={setActiveTab}>
                <Tabs.List justify="center" color="orange" style={{boxShadow: "none"}}>
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