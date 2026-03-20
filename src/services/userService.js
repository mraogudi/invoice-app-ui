import api from "../api/api";

const userService = {
  getUserDetails: async () => {
    try {
      const response = await api.get("/user/details");
      return response.data;
    } catch (error) {
      console.error("Error fetching user details:", error);
      throw error;
    }
  },

  updateUser: async (body) => {
    try {
      const response = await api.post("/user/details", body);
      return response.data;
    } catch (error) {
      console.error("Error updating user details:", error);
      throw error;
    }
  },

  changePassword: async (body) => {
    try {
      const response = await api.post("/user/password", body);
      return response.data;
    } catch (error) {
      console.error("Error updating password:", error);
      throw error;
    }
  },

  getLoginHistory: async () => {
    try {
      const response = await api.get("/user/history");
      return response.data;
    } catch (error) {
      console.error("Error updating password:", error);
      throw error;
    }
  },
};

export default userService;
