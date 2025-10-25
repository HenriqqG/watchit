import watchItLogo from "../assets/watchitlogo.png";
import { languages, tl } from "../translations/translation";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuthStore } from "../store/AuthStore";
import { Navigate } from "react-router-dom";
import { Card, Button, Flex, Select, Box } from "@radix-ui/themes";
import FaceitLogin from "./login/FaceitLogin";
import { Footer } from "../components/general-components/Footer";
import { getFlagUrl } from "../util/function_utils";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import capture1 from "../assets/capture1.jpg";
import capture2 from "../assets/capture2.jpg";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export function LandingPage() {
    const { currentLanguage, handleLanguageChange } = useLanguage();
    const { user } = useAuthStore();

    const LanguageDisplay = ({ langId, name }: { langId: string, name: string }) => (
        <Flex align="center" gap="2">
            <img width="20"
                height="14"
                className="rounded-sm"
                src={getFlagUrl(langId)}
                alt={`Flag of ${name}`} />
            <Box>{name}</Box>
        </Flex>
    );

    if (user) return <Navigate to="/watch" replace />;

    return (
        <main className="w-full min-h-screen flex flex-col items-center bg-[#101010] text-white">

            <nav className="w-full max-w-7xl flex justify-between items-center px-8 py-6">
                <img src={watchItLogo} className="h-10 opacity-90" />
                <Select.Root
                    value={currentLanguage.id}
                    onValueChange={handleLanguageChange}>
                    <Select.Trigger
                        className="min-w-[150px]">
                        <LanguageDisplay langId={currentLanguage.id} name={currentLanguage.name} />
                    </Select.Trigger>

                    <Select.Content>
                        {languages.map(lang => (
                            <Select.Item
                                key={lang.id}
                                value={lang.id}>
                                <LanguageDisplay langId={lang.id} name={lang.name} />
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Root>
                <FaceitLogin></FaceitLogin>
            </nav>

            <section className="flex flex-col items-center text-center px-6 mt-24 max-w-3xl">
                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                    {tl(currentLanguage, 'subtitle')}
                </h1>

                <p className="text-lg text-gray-400 mt-6">
                    {tl(currentLanguage, 'header.tagline')}
                </p>
            </section>

            <section className="my-32 px-6 w-full flex justify-center">
                <div className="rounded-xl bg-[#181818] border border-[#2a2a2a] shadow-xl max-w-4xl overflow-hidden w-full">
                    <Swiper modules={[Navigation, Pagination, Autoplay]}
                        autoplay={{ delay: 3500 }}
                        loop={true}
                        pagination={{ clickable: true }}
                        className="w-full h-full">
                        {[
                            capture1,
                            capture2
                        ].map((img, i) => (
                            <SwiperSlide key={i}>
                                <img
                                    src={img}
                                    alt={`WatchIT screenshot ${i + 1}`}
                                    className="w-full object-cover"/>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section>

            <section className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 px-8">
                {[
                    {
                        title: tl(currentLanguage, 'landing.feature1_title'),
                        desc: tl(currentLanguage, 'landing.feature1_desc')
                    },
                    {
                        title: tl(currentLanguage, 'landing.feature2_title'),
                        desc: tl(currentLanguage, 'landing.feature2_desc')
                    }
                ].map((f, i) => (
                    <Card key={i} className="p-8 bg-[#181818] border border-[#2a2a2a] rounded-xl">
                        <Flex direction="row" align="center">
                            {i == 0 && (
                                <div>
                                    <svg width="42" height="42" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 2H13.5C13.7761 2 14 2.22386 14 2.5V7H1V2.5C1 2.22386 1.22386 2 1.5 2ZM1 8V12.5C1 12.7761 1.22386 13 1.5 13H13.5C13.7761 13 14 12.7761 14 12.5V8H1ZM0 2.5C0 1.67157 0.671573 1 1.5 1H13.5C14.3284 1 15 1.67157 15 2.5V12.5C15 13.3284 14.3284 14 13.5 14H1.5C0.671573 14 0 13.3284 0 12.5V2.5Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
                                    </path>
                                    </svg>
                                </div>
                            )}
                            {i == 1 && (
                                <div>
                                    <svg width="42" height="42" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.5 0.875C5.49797 0.875 3.875 2.49797 3.875 4.5C3.875 6.15288 4.98124 7.54738 6.49373 7.98351C5.2997 8.12901 4.27557 8.55134 3.50407 9.31167C2.52216 10.2794 2.02502 11.72 2.02502 13.5999C2.02502 13.8623 2.23769 14.0749 2.50002 14.0749C2.76236 14.0749 2.97502 13.8623 2.97502 13.5999C2.97502 11.8799 3.42786 10.7206 4.17091 9.9883C4.91536 9.25463 6.02674 8.87499 7.49995 8.87499C8.97317 8.87499 10.0846 9.25463 10.8291 9.98831C11.5721 10.7206 12.025 11.8799 12.025 13.5999C12.025 13.8623 12.2376 14.0749 12.5 14.0749C12.7623 14.075 12.975 13.8623 12.975 13.6C12.975 11.72 12.4778 10.2794 11.4959 9.31166C10.7244 8.55135 9.70025 8.12903 8.50625 7.98352C10.0187 7.5474 11.125 6.15289 11.125 4.5C11.125 2.49797 9.50203 0.875 7.5 0.875ZM4.825 4.5C4.825 3.02264 6.02264 1.825 7.5 1.825C8.97736 1.825 10.175 3.02264 10.175 4.5C10.175 5.97736 8.97736 7.175 7.5 7.175C6.02264 7.175 4.825 5.97736 4.825 4.5Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
                                        </path>
                                    </svg>
                                </div>
                            )}
                            {i == 2 && (
                                <div>
                                    <svg width="42" height="42" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2 3.5C2 3.22386 2.22386 3 2.5 3H12.5C12.7761 3 13 3.22386 13 3.5V9.5C13 9.77614 12.7761 10 12.5 10H2.5C2.22386 10 2 9.77614 2 9.5V3.5ZM2 10.9146C1.4174 10.7087 1 10.1531 1 9.5V3.5C1 2.67157 1.67157 2 2.5 2H12.5C13.3284 2 14 2.67157 14 3.5V9.5C14 10.1531 13.5826 10.7087 13 10.9146V11.5C13 12.3284 12.3284 13 11.5 13H3.5C2.67157 13 2 12.3284 2 11.5V10.9146ZM12 11V11.5C12 11.7761 11.7761 12 11.5 12H3.5C3.22386 12 3 11.7761 3 11.5V11H12Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
                                        </path>
                                    </svg>
                                </div>
                            )}
                            <h3 className="text-xl font-bold mb-3 ml-3 pt-3">{f.title}</h3>
                        </Flex>
                        <p className="text-gray-400">{f.desc}</p>
                    </Card>
                ))}
            </section>

            <section className="mt-32 mb-20 text-center px-6">
                <a href="/watch">
                    <Button size="3" color="orange" className="px-10 font-medium">
                        {tl(currentLanguage, 'landing.enter_button')}
                    </Button>
                </a>
            </section>

            <Footer></Footer>
        </main>
    );
}

