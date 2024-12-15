import { useState } from "react"
import { FiSave, FiShare, FiDownload } from "react-icons/fi"
import NewResultModal from "../Modals/NewResultModal";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import LoadingScreen from "../Editor/LoadingScreen";

interface ResultButtonGroupProps {
    saveResult: (name: string) => Promise<void>;
    abilityToSaveNew: boolean
}

export default function ResultButtonGroup({ saveResult, abilityToSaveNew }: ResultButtonGroupProps) {

    const [newResultModalOpen, setNewProjectModalOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const pdfSaveHelper = async () => {

        const content = document.getElementById("pdfToSave"); // ID of the element you want to capture
        if (content) {
            // Use html2canvas to capture the HTML element
            const canvas = await html2canvas(content, {
                scale: 2, // Higher scale for better quality
                useCORS: true, // Enable if you have images with cross-origin issues
            });

            const imageData = canvas.toDataURL("image/png"); // Convert canvas to image

            const pdf = new jsPDF("p", "mm", "a4"); // Create a new PDF (portrait, mm units, A4 size)

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const imageWidth = canvas.width / 2; // Divide by scale factor (2 in this case)
            const imageHeight = canvas.height / 2;

            if (imageHeight > pageHeight) {
                // If the content overflows, add multiple pages
                let remainingHeight = imageHeight;
                let position = 0;

                while (remainingHeight > 0) {
                    pdf.addImage(imageData, "PNG", 0, position, pageWidth, pageHeight);
                    remainingHeight -= pageHeight;
                    position += pageHeight;

                    if (remainingHeight > 0) {
                        pdf.addPage(); // Add a new page for remaining content
                    }
                }
            } else {
                // Add single-page content
                pdf.addImage(imageData, "PNG", 0, 0, pageWidth, (imageHeight / imageWidth) * pageWidth);
            }

            pdf.save("myResult.pdf"); // Save the PDF with a file name
        }

    };

    const saveAsPDF = async () => {

        setLoading(true);

        try {
            await pdfSaveHelper()
        } catch (error: any) {
            alert(error.msg)
        }

        setLoading(false)
    }

    const loadEmailHelper = async () => {
        const content = document.getElementById("pdfToSave"); // ID of the element to capture

        if (content) {
            const canvas = await html2canvas(content, {
                scale: 2, // Higher scale for better quality
                useCORS: true, // Enable if cross-origin images are used
            });

            const imageData = canvas.toDataURL("image/png"); // Convert canvas to Base64

            // Example Email Setup
            const subject = encodeURIComponent("Check out my charts!");
            const body = encodeURIComponent(
                `Hello,\n\nPlease find the chart below:\n\n` +
                `<img src="${imageData}" alt="Charts" />\n\n` +
                `Best regards,\nYour Name`
            );
            const mailtoLink = `mailto:?subject=${subject}&body=${body}`;

            // Open the default email client with the prefilled email
            window.location.href = mailtoLink;
        }
    }

    const loadEmail = async () => {
        setLoading(true);

        try {
            await loadEmailHelper();
        } catch (error: any) {
            alert(error.msg)
        }

        setLoading(false);
    }

    return (
        <div className='flex justify-between'>

            {abilityToSaveNew &&
                <>
                    <button className='flex gap-x-1 items-center p-2 m-1 tracking-tight bg-slate-500 hover:bg-slate-900 rounded-md text-white font-extralight'
                        onClick={() => setNewProjectModalOpen(true)}>
                        <FiSave />
                        save to my results
                    </button>
                    <div className="border-r-2 mx-2 border-black/60"></div>
                </>
            }

            {loading && <LoadingScreen />}

            {newResultModalOpen &&
                <NewResultModal onSuccess={saveResult}
                    onFailure={() => setNewProjectModalOpen(false)} />
            }

            <button className='flex gap-x-2 items-center p-2 m-1 tracking-tight bg-slate-600 hover:bg-slate-900 rounded-md text-white font-extralight'
                onClick={saveAsPDF}>
                <FiDownload /> download PDF
            </button>

            <button className='flex gap-x-2 items-center p-2 m-1 tracking-tight bg-slate-700 hover:bg-slate-900 rounded-md text-white font-extralight'
                onClick={loadEmail}>
                <FiShare /> share
            </button>

            <button className='p-2 m-1 tracking-tight bg-slate-800 hover:bg-slate-900 rounded-md text-white font-light'>
                Implement With Real Money
                <span className="pl-1 text-xs font-extrabold tracking-tight uppercase align-top">
                    (Beta)
                </span>
            </button>
        </div>)
}