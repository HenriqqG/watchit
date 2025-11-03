import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Footer } from "../components/general-components/Footer";
import { Navbar } from "../components/general-components/Navbar";
import { useAuthStore } from "../store/AuthStore";
import { SelectLanguage } from "../components/general-components/SelectLanguage";

export default function MainLayout() {
    const fetchUser = useAuthStore(s => s.fetchUser);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
            <div className="flex flex-col min-h-screen play-regular bg-gradient-to-b from-[#0a0a0a] via-[#121212] to-[#1a1a1a]">
                <Navbar open={sidebarOpen} setOpen={setSidebarOpen} />
                <main className="flex-1">
                    <Outlet />
                </main>
                <SelectLanguage />
                <Footer />
            </div>
        </>
    );
}
