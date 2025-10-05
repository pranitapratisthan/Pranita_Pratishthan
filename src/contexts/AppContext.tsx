import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  date: string;
}

interface YouTubeVideo {
  id: string;
  title: string;
  videoId: string;
  description: string;
}

interface Program {
  id: string;
  name: string;
  description: string;
  details: string;
  image?: string;
}

interface PopupData {
  enabled: boolean;
  title: string;
  description: string;
  date: string;
  location: string;
  bannerImage?: string;
}

interface MELUser {
  id: string;
  fullName: string;
  username: string;
  role: 'user' | 'admin';
}

interface MELRental {
  id: string;
  equipmentId: string;
  equipmentName: string;
  patientName: string;
  mobileNumber: string;
  rentalDate: number;
  returnDate: number;
  userId: string;
}

interface Feedback {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  rating: number;
  feedback: string;
  suggestion: string;
  date: string;
  isRead: boolean;
}

interface OrganizationInfo {
  president: {
    name: string;
    photo?: string;
    message: string;
  };
  secretary: {
    name: string;
    photo?: string;
    message: string;
  };
}

interface AppContextType {
  timelineEvents: TimelineEvent[];
  addTimelineEvent: (event: TimelineEvent) => void;
  newsItems: NewsItem[];
  addNewsItem: (item: NewsItem) => void;
  youtubeVideos: YouTubeVideo[];
  addYouTubeVideo: (video: YouTubeVideo) => void;
  programs: Program[];
  addProgram: (program: Program) => Promise<void>;
  popupData: PopupData;
  setPopupData: (data: PopupData) => void;
  currentMELUser: MELUser | null;
  setCurrentMELUser: (user: MELUser | null) => void;
  melRentals: MELRental[];
  addMELRental: (rental: MELRental) => void;
  updateMELRental: (rental: MELRental) => void;
  deleteMELRental: (id: string) => void;
  getOverdueRentals: () => MELRental[];
  feedbackList: Feedback[];
  addFeedback: (feedback: Feedback) => void;
  markFeedbackAsRead: (id: string) => void;
  organizationInfo: OrganizationInfo;
  updateOrganizationInfo: (info: OrganizationInfo) => void;
  loading: boolean;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [youtubeVideos, setYouTubeVideos] = useState<YouTubeVideo[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [popupData, setPopupData] = useState<PopupData>({
    enabled: false,
    title: '',
    description: '',
    date: '',
    location: '',
  });
  const [currentMELUser, setCurrentMELUser] = useState<MELUser | null>(null);
  const [melRentals, setMelRentals] = useState<MELRental[]>([]);
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [organizationInfo, setOrganizationInfo] = useState<OrganizationInfo>({
    president: {
      name: 'श्री. मिलिंद धर्माधिकारी ',
      message: 'समाजसेवेच्या क्षेत्रात अग्रणी असलेल्या प्रणिता प्रतिष्ठानच्या अध्यक्षपदी कार्यरत आहेत. त्यांच्या नेतृत्वाखाली संस्थेने अनेक महत्वाचे प्रकल्प राबवले आहेत.'
    },
    secretary: {
      name: 'श्री. भानुदास पाटील ',
      message: 'संस्थेच्या दैनंदिन कामकाजाची जबाबदारी सांभाळणाऱ्या सचिव म्हणून कार्यरत आहेत. त्यांच्या कुशल व्यवस्थापनामुळे संस्थेची कार्ये सुरळीतपणे चालतात.'
    }
  });

  // --- DATA FETCHING FUNCTIONS ---
  const fetchTimelineEvents = async () => {
    console.log('AppContext: Fetching timeline events...');
    try {
      console.log('AppContext: Supabase client exists:', !!supabase);
      const { data, error } = await supabase
        .from('timeline_events')
        .select('*')
        .order('year', { ascending: true });
      
      if (error) {
        console.error('AppContext: Timeline events error:', error);
        throw error;
      }
      console.log('AppContext: Timeline events data:', data);
      const mappedData = data?.map(event => ({
        year: event.year,
        title: event.title,
        description: event.description || '',
        icon: event.icon || 'Award',
        color: event.color || 'bg-marathi-orange'
      })) || [];
      console.log('AppContext: Mapped timeline events:', mappedData);
      setTimelineEvents(mappedData);
    } catch (error) {
      console.error("Error fetching timeline events:", error);
      setTimelineEvents([]);
    }
  };

  const fetchNewsItems = async () => {
    console.log('AppContext: Fetching news items...');
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('AppContext: News items error:', error);
        throw error;
      }
      console.log('AppContext: News items data:', data);
      const mappedData = data?.map(news => ({
        id: news.id,
        title: news.title,
        summary: news.summary || '',
        content: news.content,
        author: news.author || '',
        date: news.date || news.created_at
      })) || [];
      setNewsItems(mappedData);
    } catch (error) {
      console.error("Error fetching news items:", error);
      setNewsItems([]);
    }
  };

  const fetchYouTubeVideos = async () => {
    console.log('AppContext: Fetching YouTube videos...');
    try {
      const { data, error } = await supabase
        .from('youtube_videos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('AppContext: YouTube videos error:', error);
        throw error;
      }
      console.log('AppContext: YouTube videos data:', data);
      const mappedData = data?.map(video => ({
        id: video.id,
        title: video.title,
        videoId: video.video_id,
        description: video.description || ''
      })) || [];
      setYouTubeVideos(mappedData);
    } catch (error) {
      console.error("Error fetching YouTube videos:", error);
      setYouTubeVideos([]);
    }
  };

  const fetchPrograms = async () => {
    console.log('AppContext: Fetching programs...');
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id, name, description, details, image_url');
      
      if (error) {
        console.error('AppContext: Programs error:', error);
        throw error;
      }
      console.log('AppContext: Programs data:', data);
      const mappedData = data?.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        details: p.details,
        image: p.image_url || undefined,
      })) || [];
      setPrograms(mappedData);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setPrograms([]);
    }
  };

  const fetchPopupData = async () => {
    console.log('AppContext: Fetching popup data...');
    try {
      const { data, error } = await supabase
        .from('popup_events')
        .select('*')
        .eq('enabled', true)
        .maybeSingle();
      
      if (error) {
        console.error('AppContext: Popup data error:', error);
        throw error;
      }
      console.log('AppContext: Popup data:', data);
      if (data) {
        setPopupData({
          enabled: data.enabled,
          title: data.title,
          description: data.description || '',
          date: data.date || '',
          location: data.location || '',
          bannerImage: data.banner_image_url || undefined
        });
      }
    } catch (error) {
      console.error("Error fetching popup data:", error);
    }
  };

  const refreshData = async () => {
    console.log('AppContext: Starting data refresh...');
    setLoading(true);
    try {
      console.log('AppContext: Fetching all data...');
      const results = await Promise.allSettled([
        fetchTimelineEvents(),
        fetchNewsItems(),
        fetchYouTubeVideos(),
        fetchPrograms(),
        fetchPopupData()
      ]);
      console.log('AppContext: Data fetch results:', results);
    } finally {
      setLoading(false);
      console.log('AppContext: Data loading complete');
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // When a new program is added, insert to Supabase and refresh
  const addProgram = async (program: Program) => {
    const { error } = await supabase
      .from('projects')
      .insert([
        {
          name: program.name,
          description: program.description,
          details: program.details,
          image_url: program.image || null,
        }
      ]);
    if (error) {
      console.error("Error adding program:", error.message);
      return;
    }
    await fetchPrograms();
  };

  const addTimelineEvent = (event: TimelineEvent) => {
    setTimelineEvents((prevEvents) => [...prevEvents, event]);
  };

  const addNewsItem = (item: NewsItem) => {
    setNewsItems((prevItems) => [...prevItems, item]);
  };

  const addYouTubeVideo = (video: YouTubeVideo) => {
    setYouTubeVideos((prevVideos) => [...prevVideos, video]);
  };

  const addMELRental = (rental: MELRental) => {
    setMelRentals(prev => [...prev, rental]);
  };

  const updateMELRental = (rental: MELRental) => {
    setMelRentals(prev => prev.map(r => r.id === rental.id ? rental : r));
  };

  const deleteMELRental = (id: string) => {
    setMelRentals(prev => prev.filter(r => r.id !== id));
  };

  const getOverdueRentals = () => {
    const today = new Date().getTime();
    return melRentals.filter(rental => rental.returnDate < today);
  };

  const addFeedback = (feedback: Feedback) => {
    setFeedbackList(prev => [feedback, ...prev]);
  };

  const markFeedbackAsRead = (id: string) => {
    setFeedbackList(prev => 
      prev.map(feedback => 
        feedback.id === id ? { ...feedback, isRead: true } : feedback
      )
    );
  };

  const updateOrganizationInfo = (info: OrganizationInfo) => {
    setOrganizationInfo(info);
  };

  return (
    <AppContext.Provider
      value={{
        timelineEvents,
        addTimelineEvent,
        newsItems,
        addNewsItem,
        youtubeVideos,
        addYouTubeVideo,
        programs,
        addProgram,
        popupData,
        setPopupData,
        currentMELUser,
        setCurrentMELUser,
        melRentals,
        addMELRental,
        updateMELRental,
        deleteMELRental,
        getOverdueRentals,
        feedbackList,
        addFeedback,
        markFeedbackAsRead,
        organizationInfo,
        updateOrganizationInfo,
        loading,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
