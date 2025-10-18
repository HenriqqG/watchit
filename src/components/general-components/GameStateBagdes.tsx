import { Flex, Badge } from "@radix-ui/themes";
import { tl } from "../../translations/translation";
import { useLanguage } from "../../contexts/LanguageContext";

export function GameStateBadges() {
    const { currentLanguage } = useLanguage();
    
    return (
        <Flex gap="2" justify="end">
            <Badge color="orange">{tl(currentLanguage, 'badges.on_going')}</Badge>
            <Badge color="green">{tl(currentLanguage, 'badges.ready')}</Badge>
            <Badge color="yellow">{tl(currentLanguage, 'badges.configuring')}</Badge>
        </Flex>
    )
}