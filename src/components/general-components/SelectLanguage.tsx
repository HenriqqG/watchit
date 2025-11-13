import { Box, Flex, Select } from "@radix-ui/themes";
import { languages } from "../../translations/translation";
import { useLanguage } from "../../contexts/LanguageContext";

const LanguageDisplay = ({ name }: { name: string }) => (
    <Flex align="center" gap="2">
        <Box>{name}</Box>
    </Flex>
);

export function SelectLanguage() {
    const { currentLanguage, handleLanguageChange } = useLanguage();

    return (
        <div className="fixed bottom-6 right-6 z-[50] flex justify-end">
            <Select.Root
                value={currentLanguage.id}
                onValueChange={handleLanguageChange}
            >
                <Select.Trigger
                    className="min-w-[150px] cursor-pointer shadow-lg bg-[#181818] border border-[#2a2a2a]"
                    aria-label="Select language"
                >
                    <LanguageDisplay name={currentLanguage.name} />
                </Select.Trigger>
                <Select.Content position="popper" sideOffset={5}>
                    {languages.map(lang => (
                        <Select.Item
                            key={lang.id}
                            value={lang.id}
                            className="cursor-pointer hover:bg-orange-500/10">
                            <LanguageDisplay name={lang.name} />
                        </Select.Item>
                    ))}
                </Select.Content>
            </Select.Root>
        </div>
    );
}