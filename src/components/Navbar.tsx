import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/AppContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavbarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const Navbar = ({ activeSection, onNavigate }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { programs } = useAppContext();

  const navItems = [
    { id: 'home', label: 'मुख्यपृष्ठ' },
    { id: 'about', label: 'संस्था माहिती' },
    { id: 'gallery', label: 'छायाचित्र दालन' },
    { id: 'news', label: 'बातम्या व प्रसारमाध्यम' },
    { id: 'youtube', label: 'YouTube विंडो' }
  ];

  const handleProgramClick = (programId: string) => {
    navigate(`/program/${programId}`);
  };

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 cursor-pointer flex items-center gap-3" onClick={() => onNavigate('home')}>
              <img
                src="/logo.png"
                alt="Pranita Pratisthan Logo"
                className="h-10 w-auto"
              />
              <div>
                <h1 className="heading-cultural text-xl font-bold text-orange-600">
                  प्रणिता प्रतिष्ठान
                </h1>
                <p className="text-xs text-orange-800">
                  सेवा • संस्कृती • विकास
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2 ml-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === item.id
                    ? 'text-white bg-orange-600'
                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                }`}
              >
                <span className="text-cultural">{item.label}</span>
              </button>
            ))}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 text-sm px-4"
                >
                  <span className="text-cultural">प्रकल्प</span>
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border shadow-lg z-50 min-w-48">
                {programs.map((program) => (
                  <DropdownMenuItem 
                    key={program.id}
                    className="hover:bg-orange-50 cursor-pointer text-cultural py-3 px-4"
                    onClick={() => handleProgramClick(program.id)}
                  >
                    {program.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-orange-600 p-2 rounded-lg hover:bg-orange-50 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden bg-white border-t mt-2 rounded-b-2xl shadow-lg">
            <div className="px-4 pt-4 pb-6 space-y-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? 'text-white bg-orange-600'
                      : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                  }`}
                >
                  <span className="text-cultural">{item.label}</span>
                </button>
              ))}
              
              <div className="px-4 py-2 border-t">
                <p className="text-xs font-medium text-gray-700 mb-3">
                  <span className="text-cultural">प्रकल्प</span>
                </p>
                {programs.map((program) => (
                  <button 
                    key={program.id}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    onClick={() => {
                      handleProgramClick(program.id);
                      setIsOpen(false);
                    }}
                  >
                    <span className="text-cultural">{program.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
