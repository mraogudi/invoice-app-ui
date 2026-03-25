import api from "../api/api";

const socialService = {
  googleLogin: async (body) => {
    try {
      const response = api.post("/social/google", body);
      return response;
    } catch (error) {
      console.error("Error getting google details:", error);
      throw error;
    }
  },

  microsoftLogin: async (body) => {
    try {
      const respose = api.post("/social/microsoft", body);
      return respose;
    } catch (error) {
      console.error("Error getting microsoft details:", error);
      throw error;
    }
  },

  githubLogin: async (body) => {
    try {
      const response = api.post("/social/github", body);
      return response;
    } catch (error) {
      console.error("Error getting github details:", error);
      throw error;
    }
  },
};

export default socialService;
