import api from './api';

const callsForTendersApi = {
  createCallForTender(payload) {
    return api.post('/calls-for-tenders', payload).then(r => r.data).catch(err => { throw err; });
  },

  listCallsForTenders(filters = {}) {
    const params = {};
    if (filters.localisation) params.localisation = filters.localisation;
    if (filters.type_construction) params.type_construction = filters.type_construction;
    if (filters.budget_min != null) params.budget_min = filters.budget_min;
    if (filters.budget_max != null) params.budget_max = filters.budget_max;
    if (Array.isArray(filters.mots_cles) && filters.mots_cles.length) {
      params.mots_cles = filters.mots_cles;
    }
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;
    if (filters.publisher_only) params.publisher_only = filters.publisher_only;
    return api.get('/calls-for-tenders', { params }).then(r => r.data).catch(err => { throw err; });
  },

  getCallForTenderById(id) {
    return api.get(`/calls-for-tenders/${id}`).then(r => r.data).catch(err => { throw err; });
  },

  applyToCallForTender(callForTenderId, application) {
    return api.post(`/calls-for-tenders/${callForTenderId}/apply`, application).then(r => r.data).catch(err => { throw err; });
  },

  listCallForTenderApplications(callForTenderId) {
    return api.get(`/calls-for-tenders/${callForTenderId}/applications`).then(r => r.data).catch(err => { throw err; });
  },

  acceptCallForTenderApplication(callForTenderId, applicationId) {
    return api.put(`/calls-for-tenders/${callForTenderId}/applications/${applicationId}/accept`).then(r => r.data).catch(err => { throw err; });
  },

  rejectCallForTenderApplication(callForTenderId, applicationId) {
    return api.put(`/calls-for-tenders/${callForTenderId}/applications/${applicationId}/reject`).then(r => r.data).catch(err => { throw err; });
  },

  listApplications(callForTenderId) {
    return this.listCallForTenderApplications(callForTenderId);
  },

  acceptApplication(callForTenderId, applicationId) {
    return this.acceptCallForTenderApplication(callForTenderId, applicationId);
  },

  rejectApplication(callForTenderId, applicationId) {
    return this.rejectCallForTenderApplication(callForTenderId, applicationId);
  },

  getStatistics() {
    return api.get('/calls-for-tenders/statistics').then(r => r.data).catch(err => { throw err; });
  }
};

export default callsForTendersApi;
