import api from './api';

const freelancesApi = {
  getRecommendedFreelances(limit = 10) {
    return api.get('/freelances/recommended', { params: { limit } })
      .then(r => r.data)
      .catch(() => ({
        freelances: [
          { id: 1, nom: "Sophie Martin", prenom: "Sophie", specialite: "Architecte DPLG", ville: "Paris", note_moyenne: 4.9, nb_projets: 127, is_active: true },
          { id: 2, nom: "Dubois", prenom: "Thomas", specialite: "Conducteur de Travaux", ville: "Lyon", note_moyenne: 4.8, nb_projets: 89, is_active: true },
          { id: 3, nom: "Leroy", prenom: "Marie", specialite: "Ingenieure Genie Civil", ville: "Marseille", note_moyenne: 4.7, nb_projets: 156, is_active: true }
        ]
      }));
  },

  listFreelances(filters = {}) {
    const params = {};
    if (filters.ville) params.ville = filters.ville;
    if (filters.specialite) params.specialite = filters.specialite;
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;
    return api.get('/freelances', { params })
      .then(r => r.data)
      .catch(() => this.getRecommendedFreelances(filters.limit || 10));
  },

  getFreelanceById(id) {
    return api.get(`/freelances/${id}`).then(r => r.data);
  }
};

export default freelancesApi;
