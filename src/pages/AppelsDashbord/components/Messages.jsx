import React, { useState, useEffect, useRef } from 'react';
import {
  RiSearchLine,
  RiSendPlaneLine,
  RiEmotionHappyLine,
  RiAttachmentLine,
  RiMoreLine,
  RiArrowLeftLine,
  RiCheckDoubleLine,
  RiCheckLine,
  RiUserLine,
  RiBuildingLine,
  RiPhoneLine,
  RiVideoLine
} from 'react-icons/ri';
import messagesApi from '../../../services/messagesApi';

const Messages = ({ destinataire, appel_offre_id, candidature_id, onBack }) => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Charger les conversations au démarrage
  useEffect(() => {
    loadConversations();
  }, []);

  // Auto-sélection si on a des paramètres spécifiques
  useEffect(() => {
    if (appel_offre_id && candidature_id && destinataire) {
      const specificConversation = {
        appel_offre_id: parseInt(appel_offre_id),
        candidature_id: parseInt(candidature_id),
        appel_offre_titre: `AO ${appel_offre_id}`,
        appel_offre_reference: `REF-${appel_offre_id}`,
        autre_user_nom: destinataire,
        autre_user_type: 'freelance',
        dernier_message: 'Nouvelle conversation',
        dernier_message_date: new Date().toISOString(),
        unread_count: 0
      };
      setActiveConversation(specificConversation);
      loadMessages(appel_offre_id, candidature_id);
    }
  }, [appel_offre_id, candidature_id, destinataire]);

  // Scroll automatique
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await messagesApi.getConversations();
      console.log('Response from API:', response);
      
      // Handle the new API response format: { success: true, conversations: [...] }
      if (response && response.success && Array.isArray(response.conversations)) {
        setConversations(response.conversations);
      } else if (Array.isArray(response)) {
        // Fallback for direct array response
        setConversations(response);
      } else {
        console.warn('Unexpected response format:', response);
        setConversations([]);
      }
    } catch (error) {
      console.error('Erreur chargement conversations:', error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (aoId, candId) => {
    try {
      const response = await messagesApi.getMessages(aoId, candId);
      console.log('Messages response from API:', response);
      
      // Handle the new API response format: { success: true, messages: [...] }
      if (response && response.success && Array.isArray(response.messages)) {
        setMessages(response.messages);
      } else if (Array.isArray(response)) {
        // Fallback for direct array response
        setMessages(response);
      } else {
        console.warn('Unexpected messages response format:', response);
        setMessages([]);
      }
    } catch (error) {
      console.error('Erreur chargement messages:', error);
      setMessages([]);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending || !activeConversation) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setSending(true);

    // Ajout optimiste du message
    const tempMessage = {
      id: Date.now(),
      contenu: messageText,
      date_envoi: new Date().toISOString(),
      est_expediteur: true,
      status: 'sending'
    };
    
    setMessages(prev => [...prev, tempMessage]);

    try {
    const messagePayload = {
      appel_offre_id: activeConversation.appel_offre_id,
      candidature_id: activeConversation.candidature_id,
      contenu: messageText
    };

    console.log('Envoi message avec payload:', messagePayload);
    
    await messagesApi.sendMessage(messagePayload);
      
      // Mise à jour du statut du message
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempMessage.id 
            ? { ...msg, status: 'sent' }
            : msg
        )
      );
      
      // Actualiser la liste des conversations pour maintenir la persistance
      await loadConversations();
    } catch (error) {
      console.error('Erreur envoi message:', error);
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
    } finally {
      setSending(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectConversation = (conversation) => {
    setActiveConversation(conversation);
    loadMessages(conversation.appel_offre_id, conversation.candidature_id);
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return date.toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: '2-digit' 
      });
    }
  };

  const getStatusIcon = (message) => {
    if (!message.est_expediteur) return null;
    
    switch (message.status) {
      case 'sending':
        return <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>;
      case 'sent':
        return <RiCheckLine className="text-gray-400 text-sm" />;
      case 'delivered':
        return <RiCheckDoubleLine className="text-gray-400 text-sm" />;
      case 'read':
        return <RiCheckDoubleLine className="text-blue-500 text-sm" />;
      default:
        return <RiCheckLine className="text-gray-400 text-sm" />;
    }
  };

  const filteredConversations = conversations.filter(conv => 
    conv.autre_user_nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.appel_offre_titre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Panel des conversations */}
      <div className={`${activeConversation ? 'hidden md:block' : 'block'} w-full md:w-80 bg-gray-50 border-r flex flex-col`}>
        {/* Header des conversations */}
        <div className="p-4 bg-white border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            {onBack && (
              <button 
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <RiArrowLeftLine className="text-gray-500" />
              </button>
            )}
          </div>
          
          {/* Barre de recherche */}
          <div className="relative">
            <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une conversation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Liste des conversations */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-500 text-sm mt-2">Chargement...</p>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>Aucune conversation trouvée</p>
              <p className="text-xs mt-1">Vos conversations apparaîtront ici</p>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {filteredConversations.map((conv) => (
                <div
                  key={`${conv.appel_offre_id}-${conv.candidature_id}`}
                  onClick={() => selectConversation(conv)}
                  className={`p-3 rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                    activeConversation?.appel_offre_id === conv.appel_offre_id &&
                    activeConversation?.candidature_id === conv.candidature_id
                      ? 'bg-blue-50 border-l-4 border-blue-500' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {/* Avatar avec indicateur en ligne */}
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white shadow-md">
                        {conv.autre_user_type === 'freelance' ? (
                          <RiUserLine className="text-xl" />
                        ) : (
                          <RiBuildingLine className="text-xl" />
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-gray-900 truncate">
                          {conv.autre_user_nom || 'Utilisateur'}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {formatTime(conv.dernier_message_date)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate">
                          {conv.appel_offre_titre || 'Nouvelle conversation'}
                        </p>
                        {conv.unread_count > 0 && (
                          <div className="bg-blue-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1">
                            {conv.unread_count > 99 ? '99+' : conv.unread_count}
                          </div>
                        )}
                      </div>
                      
                      <p className="text-xs text-gray-400 mt-1">
                        {conv.appel_offre_reference}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Panel des messages */}
      <div className={`${activeConversation ? 'block' : 'hidden md:block'} flex-1 flex flex-col`}>
        {activeConversation ? (
          <>
            {/* Header de la conversation */}
            <div className="bg-white border-b px-4 py-3 shadow-sm">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setActiveConversation(null)}
                  className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <RiArrowLeftLine className="text-gray-600" />
                </button>
                
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white shadow-md">
                  {activeConversation.autre_user_type === 'freelance' ? (
                    <RiUserLine />
                  ) : (
                    <RiBuildingLine />
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {activeConversation.autre_user_nom}
                  </h3>
                  <p className="text-sm text-green-500">● En ligne</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <RiPhoneLine className="text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <RiVideoLine className="text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <RiMoreLine className="text-gray-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* Zone des messages */}
            <div className="flex-1 overflow-y-auto bg-gray-50 px-4 py-4" style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f3f4f6' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}>
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <RiUserLine className="text-3xl text-gray-400" />
                    </div>
                    <p className="text-lg font-medium mb-2">Aucun message</p>
                    <p className="text-sm text-gray-400">
                      Commencez votre conversation avec <span className="font-medium">{activeConversation.autre_user_nom}</span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message, index) => {
                    const isConsecutive = index > 0 && 
                      messages[index - 1].est_expediteur === message.est_expediteur &&
                      new Date(message.date_envoi) - new Date(messages[index - 1].date_envoi) < 60000; // 1 minute

                    return (
                      <div
                        key={message.id || index}
                        className={`flex ${message.est_expediteur ? 'justify-end' : 'justify-start'} ${
                          isConsecutive ? 'mt-1' : 'mt-4'
                        }`}
                      >
                        <div className={`max-w-xs lg:max-w-md ${
                          message.est_expediteur ? 'order-2' : 'order-1'
                        }`}>
                          <div className={`px-4 py-2 rounded-2xl shadow-sm ${
                            message.est_expediteur
                              ? 'bg-blue-500 text-white rounded-br-md'
                              : 'bg-white text-gray-900 border rounded-bl-md'
                          }`}>
                            <p className="text-sm leading-relaxed break-words">
                              {message.contenu}
                            </p>
                          </div>
                          
                          <div className={`flex items-center mt-1 space-x-1 ${
                            message.est_expediteur ? 'justify-end' : 'justify-start'
                          }`}>
                            <span className="text-xs text-gray-500">
                              {formatTime(message.date_envoi)}
                            </span>
                            {getStatusIcon(message)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Zone de saisie */}
            <div className="bg-white border-t px-4 py-3">
              <div className="flex items-end space-x-3">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <RiEmotionHappyLine className="text-gray-500 text-xl" />
                </button>
                
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <RiAttachmentLine className="text-gray-500 text-xl" />
                </button>
                
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={`Message à ${activeConversation.autre_user_nom}...`}
                    className="w-full bg-gray-100 border border-transparent rounded-2xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent max-h-32 min-h-12"
                    rows={1}
                    style={{ height: 'auto' }}
                    onInput={(e) => {
                      e.target.style.height = 'auto';
                      e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
                    }}
                  />
                </div>
                
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sending}
                  className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {sending ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <RiSendPlaneLine className="text-lg" />
                  )}
                </button>
              </div>
              
              {newMessage && (
                <div className="flex justify-between items-center mt-2 px-2">
                  <p className="text-xs text-gray-500">
                    Appuyez sur Entrée pour envoyer, Maj+Entrée pour une nouvelle ligne
                  </p>
                  <span className="text-xs text-gray-400">
                    {newMessage.length}/1000
                  </span>
                </div>
              )}
            </div>
          </>
        ) : (
          // État par défaut quand aucune conversation n'est sélectionnée
          <div className="flex items-center justify-center h-full bg-gray-50">
            <div className="text-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <RiUserLine className="text-4xl text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Messages</h3>
              <p className="text-gray-500 text-sm max-w-md">
                Sélectionnez une conversation dans la liste de gauche pour commencer à échanger des messages
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
