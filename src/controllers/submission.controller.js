import Submission from "../models/Submission.model.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { generateSubmissionPDF } from "../utils/pdfGenerator.js";
import fs from "fs";

const createSubmission = async (req, res) => {
  try {
    const userId = req.user._id;
    const { formSchemaId, encryptedData } = req.body;
    const decryptedData = req.body.decryptedData;

    let resumeUrl = null;
    let photoUrl = null;

    // ----------------------------------
    // 1. Upload Resume to Cloudinary
    // ----------------------------------
    if (req.files?.resume?.[0]) {
      const resumePath = req.files.resume[0].path;
      const uploaded = await uploadOnCloudinary(resumePath);
      resumeUrl = uploaded?.secure_url || null;
    }


    // ----------------------------------
    // 2. Upload Photo to Cloudinary
    // ----------------------------------
    if (req.files?.photo?.[0]) {
      const photoPath = req.files.photo[0].path;
      const uploaded = await uploadOnCloudinary(photoPath);
      photoUrl = uploaded?.secure_url || null;
    }

    // ----------------------------------
    // 3. Create Submission (PDF URL pending)
    // ----------------------------------
    const submission = await Submission.create({
      userId,
      formSchemaId,
      encryptedData,
      resumeUrl,
      photoUrl,
      pdfUrl: null,
    });

    // ----------------------------------
    // 4. Generate local PDF using decrypted data
    // ----------------------------------
    const localPdfPath = await generateSubmissionPDF(
      decryptedData,
      resumeUrl,
      photoUrl
    );

    // ----------------------------------
    // 5. Upload PDF to Cloudinary (resource_type raw)
    // ----------------------------------
   const pdfUpload = await uploadOnCloudinary(localPdfPath, "raw");

    const pdfUrl = pdfUpload?.secure_url || null;

    // ----------------------------------
    // 6. Update submission with pdfUrl
    // ----------------------------------
    submission.pdfUrl = pdfUrl;
    await submission.save();

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          submission,
          "Submission created and PDF generated successfully"
        )
      );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(new ApiResponse(500, error, "Failed to create submission"));
  }
};




const getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, submissions, "Submissions fetched successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, error, "Failed to fetch submissions"));
  }
};


export {createSubmission,getMySubmissions}