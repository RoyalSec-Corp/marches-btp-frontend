import api from './api';

const contractsApi = {
  listMyEnterpriseContracts() {
    const userStr = localStorage.getItem('user');
    let userId = null;
    if (userStr) {
      try { userId = JSON.parse(userStr).id; } catch (e) {}
    }
    if (!userId) return Promise.resolve([]);
    return api.get(`/contracts/my-contracts-dashboard/${userId}`)
      .then(response => response.data.map(c => ({
        id: c.id,
        title: c.titre,
        description: c.description || `Mission avec ${c.freelance_nom || 'Utilisateur Inconnu'}`,
        freelance_name: c.freelance_nom || 'Utilisateur Inconnu',
        client_name: c.client_nom || 'Client Inconnu',
        budget_formatted: `${c.montant} EUR`,
        start_date: c.date_debut,
        statut: c.statut,
        status_display: c.statut ? c.statut.toUpperCase() : 'INCONNU',
      })))
      .catch(() => []);
  },

  listMyContracts() {
    const userStr = localStorage.getItem('user');
    let userId = null;
    if (userStr) {
      try { userId = JSON.parse(userStr).id; } catch (e) {}
    }
    if (!userId) return Promise.resolve([]);
    return api.get(`/contracts/my-contracts-dashboard/${userId}`)
      .then(response => response.data.map(c => ({
        id: c.id,
        title: c.titre,
        description: c.description || 'Mission freelance',
        freelance_name: c.client_nom || 'Client Inconnu',
        client_name: c.client_nom,
        budget_formatted: `${c.montant} EUR`,
        start_date: c.date_debut,
        statut: c.statut,
        status_display: c.statut ? c.statut.toUpperCase() : 'INCONNU',
      })))
      .catch(() => []);
  },

  createContract(payload) { return api.post('/contracts', payload).then(r => r.data); },
  getContractById(id) { return api.get(`/contracts/${id}`).then(r => r.data); },
  applyToContract(contractId, application) { return api.post(`/contracts/${contractId}/apply`, application).then(r => r.data); },
  respondDirect(contractId, response, message = '') { return api.post(`/contracts/${contractId}/respond`, { response, message }).then(r => r.data); },
  selectFreelance(contractId, applicationId) { return api.put(`/contracts/${contractId}/select`, { applicationId }).then(r => r.data); },
  listApplications(contractId) { return api.get(`/contracts/${contractId}/applications`).then(r => r.data); },
  acceptApplication(contractId, applicationId) { return api.put(`/contracts/${contractId}/applications/${applicationId}/accept`).then(r => r.data); },
  rejectApplication(contractId, applicationId) { return api.put(`/contracts/${contractId}/applications/${applicationId}/reject`).then(r => r.data); },

  listAvailable(filters = {}) {
    const params = {};
    if (filters.location) params.location = filters.location;
    if (filters.search) params.search = filters.search;
    if (Array.isArray(filters.skills) && filters.skills.length) params.skills = filters.skills.join(',');
    if (filters.budgetMin != null) params.budgetMin = filters.budgetMin;
    if (filters.budgetMax != null) params.budgetMax = filters.budgetMax;
    return api.get('/contracts/available', { params }).then(r => r.data);
  },

  getNotifications() { return api.get('/notifications').then(r => r.data); },
  getUnreadCount() { return api.get('/notifications/unread-count').then(r => r.data); },
  markAsRead(notificationId) { return api.put(`/notifications/${notificationId}/read`).then(r => r.data); },
  markAllAsRead() { return api.put('/notifications/mark-all-read').then(r => r.data); },

  getEnterpriseDashboardStats() { return api.get('/contracts/dashboard/enterprise/stats').then(r => r.data); },
  getFreelanceDashboardStats() { return api.get('/contracts/dashboard/freelance/stats').then(r => r.data); },
  getFreelanceMonthlyEarnings() { return api.get('/contracts/dashboard/freelance/earnings').then(r => r.data); },

  getContractProgress(contractId) { return api.get(`/contracts/${contractId}/progress`).then(r => r.data); },
  updateContractStage(contractId, stageData) { return api.put(`/contracts/${contractId}/stage`, stageData).then(r => r.data); },

  addMilestone(contractId, milestoneData) { return api.post(`/contracts/${contractId}/milestones`, milestoneData).then(r => r.data); },
  updateMilestoneStatus(contractId, milestoneId, statusData) { return api.put(`/contracts/${contractId}/milestones/${milestoneId}`, statusData).then(r => r.data); },
  addPayment(contractId, paymentData) { return api.post(`/contracts/${contractId}/payments`, paymentData).then(r => r.data); },
  markPaymentCompleted(contractId, paymentId, completionData) { return api.put(`/contracts/${contractId}/payments/${paymentId}/complete`, completionData).then(r => r.data); },

  getContractSignatures(contractId) { return api.get(`/contracts/${contractId}/signatures`).then(r => r.data); },
  submitContractSignature(contractId, signatureData) { return api.post(`/contracts/${contractId}/signatures`, signatureData).then(r => r.data); },
  checkContractSignatureStatus(contractId) { return api.get(`/contracts/${contractId}/signatures/status`).then(r => r.data); },

  getContractMetrics(contractId) { return api.get(`/contracts/${contractId}/metrics`).then(r => r.data); },
  updateContractMetrics(contractId, metrics) { return api.put(`/contracts/${contractId}/metrics`, metrics).then(r => r.data); },
};

export default contractsApi;
