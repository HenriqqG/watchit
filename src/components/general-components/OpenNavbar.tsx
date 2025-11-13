import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Text } from "@radix-ui/themes";
import { Menu, X } from "lucide-react";

import { tl } from "../../translations/translation";

import { AnimatePresence, motion } from "framer-motion";
import watchItIcon from "../../assets/watchitIcon.webp";
import { useLanguage } from "../../contexts/LanguageContext";
import { InstallExtension } from "./InstallExtensionButton";

export function OpenNavbar() {

    const { currentLanguage } = useLanguage();

    const navigator = useNavigate();

    const redirectToPage = (redirectTo: string) => {
        const newUrl = `/${currentLanguage.id}${redirectTo}`
        navigator(newUrl, { replace: true })
    }

    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <nav >
                <div className="mx-auto p-3 md:flex md:items-start md:justify-between px-8 py-6">
                    <div onClick={() => redirectToPage("/")} className="flex items-center justify-between">
                        <img src={watchItIcon} className="h-17 opacity-90 cursor-pointer" alt="WatchIt - go to home page"/>
                        <button
                            className="text-gray-300 hover:text-white focus:outline-none lg:hidden"
                            onClick={() => setMenuOpen(!menuOpen)}>
                            {menuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>

                    <div className="hidden lg:grid grid-cols-5 gap-1 items-center">
                        <Box className="hover:underline decoration-orange-300 hover:text-orange-300 min-w-[50px] max-w-[100px] cursor-pointer"
                            onClick={() => redirectToPage(`/about`)}>
                            <Text>{tl(currentLanguage, "landing.about")}</Text>
                        </Box>
                        <Box className="hover:underline decoration-orange-300 hover:text-orange-300 min-w-[50px] max-w-[100px] cursor-pointer"
                            onClick={() => redirectToPage("/contact")}>
                            <Text>{tl(currentLanguage, "landing.contact")}</Text>
                        </Box>
                        <Box className="hover:underline decoration-orange-300 hover:text-orange-300 min-w-[50px] max-w-[100px] cursor-pointer"
                            onClick={() => redirectToPage("/donate")}>
                            <Text>{tl(currentLanguage, "landing.donations")}</Text>
                        </Box>
                        <Box className="hover:underline decoration-orange-300 hover:text-orange-300 min-w-[10px] max-w-[150px] cursor-pointer"
                            onClick={() => redirectToPage("/privacypolicy")}>
                            <Text>{tl(currentLanguage, "landing.priv_policy")}</Text>
                        </Box>
                        <InstallExtension />
                    </div>
                </div>

                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            key="mobile-menu"
                            className="lg:hidden py-3 px-6 space-y-3 bg-[#0a0a0a]"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}>
                            <Box
                                className="block hover:underline decoration-orange-300 hover:text-orange-300 cursor-pointer"
                                onClick={() => {
                                    redirectToPage("/about");
                                    setMenuOpen(false);
                                }}>
                                <Text>{tl(currentLanguage, "landing.about")}</Text>
                            </Box>
                            <Box
                                className="block hover:underline decoration-orange-300 hover:text-orange-300 cursor-pointer"
                                onClick={() => {
                                    redirectToPage("/contact");
                                    setMenuOpen(false);
                                }}>
                                <Text>{tl(currentLanguage, "landing.contact")}</Text>
                            </Box>
                            <Box
                                className="block hover:underline decoration-orange-300 hover:text-orange-300 cursor-pointer"
                                onClick={() => {
                                    redirectToPage("/donate");
                                    setMenuOpen(false);
                                }}>
                                <Text>{tl(currentLanguage, "landing.donations")}</Text>
                            </Box>
                            <Box
                                className="block hover:underline decoration-orange-300 hover:text-orange-300 cursor-pointer"
                                onClick={() => {
                                    redirectToPage("/privacypolicy");
                                    setMenuOpen(false);
                                }}>
                                <Text>{tl(currentLanguage, "landing.priv_policy")}</Text>
                            </Box>
                            <div className="pt-2 border-t border-white text-sm text-orange-300 cursor-pointer">
                                <InstallExtension />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </>
    );
}