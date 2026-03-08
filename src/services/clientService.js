import api from "../api/api";

const clientService = {
    getAllClients: async () => {
        try {
            const response = await api.get('/clients');
            return response.data;
        } catch (error) {
            console.error('Error fetching all clients:', error);
            throw error;
        }
    }
};

export default clientService;
