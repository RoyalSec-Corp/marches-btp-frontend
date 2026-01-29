import React, { useEffect, useState } from 'react';
import { RiArrowUpLine } from 'react-icons/ri';

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => { setVisible(window.scrollY > 200); };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };

  if (!visible) return null;

  return (
    <button onClick={scrollToTop} className="fixed bottom-6 left-6 md:left-8 z-40 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition" aria-label="Remonter en haut">
      <RiArrowUpLine size={24} />
    </button>
  );
}

export default BackToTop;
