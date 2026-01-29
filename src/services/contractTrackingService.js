import api from './api';

/**
 * Service de suivi des contrats
 */
export const contractTrackingService = {
  // Obtenir le statut d'un contrat
  getContractStatus: async (contractId) => {
    try {
      const response = await api.get(`/contracts/${contractId}/status`);
      return response.data;
    } catch (error) {
      console.error('Erreur getContractStatus:', error);
      throw error;
    }
  },

  // Obtenir l'historique des changements de statut
  getStatusHistory: async (contractId) => {
    try {
      const response = await api.get(`/contracts/${contractId}/history`);
      return response.data;
    } catch (error) {
      console.error('Erreur getStatusHistory:', error);
      throw error;
    }
  },

  // Mettre a jour le statut du contrat
  updateStatus: async (contractId, newStatus, comment = '') => {
    try {
      const response = await api.patch(`/contracts/${contractId}/status`, {
        status: newStatus,
        comment,
      });
      return response.data;
    } catch (error) {
      console.error('Erreur updateStatus:', error);
      throw error;
    }
  },

  // Marquer une etape comme completee
  completeStage: async (contractId, stage) => {
    try {
      const response = await api.post(`/contracts/${contractId}/stages/${stage}/complete`);
      return response.data;
    } catch (error) {
      console.error('Erreur completeStage:', error);
      throw error;
    }
  },

  // Obtenir les statistiques de progression
  getProgressStats: async (contractId) => {
    try {
      const response = await api.get(`/contracts/${contractId}/progress`);
      return response.data;
    } catch (error) {
      console.error('Erreur getProgressStats:', error);
      throw error;
    }
  },

  // Obtenir les milestones du contrat
  getMilestones: async (contractId) => {
    try {
      const response = await api.get(`/contracts/${contractId}/milestones`);
      return response.data;
    } catch (error) {
      console.error('Erreur getMilestones:', error);
      return [];
    }
  },

  // Valider un milestone
  validateMilestone: async (contractId, milestoneId) => {
    try {
      const response = await api.post(
        `/contracts/${contractId}/milestones/${milestoneId}/validate`
      );
      return response.data;
    } catch (error) {
      console.error('Erreur validateMilestone:', error);
      throw error;
    }
  },

  // Calculer le pourcentage de progression
  calculateProgress: (contrat) => {
    const statusWeights = {
      BROUILLON: 0,
      EN_ATTENTE: 20,
      SIGNE: 40,
      EN_COURS: 60,
      TERMINE: 100,
      ANNULE: 0,
      LITIGE: 0,
    };
    return statusWeights[contrat?.statut] || 0;
  },

  // Obtenir la couleur du statut
  getStatusColor: (status) => {
    const colors = {
      BROUILLON: '#6b7280',
      EN_ATTENTE: '#f59e0b',
      SIGNE: '#3b82f6',
      EN_COURS: '#8b5cf6',
      TERMINE: '#10b981',
      ANNULE: '#ef4444',
      LITIGE: '#dc2626',
    };
    return colors[status] || '#6b7280';
  },

  // Obtenir le label du statut
  getStatusLabel: (status) => {
    const labels = {
      BROUILLON: 'Brouillon',
      EN_ATTENTE: 'En attente',
      SIGNE: 'Signe',
      EN_COURS: 'En cours',
      TERMINE: 'Termine',
      ANNULE: 'Annule',
      LITIGE: 'Litige',
    };
    return labels[status] || status;
  },
};

export default contractTrackingService;
