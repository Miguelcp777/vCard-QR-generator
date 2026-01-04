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
        if (!targetRef.current) return;
        setIsExporting(true);

        try {
            // Delay to ensure rendering (fonts, layout)
            await new Promise(resolve => setTimeout(resolve, 500));

            const dataUrl = await toPng(targetRef.current, {
                cacheBust: true,
                pixelRatio: 3, // High resolution (3x)
            });

            const link = document.createElement("a");
            link.download = `${fileName}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error("Export failed:", err);
            alert(`Failed to export image. ${err instanceof Error ? err.message : String(err)}`);
        } finally {
            setIsExporting(false);
        }
    };

    const handleDownloadPDF = async () => {
        if (!targetRef.current) return;
        setIsExporting(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 100));

            const imgData = await toPng(targetRef.current, {
                cacheBust: true,
                pixelRatio: 3, // Match PNG quality
            });

            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
            });

            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
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
