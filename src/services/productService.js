import api from "../api/api";

const productService = {
  getAllProducts: async () => {
    try {
      const response = await api.get("/products");
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};

export default productService;
