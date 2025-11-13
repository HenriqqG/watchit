import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

import { motion } from "framer-motion";
import { Badge, Text } from "@radix-ui/themes";
import { CheckCircle, Mail, MessageSquare } from "lucide-react";

import { useLanguage } from "../../contexts/LanguageContext";
import { languages, tl } from "../../translations/translation";

import { useFeedbackToast } from "../../hooks/useFeedbackToast";

export default function ContactPage() {
    const { currentLanguage } = useLanguage();
    const currentPagePath = "contact";

    const {
        setOpen,
        submitted,
        message,
        setMessage,
        prompt,
        handleSubmit,
    } = useFeedbackToast();

    useEffect(() => {
        setOpen(true);
    }, [submitted]);

    return (
        <>
            <Helmet>
                {currentLanguage.id === "pt-br" ? (
                    <>
                        <title>Contato - Suporte WatchIT</title>
                        <meta
                            name="description"
                            content="Entre em contato com a equipe da WatchIT ou envie seu feedback."
                        />
                        <meta property="og:title" content="Contato - Suporte WatchIT" />
                        <meta
                            property="og:description"
                            content="Fale com a equipe da WatchIT para enviar sugestões, dúvidas ou solicitar suporte."
                        />
                        <meta property="og:locale" content="pt_BR" />
                    </>
                ) : (
                    <>
                        <title>Contact - WatchIT Support</title>
                        <meta
                            name="description"
                            content="Get in touch with the WatchIT team or send us your feedback."
                        />
                        <meta property="og:title" content="Contact - WatchIT Support" />
                        <meta
                            property="og:description"
                            content="Contact the WatchIT team for feedback, questions, or support requests."
                        />
                        <meta property="og:locale" content="en_US" />
                    </>
                )}

                {(() => {
                    const normalizedPath = currentPagePath.startsWith("/")
                        ? currentPagePath.slice(1)
                        : currentPagePath;

                    const canonicalUrl = `https://watchit.gg/${currentLanguage.id}/${normalizedPath}`;

                    return (
                        <>
                            <link rel="canonical" href={canonicalUrl} />
                            <meta property="og:url" content={canonicalUrl} />

                            {languages.map((lang) => (
                                <link
                                    key={`hreflang-${lang.id}`}
                                    rel="alternate"
                                    href={`https://watchit.gg/${lang.id.toLowerCase()}/${normalizedPath}`}
                                    hrefLang={lang.id.toLowerCase()}
                                />
                            ))}

                            <link
                                rel="alternate"
                                href={`https://watchit.gg/${normalizedPath}`}
                                hrefLang="x-default"
                            />
                        </>
                    );
                })()}

                <meta property="og:image" content="https://watchit.gg/og-image.jpg" />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
            </Helmet>

            <main className="w-full min-h-screen flex flex-col items-center text-white bg-gradient-to-b via-[#121212] to-[#1a1a1a] overflow-hidden pb-20">
                <motion.section
                    className="flex flex-col items-center text-center px-6 mt-24 max-w-3xl"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-orange-400">
                        {tl(currentLanguage, "contact.title")}
                    </h1>
                    <p className="text-lg text-gray-400 leading-relaxed max-w-2xl">
                        {tl(currentLanguage, "contact.subtitle")}
                    </p>

                </motion.section>
                <div className="flex flex-col xl:flex-row xl:gap-5 xl:justify-center py-10 px-10 xl:px-0 w-full mt-5">
                    <div className="w-full xl:w-[30%] mb-5 xl:mb-0 order-2 xl:order-1">
                        <motion.section className="bg-[#181818] border border-[#2a2a2a] rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.6)] p-8 w-full max-w-3xl text-center"
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}>
                            <h2 className="text-2xl font-semibold mb-4 flex items-center justify-center gap-2">
                                <MessageSquare className="w-6 h-6 text-orange-400" />
                                {tl(currentLanguage, "contact.send_feedback")}
                            </h2>
                            <Text className="text-sm text-faceit-text-light">
                                {prompt}
                            </Text>
                            <form
                                onSubmit={handleSubmit}
                                name="watchit-feedback"
                                method="POST"
                                netlify
                                className="flex flex-col gap-4 p-4 play-regular">
                                <input type="hidden" name="form-name" value="watchit-feedback" />
                                <input type="hidden" name="prompt" value={prompt} />

                                <textarea
                                    name="message"
                                    aria-label="Your feedback message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full h-32 rounded-md border border-faceit-border text-white text-sm p-3 resize-none play-regular placeholder-faceit-text-light/50 focus:outline-none focus:ring-1 focus:ring-faceit-orange bg-[#121212]"
                                    placeholder={"..."}
                                    required />

                                {submitted ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="flex flex-row justify-center items-center gap-2 text-green-400 drop-shadow-[0_0_3px_rgba(0,255,0,0.3)] font-medium text-sm mt-2">
                                        <CheckCircle className="w-5 h-5" />
                                        {tl(currentLanguage, "feedback.status.submitted_successfully")}
                                    </motion.div>
                                ) : (
                                    <button
                                        type="submit"
                                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 transition text-sm font-semibold py-2 rounded-md text-white shadow-md hover:shadow-lg">
                                        {tl(currentLanguage, "feedback.status.submit_feedback")}
                                    </button>
                                )}
                            </form>
                        </motion.section>
                    </div>
                    <div className="w-full xl:w-[10%] order-1 xl:order-2">
                        <a href="mailto:support@watchit.gg" rel="noopener noreferrer">
                            <motion.section
                                className="grid grid-cols-1 gap-8 max-w-4xl w-full mb-20"
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: {
                                        opacity: 1,
                                    },
                                }}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.97 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    whileHover={{ scale: 1.08 }}
                                    className="p-6 bg-[#181818] rounded-2xl border border-[#2a2a2a] shadow-lg hover:shadow-[0_0_30px_rgba(255,150,0,0.15)] transition-all duration-300 text-center space-y-4">
                                    <div className="flex flex-col items-center space-y-3">
                                        <Badge color="orange">
                                            {tl(currentLanguage, "contact.official_badge")}
                                        </Badge>
                                        <div className="flex flex-row justify-evenly xl:justify-between w-full">
                                            <div className="content-center">
                                                <Mail className="w-6 h-6 text-orange-400 align-text-bottom" aria-hidden="true" />
                                                <span className="sr-only">Email support@watchit.gg</span>
                                            </div>
                                            <p className="text-lg">support@watchit.gg</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.section>
                        </a>
                    </div>
                </div>
            </main>
        </>

    );
}