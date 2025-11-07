import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { Button, Separator } from "@radix-ui/themes";
import { useLanguage } from "../../contexts/LanguageContext";
import { tl } from "../../translations/translation";

export default function SubscriptionSuccess() {
  const { currentLanguage } = useLanguage();

  const handleGoToProfile = () => {
    window.location.href = "/me";
  };

  return (
    <motion.main
      className="w-full min-h-screen flex flex-col items-center justify-center px-6 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="flex flex-col items-center gap-6 bg-[#181818] p-10 rounded-2xl border border-orange-600/50 shadow-[0_0_50px_rgba(255,150,0,0.15)]">
        <motion.div
          initial={{ rotate: -10, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 8 }}
          className="text-green-400">
          <CheckCircle2 className="w-24 h-24" />
        </motion.div>

        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-orange-400"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}>
          {tl(currentLanguage, "subscriptions.success.title")}
        </motion.h1>

        <motion.p
          className="text-gray-300 text-lg max-w-xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}>
          {tl(currentLanguage, "subscriptions.success.subtitle")}
        </motion.p>

        <Separator size="4" my="3" className="bg-[#2a2a2a] w-1/2" />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-gray-400 flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-300" />
            <span>{tl(currentLanguage, "subscriptions.success.method")}: Mercado Pago</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-300" />
            <span>{tl(currentLanguage, "subscriptions.success.date")}: {new Date().toLocaleDateString()}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}>
          <Button
            size="4"
            radius="small"
            variant="soft"
            color="orange"
            onClick={handleGoToProfile}
            className="flex items-center justify-center gap-3 px-10 py-4 text-lg font-semibold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 shadow-lg">
            {tl(currentLanguage, "subscriptions.success.button")}
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </motion.div>
    </motion.main>
  );
}
