import api from "../api/api";

const invoiceService = {
  getRecentInvoices: async () => {
    try {
      const response = await api.get("/invoices/recent");
      return response.data;
    } catch (error) {
      console.error("Error fetching recent invoices:", error);
      throw error;
    }
  },
  getAllInvoices: async () => {
    try {
      const response = await api.get("/invoices/invoices");
      return response.data;
    } catch (error) {
      console.error("Error fetching all invoices:", error);
      throw error;
    }
  },
  getInvoiceById: async (id) => {
    try {
      const response = await api.get(`/invoices/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching invoice with ID ${id}:`, error);
      throw error;
    }
  },
  createInvoice: async (invoiceData) => {
    try {
      const response = await api.post("/invoices/add", invoiceData);
      return response.data;
    } catch (error) {
      console.error("Error creating invoice:", error);
      throw error;
    }
  },
  getInvoiceItems: async (invoiceId) => {
    try {
      const response = await api.get(`/invoices/${invoiceId}/items`);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching invoice items for invoice ID ${invoiceId}:`,
        error,
      );
      throw error;
    }
  },

  getInvoicePdf: async (invoiceId) => {
    try {
      const response = await api.get(`/invoices/${invoiceId}/download`);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching invoice items for invoice ID ${invoiceId}:`,
        error,
      );
      throw error;
    }
  },
};

export default invoiceService;
