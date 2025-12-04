import FormSchema from "../models/Form.model.js";
import {ApiResponse} from "../utils/ApiResponse.js";

// -------------------- GET ACTIVE FORM --------------------
const getActiveForm = async (req, res) => {
  try {
    const form = await FormSchema.findOne({ isActive: true });

    if (!form) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "No active form found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, form, "Active form fetched successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, error, "Server error while fetching form"));
  }
};

// -------------------- GET FORM BY ID --------------------
const getFormById = async (req, res) => {
  try {
    const form = await FormSchema.findById(req.params.id);

    if (!form) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Form not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, form, "Form fetched successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, error, "Server error while fetching form"));
  }
};

// -------------------- CREATE FORM --------------------
const createForm = async (req, res) => {
  try {
    const { name, description, schema } = req.body;

    const newForm = await FormSchema.create({
      name,
      description,
      schema,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, newForm, "Form created successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, error, "Server error while creating form"));
  }
};

// -------------------- DEACTIVATE FORM --------------------
const deactivateForm = async (req, res) => {
  try {
    const form = await FormSchema.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!form) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Form not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, form, "Form deactivated successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, error, "Server error while deactivating form"));
  }
};

export { getActiveForm, getFormById, deactivateForm, createForm };
