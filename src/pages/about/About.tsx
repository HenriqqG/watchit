import { motion } from "framer-motion";
import { TextSearch, ScanEye, Globe, Users, Sparkles } from "lucide-react";
import watchItLogo from "../../assets/watchitlogo.png";
import { Badge } from "@radix-ui/themes";
import { useLanguage } from "../../contexts/LanguageContext";
import { tl } from "../../translations/translation";

export function About() {
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
        <main className="w-full min-h-screen flex flex-col items-center text-white bg-gradient-to-b via-[#121212] to-[#1a1a1a] overflow-hidden">
            
            {/* Header */}
            <motion.section
                className="flex flex-col items-center text-center px-6 mt-24 max-w-3xl"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <img
                    src={watchItLogo}
                    alt="WatchIT logo"
                    className="h-28 opacity-90 drop-shadow-[0_0_25px_rgba(255,150,0,0.3)] mb-6"
                />
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                    {tl(currentLanguage, "about.title")}
                </h1>
                <p className="text-lg text-gray-400 leading-relaxed max-w-2xl">
                    {tl(currentLanguage, "about.description")}
                </p>
            </motion.section>

            {/* Features */}
            <motion.section
                className="mt-20 px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.15 } },
                }}
            >
                {features.map((f, i) => (
                    <motion.div
                        key={i}
                        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 120 }}
                        className="p-6 bg-[#181818] rounded-2xl border border-[#2a2a2a] shadow-lg hover:shadow-[0_0_30px_rgba(255,150,0,0.15)] transition-all duration-300"
                    >
                        <div className="flex flex-col items-center text-center space-y-4">
                            {f.icon}
                            <h3 className="text-xl font-semibold">{f.title}</h3>
                            {f.badge && (
                                <Badge size="1"  color={i == 3 ? 'teal' : 'gold'}>
                                    {f.badge.label}
                                </Badge>
                            )}
                            <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </motion.section>

            {/* Purpose */}
            <motion.section
                className="mt-24 px-6 text-center max-w-3xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.4 }}
            >
                <div className="flex flex-col items-center gap-4">
                    <Sparkles className="w-10 h-10 text-orange-400" />
                    <h2 className="text-3xl font-semibold">
                        {tl(currentLanguage, "about.purpose_title")}
                    </h2>
                    <p className="text-gray-400 mt-2 text-lg leading-relaxed">
                        {tl(currentLanguage, "about.purpose_desc")}
                    </p>
                </div>
            </motion.section>
        </main>
    );
}
