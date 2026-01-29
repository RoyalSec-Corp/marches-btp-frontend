import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-3xl font-['Pacifico'] text-primary mr-10">
            Marches BTP
          </Link>
          <nav className="hidden md:flex space-x-8">
            <a href="#services" className="text-gray-700 hover:text-primary font-medium">Services</a>
            <a href="#avantages" className="text-gray-700 hover:text-primary font-medium">Avantages</a>
            <a href="#temoignages" className="text-gray-700 hover:text-primary font-medium">Temoignages</a>
            <a href="#contact" className="text-gray-700 hover:text-primary font-medium">Contact</a>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <div className="w-5 h-5 flex items-center justify-center text-gray-400">
                <i className="ri-search-line"></i>
              </div>
            </div>
            <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-64 pl-10 p-2.5" placeholder="Rechercher..." />
          </div>
          <Link to="/connexion" className="text-primary hover:text-primary/80 font-medium whitespace-nowrap">Connexion</Link>
          <Link to="/inscription" className="bg-primary text-white px-4 py-2 rounded-button font-medium hover:bg-primary/90 whitespace-nowrap">Inscription</Link>
          <button className="md:hidden w-10 h-10 flex items-center justify-center text-gray-700">
            <i className="ri-menu-line ri-lg"></i>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
