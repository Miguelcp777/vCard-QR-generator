import type { ContactData } from "../utils/vcard";
import { QRCodeCanvas } from "qrcode.react";
import { Phone, Mail, Globe, MapPin, Scan, Edit2 } from "lucide-react";
import clsx from "clsx";
import { generateVCard } from "../utils/vcard";

interface CardPreviewProps {
    data: ContactData;
    className?: string;
    onEditImage?: () => void;
}

export const CardPreview = ({ data, className, onEditImage }: CardPreviewProps) => {
    const vCardData = generateVCard(data, true);

    return (
        <div className={clsx("relative w-full max-w-sm mx-auto", className)}>
            <div className="bg-white dark:bg-card-dark rounded-[1.5rem] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col items-center border border-gray-100 dark:border-gray-700">

                {/* Header Section */}
                <div className="w-full bg-white dark:bg-card-dark pt-8 pb-12 px-6 flex justify-center relative">
                    {/* J&J Logo Text */}
                    <h2 className="text-3xl font-bold text-primary tracking-tight font-display text-center">
                        Johnson<span className="font-normal">&</span>Johnson
                    </h2>
                </div>

                {/* Overlapping Avatar Section - Helper for robust export */}
                <div className="relative -mt-10 mb-6 group cursor-pointer shrink-0" onClick={onEditImage}>
                    <div className="w-32 h-32 rounded-full border-[6px] border-white dark:border-card-dark shadow-md bg-gray-200 shrink-0 flex items-center justify-center overflow-hidden relative">
                        {data.photoBase64 ? (
                            <img
                                src={data.photoBase64}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="material-symbols-rounded text-4xl text-gray-400">person</span>
                        )}
                    </div>
                    <div className="absolute bottom-1 right-1 bg-primary text-white p-1.5 rounded-full shadow-lg z-10">
                        <Edit2 size={14} />
                    </div>
                </div>

                {/* User Info */}
                <div className="text-center w-full px-4 mb-6 pt-2">
                    <h3 className="text-2xl font-bold text-navy dark:text-white mb-2 leading-tight font-display">
                        {data.firstName || "Name"} {data.lastName}
                    </h3>
                    <p className="text-primary font-semibold text-sm uppercase tracking-wide mb-1 leading-relaxed">
                        {data.title || "Position"}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                        {data.company}
                    </p>
                </div>

                {/* Contact Details List */}
                <div className="w-full flex flex-col gap-4 text-sm text-text-secondary-light dark:text-text-secondary-dark mb-10 pl-8 pr-6">
                    <div className="flex items-center gap-4 py-1">
                        <Phone size={18} className="text-primary shrink-0" />
                        <span className="font-medium break-all leading-relaxed pt-0.5">{data.mobile || "+1 234 567 890"}</span>
                    </div>
                    <div className="flex items-center gap-4 py-1">
                        <Mail size={18} className="text-primary shrink-0" />
                        <span className="font-medium break-all leading-relaxed pt-0.5">{data.email || "email@jnj.com"}</span>
                    </div>
                    <div className="flex items-center gap-4 py-1">
                        <Globe size={18} className="text-primary shrink-0" />
                        <span className="font-medium break-all leading-relaxed pt-0.5">{data.website || "www.jnj.com"}</span>
                    </div>
                    <div className="flex items-start gap-4 py-1">
                        <MapPin size={18} className="text-primary shrink-0 mt-1" />
                        <span className="text-xs leading-relaxed pt-0.5">
                            {data.address || "Address"}
                        </span>
                    </div>
                </div>

                {/* Footer / QR Section */}
                <div className="w-full bg-gray-50 dark:bg-gray-800/50 p-6 border-t border-gray-100 dark:border-gray-700/50 flex flex-col items-center gap-4 text-center">
                    <div className="bg-white p-2 rounded-xl shadow-sm">
                        <QRCodeCanvas
                            value={vCardData}
                            size={512} // High-res internal rendering (optimized)
                            level="M"
                            includeMargin={true}
                            style={{ width: 160, height: 160 }} // Constraint for display
                        />
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="font-bold text-navy dark:text-white text-sm font-display uppercase flex items-center gap-2">
                            <Scan size={16} className="text-primary" />
                            Scan Contact
                        </span>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight mt-1 max-w-[200px]">
                            Point your camera at the QR code to instantly save the contact.
                        </p>
                    </div>
                </div>

                {/* Safe Zone for Export Clipping */}
                <div className="w-full h-8 bg-transparent" />
            </div>
        </div>
    );
};

