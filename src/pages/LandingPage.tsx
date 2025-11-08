import watchItLogo from "../assets/watchitlogo.png";
import { tl } from "../translations/translation";
import { useLanguage } from "../contexts/LanguageContext";
import { Badge, Button } from "@radix-ui/themes";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import capture1 from "../assets/capture1.jpg";
import capture2 from "../assets/capture2.jpg";
import "swiper/css";
import "swiper/css/pagination";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { TextSearch, ScanEye, Globe, Users } from "lucide-react";

export default function LandingPage() {
    const { currentLanguage } = useLanguage();
    const navigate = useNavigate();

    const handleNavigation = () => navigate("/watch", { replace: true });

    const features = [
        {
            icon: <TextSearch className="w-10 h-10 text-orange-400" />,
            title: tl(currentLanguage, "landing.feature1_title"),
            desc: tl(currentLanguage, "landing.feature1_desc"),
        },
        {
            icon: <ScanEye className="w-10 h-10 text-orange-400" />,
            title: tl(currentLanguage, "landing.feature2_title"),
            desc: tl(currentLanguage, "landing.feature2_desc"),
        },
        {
            icon: <Globe className="w-10 h-10 text-orange-400" />,
            title: tl(currentLanguage, "landing.feature3_title"),
            desc: tl(currentLanguage, "landing.feature3_desc"),
        },
        {
            icon: <Users className="w-10 h-10 text-orange-400" />,
            title: tl(currentLanguage, "landing.feature4_title"),
            desc: tl(currentLanguage, "landing.feature4_desc"),
        },
    ];

    return (
        <main className="w-full min-h-screen flex flex-col items-center py-10">
            <motion.section
                className="flex flex-col items-center text-center px-6 max-w-3xl"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}>
                <motion.img
                    src={watchItLogo}
                    alt="WatchIt logo"
                    className="h-25 lg:h-32 opacity-90 drop-shadow-[0_0_25px_rgba(255,150,0,0.3)]"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }} />
                <p className="text-lg md:text-xl text-gray-400 mt-6 max-w-xl leading-relaxed">
                    {tl(currentLanguage, "header.tagline")}
                </p>
            </motion.section>

            <motion.section
                className="mt-20 px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.15 } },
                }}>
                {features.map((f, i) => (
                    <motion.div
                        key={i}
                        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 120 }}
                        className="p-6 bg-[#181818] rounded-2xl border border-[#2a2a2a] shadow-lg hover:shadow-[0_0_30px_rgba(255,150,0,0.15)] transition-all duration-300">
                        <div className="flex flex-col items-center text-center space-y-4">
                            {f.icon}
                            <h3 className="text-xl font-semibold">{f.title}</h3>
                            {i == 3 && (
                                <Badge size="1" color="teal">{tl(currentLanguage, 'landing.feature_desc.soon')}</Badge>
                            )}
                            {i == 2 && (
                                <Badge size="1" color="gold">{tl(currentLanguage, 'landing.feature_desc.extension_needed')}</Badge>
                            )}
                            <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </motion.section>

            <motion.section
                className="mt-10 px-6 w-full flex justify-center"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}>
                <div className="rounded-2xl bg-[#181818] border border-[#2a2a2a] shadow-[0_0_40px_rgba(0,0,0,0.6)] max-w-4xl overflow-hidden w-full">
                    <Swiper
                        modules={[Pagination, Autoplay]}
                        autoplay={{ delay: 4000 }}
                        loop
                        pagination={{ clickable: true }}
                        className="w-full h-full">
                        {[capture1, capture2].map((img, i) => (
                            <SwiperSlide key={i}>
                                <img
                                    src={img}
                                    alt={`WatchIT screenshot ${i + 1}`}
                                    className="w-full h-[350px] md:h-[450px] object-cover brightness-95"
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </motion.section>

            <motion.section
                className="mt-5 mb-24"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}>
                <div className="flex justify-center">
                    <Button
                        size="4"
                        radius="small"
                        variant="soft"
                        color="orange"
                        onMouseOver={(e) => e.currentTarget.style.cursor = "pointer"}
                        className="flex items-center justify-center gap-3 px-8 py-4 text-lg font-semibold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 shadow-lg hover:shadow-xl transition-all duration-300"
                        onClick={handleNavigation}>
                        <p>{tl(currentLanguage, "landing.enter_button")}</p>
                    </Button>
                </div>
            </motion.section>
        </main>
    );
}
