import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    formSchemaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FormSchema",
      required: true,
    },

    encryptedData: {
      type: String,
      required: true,
    },

    // URL of generated PDF (after backend creates it)
    pdfUrl: {
      type: String,
      default: null,
    },

    // Resume & photo optional URLs (if uploads exist)
    resumeUrl: {
      type: String,
      default: null,
    },

    photoUrl: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Submission", submissionSchema);
