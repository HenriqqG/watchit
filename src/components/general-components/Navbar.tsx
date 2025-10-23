import { Select, Flex, Box } from "@radix-ui/themes";
import { languages } from "../../translations/translation";
import { useLanguage } from '../../contexts/LanguageContext';

const getFlagUrl = (langId: string) => {
    let countryCode = langId.toUpperCase();
    if (langId === 'pt-br') countryCode = 'BR';
    if (langId === 'es') countryCode = 'AR';
    if (langId === 'en') countryCode = 'US';

    return `https://purecatamphetamine.github.io/country-flag-icons/3x2/${countryCode}.svg`;
};

const LanguageDisplay = ({ langId, name }: { langId: string, name: string }) => (
    <Flex align="center" gap="2">
        <img width="20"
            height="14"
            className="rounded-sm"
            src={getFlagUrl(langId)}
            alt={`Flag of ${name}`}/>
        <Box>{name}</Box>
    </Flex>
);

export function Navbar() {
    const { currentLanguage, handleLanguageChange } = useLanguage();

    return (
        <>
            <nav>
                <div className="mx-auto p-3 md:flex md:items-end md:justify-end">
                    <div className="w-[500px] max-w-[100vw] flex justify-end">
                        <Select.Root
                            value={currentLanguage.id}
                            onValueChange={handleLanguageChange}>
                            <Select.Trigger
                                className="min-w-[150px]">
                                <LanguageDisplay langId={currentLanguage.id} name={currentLanguage.name} />
                            </Select.Trigger>

                            <Select.Content>
                                {languages.map(lang => (
                                    <Select.Item
                                        key={lang.id}
                                        value={lang.id}>
                                        <LanguageDisplay langId={lang.id} name={lang.name} />
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Root>
                    </div>
                </div>
            </nav>
        </>
    );
}