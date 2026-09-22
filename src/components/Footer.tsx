
import { MapPin, Phone, Mail, Facebook, Youtube,Instagram, Heart } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
    // Navigate to home page with the section info
    navigate('/', { state: { scrollTo: sectionId } });
  };

  const handlePageNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Organization Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full flex items-center justify-center">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="heading-cultural text-2xl lg:text-3xl font-bold text-orange-400 mb-2">
                  प्रणिता प्रतिष्ठान
                </h3>
                <p className="text-yellow-200 text-sm">समाजसेवेसाठी समर्पित</p>
              </div>
            </div>
            
            <p className="text-cultural text-gray-300 mb-6 leading-relaxed">
              समाजसेवा, संस्कृती आणि विकासाच्या क्षेत्रात काम करणारी एक प्रतिष्ठित संस्था. 
              आमचे उद्दिष्ट समाजातील प्रत्येक व्यक्तीच्या जीवनात सकारात्मक बदल घडवून आणणे आहे.
            </p>
            
            <div className="flex space-x-4">
              <a href="#" className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="https://youtube.com/@pranitapratishthan123?si=lCg-3n8B87s6IC5Y" className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors">
                <Youtube className="h-6 w-6" />
              </a>
              <a href="https://www.instagram.com/pranita_pratishthan_bhusawal" className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-500 transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="heading-cultural text-lg font-bold text-orange-400 mb-6">
              द्रुत दुवे
            </h4>
            <ul className="space-y-3">
              {[
                { id: 'home', label: 'मुख्यपृष्ठ' },
                { id: 'about', label: 'आमच्याबद्दल' },
                { id: 'gallery', label: 'छायाचित्र दालन' },
                { id: 'youtube', label: 'YouTube व्हिडिओ' },
                { id: 'news', label: 'बातम्या' }
              ].map((item) => (
                <li key={item.id}>
                  <button 
                    onClick={() => scrollToSection(item.id)} 
                    className="text-gray-300 hover:text-orange-400 transition-colors text-cultural"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              <li>
                <button 
                  onClick={() => handlePageNavigation('/privacy-policy')}
                  className="text-gray-300 hover:text-orange-400 transition-colors text-cultural"
                >
                  गोपनीयता धोरण
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handlePageNavigation('/terms-conditions')}
                  className="text-gray-300 hover:text-orange-400 transition-colors text-cultural"
                >
                  नियम व अटी
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="heading-cultural text-lg font-bold text-orange-400 mb-6">
              संपर्क माहिती
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-orange-400 mt-1" />
                <div>
                  <p className="text-cultural text-gray-300 leading-relaxed">
                    'धनश्री',<br />
                    प्रभात कॉलनी, भुसावळ - 425201<br />
                    महाराष्ट्र, भारत
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-orange-400" />
                <span className="text-cultural text-gray-300">+91 94203 48146</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-orange-400" />
                <span className="text-cultural text-gray-300">pranitapratibsl@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 lg:mb-0">
              <Heart className="h-4 w-4 text-red-400" />
              <span className="text-cultural text-gray-400 text-sm">
                © 2024 प्रणिता प्रतिष्ठान. सर्व हक्क राखीव.
              </span>
            </div>
            <div className="flex space-x-6 text-sm">
              <button 
                onClick={() => handlePageNavigation('/privacy-policy')}
                className="text-gray-400 hover:text-orange-400 transition-colors text-cultural"
              >
                गोपनीयता धोरण
              </button>
              <button 
                onClick={() => handlePageNavigation('/terms-conditions')}
                className="text-gray-400 hover:text-orange-400 transition-colors text-cultural"
              >
                नियम व अटी
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
