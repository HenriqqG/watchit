import { Box, Flex, Select } from "@radix-ui/themes";
import { languages } from "../../translations/translation";
import { useLanguage } from "../../contexts/LanguageContext";


const LanguageDisplay = ({ name }: {name: string }) => (
    <Flex align="center" gap="2">
        <Box>{name}</Box>
    </Flex>
);

export function SelectLanguage() {
    const { currentLanguage, handleLanguageChange } = useLanguage();

    return (
        <div className="fixed bottom-5 right-6 z-[50] w-96 max-w-[90vw] flex justify-end">
            <Select.Root
                value={currentLanguage.id}
                onValueChange={handleLanguageChange}>
                <Select.Trigger
                    className="min-w-[150px]">
                    <LanguageDisplay name={currentLanguage.name} />
                </Select.Trigger>

                <Select.Content>
                    {languages.map(lang => (
                        <Select.Item
                            key={lang.id}
                            value={lang.id}>
                            <LanguageDisplay name={lang.name} />
                        </Select.Item>
                    ))}
                </Select.Content>
            </Select.Root>
        </div>
    )
}