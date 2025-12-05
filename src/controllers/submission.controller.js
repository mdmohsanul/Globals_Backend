import Submission from "../models/submission.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { generateSubmissionPDF } from "../utils/pdfGenerator.js";
import fs from "fs";
import { uploadFileToSupabase } from "../utils/supabaseUpload.js";

const createSubmission = async (req, res) => {
  try {
    const userId = req.user._id;
    const { formSchemaId, encryptedData } = req.body;
    const decrypted = req.body.decryptedData;

    let resumeUrl = null;
    let photoUrl = null;

    // 1️⃣ Upload Resume
    if (req.files?.resume?.[0]) {
      const resumePath = req.files.resume[0].path;
      resumeUrl = await uploadFileToSupabase(resumePath, "resumes", userId);
    }

    // 2️⃣ Upload Photo
    if (req.files?.photo?.[0]) {
      const photoPath = req.files.photo[0].path;
      photoUrl = await uploadFileToSupabase(photoPath, "photos", userId);
    }

    // 3️⃣ Create Submission
    const submission = await Submission.create({
      userId,
      formSchemaId,
      encryptedData,
      resumeUrl,
      photoUrl,
      pdfUrl: null,
    });

    // 4️⃣ Generate PDF locally
    const localPdfPath = await generateSubmissionPDF(
      decrypted,
      resumeUrl,
      photoUrl
    );

    // 5️⃣ Upload PDF to Supabase
    const pdfUrl = await uploadFileToSupabase(
      localPdfPath,
      "submission-pdfs",
      userId
    );

    submission.pdfUrl = pdfUrl;
    await submission.save();

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          submission,
          "Submission created successfully with Supabase"
        )
      );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(new ApiResponse(500, error, "Failed to create submission"));
  }
};

// const createSubmission = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     const { formSchemaId, encryptedData } = req.body;
//     const decrypted = req.body.decryptedData;

//     let resumeUrl = null;
//     let photoUrl = null;

//     // ----------------------------------
//     // 1. Upload Resume to Cloudinary
//     // ----------------------------------
//     if (req.files?.resume?.[0]) {
//       const resumePath = req.files.resume[0].path;
//       const uploaded = await uploadOnCloudinary(resumePath, "raw");
//       resumeUrl = uploaded?.secure_url || null;
//     }
//     console.log(resumeUrl);
//     // ----------------------------------
//     // 2. Upload Photo to Cloudinary
//     // ----------------------------------
//     if (req.files?.photo?.[0]) {
//       const photoPath = req.files.photo[0].path;
//       const uploaded = await uploadOnCloudinary(photoPath, "image");
//       photoUrl = uploaded?.secure_url || null;
//     }

//     // ----------------------------------
//     // 3. Create Submission (PDF URL pending)
//     // ----------------------------------
//     const submission = await Submission.create({
//       userId,
//       formSchemaId,
//       encryptedData,
//       resumeUrl,
//       photoUrl,
//       pdfUrl: null,
//     });

//     // ----------------------------------
//     // 4. Generate local PDF using decrypted data
//     // ----------------------------------
//     const localPdfPath = await generateSubmissionPDF(
//       decrypted,
//       resumeUrl,
//       photoUrl
//     );
//     console.log("LOCAL PDF PATH:", localPdfPath);
//     console.log("FILE EXISTS:", fs.existsSync(localPdfPath));
//     console.log("FILE SIZE:", fs.statSync(localPdfPath).size);

//     // ----------------------------------
//     // 5. Upload PDF to Cloudinary
//     // ----------------------------------
//     const pdfUpload = await uploadOnCloudinary(localPdfPath, "raw");

//     const pdfUrl = pdfUpload?.secure_url || null;

//     // ----------------------------------
//     // 6. Update submission with pdfUrl
//     // ----------------------------------
//     submission.pdfUrl = pdfUrl;
//     await submission.save();

//     return res
//       .status(201)
//       .json(
//         new ApiResponse(
//           201,
//           submission,
//           "Submission created and PDF generated successfully"
//         )
//       );
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json(new ApiResponse(500, error, "Failed to create submission"));
//   }
// };

const getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, submissions, "Submissions fetched successfully")
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, error, "Failed to fetch submissions"));
  }
};

export { createSubmission, getMySubmissions };
