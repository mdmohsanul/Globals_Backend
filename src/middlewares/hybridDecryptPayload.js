
import { ApiResponse } from "../utils/ApiResponse.js";
import { decryptHybrid } from "../utils/hybridDecrypt.js";

const hybridDecryptPayload = (req, res, next) => {
  try {
    const { encryptedKey, encryptedData, iv } = req.body;

    if (!encryptedKey || !encryptedData || !iv) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            null,
            "Missing encryption payload (encryptedKey, encryptedData, iv)"
          )
        );
    }

    const decryptedJSON = decryptHybrid(encryptedKey, encryptedData, iv);
    req.body.decryptedData = decryptedJSON;

    next();
  } catch (error) {
    console.error("Hybrid decrypt error:", error);
    return res
      .status(400)
      .json(
        new ApiResponse(400, { code: error.code }, "Invalid encrypted payload")
      );
  }
};

export default hybridDecryptPayload;
