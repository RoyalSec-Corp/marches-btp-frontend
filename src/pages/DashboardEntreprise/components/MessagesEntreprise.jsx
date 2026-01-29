import React, { useState, useEffect, useRef } from 'react';
import { RiMessage3Line, RiArrowLeftLine, RiSendPlaneLine, RiAttachmentLine, RiUser3Line, RiBuildingLine, RiSearchLine, RiCalendarLine, RiRefreshLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
import messagesApi from '../../../services/messagesApi';

const MessagesEntreprise = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => { loadConversations(); }, []);
  useEffect(() => { scrollToBottom(); }, [messages]);

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); };
  const loadConversations = async () => { try { setLoading(true); const response = await messagesApi.getConversations(); if (response.success) setConversations(response.conversations || []); else { console.error('Erreur:', response); toast.error('Erreur lors de la recuperation des conversations'); } } catch (error) { console.error('Erreur API:', error); toast.error('Erreur de connexion'); } finally { setLoading(false); } };
  const loadMessages = async (conversation) => { try { console.log('Chargement messages pour conversation:', conversation); const response = await messagesApi.getMessages(conversation.appel_offre_id, conversation.candidature_id); if (response.success) { setMessages(response.messages || []); setActiveConversation(conversation); } else { console.error('Erreur:', response); toast.error('Erreur lors de la recuperation des messages'); } } catch (error) { console.error('Erreur API:', error); toast.error('Erreur de connexion'); } };
  const sendMessage = async () => { if (!newMessage.trim() || !activeConversation) return; try { setSendingMessage(true); const messageData = { appel_offre_id: activeConversation.appel_offre_id, candidature_id: activeConversation.candidature_id || null, destinataire_id: activeConversation.autre_user_id, destinataire_type: activeConversation.autre_user_type, contenu: newMessage.trim() }; console.log('Envoi message:', messageData); const response = await messagesApi.sendMessage(messageData); if (response.success) { setNewMessage(''); await loadMessages(activeConversation); toast.success('Message envoye'); } else { console.error('Erreur:', response); toast.error('Erreur lors de l\'envoi du message'); } } catch (error) { console.error('Erreur API:', error); toast.error('Erreur de connexion'); } finally { setSendingMessage(false); } };
  const handleKeyPress = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };
  const formatDate = (dateString) => { const date = new Date(dateString); const now = new Date(); const diffTime = now - date; const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); if (diffDays === 0) return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }); else if (diffDays === 1) return 'Hier'; else if (diffDays < 7) return `Il y a ${diffDays} jours`; else return date.toLocaleDateString('fr-FR'); };
  const isFreelanceUser = (userType) => userType === 'freelance';
  const filteredConversations = conversations.filter(conv => { const searchLower = searchTerm.toLowerCase(); const titre = conv.appel_offre_titre ? String(conv.appel_offre_titre).toLowerCase() : ''; const nom = conv.autre_user_nom ? String(conv.autre_user_nom).toLowerCase() : ''; const reference = conv.appel_offre_reference ? String(conv.appel_offre_reference).toLowerCase() : ''; return titre.includes(searchLower) || nom.includes(searchLower) || reference.includes(searchLower); });

  if (loading) return (<div className="flex items-center justify-center h-96"><div className="flex items-center space-x-2"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div><span className="text-gray-600">Chargement des conversations...</span></div></div>);

  return (
    <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-orange-500 rounded-xl shadow-sm border border-gray-200 h-screen max-h-[800px] flex">
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold text-white flex items-center"><RiMessage3Line className="mr-2 text-orange-500" />Messages AO</h2><button onClick={loadConversations} className="text-orange-500 hover:text-blue-600 transition-colors" title="Actualiser"><RiRefreshLine /></button></div>
          <div className="relative"><RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Rechercher une conversation..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" /></div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (<div className="p-6 text-center text-gray-500"><RiMessage3Line className="mx-auto text-4xl text-gray-300 mb-2" /><p className="text-sm">Aucune conversation trouvee</p></div>) : (
            <div className="divide-y divide-gray-100">
              {filteredConversations.map((conversation, index) => (
                <div key={index} onClick={() => loadMessages(conversation)} className={`p-4 cursor-pointer transition-colors ${activeConversation?.appel_offre_id === conversation.appel_offre_id && activeConversation?.candidature_id === conversation.candidature_id ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 border-r-2 border-blue-600' : 'hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-800'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-1">{isFreelanceUser(conversation.autre_user_type) ? (<RiUser3Line className="text-orange-500 mr-1 flex-shrink-0" />) : (<RiBuildingLine className="text-orange-500 mr-1 flex-shrink-0" />)}<span className="text-sm font-medium text-white truncate">{conversation.autre_user_nom}</span>{conversation.messages_non_lus > 0 && (<span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[1.5rem] text-center">{conversation.messages_non_lus}</span>)}</div>
                      <p className="text-sm text-white truncate mb-1">{conversation.appel_offre_titre}</p>
                      <div className="flex items-center text-xs text-white"><RiCalendarLine className="mr-1" /><span>{formatDate(conversation.dernier_message_date)}</span></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white flex items-center">{isFreelanceUser(activeConversation.autre_user_type) ? (<RiUser3Line className="mr-2 text-orange-500" />) : (<RiBuildingLine className="mr-2 text-orange-500" />)}{activeConversation.autre_user_nom}<span className="ml-2 text-xs bg-orange-400/20 text-orange-500 border border-orange-400/40 px-2 py-1 rounded">{isFreelanceUser(activeConversation.autre_user_type) ? 'Freelance' : 'Entreprise'}</span></h3>
                  <p className="text-sm text-white mt-1">{activeConversation.appel_offre_titre}</p>
                  {activeConversation.appel_offre_reference && (<p className="text-xs text-white">Ref: {activeConversation.appel_offre_reference}</p>)}
                </div>
                <button onClick={() => setActiveConversation(null)} className="md:hidden text-gray-500 hover:text-gray-700"><RiArrowLeftLine /></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (<div className="text-center text-gray-500 py-8"><RiMessage3Line className="mx-auto text-4xl text-white mb-2" /><p className="text-white">Aucun message dans cette conversation</p><p className="text-sm text-white">Envoyez le premier message !</p></div>) : (
                messages.map((message, index) => (
                  <div key={message.id || index} className={`flex ${['entreprise', 'ao_individu', 'ao_societe'].includes(message.expediteur_type) ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg ${['entreprise', 'ao_individu', 'ao_societe'].includes(message.expediteur_type) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                      <p className="text-sm whitespace-pre-wrap">{message.contenu}</p>
                      <div className="flex items-center justify-between mt-2"><span className={`text-xs ${['entreprise', 'ao_individu', 'ao_societe'].includes(message.expediteur_type) ? 'text-blue-100' : 'text-gray-500'}`}>{message.expediteur_nom}</span><span className={`text-xs ${['entreprise', 'ao_individu', 'ao_societe'].includes(message.expediteur_type) ? 'text-blue-100' : 'text-gray-500'}`}>{formatDate(message.created_at)}</span></div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-end space-x-3">
                <button className="text-gray-400 hover:text-gray-600 p-2"><RiAttachmentLine /></button>
                <textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder="Tapez votre message..." className="flex-1 resize-none border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={2} disabled={sendingMessage} />
                <button onClick={sendMessage} disabled={!newMessage.trim() || sendingMessage} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center">{sendingMessage ? (<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>) : (<RiSendPlaneLine />)}</button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center"><RiMessage3Line className="mx-auto text-6xl text-white mb-4" /><h3 className="text-lg font-medium text-white mb-2">Selectionnez une conversation</h3><p className="text-white">Choisissez une conversation dans la liste pour commencer a echanger</p></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesEntreprise;
