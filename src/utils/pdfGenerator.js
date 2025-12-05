import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateSubmissionPDF = (data, resumeUrl, photoBuffer) => {
  return new Promise((resolve, reject) => {
    try {
      const pdfPath = `uploads/submission-${Date.now()}.pdf`;
      const doc = new PDFDocument();
      const stream = fs.createWriteStream(pdfPath);

      doc.pipe(stream);

      doc.fontSize(20).text("Job Application Summary", { underline: true });

      Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value)) value = value.join(", ");
        doc.text(`${key}: ${value}`);
      });

      doc.moveDown();

      // embed image ONLY if buffer is ready
      if (photoBuffer) {
        doc.text("Photo:");
        doc.image(photoBuffer, { width: 120 });
      }

      if (resumeUrl) {
        doc.text(`Resume URL: ${resumeUrl}`);
      }

      doc.end();

      stream.on("finish", () => resolve(pdfPath));
      stream.on("error", reject);
    } catch (err) {
      reject(err);
    }
  });
};
