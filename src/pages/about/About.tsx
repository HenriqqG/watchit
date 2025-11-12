import { Helmet } from "react-helmet-async";

import { motion } from "framer-motion";

import { useLanguage } from "../../contexts/LanguageContext";
import { tl } from "../../translations/translation";

import { Badge } from "@radix-ui/themes";
import { TextSearch, ScanEye, Globe, Users } from "lucide-react";

export default function About() {
    const { currentLanguage } = useLanguage();

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
            badge: { label: tl(currentLanguage, "landing.feature_desc.extension_needed"), color: "gold" },
        },
        {
            icon: <Users className="w-10 h-10 text-orange-400" />,
            title: tl(currentLanguage, "landing.feature4_title"),
            desc: tl(currentLanguage, "landing.feature4_desc"),
            badge: { label: tl(currentLanguage, "landing.feature_desc.soon"), color: "teal" },
        },
    ];

    return (
        <>
            <Helmet>
                {currentLanguage.id === "pt-br" ? (
                    <>
                        <title>Sobre - WatchIT</title>
                        <meta name="description"
                            content="Conheça a WatchIT - quem somos, o que fazemos e qual é o nosso propósito." />
                        <meta property="og:title" content="Sobre - WatchIT" />
                        <meta property="og:description"
                            content="Saiba mais sobre a WatchIT, nossa missão e o que nos motiva a ajudar jogadores a aproveitarem mais suas partidas." />
                        <meta property="og:image" content="https://watchit.gg/og-image.jpg" />
                        <meta property="og:url" content="https://watchit.gg/about" />
                        <meta name="twitter:card" content="summary_large_image" />
                    </>
                ) : (
                    <>
                        <title>About - WatchIT</title>
                        <meta name="description"
                            content="Learn more about WatchIT - who we are, what we do, and our purpose." />
                        <meta property="og:title" content="About - WatchIT" />
                        <meta property="og:description"
                            content="Discover more about WatchIT, our mission, and what drives us to help players enjoy their matches even more." />
                        <meta property="og:image" content="https://watchit.gg/og-image.jpg" />
                        <meta property="og:url" content="https://watchit.gg/about" />
                        <meta name="twitter:card" content="summary_large_image" />
                    </>
                )}
            </Helmet>
            <main className="w-full min-h-screen flex flex-col items-center text-white bg-gradient-to-b via-[#121212] to-[#1a1a1a] overflow-hidden">
                <motion.section
                    className="flex flex-col items-center text-center px-6 mt-24 max-w-3xl"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-orange-400 mt-5">
                        {tl(currentLanguage, "about.title")}
                    </h1>
                    <p className="text-lg text-gray-400 leading-relaxed max-w-2xl">
                        {tl(currentLanguage, "about.description")}
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
                                {f.badge && (
                                    <Badge size="1" color={i == 3 ? 'teal' : 'gold'}>
                                        {f.badge.label}
                                    </Badge>
                                )}
                                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.section>

                <motion.section
                    className="mt-24 px-6 text-center max-w-3xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}>
                    <div className="flex flex-col items-center gap-4">
                        <h2 className="text-3xl font-semibold">
                            {tl(currentLanguage, "about.purpose_title")}
                        </h2>
                        <p className="text-gray-400 mt-2 text-lg leading-relaxed">
                            {tl(currentLanguage, "about.purpose_desc")}
                        </p>
                    </div>
                </motion.section>

                <motion.section
                    className="mb-40 sm:mb-60 lg:mb-72 mt-24 px-6 text-center max-w-3xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}>
                    <h2 className="text-3xl font-semibold mb-4">
                        {tl(currentLanguage, "about.evolution_title")}
                    </h2>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        {tl(currentLanguage, "about.evolution_desc")}
                    </p>
                </motion.section>
            </main>
        </>

    );
}
