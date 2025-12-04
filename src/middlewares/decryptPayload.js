import { ApiResponse } from "../utils/ApiResponse.js";
import { decrypt } from "../utils/encryption.js";


const decryptPayload = (req, res, next) => {
  try {
    const { encryptedData } = req.body;

    if (!encryptedData) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Missing encrypted data"));
    }

    const decryptedJSON = decrypt(encryptedData);
    req.body.decryptedData = JSON.parse(decryptedJSON);

    next();
  } catch (error) {
    return res
      .status(400)
      .json(new ApiResponse(400, error, "Invalid encrypted payload"));
  }
};

export default decryptPayload;
