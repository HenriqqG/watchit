import { useMemo, useState } from "react";
import { Button, Separator } from "@radix-ui/themes";

import { Check, Repeat, DollarSign, CornerDownRight, ListChecks, Asterisk, Star } from "lucide-react";
import { motion } from "framer-motion";
import { tl } from "../../translations/translation";
import { useLanguage } from "../../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

export default function Pricing() {
    const { currentLanguage } = useLanguage();

    const subscriptionFeatures = useMemo(() => [
        { text: tl(currentLanguage, "pricing.features.item1"), icon: Asterisk, iconColor: "text-green-500", isSubscriptionOnly: false },
        { text: tl(currentLanguage, "pricing.features.item2"), icon: Asterisk, iconColor: "text-green-500", isSubscriptionOnly: false },
        {
            text: tl(currentLanguage, "pricing.features.item3"),
            icon: Star,
            iconColor: "text-orange-300",
            isFuture: true,
            isSubscriptionOnly: true
        },
        {
            text: tl(currentLanguage, "pricing.features.item4"),
            icon: DollarSign,
            iconColor: "text-red-400",
            isFuture: true,
            isSubscriptionOnly: true
        },
    ], [currentLanguage]);

    const [selectedPlanType, setSelectedPlanType] = useState('subscription');

    const isSubscription = selectedPlanType === 'subscription';

    const navigate = useNavigate();

    const handleNavigation = (href: string) => {
        const newUrl = `/${currentLanguage.id}${href}`
        navigate(newUrl, { replace: true })
    };

    return (
        <motion.main
            className="w-full min-h-screen flex flex-col items-center pt-16 pb-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}>
            <div className="max-w-4xl w-full px-6">
                <div className="flex flex-col items-center text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-orange-400">
                        {tl(currentLanguage, "pricing.header.title")}
                    </h1>
                    <p className="text-xl text-gray-400 max-w-xl">
                        {tl(currentLanguage, "pricing.header.subtitle")}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <motion.div
                        onClick={() => setSelectedPlanType('one_time')}
                        whileHover={{ scale: 1.02 }}
                        className={`p-6 rounded-2xl border-4 cursor-pointer transition-all duration-300 
                            ${!isSubscription
                                ? 'border-orange-500 shadow-[0_0_40px_rgba(255,150,0,0.2)] bg-[#1e1e1e]'
                                : 'border-[#2a2a2a] hover:border-orange-600/50 bg-[#181818]'
                            }`}>
                        <div className="flex justify-between items-start mb-3">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <DollarSign className="w-6 h-6 text-red-400" />
                                {tl(currentLanguage, "pricing.plan.one_time.title")}
                            </h2>
                            {!isSubscription && <Check className="w-6 h-6 text-orange-500" />}
                        </div>
                        <p className="text-4xl font-extrabold text-white">
                            {tl(currentLanguage, "pricing.plan.one_time.price")}
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                            {tl(currentLanguage, "pricing.plan.one_time.desc")}
                        </p>
                        <Separator size="4" my="3" className="bg-[#2a2a2a]" />
                        <ul className="space-y-1 text-sm text-gray-300">
                            <li className="flex items-center gap-2"><CornerDownRight className="w-4 h-4 text-red-300" /> {tl(currentLanguage, "pricing.plan.one_time.feature1")}</li>
                            <li className="flex items-center gap-2"><CornerDownRight className="w-4 h-4 text-red-300" /> {tl(currentLanguage, "pricing.plan.one_time.feature2")}</li>
                        </ul>
                    </motion.div>

                    <motion.div
                        onClick={() => setSelectedPlanType('subscription')}
                        whileHover={{ scale: 1.02 }}
                        className={`p-6 rounded-2xl border-4 cursor-pointer transition-all duration-300
                            ${isSubscription
                                ? 'border-orange-500 shadow-[0_0_40px_rgba(255,150,0,0.2)] bg-[#1e1e1e]'
                                : 'border-[#2a2a2a] hover:border-orange-600/50 bg-[#181818]'
                            }`}>
                        <div className="flex justify-between items-start mb-3">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Repeat className="w-6 h-6 text-orange-400" />
                                {tl(currentLanguage, "pricing.plan.subscription.title")}
                            </h2>
                            {isSubscription && <Check className="w-6 h-6 text-orange-500" />}
                        </div>
                        <p className="text-4xl font-extrabold text-white">
                            {tl(currentLanguage, "pricing.plan.subscription.price")}
                            <span className="text-xl font-normal text-gray-400">
                                {tl(currentLanguage, "pricing.plan.subscription.price.recurrency")}
                            </span>
                        </p>
                        <p className="text-sm mt-2 font-semibold text-orange-300">
                            {tl(currentLanguage, "pricing.plan.subscription.note")}
                        </p>
                        <Separator size="4" my="3" className="bg-[#2a2a2a]" />
                        <ul className="space-y-1 text-sm text-gray-300">
                            <li className="flex items-center gap-2"><CornerDownRight className="w-4 h-4 text-orange-300" /> {tl(currentLanguage, "pricing.plan.subscription.feature1")}</li>
                            <li className="flex items-center gap-2"><CornerDownRight className="w-4 h-4 text-orange-300" /> {tl(currentLanguage, "pricing.plan.subscription.feature2")}</li>
                        </ul>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className={`p-6 bg-[#181818] rounded-2xl border border-orange-600/50 shadow-lg mb-8 mt-4`}>
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
                        <ListChecks className="w-5 h-5 text-orange-400" />
                        {tl(currentLanguage, "pricing.features.title")}
                    </h3>

                    <div className="grid grid-cols-1 gap-6 text-base">
                        {subscriptionFeatures.map((feature, index) => {
                            if (feature.isSubscriptionOnly && !isSubscription) {
                                return null;
                            }
                            const IconComponent = feature.icon;
                            return (
                                <motion.div
                                    key={index}
                                    className={`flex items-start gap-3 ${feature.isFuture ? 'text-orange-300' : 'text-gray-200'} ${feature.iconColor === 'text-red-400' ? 'font-bold' : ''}`}
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}>
                                    {IconComponent ? <IconComponent className={`w-5 h-5 ${feature.iconColor} mt-1 flex-shrink-0`} /> : <Check className={`w-5 h-5 ${feature.iconColor} mt-1 flex-shrink-0`} />}
                                    <span>{feature.text}</span>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                <motion.div
                    className="flex justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}>
                    <Button
                        size="4"
                        radius="small"
                        variant="soft"
                        color="orange"
                        onClick={() => handleNavigation("/subscription")}
                        className="flex items-center justify-center gap-3 px-12 py-5 text-lg font-semibold transition-all duration-300 play-regular bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 shadow-lg cursor-pointer">
                        {tl(currentLanguage, "pricing.button.label")}
                    </Button>
                </motion.div>
            </div>
        </motion.main>
    );
}