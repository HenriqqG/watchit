import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { tl } from "../../translations/translation";

export default function DonateSuccess() {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();

  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center text-white bg-gradient-to-b via-[#121212] to-[#1a1a1a] overflow-hidden px-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 12 }}
        className="flex flex-col items-center">
        <CheckCircle2 className="text-green-400 w-24 h-24 drop-shadow-[0_0_25px_rgba(0,255,100,0.3)]" />
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-center mt-6 max-w-xl">
        <h1 className="text-4xl font-extrabold text-orange-400 mb-3">
          {tl(currentLanguage, "donate.success_title")}
        </h1>
        <p className="text-lg text-gray-400 leading-relaxed">
          {tl(currentLanguage, "donate.success_message")}
        </p>
      </motion.section>

      <motion.div
        className="flex flex-col sm:flex-row gap-4 mt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}>
        <Button
          size="3"
          color="orange"
          radius="large"
          onClick={() => navigate(`/${currentLanguage.id}/`, { replace: true })}>
          {tl(currentLanguage, "donate.back_home")}
        </Button>
      </motion.div>
    </main>
  );
}
