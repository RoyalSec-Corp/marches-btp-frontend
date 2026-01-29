import api from './api';

class ReferralsApi {
  async getMe() {
    try {
      const response = await api.get('/referrals/me');
      return response.data;
    } catch (error) {
      console.error('Erreur recuperation info parrainage:', error);
      throw this.handleError(error);
    }
  }

  async getMyReferees(page = 1, limit = 10) {
    try {
      const response = await api.get('/referrals/me/referees', { params: { page, limit } });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async applyCode(code) {
    try {
      const response = await api.post('/referrals/apply-code', { code });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async checkPublicCode(code) {
    try {
      const response = await api.get(`/referrals/public/code/${code}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async healthCheck() {
    try {
      const response = await api.get('/referrals/health');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getSettings() {
    try {
      const response = await api.get('/referrals/settings');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateSetting(key, value, dataType = 'string') {
    try {
      const response = await api.put(`/referrals/settings/${key}`, { value, dataType });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getGlobalStats() {
    try {
      const response = await api.get('/referrals/stats');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || 'Erreur inconnue';
      switch (status) {
        case 400: return new Error(`Requete invalide: ${message}`);
        case 401: return new Error('Non authentifie. Veuillez vous reconnecter.');
        case 403: return new Error('Acces refuse.');
        case 404: return new Error(`Ressource non trouvee: ${message}`);
        case 409: return new Error(`Conflit: ${message}`);
        case 429: return new Error(`Limite atteinte: ${message}`);
        case 500: return new Error('Erreur interne du serveur.');
        default: return new Error(`Erreur ${status}: ${message}`);
      }
    } else if (error.request) {
      return new Error('Erreur de connexion.');
    } else {
      return new Error(`Erreur: ${error.message}`);
    }
  }

  async copyReferralLink(referralLink) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(referralLink);
        return true;
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = referralLink;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const result = document.execCommand('copy');
        document.body.removeChild(textArea);
        return result;
      }
    } catch (error) {
      return false;
    }
  }

  formatAmount(amount, currency = 'EUR') {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(amount);
  }

  formatDate(date) {
    return new Intl.DateTimeFormat('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(date));
  }

  getStatusDisplay(status) {
    const statusMap = {
      pending: { color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: 'clock', label: 'En attente' },
      qualified: { color: 'text-blue-600', bgColor: 'bg-blue-100', icon: 'check', label: 'Qualifie' },
      rewarded: { color: 'text-green-600', bgColor: 'bg-green-100', icon: 'gift', label: 'Recompense' }
    };
    return statusMap[status] || { color: 'text-gray-600', bgColor: 'bg-gray-100', icon: 'question', label: 'Inconnu' };
  }
}

const referralsApi = new ReferralsApi();
export default referralsApi;
