import { useState } from "react";
import { Download, FileText } from "lucide-react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import type { RefObject } from "react";

interface ExportButtonsProps {
    targetRef: RefObject<HTMLDivElement | null>;
    fileName?: string;
}

export const ExportButtons = ({ targetRef, fileName = "business-card" }: ExportButtonsProps) => {
    const [isExporting, setIsExporting] = useState(false);

    const handleDownloadPNG = async () => {
        if (!targetRef.current) {
            alert("Export Error: Element not found. Please reload.");
            return;
        }
        setIsExporting(true);

        try {
            console.log("Starting export...");

            // 1. Force wait for all images/canvases
            const images = targetRef.current.querySelectorAll("img");

            // Simple wait for logic
            await Promise.all([
                ...Array.from(images).map(img => {
                    if (img.complete) return Promise.resolve();
                    return new Promise(resolve => { img.onload = resolve; img.onerror = resolve; });
                }),
                // Allow canvases time to paint
                new Promise(resolve => setTimeout(resolve, 500))
            ]);

            // 2. Extra safety delay for mobile rendering/decoding
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Get standard dimensions to force canvas size if needed, but rely on auto first.
            const dataUrl = await toPng(targetRef.current, {
                cacheBust: false,
                pixelRatio: 2,
                backgroundColor: "#ffffff",
                style: { background: "white" }
            });

            if (!dataUrl || dataUrl.length < 100) {
                throw new Error("Generated image is empty. Please try again.");
            }

            const link = document.createElement("a");
            link.download = `${fileName}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error("Export failed:", err);
            // Detailed alert for user feedback
            alert(`Error de exportación: ${err instanceof Error ? err.message : String(err)}. Intente recargar la página.`);
        } finally {
            setIsExporting(false);
        }
    };

    const handleDownloadPDF = async () => {
        if (!targetRef.current) return;
        setIsExporting(true);

        try {
            const images = targetRef.current.querySelectorAll("img");
            await Promise.all(Array.from(images).map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise(resolve => {
                    img.onload = resolve;
                    img.onerror = resolve;
                });
            }));

            await new Promise(resolve => setTimeout(resolve, 2500));

            const imgData = await toPng(targetRef.current, {
                cacheBust: false,
                pixelRatio: 2,
                backgroundColor: "#ffffff",
                style: { background: "white" }
            });

            // Create temporary image to get dimensions
            const img = new Image();
            img.src = imgData;
            await new Promise((resolve) => { img.onload = resolve; });

            // Create PDF with exact image dimensions
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "px",
                format: [img.width, img.height] // Set page size to image size
            });

            pdf.addImage(imgData, "PNG", 0, 0, img.width, img.height);
            pdf.save(`${fileName}.pdf`);
        } catch (err) {
            console.error("PDF Export failed:", err);
            alert("Failed to export PDF. Please try again.");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="flex gap-3 justify-center w-full max-w-sm mx-auto mt-6">
            <button
                onClick={handleDownloadPNG}
                disabled={isExporting}
                className="flex-1 flex items-center justify-center gap-2 bg-navy text-white px-4 py-3 rounded-xl font-semibold shadow-lg active:scale-95 transition-all text-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
                <Download size={18} />
                {isExporting ? "Saving..." : "Save Image"}
            </button>
            <button
                onClick={handleDownloadPDF}
                disabled={isExporting}
                className="flex-1 flex items-center justify-center gap-2 bg-white text-navy border border-gray-200 px-4 py-3 rounded-xl font-semibold shadow-sm active:scale-95 transition-all text-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
                <FileText size={18} />
                {isExporting ? "Saving..." : "Save PDF"}
            </button>
        </div>
    );
};
