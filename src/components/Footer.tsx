import { Link } from "react-router-dom";
import { Heart, Mail, Shield, Facebook, Twitter, Instagram } from 'lucide-react';



const Footer = () => {
    return (
      <footer className="bg-gray-900 text-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About Section */}
            <div>
              <h3 className="text-xl font-bold mb-4">À propos</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-pink-400">Qui sommes-nous</a></li>
                <li><a href="#" className="hover:text-pink-400">Notre histoire</a></li>
                <li><a href="#" className="hover:text-pink-400">Blog</a></li>
                <li><a href="#" className="hover:text-pink-400">Carrières</a></li>
              </ul>
            </div>
  
            {/* Help Section */}
            <div>
              <h3 className="text-xl font-bold mb-4">Aide</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-pink-400">FAQ</a></li>
                <li><a href="#" className="hover:text-pink-400">Guide de sécurité</a></li>
                <li><a href="#" className="hover:text-pink-400">Support</a></li>
                <li><a href="#" className="hover:text-pink-400">Contact</a></li>
              </ul>
            </div>
  
            {/* Legal Section */}
            <div>
              <h3 className="text-xl font-bold mb-4">Légal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-pink-400">Conditions d'utilisation</a></li>
                <li><a href="#" className="hover:text-pink-400">Politique de confidentialité</a></li>
                <li><a href="#" className="hover:text-pink-400">Cookies</a></li>
                <li><a href="#" className="hover:text-pink-400">RGPD</a></li>
              </ul>
            </div>
  
            {/* Newsletter Section */}
            <div>
              <h3 className="text-xl font-bold mb-4">Newsletter</h3>
              <p className="mb-4">Recevez nos actualités et conseils</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Votre email" 
                  className="px-4 py-2 rounded-l text-gray-900 w-full"
                />
                <button className="bg-pink-500 px-4 py-2 rounded-r hover:bg-pink-600">
                  <Mail size={20} />
                </button>
              </div>
            </div>
          </div>
  
          {/* Features Bar */}
          <div className="border-t border-gray-700 mt-12 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex items-center justify-center space-x-2">
                <Shield className="text-pink-400" size={24} />
                <span>Site 100% sécurisé</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Heart className="text-pink-400" size={24} />
                <span>Plus de 1000 couples formés</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Mail className="text-pink-400" size={24} />
                <span>Support 24/7</span>
              </div>
            </div>
          </div>
  
          {/* Social & Copyright */}
          <div className="border-t border-gray-700 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex space-x-6 mb-4 md:mb-0">
                <a href="#" className="hover:text-pink-400">
                  <Facebook size={24} />
                </a>
                <a href="#" className="hover:text-pink-400">
                  <Twitter size={24} />
                </a>
                <a href="#" className="hover:text-pink-400">
                  <Instagram size={24} />
                </a>
              </div>
              <div className="text-gray-400 text-sm">
                © 2025 Matcha. Tous droits réservés.
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;