import { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSupabaseMEL } from '@/contexts/SupabaseMELContext';
import useEmblaCarousel from 'embla-carousel-react';

const heroImages = [
  '/hero.png',
  '/hero2.png', // Replace with actual different images
  '/hero3.png', // Replace with actual different images
  '/hero4.png', // Replace with actual different images
];

const HeroSection = () => {
  const { popup, fetchPopup } = useSupabaseMEL();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  // Manual autoplay implementation
  useEffect(() => {
    if (!emblaApi) return;
    
    const startAutoplay = () => {
      autoplayRef.current = setInterval(() => {
        emblaApi.scrollNext();
      }, 5000);
    };

    startAutoplay();

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    fetchPopup();
    if (popup?.enabled && popup?.title) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [popup?.enabled, popup?.title]);

  return (
    <div className="relative overflow-hidden">
      {/* Hero Carousel */}
      <div className="relative h-screen" ref={emblaRef}>
        <div className="flex h-full">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className="flex-[0_0_100%] min-w-0 h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url('${image}')` }}
            />
          ))}
        </div>

        {/* Hero Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-white max-w-4xl mx-auto px-6">
            <h1 className="heading-cultural text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-shadow">
              प्रणिता प्रतिष्ठान
            </h1>
            <p className="text-cultural text-xl md:text-2xl lg:text-3xl mb-4 text-shadow">
              समाजसेवा • संस्कृती • विकास
            </p>
            <p className="text-cultural text-base md:text-lg text-orange-100">
              सेवा ही आमची शक्ती, संस्कृती आमचा अभिमान
            </p>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={scrollPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors z-10"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={scrollNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors z-10"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === selectedIndex
                  ? 'bg-white'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Popup */}
      {showPopup && popup?.enabled && popup.title && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full relative shadow-xl">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-orange-600 z-10 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
            >
              <X className="h-5 w-5" />
            </button>
            {popup.banner_image_url && (
              <div className="w-full flex justify-center">
                <img
                  src={popup.banner_image_url}
                  alt="Banner"
                  className="rounded-t-2xl object-contain"
                  style={{
                    maxHeight: 220,
                    maxWidth: '100%',
                    width: 'auto',
                    height: 'auto',
                    aspectRatio: 'auto'
                  }}
                />
              </div>
            )}
            <div className="p-8">
              <div className="text-center">
                {!popup.banner_image_url && (
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <span className="text-3xl">🎉</span>
                  </div>
                )}
                <h3 className="heading-cultural text-2xl md:text-3xl font-bold text-orange-600 mb-4">
                  {popup.title}
                </h3>
                <p className="text-cultural text-gray-700 mb-4 leading-relaxed">
                  {popup.description}
                </p>
                {(popup.date || popup.location) && (
                  <div className="bg-orange-50 rounded-lg p-3 mb-6">
                    <p className="text-sm text-orange-800 font-medium">
                      {popup.date ? <>📅 {popup.date} </> : null}
                      {popup.location ? <>• 📍 {popup.location}</> : null}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSection;
