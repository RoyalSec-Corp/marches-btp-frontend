import React from 'react';
import { Link } from 'react-router-dom';
import { RiLinkedinFill, RiTwitterXFill, RiFacebookFill, RiInstagramFill, RiMapPinLine, RiPhoneLine, RiMailLine, RiVisaLine, RiMastercardLine, RiPaypalLine } from 'react-icons/ri';

function Footer() {
  return (
    <footer id="contact" className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <Link to="/" className="text-3xl font-['Pacifico'] text-white mb-4 inline-block">Marches BTP</Link>
            <p className="text-gray-400 mb-6">La plateforme qui simplifie la vie des professionnels du BTP en France.</p>
            <div className="flex space-x-4">
              {[RiLinkedinFill, RiTwitterXFill, RiFacebookFill, RiInstagramFill].map((Icon, i) => (<a key={i} href="/" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors"><Icon className="w-5 h-5 text-white" /></a>))}
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Liens Utiles</h4>
            <ul className="space-y-2 text-gray-400">
              {['A propos', 'Services', 'Tarifs', 'Blog', 'FAQ', 'Nous rejoindre'].map((item, i) => (<li key={i}><Link to="/" className="hover:text-white transition-colors">{item}</Link></li>))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Informations Legales</h4>
            <ul className="space-y-2 text-gray-400">
              {['Conditions generales', 'Politique de confidentialite', 'Mentions legales', 'Cookies'].map((item, i) => (<li key={i}><Link to="/" className="hover:text-white transition-colors">{item}</Link></li>))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-start"><RiMapPinLine className="w-5 h-5 mr-2 mt-0.5" /><span>123 Avenue de la Construction<br />75001 Paris, France</span></li>
              <li className="flex items-center"><RiPhoneLine className="w-5 h-5 mr-2" /><a href="tel:+33123456789" className="hover:text-white transition-colors">+33 1 23 45 67 89</a></li>
              <li className="flex items-center"><RiMailLine className="w-5 h-5 mr-2" /><a href="mailto:contact@marchesbtp.fr" className="hover:text-white transition-colors">contact@marchesbtp.fr</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row items-center md:space-x-4 mb-4 md:mb-0">
            <p className="text-gray-500">2025 Marches BTP. Tous droits reserves.</p>
            <Link to="/connexion-admin" className="text-gray-600 hover:text-white text-xs transition-colors mt-2 md:mt-0">Administration</Link>
          </div>
          <div className="flex items-center space-x-4">{[RiVisaLine, RiMastercardLine, RiPaypalLine].map((Icon, i) => (<Icon key={i} className="w-6 h-6 text-gray-400" />))}</div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
