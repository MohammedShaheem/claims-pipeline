import API from "../api/api";


export const processClaim = async ({ claimId, file }) => {
  const formData = new FormData();
  formData.append("claim_id", claimId);
  formData.append("file", file);

  try {
    const response = await API.post("/api/claims/process", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Claim processing failed:", error);

    
    throw (
      error?.response?.data?.message ||
      error.message ||
      "Something went wrong"
    );
  }
};