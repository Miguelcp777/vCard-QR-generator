import { useState, useRef } from "react";
import type { ChangeEvent } from "react";
import type { ContactData } from "../utils/vcard";
import { CardPreview } from "../components/CardPreview";
import { ExportButtons } from "../components/ExportButtons";
import {
    User, Briefcase, Phone, Mail, Globe, MapPin,
    Image as ImageIcon, Eye, Edit3
} from "lucide-react";
import clsx from "clsx";

const INITIAL_DATA: ContactData = {
    firstName: "",
    lastName: "",
    title: "",
    company: "Johnson & Johnson",
    mobile: "",
    work: "",
    email: "",
    website: "",
    address: "",
    photoBase64: ""
};

export const GeneratorView = () => {
    const [data, setData] = useState<ContactData>(INITIAL_DATA);
    const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const captureRef = useRef<HTMLDivElement>(null);

    const handleInputChange = (field: keyof ContactData, value: string) => {
        setData((prev) => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert("File too large. Please choose an image under 2MB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setData((prev) => ({ ...prev, photoBase64: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50/50 dark:bg-background-dark">
            {/* Header */}
            <header className="px-6 py-5 bg-white dark:bg-card-dark shadow-sm z-10 sticky top-0 flex justify-between items-center">
                <h1 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark font-display">
                    Card Editor
                </h1>
                <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-1">
                    <button
                        onClick={() => setViewMode("edit")}
                        className={clsx("p-1.5 rounded-md transition-all", viewMode === "edit" ? "bg-white dark:bg-card-dark shadow text-primary" : "text-gray-400")}
                    >
                        <Edit3 size={18} />
                    </button>
                    <button
                        onClick={() => setViewMode("preview")}
                        className={clsx("p-1.5 rounded-md transition-all", viewMode === "preview" ? "bg-white dark:bg-card-dark shadow text-primary" : "text-gray-400")}
                    >
                        <Eye size={18} />
                    </button>
                </div>
            </header>

            {/* Hidden File Input - Always Rendered */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
            />

            {/* Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-6">

                {viewMode === "preview" ? (
                    <div className="flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
                        {/* Capture Wrapper */}
                        <div ref={captureRef} className="w-full flex justify-center p-4 bg-transparent">
                            <CardPreview
                                data={data}
                                onEditImage={() => fileInputRef.current?.click()}
                            />
                        </div>

                        {/* Export Buttons */}
                        <div className="w-full px-6">
                            <ExportButtons targetRef={captureRef} fileName={`JNJ_Card_${data.firstName || 'Contact'}`} />
                        </div>

                        <p className="text-xs text-center text-gray-400 max-w-xs mt-4">
                            This is how your card will appear on a mobile device.
                            <button className="text-primary font-medium ml-1" onClick={() => setViewMode("edit")}>Make changes</button>
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-left-4 duration-300">

                        {/* Photo Upload Section */}
                        <div className="bg-white dark:bg-card-dark p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                            <div
                                className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 relative cursor-pointer group"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {data.photoBase64 ? (
                                    <img src={data.photoBase64} className="w-full h-full object-cover" />
                                ) : (
                                    <User className="absolute inset-0 m-auto text-gray-400" />
                                )}
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ImageIcon size={20} className="text-white" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <label className="text-sm font-semibold text-navy dark:text-white block mb-1">Profile Photo</label>
                                <button
                                    className="text-xs text-primary font-medium bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    Change Photo
                                </button>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="flex flex-col gap-4">
                            <InputField
                                label="First Name"
                                value={data.firstName}
                                icon={User}
                                onChange={(v) => handleInputChange("firstName", v)}
                            />
                            <InputField
                                label="Last Name"
                                value={data.lastName}
                                icon={User}
                                onChange={(v) => handleInputChange("lastName", v)}
                            />
                            <InputField
                                label="Job Title"
                                value={data.title}
                                icon={Briefcase}
                                onChange={(v) => handleInputChange("title", v)}
                            />
                            <InputField
                                label="Email"
                                value={data.email}
                                icon={Mail}
                                type="email"
                                onChange={(v) => handleInputChange("email", v)}
                            />
                            <InputField
                                label="Mobile"
                                value={data.mobile}
                                icon={Phone}
                                type="tel"
                                onChange={(v) => handleInputChange("mobile", v)}
                            />
                            <InputField
                                label="Website"
                                value={data.website}
                                icon={Globe}
                                onChange={(v) => handleInputChange("website", v)}
                            />
                            <InputField
                                label="Address"
                                value={data.address}
                                icon={MapPin}
                                multiline
                                onChange={(v) => handleInputChange("address", v)}
                            />
                        </div>

                        <div className="h-12" /> {/* Spacer */}
                    </div>
                )}
            </div>
        </div>
    );
};

// Helper Input Component
const InputField = ({
    label, value, onChange, icon: Icon, type = "text", multiline = false
}: {
    label: string, value: string, onChange: (v: string) => void, icon?: any, type?: string, multiline?: boolean
}) => (
    <div className="w-full group">
        <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1.5 block ml-1">{label}</label>
        <div className="relative">
            {Icon && (
                <div className="absolute left-3 top-3 text-gray-400 group-focus-within:text-primary transition-colors">
                    <Icon size={18} />
                </div>
            )}
            {multiline ? (
                <textarea
                    value={value}
                    rows={3}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all shadow-sm resize-none"
                    placeholder={`Enter ${label}`}
                />
            ) : (
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all shadow-sm"
                    placeholder={`Enter ${label}`}
                />
            )}
        </div>
    </div>
)
