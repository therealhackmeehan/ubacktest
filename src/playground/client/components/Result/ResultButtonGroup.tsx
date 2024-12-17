import { useState } from "react"
import { FiSave, FiShare, FiDownload } from "react-icons/fi"
import NewResultModal from "../Modals/NewResultModal";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import LoadingScreen from "../Editor/LoadingScreen";

interface ResultButtonGroupProps {
    saveResult: (name: string) => Promise<void>;
    abilityToSaveNew: boolean;
    symbol: string;
}

export default function ResultButtonGroup({ saveResult, abilityToSaveNew, symbol }: ResultButtonGroupProps) {

    const [newResultModalOpen, setNewResultModalOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    
    const convertHtmlToCanvas = async (elementId: string) => {
        const content = document.getElementById(elementId);
        if (!content) {
            throw new Error(`Element with ID '${elementId}' not found.`);
        }

        return await html2canvas(content, {
            scale: 2, // Higher scale for better quality
            useCORS: true, // Enable for cross-origin images
        });
    };

    const pdfSaveHelper = async () => {
        const canvas = await convertHtmlToCanvas("pdfToSave");
        const imageData = canvas.toDataURL("image/png"); // Convert canvas to image

        const pdf = new jsPDF("l", "mm", "a4"); // Create a new PDF (portrait, mm units, A4 size)
        const pageWidth = pdf.internal.pageSize.getWidth();
        const imageWidth = canvas.width; // Divide by scale factor (2 in this case)
        const imageHeight = canvas.height;

        pdf.addImage(imageData, "PNG", 0, 0, pageWidth, (imageHeight / imageWidth) * pageWidth);
        pdf.save("result_" + symbol + '.pdf'); // Save the PDF with a file name
    };

    const saveAsPDF = async () => {
        setLoading(true);
        try {
            await pdfSaveHelper();
        } catch (error: any) {
            alert(error.message || "Failed to save PDF.");
        } finally {
            setLoading(false);
        }
    };

    const loadEmailHelper = async () => {
        const canvas = await convertHtmlToCanvas("pdfToSave");
        const imageData = canvas.toDataURL("image/png"); // Convert canvas to Base64

        // Example Email Setup
        const subject = encodeURIComponent("Check out my trading strategy!");
        const body = encodeURIComponent(
            `Hello,\n\nPlease find the chart below:\n\n` +
            `<img src="${imageData}" alt="Charts" />\n\n` +
            `Best regards,\nYour Name`
        );
        const mailtoLink = `mailto:?subject=${subject}&body=${body}`;

        // Open the default email client with the prefilled email
        window.location.href = mailtoLink;
    };

    const loadEmail = async () => {
        setLoading(true);
        try {
            await loadEmailHelper();
        } catch (error: any) {
            alert(error.message || "Failed to load email.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex justify-between'>

            {abilityToSaveNew &&
                <>
                    <button className='flex gap-x-1 items-center p-2 m-1 tracking-tight bg-slate-500 hover:bg-slate-900 rounded-md text-white font-extralight'
                        onClick={() => setNewResultModalOpen(true)}>
                        <FiSave />
                        save to my results
                    </button>
                    <div className="border-r-2 mx-2 border-black/60"></div>
                </>
            }

            {loading && <LoadingScreen />}

            {newResultModalOpen &&
                <NewResultModal onSuccess={saveResult}
                    closeModal={() => setNewResultModalOpen(false)} 
                    symbol={symbol}/>
            }

            <button className='flex gap-x-2 items-center p-2 m-1 tracking-tight bg-slate-600 hover:bg-slate-900 rounded-md text-white font-extralight'
                onClick={saveAsPDF}>
                <FiDownload /> download PDF
            </button>

            <button className='flex gap-x-2 items-center p-2 m-1 tracking-tight bg-slate-700 hover:bg-slate-900 rounded-md text-white font-extralight'
                onClick={loadEmail}>
                <FiShare /> share
            </button>
        </div>)
}