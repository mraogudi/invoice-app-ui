import api from "../api/api";

const authService = {
  changePassword: async (body) => {
    try {
      const response = await api.post("/auth/chng-password", body);
      return response.data;
    } catch (error) {
      console.error("Error fetching all clients:", error);
      throw error;
    }
  },

  resentOtp: async (email) => {
    try {
      const response = await api.get(`/auth/resend-otp/${email}`);
      return response;
    } catch (error) {
      console.error("Error fetching all clients:", error);
    }
  },

  // createFromGoogle: async () => {
  //   try {
  //     const repose = await api.post("/auth/google")
  //   } catch (error) {
  //     console.error("Error fetching all clients:", error);
  //     throw error;
  //   }
  // }
};

export default authService;
