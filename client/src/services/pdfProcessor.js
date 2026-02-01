import * as pdfjsLib from 'pdfjs-dist';

// Set worker to load from public folder (must be copied there or served statically)
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

export const extractTextFromPDF = async (file) => {
    try {
        const arrayBuffer = await file.arrayBuffer();

        // precise timeout handling
        const extractionPromise = (async () => {
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            let fullText = '';

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item) => item.str).join(' ');
                fullText += pageText + '\n\n';
            }
            return fullText;
        })();

        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("PDF extraction timed out. Please try a text file or a smaller PDF.")), 15000)
        );

        return await Promise.race([extractionPromise, timeoutPromise]);
    } catch (error) {
        console.error("Error extracting PDF text:", error);
        throw new Error(error.message || "Failed to extract text from PDF");
    }
};
