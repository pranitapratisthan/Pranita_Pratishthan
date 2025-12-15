
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import DynamicTimeline from '@/components/dynamic/DynamicTimeline';
import DynamicPhotoGallery from '@/components/dynamic/DynamicPhotoGallery';
import DynamicNewsSection from '@/components/dynamic/DynamicNewsSection';
import DynamicYouTubeSection from '@/components/dynamic/DynamicYouTubeSection';
import DynamicFeedbackForm from '@/components/dynamic/DynamicFeedbackForm';
import UnifiedAdminPanel from '@/components/UnifiedAdminPanel';
import Footer from '@/components/Footer';
import AboutSection from '@/components/AboutSection';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll to section from navigation state (e.g., from footer links)
  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (state?.scrollTo) {
      // Navigate to the section
      setActiveSection(state.scrollTo);
      // Clear the state to prevent re-navigation on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleNavigate = (section: string) => {
    if (section === 'admin') {
      if (!user) {
        navigate('/login');
        return;
      }
    }
    setActiveSection(section);
    // Scroll to top when changing sections
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return (
          <div id="home">
            <HeroSection />
            <div id="timeline">
              <DynamicTimeline />
            </div>
          </div>
        );
      case 'about':
        return <div id="about"><AboutSection /></div>;
      case 'gallery':
        return <div id="gallery"><DynamicPhotoGallery /></div>;
      case 'news':
        return <div id="news"><DynamicNewsSection /></div>;
      case 'youtube':
        return <div id="youtube"><DynamicYouTubeSection /></div>;
      case 'admin':
        return <UnifiedAdminPanel />;
      default:
        return (
          <div id="home">
            <HeroSection />
            <div id="timeline">
              <DynamicTimeline />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar activeSection={activeSection} onNavigate={handleNavigate} />
      
      <main className="pt-12">
        {renderSection()}
        
        {/* Only show feedback form on home page */}
        {activeSection === 'home' && <DynamicFeedbackForm />}
      </main>

      {/* Always show footer except on admin page */}
      {activeSection !== 'admin' && <Footer />}
    </div>
  );
};

export default Index;
