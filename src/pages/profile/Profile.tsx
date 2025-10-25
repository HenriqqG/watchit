import { Box, Flex, Table } from "@radix-ui/themes";
import Loading from "../../components/general-components/Loading";
import { useAuthStore } from "../../store/AuthStore";
import { useLanguage } from "../../contexts/LanguageContext";
import { tl } from "../../translations/translation";
import { useNavigate } from "react-router-dom";

export function Profile() {
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

    return (
        <main className="flex items-center justify-center pt-16 pb-4 play-regular flex-col">
            <section className="w-full">
                <div className="flex-1 flex flex-col items-center gap-16 min-h-0 pb-20">
                    <h1 className="text-2xl font-bold mb-4">{user?.nickname}</h1>
                    <img src={user.avatar} alt="Avatar" className="w-32 h-32 rounded-full mb-4" />
                    <Flex direction="column" align="start">
                        <p><strong>{tl(currentLanguage, 'profile_page.name')}:</strong> {user?.given_name} </p>
                        <p><strong>{tl(currentLanguage, 'profile_page.last_name')}:</strong> {user?.family_name} </p>
                        <p><strong>E-mail:</strong> {user?.email} </p>
                    </Flex>
                    <Box className="p-2 w-[50%]">
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
                    </Table.Root>
                    </Box>
                    <button className="mt-6 px-4 py-2 bg-red-600 rounded hover:bg-red-700 flex"
                        onClick={handleLogout}>
                        {tl(currentLanguage, 'logout')}
                        <Box className="pt-1 pl-2">
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 1C2.44771 1 2 1.44772 2 2V13C2 13.5523 2.44772 14 3 14H10.5C10.7761 14 11 13.7761 11 13.5C11 13.2239 10.7761 13 10.5 13H3V2L10.5 2C10.7761 2 11 1.77614 11 1.5C11 1.22386 10.7761 1 10.5 1H3ZM12.6036 4.89645C12.4083 4.70118 12.0917 4.70118 11.8964 4.89645C11.7012 5.09171 11.7012 5.40829 11.8964 5.60355L13.2929 7H6.5C6.22386 7 6 7.22386 6 7.5C6 7.77614 6.22386 8 6.5 8H13.2929L11.8964 9.39645C11.7012 9.59171 11.7012 9.90829 11.8964 10.1036C12.0917 10.2988 12.4083 10.2988 12.6036 10.1036L14.8536 7.85355C15.0488 7.65829 15.0488 7.34171 14.8536 7.14645L12.6036 4.89645Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
                                </path>
                            </svg>
                        </Box>
                    </button>
                </div>
            </section>
        </main>
    );
}