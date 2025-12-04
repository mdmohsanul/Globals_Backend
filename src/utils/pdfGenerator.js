import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateSubmissionPDF = (data, resumeUrl, photoUrl) => {
  return new Promise((resolve, reject) => {
    try {
      const pdfPath = path.join("uploads", `submission-${Date.now()}.pdf`);
      const doc = new PDFDocument({ autoFirstPage: true });
      const stream = fs.createWriteStream(pdfPath);

      // Pipe PDF into file stream
      doc.pipe(stream);

      // Title
      doc.fontSize(20).text("Job Application Summary", { underline: true });
      doc.moveDown();

      // Basic Information
      doc.fontSize(14).text(`Full Name: ${data.fullName || "N/A"}`);
      doc.text(`Email: ${data.email || "N/A"}`);
      doc.text(`Phone: ${data.phone || "N/A"}`);
      doc.text(`Gender: ${data.gender || "N/A"}`);
      doc.text(`Position: ${data.position || "N/A"}`);
      doc.text(`Experience: ${data.experience || "N/A"} years`);
      doc.moveDown();

      // Skills
      if (data.skills?.length) {
        doc.text(`Skills: ${data.skills.join(", ")}`);
        doc.moveDown();
      }

      // Try embedding photo
      if (photoUrl) {
        try {
          doc.text("Profile Photo:");
          doc.image(photoUrl, { width: 120 });
          doc.moveDown();
        } catch (err) {
          doc.text("(Unable to load profile photo)");
        }
      }

      // Resume Link
      if (resumeUrl) {
        doc
          .fillColor("blue")
          .text("Resume Link", { link: resumeUrl, underline: true });
      }

      // END PDF — This triggers stream finish
      doc.end();

      // ONLY RESOLVE WHEN STREAM IS DONE
      stream.on("finish", () => {
        console.log("PDF generated at:", pdfPath);
        resolve(pdfPath);
      });

      stream.on("error", (err) => {
        console.error("PDF stream error:", err);
        reject(err);
      });

    } catch (err) {
      console.error("PDF generator error:", err);
      reject(err);
    }
  });
};
