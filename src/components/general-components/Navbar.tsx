import { Select, Flex, Box, Text } from "@radix-ui/themes";
import { languages } from "../../translations/translation";
import { useLanguage } from '../../contexts/LanguageContext';
import FaceitLogin from "../../pages/login/FaceitLogin";
import { useAuthStore } from "../../store/AuthStore";

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
            alt={`Flag of ${name}`} />
        <Box>{name}</Box>
    </Flex>
);

export function Navbar() {
    const { currentLanguage, handleLanguageChange } = useLanguage();

    const { user } = useAuthStore();

    return (
        <>
            <nav>
                <div className="mx-auto p-3 md:flex md:items-end md:justify-between">
                    <div className="w-full max-w-[100vw] flex justify-between">
                        {!user && (
                            <FaceitLogin></FaceitLogin>
                        )}
                        {user && (
                            <a href="http://localhost:5173/me">
                                <Flex direction="row" align="center">
                                    <img src="https://static.wikia.nocookie.net/brawlhalla_gamepedia/images/7/78/Avatar_Offline.png/revision/latest?cb=20230714142035" alt="Avatar" className="w-11 h-11 rounded-full mr-3" />
                                    <Text size="2"><strong>ImSkullz</strong></Text>
                                </Flex>
                            </a>
                        )}
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