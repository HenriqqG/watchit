import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge, Button } from "@radix-ui/themes";
import { TextSearch, ScanEye, Globe, Users, X, Fullscreen } from "lucide-react";

import { useLanguage } from "../contexts/LanguageContext";
import { languages, tl } from "../translations/translation";

import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import WTLP1 from "../assets/WTLP1.webp";
import WTLP2 from "../assets/WTLP2.webp";
import WTLP3 from "../assets/WTLP3.webp";
import watchItLogo from "../assets/watchitlogo.webp";

import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

export default function LandingPage() {
    const { currentLanguage } = useLanguage();
    const navigate = useNavigate();
    const currentPagePath = "";
    const handleNavigation = () => navigate(`/${currentLanguage.id}/watch`, { replace: true });
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
        <>
            <Helmet>
                {currentLanguage.id === "pt-br" ? (
                    <>
                        <title>Boas vindas ao WatchIT!</title>
                        <meta name="description"
                            content="Bem-vindo ao WatchIT! Explore Supermatches em tempo real e gerencie sua lista WatchIT de forma prática e intuitiva." />
                        <meta property="og:title" content="WatchIT" />
                        <meta property="og:description"
                            content="Explore Supermatches em tempo real e gerencie sua lista WatchIT de forma simples e eficiente." />
                        <meta property="og:locale" content="pt_BR" />
                    </>
                ) : (
                    <>
                        <title>Welcome to WatchIT!</title>
                        <meta name="description"
                            content="Welcome to WatchIT! Explore real-time Supermatches and manage your WatchIT List easily and intuitively." />
                        <meta property="og:title" content="WatchIT" />
                        <meta property="og:description"
                            content="Explore real-time Supermatches and manage your WatchIT List with ease and simplicity." />
                        <meta property="og:locale" content="en_US" />
                    </>
                )}
                <link rel="canonical" href={`https://watchit.gg/${currentLanguage.id}/${currentPagePath}`} />
                {(() => {
                    const normalizedPath = currentPagePath.startsWith("/")
                        ? currentPagePath.slice(1)
                        : currentPagePath;
                    const canonicalUrl = `https://watchit.gg/${currentLanguage.id}/${normalizedPath}`;

                    return (
                        <>
                            <link rel="canonical" href={canonicalUrl} />
                            {languages.map((lang) => (
                                <link
                                    key={`hreflang-${lang.id}`}
                                    rel="alternate"
                                    href={`https://watchit.gg/${lang.id.toLowerCase()}/${normalizedPath}`}
                                    hrefLang={lang.id.toLowerCase()}
                                />
                            ))}
                            <link rel="alternate" href={`https://watchit.gg/${normalizedPath}`} hrefLang="x-default" />

                            <meta property="og:url" content={canonicalUrl} />
                        </>
                    );
                })()}
                <link rel="alternate" href={`https://watchit.gg/${currentPagePath}`} hrefLang="x-default" />
                <meta property="og:url" content={`https://watchit.gg/${currentLanguage.id}/${currentPagePath}`} />
                <meta property="og:image" content="https://watchit.gg/og-image.jpg" />
                <meta name="twitter:card" content="summary_large_image" />
            </Helmet>
            <main className="w-full min-h-screen flex flex-col items-center py-35">
                <motion.section
                    className="flex flex-col items-center text-center px-6 max-w-3xl"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}>
                    <motion.img
                        src={watchItLogo}
                        alt="WatchIt logo"
                        fetchPriority="high"
                        loading="eager"
                        className="h-25 lg:h-32 opacity-90 drop-shadow-[0_0_25px_rgba(255,150,0,0.3)]"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }} />
                    <p className="text-lg md:text-xl text-gray-400 mt-6 max-w-xl leading-relaxed">
                        {tl(currentLanguage, "header.tagline")}
                    </p>
                </motion.section>

                <motion.section
                    className="my-15"
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

                <motion.section
                    className="px-6 w-full flex justify-center"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}>
                    <div className="rounded-2xl bg-[#181818] border border-[#2a2a2a] shadow-[0_0_40px_rgba(0,0,0,0.6)] max-w-6xl overflow-hidden w-full transform transition-transform duration-300 hover:scale-[1.02]">
                        <Swiper
                            modules={[Pagination, Autoplay]}
                            autoplay={{ delay: 4000 }}
                            loop
                            pagination={{ clickable: true }}
                            className="w-full h-full">
                            {[WTLP1, WTLP2, WTLP3].map((img, i) => (
                                <SwiperSlide key={i}>
                                    <img src={img}
                                        alt={`WatchIT screenshot ${i + 1}`}
                                        className="w-full object-cover brightness-95 cursor-pointer"
                                        onClick={() => setSelectedImage(img)} />
                                    <div className="absolute bottom-3 left-3 group-hover:opacity-100 transition-opacity duration-300">
                                        <Fullscreen className="w-10 h-10 text-white drop-shadow-md  rounded-full p-1 hover:bg-black/70" />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </motion.section>

                <motion.section
                    className="mt-10 px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl"
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


                {selectedImage && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                        onClick={() => setSelectedImage(null)}>
                        <button className="absolute top-6 right-6 text-white bg-black/60 hover:bg-black/80 rounded-full p-2 transition-all duration-300 cursor-pointer"
                            onClick={() => setSelectedImage(null)}>
                            <X className="w-6 h-6" />
                        </button>
                        <Swiper modules={[Pagination, Autoplay]}
                            autoplay={{ delay: 4000 }}
                            loop
                            pagination={{ clickable: true }}
                            className="max-w-[90%] max-h-[90%]">
                            {[WTLP1, WTLP2, WTLP3].map((img, i) => (
                                <SwiperSlide key={i}>
                                    <img src={img}
                                        alt={`WatchIT screenshot ${i + 1}`}
                                        className="max-h-[85vh] w-auto rounded-2xl shadow-2xl object-contain cursor-default"
                                        onClick={(e) => e.stopPropagation()} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                )}
            </main>
        </>
    );
}