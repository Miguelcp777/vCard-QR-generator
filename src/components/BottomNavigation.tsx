import { QrCode, Grid, Scan, Settings } from "lucide-react";
import clsx from "clsx";

interface BottomNavigationProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
    const tabs = [
        { id: "generator", label: "Generator", icon: QrCode },
        { id: "my-codes", label: "My Codes", icon: Grid },
        { id: "scanner", label: "Scanner", icon: Scan },
        { id: "settings", label: "Settings", icon: Settings },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-card-dark border-t border-gray-200 dark:border-gray-700 pb-safe pt-2 px-6 shadow-[0_-4px_20px_-2px_rgba(0,0,0,0.05)] z-50">
            <div className="flex justify-between items-center max-w-md mx-auto">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={clsx(
                                "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300",
                                isActive
                                    ? "text-primary scale-105"
                                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            )}
                        >
                            <div className={clsx("p-1 rounded-lg transition-colors", isActive && "bg-primary/10")}>
                                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            <span className="text-[10px] font-medium tracking-wide">{tab.label}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};
