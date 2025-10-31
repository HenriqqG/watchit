import { Box, Button, Card, Flex, Table, Tabs } from "@radix-ui/themes";
import Loading from "../../components/general-components/Loading";
import { useAuthStore } from "../../store/AuthStore";
import { useLanguage } from "../../contexts/LanguageContext";
import { tl } from "../../translations/translation";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Profile() {
    const { currentLanguage } = useLanguage();

    const { user, loading, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/watch", { replace: true });
    };

    if (loading || !user) {
        return (
            <main className="flex items-center justify-center pt-16 pb-4 play-regular flex-col">
                <section className="w-full">
                    <div className="flex-1 flex flex-col items-center gap-16 min-h-0 pb-20">
                        <Loading></Loading>
                    </div>
                </section>
            </main>
        )
    }

    const [isHidden, setisHidden] = useState(true);

    const showTabsContent = () => {
        setisHidden(!isHidden);
    }

    function IconAccDetails() {
        if (isHidden) {
            return (<>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.7649 6.07596C14.9991 6.22231 15.0703 6.53079 14.9239 6.76495C14.4849 7.46743 13.9632 8.10645 13.3702 8.66305L14.5712 9.86406C14.7664 10.0593 14.7664 10.3759 14.5712 10.5712C14.3759 10.7664 14.0593 10.7664 13.8641 10.5712L12.6011 9.30817C11.805 9.90283 10.9089 10.3621 9.93375 10.651L10.383 12.3277C10.4544 12.5944 10.2961 12.8685 10.0294 12.94C9.76267 13.0115 9.4885 12.8532 9.41704 12.5865L8.95917 10.8775C8.48743 10.958 8.00036 10.9999 7.50001 10.9999C6.99965 10.9999 6.51257 10.958 6.04082 10.8775L5.58299 12.5864C5.51153 12.8532 5.23737 13.0115 4.97064 12.94C4.7039 12.8686 4.5456 12.5944 4.61706 12.3277L5.06625 10.651C4.09111 10.3621 3.19503 9.90282 2.3989 9.30815L1.1359 10.5712C0.940638 10.7664 0.624058 10.7664 0.428798 10.5712C0.233537 10.3759 0.233537 10.0593 0.428798 9.86405L1.62982 8.66303C1.03682 8.10643 0.515113 7.46742 0.0760677 6.76495C-0.0702867 6.53079 0.000898544 6.22231 0.235065 6.07596C0.469231 5.9296 0.777703 6.00079 0.924058 6.23496C1.40354 7.00213 1.989 7.68057 2.66233 8.2427C2.67315 8.25096 2.6837 8.25972 2.69397 8.26898C4.00897 9.35527 5.65537 9.99991 7.50001 9.99991C10.3078 9.99991 12.6564 8.5063 14.076 6.23495C14.2223 6.00079 14.5308 5.9296 14.7649 6.07596Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
                    </path>
                </svg>
            </>)
        } else {
            return (<>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.5 11C4.80285 11 2.52952 9.62184 1.09622 7.50001C2.52952 5.37816 4.80285 4 7.5 4C10.1971 4 12.4705 5.37816 13.9038 7.50001C12.4705 9.62183 10.1971 11 7.5 11ZM7.5 3C4.30786 3 1.65639 4.70638 0.0760002 7.23501C-0.0253338 7.39715 -0.0253334 7.60288 0.0760014 7.76501C1.65639 10.2936 4.30786 12 7.5 12C10.6921 12 13.3436 10.2936 14.924 7.76501C15.0253 7.60288 15.0253 7.39715 14.924 7.23501C13.3436 4.70638 10.6921 3 7.5 3ZM7.5 9.5C8.60457 9.5 9.5 8.60457 9.5 7.5C9.5 6.39543 8.60457 5.5 7.5 5.5C6.39543 5.5 5.5 6.39543 5.5 7.5C5.5 8.60457 6.39543 9.5 7.5 9.5Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
                    </path>
                </svg>
            </>)
        }
    }

    return (
        <main className="flex items-center justify-center pt-16 pb-4 play-regular flex-col">
            <section className="w-full">
                <div className="flex-1 flex flex-col items-center gap-16 min-h-0 pb-20">
                    <Card>
                        <div className="grid grid-cols-1 gap-10 p-5">
                            <Flex direction="row" justify="center">
                                <Box className="mr-3">
                                    <h1 className="text-2xl font-bold mb-4 flex flex-col items-center">{user?.nickname}</h1>
                                </Box>
                                <Box>
                                    <Button size="2" variant="outline" color="red" className="rounded hover:bg-red-700"
                                        onClick={handleLogout}>
                                        <Box className="">
                                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M3 1C2.44771 1 2 1.44772 2 2V13C2 13.5523 2.44772 14 3 14H10.5C10.7761 14 11 13.7761 11 13.5C11 13.2239 10.7761 13 10.5 13H3V2L10.5 2C10.7761 2 11 1.77614 11 1.5C11 1.22386 10.7761 1 10.5 1H3ZM12.6036 4.89645C12.4083 4.70118 12.0917 4.70118 11.8964 4.89645C11.7012 5.09171 11.7012 5.40829 11.8964 5.60355L13.2929 7H6.5C6.22386 7 6 7.22386 6 7.5C6 7.77614 6.22386 8 6.5 8H13.2929L11.8964 9.39645C11.7012 9.59171 11.7012 9.90829 11.8964 10.1036C12.0917 10.2988 12.4083 10.2988 12.6036 10.1036L14.8536 7.85355C15.0488 7.65829 15.0488 7.34171 14.8536 7.14645L12.6036 4.89645Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
                                                </path>
                                            </svg>
                                        </Box>
                                    </Button>
                                </Box>
                            </Flex>
                            <Box>
                                <img src={user.avatar} alt="Avatar" className="w-42 h-42 rounded-full mb-4" />
                            </Box>

                        </div>

                    </Card>
                </div>
            </section>
            <section className="w-full">
                <div className="flex-1 flex flex-col items-center pb-20">
                    <Tabs.Root defaultValue="accDet" className="w-[50%]">
                        <Tabs.List justify="center" color="orange"  >
                            <Tabs.Trigger value="accDet"><p className="play-regular">{tl(currentLanguage, "profile_page.account_details")}</p></Tabs.Trigger>
                            <div className="cursor-pointer" onClick={() => showTabsContent()}>
                                <IconAccDetails />
                            </div>
                            <Tabs.Trigger value="History"><p className="play-regular">{tl(currentLanguage, "profile_page.payment_history")}</p></Tabs.Trigger>
                        </Tabs.List>


                        <Tabs.Content value="accDet">
                            <div className={isHidden ? 'hidden' : ''}>
                                <Box className="p-2 w-full">
                                    <Flex direction="column" align="center">
                                        <Box className="items-center">
                                            <p className="p-2"><strong>{tl(currentLanguage, 'profile_page.name')}:</strong> {user?.given_name} </p>
                                            <p className="p-2"><strong>{tl(currentLanguage, 'profile_page.last_name')}:</strong> {user?.family_name} </p>
                                            <p className="p-2"><strong>E-mail:</strong> {user?.email} </p>
                                        </Box>
                                    </Flex>
                                </Box>
                            </div>
                        </Tabs.Content>
                        <Tabs.Content value="History">
                            <Box className="p-2 w-full">
                                <p className="pb-3"><strong>{tl(currentLanguage, 'profile_page.last_payments')}</strong></p>
                                <Table.Root variant="surface">
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.ColumnHeaderCell>{tl(currentLanguage, 'profile_page.last_payments.payment_id')}</Table.ColumnHeaderCell>
                                            <Table.ColumnHeaderCell>{tl(currentLanguage, 'profile_page.last_payments.payment_date')}</Table.ColumnHeaderCell>
                                            <Table.ColumnHeaderCell>{tl(currentLanguage, 'profile_page.last_payments.payment_value')}</Table.ColumnHeaderCell>
                                            <Table.ColumnHeaderCell>{tl(currentLanguage, 'profile_page.last_payments.payment_next_billing')}</Table.ColumnHeaderCell>
                                        </Table.Row>
                                    </Table.Header>

                                    <Table.Body>
                                        <Table.Row>
                                            <Table.RowHeaderCell></Table.RowHeaderCell>
                                        </Table.Row>
                                    </Table.Body>
                                    {/* <Table.Body>
                                        {.map((d, i) => (
                                            <Table.Row key={i}>
                                                <Table.Cell>{d.name}</Table.Cell>
                                                <Table.Cell>{d.value}</Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body> */}
                                </Table.Root>
                            </Box>
                        </Tabs.Content>
                    </Tabs.Root>


                </div>
                {/*  */}
            </section>
        </main>
    );
}