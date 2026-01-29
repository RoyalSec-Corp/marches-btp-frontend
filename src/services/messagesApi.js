import { createApi } from "./http";

const BASE = process.env.REACT_APP_MESSAGES_API || "http://localhost:3002/api/messages";
const http = createApi(BASE);

const take = (d, key) => (Array.isArray(d?.[key]) ? d[key] : Array.isArray(d) ? d : []);
const asConversations = (d) => take(d, "conversations");
const asMessages = (d) => take(d, "messages");

class MessagesApi {
  async getConversations(params = {}) {
    const { role = "freelance", freelanceId, page = 1, perPage = 50, search = "" } = params;
    const { data } = await http.get("/conversations", {
      params: { role, freelanceId, page, per_page: perPage, search },
    });
    return { success: true, conversations: asConversations(data) };
  }

  async getMessages(appelOffreId, candidatureId = null, opts = {}) {
    const { page = 1, perPage = 50 } = opts;
    const path = candidatureId ? `/${appelOffreId}/${candidatureId}` : `/${appelOffreId}`;
    const { data } = await http.get(path, { params: { page, per_page: perPage } });
    return { success: true, messages: asMessages(data) };
  }

  async sendMessage(payload) {
    const { data } = await http.post("/send", payload);
    return data;
  }

  async getUserInfo(candidatureId) {
    const { data } = await http.get(`/user-info/${candidatureId}`);
    return data ?? null;
  }
}

export default new MessagesApi();
