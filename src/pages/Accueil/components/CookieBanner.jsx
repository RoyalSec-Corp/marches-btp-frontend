import React, { useEffect, useState } from 'react';

function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const savedConsent = localStorage.getItem('cookie_consent');
    if (!savedConsent) { setTimeout(() => setVisible(true), 1000); }
  }, []);

  const handleConsent = (choice) => {
    localStorage.setItem('cookie_consent', choice);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-8 md:right-8 z-50 bg-white border border-gray-300 shadow-lg rounded-xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0">
      <div className="text-sm text-gray-700 md:max-w-lg">Ce site utilise des cookies afin d'ameliorer votre experience et de mesurer l'audience. Vous pouvez les accepter ou les refuser.<span className="block mt-1 text-xs text-gray-500">Votre choix sera memorise pendant 12 mois.</span></div>
      <div className="flex space-x-2">
        <button onClick={() => handleConsent('accepted')} className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">Accepter</button>
        <button onClick={() => handleConsent('refused')} className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition">Refuser</button>
      </div>
    </div>
  );
}

export default CookieBanner;
