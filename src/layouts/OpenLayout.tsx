import { Outlet } from "react-router-dom";
import { Footer } from "../components/general-components/Footer";
import { OpenNavbar } from "../components/general-components/OpenNavbar";
import { SelectLanguage } from "../components/general-components/SelectLanguage";

export default function OpenLayout() {
    return (
        <div className="flex flex-col min-h-screen play-regular bg-gradient-to-b from-[#0a0a0a] via-[#121212] to-[#1a1a1a]">
            <OpenNavbar />
            <main className="flex-1">
                <Outlet />
            </main>
            <SelectLanguage />
            <Footer />
        </div>
    );
}
