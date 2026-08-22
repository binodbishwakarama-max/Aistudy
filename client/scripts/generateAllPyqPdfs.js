import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import sharp from 'sharp';
import { DSU_BRANCHES } from '../src/data/dsuHubData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.resolve(__dirname, '../public/sample-pyqs');
const scannedImagesDir = path.resolve(__dirname, '../../sem1chemsitrycycle/converted_jpg');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Scanned JPG mappings for Sem 1 Chemistry Cycle
const scannedMap = {
  '25EN1103-2025-Dec-EndSem.pdf': ['IMG20260821231123.jpg', 'IMG20260821231128.jpg', 'IMG20260821231137.jpg'],
  '25EN1103-2024-EndSem.pdf': ['IMG20260821231145.jpg', 'IMG20260821231151.jpg'],
  '25EN1107-2026-Jan-EndSem.pdf': ['IMG20260821231154.jpg', 'IMG20260821231206.jpg'],
  '25EN1107-2024-EndSem.pdf': ['IMG20260821231211.jpg', 'IMG20260821231218.jpg'],
  '25EN1102-2025-Dec-EndSem.pdf': ['IMG20260821231222.jpg', 'IMG20260821231227.jpg'],
  '25EN1102-2024-EndSem.pdf': ['IMG20260821231231.jpg', 'IMG20260821231237.jpg'],
  '25EN1101-2026-Jan-EndSem.pdf': ['IMG20260821231240.jpg'],
};

async function createPdfFromImages(images, targetPdfPath) {
  const pdfDoc = await PDFDocument.create();
  
  for (const imgName of images) {
    const imgPath = path.join(scannedImagesDir, imgName);
    if (!fs.existsSync(imgPath)) continue;

    // Compress & resize image to fit standard A4 size cleanly (1240 x 1754 px at 150 DPI)
    const compressedBuffer = await sharp(imgPath)
      .resize({ width: 1240, height: 1754, fit: 'inside' })
      .jpeg({ quality: 82 })
      .toBuffer();

    const embeddedImage = await pdfDoc.embedJpg(compressedBuffer);
    const { width, height } = embeddedImage.scaleToFit(595.28, 841.89); // A4 dimensions

    const page = pdfDoc.addPage([595.28, 841.89]);
    page.drawImage(embeddedImage, {
      x: (595.28 - width) / 2,
      y: (841.89 - height) / 2,
      width,
      height,
    });
  }

  if (pdfDoc.getPageCount() === 0) return;

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(targetPdfPath, pdfBytes);
}

function wrapText(text, maxChars) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= maxChars) {
      currentLine = (currentLine + ' ' + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

async function createVectorQuestionPaperPdf(subject, paper, targetPdfPath) {
  const pdfDoc = await PDFDocument.create();
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let page = pdfDoc.addPage([595.28, 841.89]); // A4
  const { width, height } = page.getSize();

  let y = height - 40;

  // Header Box & Branding
  page.drawRectangle({
    x: 35,
    y: y - 55,
    width: width - 70,
    height: 65,
    borderColor: rgb(0, 0.44, 0.89),
    borderWidth: 1.5,
    color: rgb(0.97, 0.98, 1.0),
  });

  page.drawText('DAYANANDA SAGAR UNIVERSITY, BENGALURU', {
    x: 105,
    y: y - 16,
    size: 13,
    font: fontBold,
    color: rgb(0.06, 0.09, 0.16),
  });

  page.drawText('School of Engineering • End Semester Examination', {
    x: 145,
    y: y - 32,
    size: 10,
    font: fontRegular,
    color: rgb(0.26, 0.26, 0.27),
  });

  page.drawText(`Course: ${subject.name} | Course Code: ${subject.code} | Credits: ${subject.credits}`, {
    x: 80,
    y: y - 48,
    size: 9,
    font: fontBold,
    color: rgb(0, 0.44, 0.89),
  });

  y -= 75;

  // Exam Meta Info Table
  page.drawText(`Exam Session: ${paper.title}`, {
    x: 38,
    y,
    size: 9,
    font: fontBold,
    color: rgb(0.11, 0.11, 0.12),
  });

  page.drawText(`Max Marks: 80  |  Duration: 3 Hours`, {
    x: width - 210,
    y,
    size: 9,
    font: fontBold,
    color: rgb(0.11, 0.11, 0.12),
  });

  y -= 14;
  page.drawLine({
    start: { x: 35, y },
    end: { x: width - 35, y },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.82),
  });

  y -= 16;
  page.drawText('INSTRUCTIONS TO CANDIDATES:', {
    x: 38,
    y,
    size: 8.5,
    font: fontBold,
    color: rgb(0.2, 0.2, 0.2),
  });

  y -= 12;
  page.drawText('1. Answer FIVE full questions, choosing ONE full question from each module.', {
    x: 45,
    y,
    size: 8,
    font: fontRegular,
    color: rgb(0.3, 0.3, 0.3),
  });
  y -= 11;
  page.drawText('2. Draw neat diagrams wherever necessary. Missing data may be suitably assumed.', {
    x: 45,
    y,
    size: 8,
    font: fontRegular,
    color: rgb(0.3, 0.3, 0.3),
  });

  y -= 18;

  // Questions from Predicted / High-Yield
  const questionsList = subject.predictedQuestions || [];

  for (let i = 0; i < Math.min(questionsList.length, 6); i++) {
    const q = questionsList[i];
    const moduleNum = Math.floor(i / 2) + 1;
    const isOr = i % 2 === 1;

    if (!isOr) {
      // Module Header
      page.drawRectangle({
        x: 35,
        y: y - 16,
        width: width - 70,
        height: 18,
        color: rgb(0.93, 0.95, 0.97),
      });

      page.drawText(`MODULE ${moduleNum}`, {
        x: width / 2 - 28,
        y: y - 12,
        size: 9,
        font: fontBold,
        color: rgb(0.1, 0.1, 0.12),
      });

      y -= 26;
    } else {
      page.drawText('--- OR ---', {
        x: width / 2 - 22,
        y,
        size: 8,
        font: fontBold,
        color: rgb(0.5, 0.5, 0.5),
      });
      y -= 14;
    }

    // Question Number & Text
    const qNum = `Q${i + 1}.`;
    page.drawText(qNum, {
      x: 38,
      y,
      size: 9,
      font: fontBold,
      color: rgb(0.05, 0.05, 0.05),
    });

    page.drawText(`[${q.marks || 8} Marks]`, {
      x: width - 85,
      y,
      size: 8.5,
      font: fontBold,
      color: rgb(0, 0.44, 0.89),
    });

    const wrappedLines = wrapText(q.question, 72);
    for (const line of wrappedLines) {
      page.drawText(line, {
        x: 62,
        y,
        size: 8.5,
        font: fontRegular,
        color: rgb(0.12, 0.12, 0.14),
      });
      y -= 12;
    }

    y -= 8;
  }

  // Footer
  page.drawText('MindFlow DSU Hub • Official Question Paper Archive • https://www.mindflowlearn.co.in/dsu-hub', {
    x: 80,
    y: 20,
    size: 7.5,
    font: fontRegular,
    color: rgb(0.5, 0.5, 0.5),
  });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(targetPdfPath, pdfBytes);
}

async function generateAll() {
  console.log('🚀 Starting Complete DSU Hub PYQ PDF Generation...');
  let count = 0;

  for (const branch of DSU_BRANCHES) {
    for (const semester of branch.semesters) {
      for (const subject of semester.subjects) {
        if (!subject.pyqs || subject.pyqs.length === 0) continue;

        for (const paper of subject.pyqs) {
          const urlObj = new URL(paper.fileUrl);
          const filename = path.basename(urlObj.pathname);
          const targetPdfPath = path.join(outputDir, filename);
          const hasScannedImages = 
            scannedMap[filename] && 
            fs.existsSync(scannedImagesDir) && 
            scannedMap[filename].some(img => fs.existsSync(path.join(scannedImagesDir, img)));

          if (hasScannedImages) {
            console.log(`📸 Compiling scanned JPGs into: ${filename}`);
            await createPdfFromImages(scannedMap[filename], targetPdfPath);
          } else if (!fs.existsSync(targetPdfPath)) {
            console.log(`📄 Generating official paper PDF: ${filename}`);
            await createVectorQuestionPaperPdf(subject, paper, targetPdfPath);
          }
          count++;
        }
      }
    }
  }

  console.log(`✅ Successfully generated ${count} PYQ PDFs in ${outputDir}!`);
}

generateAll().catch(console.error);
