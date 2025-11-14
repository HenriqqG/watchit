import { useNavigate } from "react-router-dom";
import { Flex, Text, Card } from "@radix-ui/themes";
import { motion, AnimatePresence } from "framer-motion";

import { useLanguage } from "../../contexts/LanguageContext";
import { useAuthStore } from "../../store/AuthStore";

import FaceitLogin from "../../pages/login/FaceitLogin";

import watchItIcon from "../../assets/watchItIcon.webp";
import watchItLogo from "../../assets/watchItLogo.webp";
import Loading from "./Loading";
import SideBar from "./SideBar";

interface NavbarProps {
    open: boolean;
    setOpen: (value: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ open, setOpen }) => {

    const { user, loading } = useAuthStore();
    const { currentLanguage } = useLanguage();

    const navigator = useNavigate();

    const redirectToPage = (redirectTo: string) => {
        const newUrl = `/${currentLanguage.id}${redirectTo}`
        navigator(newUrl, { replace: true })
    }

    const UserSection = () => {
        if (loading) {
            return <Loading />;
        }

        if (user) {
            return (
                <motion.button initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }} className={`${open ? 'hidden' : 'w-[60%] flex justify-end'}`}>
                    <Card onClick={() => redirectToPage("/me")}>
                            <Flex direction="row" align="center">
                                <img src={user.avatar} alt="Avatar" className="w-9 h-9 rounded-full mr-3" />
                                <Text size="1"><strong>{user.nickname}</strong></Text>
                            </Flex>
                        </Card>
                </motion.button>

            );
        }

        if (!open) {
            return <motion.button initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }} className={`${open ? 'hidden' : 'w-[60%] flex justify-end'}`}>
                <FaceitLogin />
            </motion.button>
        }

        return;
    }

    return (
        <>
            <nav className="w-full flex items-center justify-between px-8 py-6 z-50">
                <motion.button onClick={() => setOpen(!open)}
                    className="flex items-center focus:outline-none select-none gap-5"
                    layout>
                    <AnimatePresence mode="wait">
                        {open ? (
                            <motion.img
                                key="logo"
                                src={watchItLogo}
                                alt="WatchIT logo"
                                className="h-17 cursor-pointer drop-shadow-[0_0_25px_rgba(255,150,0,0.3)]"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.3 }} />
                        ) : (
                            <motion.img
                                key="icon"
                                src={watchItIcon}
                                alt="WatchIT icon"
                                className="h-17 cursor-pointer drop-shadow-[0_0_25px_rgba(255,150,0,0.8)]"
                                whileHover={{ scale: 1.2 }}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.3 }} />
                        )}
                    </AnimatePresence>
                </motion.button>
                <UserSection />
            </nav>
            <AnimatePresence>
                {open && (
                    <motion.div
                        key="overlay"
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 flex"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setOpen(false)}>
                        <motion.div
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            onClick={(e) => e.stopPropagation()}>
                            <SideBar open={open} onClose={() => setOpen(false)} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}