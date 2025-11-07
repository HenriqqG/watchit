import { motion } from "framer-motion";
import { XCircle, ArrowLeft, AlertTriangle } from "lucide-react";
import { Button, Separator } from "@radix-ui/themes";
import { useLanguage } from "../../contexts/LanguageContext";
import { tl } from "../../translations/translation";

export default function SubscriptionError() {
  const { currentLanguage } = useLanguage();

  const handleGoBack = () => {
    window.location.href = "/subscription";
  };

  return (
    <motion.main
      className="w-full min-h-screen flex flex-col items-center justify-center px-6 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="flex flex-col items-center gap-6 bg-[#181818] p-10 rounded-2xl border border-red-600/50 shadow-[0_0_50px_rgba(255,50,50,0.15)]"
      >
        <motion.div
          initial={{ rotate: 10, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 8 }}
          className="text-red-500"
        >
          <XCircle className="w-24 h-24" />
        </motion.div>

        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-red-400"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {tl(currentLanguage, "subscriptions.error.title")}
        </motion.h1>

        <motion.p
          className="text-gray-300 text-lg max-w-xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {tl(currentLanguage, "subscriptions.error.subtitle")}
        </motion.p>

        <Separator size="4" my="3" className="bg-[#2a2a2a] w-1/2" />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-gray-400 flex flex-col items-center gap-1"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>{tl(currentLanguage, "subscriptions.error.reason")}: {tl(currentLanguage, "subscriptions.error.reason.generic")}</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>{tl(currentLanguage, "subscriptions.error.advice")}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            size="4"
            radius="small"
            variant="soft"
            color="red"
            onClick={handleGoBack}
            className="flex items-center justify-center gap-3 px-10 py-4 text-lg font-semibold bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            {tl(currentLanguage, "subscriptions.error.button")}
          </Button>
        </motion.div>
      </motion.div>
    </motion.main>
  );
}