// services/reportService.js
import api from "../api/api";

const reportService = {
  getReports: async () => {
    return api.get(`/reports`);
  },
};

export default reportService;
