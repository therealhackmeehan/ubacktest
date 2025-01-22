import { useState } from "react"
import { FiSave, FiShare, FiDownload } from "react-icons/fi"
import NewResultModal from "../modals/NewResultModal";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import LoadingScreen from "../../../../client/components/LoadingScreen";

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
        const originalElement = document.getElementById("pdfToSave") as HTMLElement;

        if (!originalElement) throw new Error('No Strategy Result to Save.');

        // Create a clone of the element
        const clonedElement = originalElement.cloneNode(true) as HTMLElement;
        clonedElement.style.width = "800px"; // Fixed width
        clonedElement.style.height = "600px"; // Fixed height
        clonedElement.style.position = "absolute"; // Position it off-screen
        clonedElement.style.left = "-9999px";

        // Append the cloned element to the body
        document.body.appendChild(clonedElement);

        // Generate the canvas from the cloned element
        const canvas = await html2canvas(clonedElement);

        const imageData = canvas.toDataURL("image/png"); // Convert canvas to image

        const pdf = new jsPDF("l", "mm", "a4"); // Create a new PDF (landscape, mm units, A4 size)
        // pdf.addImage(imageData, 'JPEG', 0, 0, 0, 0, 0, 0, 0);
        pdf.save("result_" + symbol + ".pdf"); // Save the PDF with a file name

        // Remove the cloned element from the DOM
        document.body.removeChild(clonedElement);
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
                    symbol={symbol} />
            }

            <button className='flex gap-x-2 items-center p-2 m-1 tracking-tight bg-slate-600 hover:bg-slate-900 rounded-md text-white'
                onClick={saveAsPDF}>
                <FiDownload /> download PDF
            </button>

            <button className='flex gap-x-2 items-center p-2 m-1 tracking-tight bg-slate-700 hover:bg-slate-900 rounded-md text-white'
                onClick={loadEmail}>
                <FiShare /> share
            </button>
        </div>)
}