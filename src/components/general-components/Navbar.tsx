import { Select, Flex, Box, Text, Card } from "@radix-ui/themes";
import { languages } from "../../translations/translation";
import { useLanguage } from '../../contexts/LanguageContext';
import FaceitLogin from "../../pages/login/FaceitLogin";
import { useAuthStore } from "../../store/AuthStore";
import { getFlagUrl } from "../../util/function_utils";
import Loading from "./Loading";

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

    const { user, loading } = useAuthStore();

    const UserSection = () => {
        if (loading) {
            return <Loading/>;
        }
        
        if (user) {
            return (
                <a href="/me">
                    <Card>
                        <Flex direction="row" align="center">
                            <img src={user.avatar} alt="Avatar" className="w-9 h-9 rounded-full mr-3" />
                            <Text size="1"><strong>{user.nickname}</strong></Text>
                        </Flex>
                    </Card>
                </a>
            );
        }

        return <FaceitLogin />;
    }

    return (
        <>
            <nav>
                <div className="mx-auto p-3 md:flex md:items-end md:justify-between">
                    <div className="w-full max-w-[100vw] flex justify-between">
                        <UserSection />
                        <Flex direction="column" align="center">
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
                        </Flex>
                    </div>
                </div>
            </nav>
        </>
    );
}