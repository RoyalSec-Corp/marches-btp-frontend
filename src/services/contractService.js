import contractsApi from './contractsApi';

function saveLastCreatedContractId(id) {
  if (id != null) localStorage.setItem('lastCreatedContractId', String(id));
}

class ContractService {
  createContract(contractData) {
    if (contractData.type === 'direct' && contractData.freelanceId) {
      return this.createDirectContract(contractData, contractData.freelanceId);
    } else if (contractData.type === 'publication') {
      return this.createPublicationContract(contractData);
    }
    return Promise.reject(new Error('Type de contrat invalide'));
  }

  createDirectContract(contractData, freelanceId) {
    const payload = {
      type: 'direct',
      title: contractData.title || '',
      description: contractData.description || '',
      location: contractData.location || '',
      budget: Number(contractData.budget ?? 0),
      budgetUnit: contractData.budgetUnit || 'day',
      duration: contractData.duration != null ? Number(contractData.duration) : null,
      durationUnit: contractData.durationUnit || 'jours',
      startDate: contractData.startDate || null,
      requirements: contractData.requirements || '',
      skills: Array.isArray(contractData.skills) ? contractData.skills : [],
      freelanceId,
    };
    return contractsApi.createContract(payload).then(res => {
      const contract = res?.contract ?? res;
      if (contract?.id) saveLastCreatedContractId(contract.id);
      return contract;
    });
  }

  createPublicationContract(contractData) {
    const payload = {
      type: 'publication',
      title: contractData.title || '',
      description: contractData.description || '',
      location: contractData.location || '',
      budget: Number(contractData.budget ?? 0),
      budgetUnit: contractData.budgetUnit || 'day',
      duration: contractData.duration != null ? Number(contractData.duration) : null,
      durationUnit: contractData.durationUnit || 'jours',
      startDate: contractData.startDate || null,
      requirements: contractData.requirements || '',
      skills: Array.isArray(contractData.skills) ? contractData.skills : [],
    };
    return contractsApi.createContract(payload).then(res => {
      const contract = res?.contract ?? res;
      if (contract?.id) saveLastCreatedContractId(contract.id);
      return contract;
    });
  }

  respondToDirectContract(contractId, _freelanceIdIgnored, response, message = '') {
    return contractsApi.respondDirect(contractId, response, message);
  }

  applyToContract(contractId, _freelanceIdIgnored, applicationData) {
    const body = {
      proposal: applicationData.proposal || '',
      proposedBudget: Number(applicationData.proposedBudget ?? 0),
      proposedDuration: applicationData.proposedDuration || '',
      coverLetter: applicationData.coverLetter || '',
    };
    return contractsApi.applyToContract(contractId, body).then(res => res.application);
  }

  selectFreelanceForContract(contractId, applicationId) {
    return contractsApi.selectFreelance(contractId, applicationId);
  }

  acceptApplication(contractId, applicationId) {
    return contractsApi.acceptApplication(contractId, applicationId);
  }

  rejectApplication(contractId, applicationId) {
    return contractsApi.rejectApplication(contractId, applicationId);
  }

  getContractById(contractId) {
    return contractsApi.getContractById(contractId).then(row => {
      if (!row) return null;
      const modeSelection = row.mode_selection || row.modeSelection || null;
      const normalizedMode = modeSelection === 'directe' ? 'direct' : modeSelection === 'publication' ? 'publication' : null;
      return {
        id: row.id,
        title: row.titre ?? row.title ?? '',
        description: row.description ?? '',
        budget: row.montant != null ? Number(row.montant) : (row.budget != null ? Number(row.budget) : null),
        duration: row.duration ?? null,
        duration_unit: row.duration_unit ?? null,
        type_tarif: row.type_tarif ?? null,
        location: row.location ?? null,
        status: row.statut ?? row.status ?? '',
        skills: Array.isArray(row.skills) ? row.skills : [],
        startDate: row.start_date ?? row.startDate ?? null,
        createdAt: row.created_at ?? row.createdAt ?? null,
        updatedAt: row.updated_at ?? row.updatedAt ?? null,
        entrepriseId: row.entreprise_id ?? row.entrepriseId ?? null,
        freelanceId: row.freelance_id ?? row.freelanceId ?? null,
        mode_selection: modeSelection,
        mode: normalizedMode,
        type: normalizedMode,
      };
    });
  }

  getApplicationsForContract(contractId) {
    return contractsApi.listApplications(contractId).then(list => {
      const arr = Array.isArray(list) ? list : [];
      return arr.map(r => ({
        id: r.id,
        contractId: r.contrat_id ?? r.contract_id ?? contractId,
        freelanceId: r.freelance_id,
        proposal: r.proposal ?? '',
        proposedBudget: r.proposed_budget ?? r.proposedBudget != null ? Number(r.proposed_budget ?? r.proposedBudget) : null,
        proposedDuration: r.proposed_duration ?? r.proposedDuration ?? '',
        coverLetter: r.cover_letter ?? r.coverLetter ?? '',
        status: r.statut ?? r.status ?? 'pending',
        createdAt: r.created_at ?? r.createdAt,
        updatedAt: r.updated_at ?? r.updatedAt,
        freelance_nom: r.freelance_nom,
        freelance_prenom: r.freelance_prenom,
        freelance_email: r.freelance_email,
      }));
    });
  }

  getContractsForEntreprise() { return Promise.resolve([]); }
  getContractsForFreelance() { return Promise.resolve([]); }
  getAvailableMissions() { return []; }
  getApplicationsForFreelance() { return []; }

  getNotificationsForUser() { return contractsApi.getNotifications(); }
  markNotificationAsRead(notificationId) { return contractsApi.markAsRead(notificationId); }
  getUnreadCount() { return contractsApi.getUnreadCount().then(res => res.count || 0); }
}

const contractService = new ContractService();
export default contractService;
