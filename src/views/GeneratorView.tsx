import { useState, useRef } from "react";
import type { ChangeEvent } from "react";
import type { ContactData } from "../utils/vcard";
import { CardPreview } from "../components/CardPreview";
import { ExportButtons } from "../components/ExportButtons";
import {
    User, Briefcase, Phone, Mail, Globe, MapPin,
    Image as ImageIcon, Eye, Edit3
} from "lucide-react";
import { JNJLogo } from "../components/JNJLogo";
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
            const reader = new FileReader();
            reader.onloadend = () => {
                // Resize image to max 400x400 to prevent mobile memory crash during export
                const img = new Image();
                img.src = reader.result as string;
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    const maxSize = 400; // Sufficient for the 128px avatar

                    let width = img.width;
                    let height = img.height;

                    // Calculate aspect ratio
                    if (width > height) {
                        if (width > maxSize) {
                            height *= maxSize / width;
                            width = maxSize;
                        }
                    } else {
                        if (height > maxSize) {
                            width *= maxSize / height;
                            height = maxSize;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    if (ctx) {
                        ctx.drawImage(img, 0, 0, width, height);
                        // Using JPEG 0.8 for good balance of size/quality
                        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.85);

                        setData(prev => ({
                            ...prev,
                            photoBase64: compressedBase64
                        }));
                    }
                };
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-col h-full bg-red-50/30 dark:bg-background-dark pt-4 sm:pt-6">
            {/* Header - Now has top spacing from root padding */}
            <header className="px-4 py-3 bg-primary dark:bg-card-dark shadow-md z-10 sticky top-0 flex justify-between items-center text-white gap-2 mx-4 sm:mx-6 rounded-t-xl">
                <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden">
                    <JNJLogo className="h-4 sm:h-5 w-auto text-white fill-white flex-shrink-0" />
                    <div className="h-4 w-px bg-white/20 mx-1 flex-shrink-0"></div>
                    <h1 className="text-[10px] sm:text-xs leading-none font-semibold tracking-wide uppercase opacity-90 font-display flex flex-col justify-center min-w-0">
                        <span className="whitespace-nowrap">vCard QR</span>
                        <span className="whitespace-nowrap">Generator</span>
                    </h1>
                </div>
                <div className="flex bg-white/10 dark:bg-gray-800 rounded-lg p-1 gap-1 backdrop-blur-sm flex-shrink-0">
                    <button
                        onClick={() => setViewMode("edit")}
                        className={clsx("p-1.5 rounded-md transition-all", viewMode === "edit" ? "bg-white text-primary shadow-sm" : "text-white/70 hover:bg-white/10")}
                    >
                        <Edit3 size={16} />
                    </button>
                    <button
                        onClick={() => setViewMode("preview")}
                        className={clsx("p-1.5 rounded-md transition-all", viewMode === "preview" ? "bg-white text-primary shadow-sm" : "text-white/70 hover:bg-white/10")}
                    >
                        <Eye size={16} />
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

            {/* Content - Removed p-6 to make content full width matching header if desired */}
            <div className="flex-1 overflow-y-auto no-scrollbar">

                {viewMode === "preview" ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Main Preview Frame - Matching Edit Mode */}
                        <div className="bg-white/90 dark:bg-card-dark backdrop-blur-sm shadow-xl border border-white/50 dark:border-gray-700 mx-4 sm:mx-6 rounded-b-3xl p-5 sm:p-6 mb-6 flex flex-col items-center gap-6">
                            {/* Capture Wrapper - Constrained width to prevent massive canvas generation */}
                            <div className="w-full flex justify-center p-4">
                                <div ref={captureRef} className="w-full max-w-sm bg-transparent">
                                    <CardPreview
                                        data={data}
                                        onEditImage={() => fileInputRef.current?.click()}
                                    />
                                </div>
                            </div>

                            {/* Export Buttons */}
                            <div className="w-full px-6 flex justify-center">
                                <div className="w-full max-w-md">
                                    <ExportButtons targetRef={captureRef} fileName={`JNJ_Card_${data.firstName || 'Contact'}`} />
                                </div>
                            </div>

                            <p className="text-xs text-center text-gray-400 max-w-xs mt-4">
                                This is how your card will appear on a mobile device.
                                <button className="text-primary font-medium ml-1" onClick={() => setViewMode("edit")}>Make changes</button>
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                        {/* Main Edit Frame - Aligned with Header Width */}
                        <div className="bg-white/90 dark:bg-card-dark backdrop-blur-sm shadow-xl border border-white/50 dark:border-gray-700 mx-4 sm:mx-6 rounded-b-3xl p-5 sm:p-6 mb-6">

                            <div className="flex flex-col gap-6">
                                {/* Photo Upload Section - Simplified to blend in */}
                                <div className="flex items-center gap-4 pb-6 border-b border-gray-100 dark:border-gray-800">
                                    <div
                                        className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 relative cursor-pointer group ring-4 ring-gray-50 dark:ring-gray-800 shadow-inner"
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
                                            className="text-xs text-primary font-medium bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10 hover:bg-primary/10 transition-colors"
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
                            </div>
                        </div>
                        <div className="h-4" /> {/* Spacer */}
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
