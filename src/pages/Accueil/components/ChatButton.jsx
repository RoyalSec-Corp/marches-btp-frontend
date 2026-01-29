import React, { useState, useRef, useEffect } from 'react';
import { RiChatSmile3Line, RiCloseLine, RiSearchLine, RiMailSendLine } from 'react-icons/ri';

const faq = [
  { question: "Comment publier un appel d'offre ?", answer: "Allez dans la section Appels d'offres et cliquez sur 'Creer'." },
  { question: "Comment contacter un freelance ?", answer: "Depuis le tableau de bord, ouvrez le profil du freelance et cliquez sur 'Contacter'." },
  { question: "Comment suivre mes paiements ?", answer: "Consultez l'onglet 'Paiements' dans votre tableau de bord." },
];

function ChatButton() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredFaq, setFilteredFaq] = useState(faq);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (search.trim() === '') { setFilteredFaq(faq); } 
    else { setFilteredFaq(faq.filter(f => f.question.toLowerCase().includes(search.toLowerCase()))); }
  }, [search]);

  return (
    <div className="fixed bottom-6 right-20 z-50">
      {open && (
        <div ref={ref} className="w-80 bg-white rounded-xl shadow-xl border border-gray-200 p-4 space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="text-sm font-semibold text-gray-800">Assistance & FAQ</h3>
            <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-700"><RiCloseLine size={18} /></button>
          </div>
          <div className="relative">
            <RiSearchLine className="absolute left-3 top-2.5 text-gray-400" />
            <input type="text" placeholder="Rechercher une question..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-100" />
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto text-sm">
            {filteredFaq.length > 0 ? filteredFaq.map((item, i) => (<div key={i} className="bg-gray-50 p-2 rounded-lg"><p className="font-medium text-gray-700">{item.question}</p><p className="text-gray-500 mt-1">{item.answer}</p></div>)) : (<p className="text-gray-500">Aucune question trouvee.</p>)}
          </div>
          <div className="border-t pt-2">
            <p className="text-xs text-gray-500 mb-1">Pas de reponse ? Contactez-nous :</p>
            <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-blue-700 transition"><RiMailSendLine /><span>Envoyer un message</span></button>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(!open)} className="w-12 h-12 bg-primary text-white rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center"><RiChatSmile3Line size={22} /></button>
    </div>
  );
}

export default ChatButton;
