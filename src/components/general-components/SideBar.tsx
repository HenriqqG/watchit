import React from "react";
import { motion } from "framer-motion";
import { Badge, Box, Flex, Text } from "@radix-ui/themes"
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/AuthStore";
import { useLanguage } from "../../contexts/LanguageContext";
import { tl } from "../../translations/translation";

interface SidebarProps {
    open: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {

    const { currentLanguage } = useLanguage();

    const navigate = useNavigate();

    const handleNavigation = (href: string) => {
        navigate(href, { replace: true })
        onClose();
    };

    const { user, loading, logout } = useAuthStore();

    const handleLogout = async () => {
        await logout();
        navigate("/watch", { replace: true });
        onClose();
    };


    return (
        <motion.aside
            className="h-full w-64 p-5 mt-[20%]"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: open ? 350 : 0, opacity: open ? 1 : 0 }}
            transition={{ duration: 0.3 }}>
            {open && (
                <>
                    <div className="flex flex-col justify-between h-[83%] xl:h-[93%]">
                        <nav className="flex flex-col gap-6 play-regular pt-10">
                            <Box className="hover:text-orange-300 transition cursor-pointer" onClick={() => handleNavigation("/watch")}>
                                <Flex direction="row" className="w-full items-center" justify="between">
                                    <Box className="flex flex-col items-start">
                                        <svg width="22" height="22" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M14 12.85L1 12.85L1 14.15L14 14.15L14 12.85ZM14 8.85002L1 8.85002L1 10.15L14 10.15L14 8.85002ZM1 4.85003L14 4.85003L14 6.15003L1 6.15002L1 4.85003ZM14 0.850025L1 0.850025L1 2.15002L14 2.15002L14 0.850025Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
                                            </path>
                                        </svg>
                                    </Box>
                                    <Text size="5">{tl(currentLanguage, 'sidebar.main_page')}</Text>
                                </Flex>
                            </Box>
                            <Box className="hover:text-orange-300 transition cursor-pointer" onClick={() => handleNavigation("/me")}>
                                <Flex direction="row" className="w-full items-center" justify="between">
                                    <Box className="flex flex-col items-start">
                                        <svg width="22" height="22" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M14 11.0001V4.00006L1 4.00006L1 11.0001H14ZM15 4.00006V11.0001C15 11.5523 14.5523 12.0001 14 12.0001H1C0.447715 12.0001 0 11.5523 0 11.0001V4.00006C0 3.44778 0.447715 3.00006 1 3.00006H14C14.5523 3.00006 15 3.44778 15 4.00006ZM2 5.25C2 5.11193 2.11193 5 2.25 5H5.75C5.88807 5 6 5.11193 6 5.25V9.75C6 9.88807 5.88807 10 5.75 10H2.25C2.11193 10 2 9.88807 2 9.75V5.25ZM7.5 7C7.22386 7 7 7.22386 7 7.5C7 7.77614 7.22386 8 7.5 8H10.5C10.7761 8 11 7.77614 11 7.5C11 7.22386 10.7761 7 10.5 7H7.5ZM7 9.5C7 9.22386 7.22386 9 7.5 9H12.5C12.7761 9 13 9.22386 13 9.5C13 9.77614 12.7761 10 12.5 10H7.5C7.22386 10 7 9.77614 7 9.5ZM7.5 5C7.22386 5 7 5.22386 7 5.5C7 5.77614 7.22386 6 7.5 6H11.5C11.7761 6 12 5.77614 12 5.5C12 5.22386 11.7761 5 11.5 5H7.5Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
                                            </path>
                                        </svg>
                                    </Box>
                                    <Text size="5">{tl(currentLanguage, 'sidebar.profile')}</Text>
                                </Flex>
                            </Box>
                            <Box className="hover:text-orange-300 transition cursor-pointer">
                                <Flex direction="row" className="w-full items-center" justify="between">
                                    <Box className="flex flex-col items-start">
                                        <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>
                                    </Box>
                                    <Badge size="1" color="indigo">{tl(currentLanguage, 'sidebar.duo.soon')}</Badge>
                                    <Text size="5">{tl(currentLanguage, 'sidebar.duo')}</Text>
                                </Flex>
                            </Box>
                        </nav>
                        {user && !loading && (
                            <Box className="hover:text-red-300 transition cursor-pointer" onClick={() => handleLogout()}>
                                <Flex direction="row" className="w-full items-center" justify="between">
                                    <Box className="flex flex-col items-start">
                                        <svg width="22" height="22" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3 1C2.44771 1 2 1.44772 2 2V13C2 13.5523 2.44772 14 3 14H10.5C10.7761 14 11 13.7761 11 13.5C11 13.2239 10.7761 13 10.5 13H3V2L10.5 2C10.7761 2 11 1.77614 11 1.5C11 1.22386 10.7761 1 10.5 1H3ZM12.6036 4.89645C12.4083 4.70118 12.0917 4.70118 11.8964 4.89645C11.7012 5.09171 11.7012 5.40829 11.8964 5.60355L13.2929 7H6.5C6.22386 7 6 7.22386 6 7.5C6 7.77614 6.22386 8 6.5 8H13.2929L11.8964 9.39645C11.7012 9.59171 11.7012 9.90829 11.8964 10.1036C12.0917 10.2988 12.4083 10.2988 12.6036 10.1036L14.8536 7.85355C15.0488 7.65829 15.0488 7.34171 14.8536 7.14645L12.6036 4.89645Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
                                            </path>
                                        </svg>
                                    </Box>
                                    <Text size="5">{tl(currentLanguage, 'sidebar.logoff')}</Text>
                                </Flex>
                            </Box>
                        )}
                    </div>
                </>
            )}
        </motion.aside>
    );
};

export default Sidebar;
