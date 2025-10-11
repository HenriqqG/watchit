import { Outlet } from "react-router-dom";
import { FeedbackToast } from "../components/general-components/FeedbackToast";
import { Footer } from "../components/general-components/Footer";
import { Navbar } from "../components/general-components/Navbar";

export default function MainLayout() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
            <FeedbackToast />
            <Footer />
        </div>
    );
}
