import api from "../api/api";

const paymentService = {
  getAllPayments: async () => {
    try {
      const response = await api.get("/payments");
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};

export default paymentService;
