import { useState } from "react";
import type { ReactNode } from "react";
import { BottomNavigation } from "../components/BottomNavigation";

interface MobileLayoutProps {
    children: ReactNode;
}

export const MobileLayout = ({ children }: MobileLayoutProps) => {
    const [activeTab, setActiveTab] = useState("generator");

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center relative overflow-hidden">
            {/* Dynamic Background Gradient */}
            <div className="fixed top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/10 to-transparent -z-10 pointer-events-none" />

            {/* Main Content Area */}
            <main className="w-full max-w-md flex-1 flex flex-col pb-24 h-[100dvh] overflow-y-auto no-scrollbar">
                {children}
            </main>

            {/* Bottom Navigation */}
            <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
    );
};
