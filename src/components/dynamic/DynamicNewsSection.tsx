import { useState, useEffect } from 'react';
import NewsArticleDialog from "./NewsArticleDialog";
import { supabase } from '@/integrations/supabase/client';
import { Youtube } from "lucide-react";
import { extractYouTubeVideoId } from "@/lib/youtube";

// NewsItem type
interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  date: string;
  created_at: string;
}

interface YoutubeVideoNewsItem {
  id: string;
  title: string;
  video_id: string;
  thumbnail_url?: string | null;
}

const DynamicNewsSection = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState<NewsItem | null>(null);

  // New: fetch only news-type YouTube videos (is_news = true)
  const [ytNews, setYTNews] = useState<YoutubeVideoNewsItem[]>([]);
  const [ytLoading, setYTLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setNews(data || []);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchYoutubeNewsVideos = async () => {
      setYTLoading(true);
      try {
        const { data, error } = await supabase
          .from('youtube_videos')
          .select('id, title, video_id, thumbnail_url')
          .eq('is_news', true)
          .order('created_at', { ascending: false });
        if (error) throw error;
        setYTNews(data ?? []);
      } catch (error) {
        console.error('Error fetching YouTube news videos:', error);
      } finally {
        setYTLoading(false);
      }
    };

    fetchNews();
    fetchYoutubeNewsVideos();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">Loading news...</p>
          </div>
        </div>
      </section>
    );
  }

  // Responsive 2-column: news left, yt news right
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-marathi-orange mb-4">
            बातम्या व मीडिया
          </h2>
          <div className="w-24 h-1 saffron-gradient mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            आमच्या संस्थेच्या नवीनतम बातम्या आणि कार्यक्रमांची माहिती
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-10">
          {/* News articles */}
          <div className="flex-1">
            {news.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                अद्याप कोणत्याही बातम्या उपलब्ध नाहीत.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {news.map((item) => (
                  <button
                    className="text-left w-full focus:outline-none group"
                    key={item.id}
                    onClick={() => {
                      setSelected(item);
                      setDialogOpen(true);
                    }}
                    aria-label={`${item.title} article`}
                  >
                    <div className="border-2 border-gray-200 hover:border-marathi-orange bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group-focus:ring-2 group-focus:ring-marathi-orange group-focus:ring-offset-2">
                      <div className="p-6">
                        <h3 className="font-bold text-xl text-gray-800 mb-2 line-clamp-2 group-hover:text-marathi-orange transition-colors">
                          {item.title}
                        </h3>
                        {item.summary && (
                          <p className="text-gray-600 mb-2 line-clamp-3">
                            {item.summary}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                          <span className="text-sm text-gray-500">
                            {item.date ? new Date(item.date).toLocaleDateString('mr-IN') : ''}
                          </span>
                          <span className="text-sm font-medium text-marathi-orange group-hover:underline">
                            अधिक वाचा →
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* YouTube news video panel */}
          <div className="lg:w-[360px] w-full">
            <YouTubeNewsPanel youtubeVideos={ytNews} ytLoading={ytLoading} />
          </div>
        </div>
      </div>
      <NewsArticleDialog
        open={dialogOpen}
        onOpenChange={open => {
          setDialogOpen(open);
          if (!open) setSelected(null);
        }}
        news={
          selected
            ? {
                title: selected.title,
                summary: selected.summary,
                content: selected.content,
                author: selected.author,
                date: selected.date,
              }
            : undefined
        }
      />
    </section>
  );
};

// Right panel: YouTube news videos (is_news only)
function YouTubeNewsPanel({
  youtubeVideos,
  ytLoading,
}: {
  youtubeVideos: YoutubeVideoNewsItem[];
  ytLoading: boolean;
}) {
  if (ytLoading) {
    return (
      <div className="bg-white border p-6 rounded-lg shadow mb-4 flex items-center gap-2">
        <Youtube className="w-6 h-6 text-red-500 animate-bounce" />
        <span>News YouTube व्हिडिओ लोड होत आहेत...</span>
      </div>
    );
  }
  if (!youtubeVideos || youtubeVideos.length === 0) {
    return (
      <div className="bg-white border p-6 rounded-lg shadow text-gray-400 text-center">
        <Youtube className="w-7 h-7 inline-block text-red-400 mb-2" />
        <div>Currently no YouTube news videos</div>
      </div>
    );
  }

  return (
    <div className="bg-white border p-6 rounded-lg shadow">
      <div className="flex items-center mb-3 gap-2">
        <Youtube className="w-5 h-5 text-red-500" />
        <span className="font-bold text-marathi-orange">YouTube News Videos</span>
      </div>
      <div className="flex flex-col gap-2">
        {youtubeVideos.map((yt) => {
          const youtubeId = extractYouTubeVideoId(yt.video_id ?? "");
          return (
            <a
              key={yt.id}
              href={`https://www.youtube.com/watch?v=${youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:bg-red-50 transition-colors rounded-md px-2 py-2 flex items-center gap-2 text-gray-800 group"
            >
              {yt.thumbnail_url ? (
                <img
                  src={yt.thumbnail_url}
                  alt={yt.title}
                  className="w-10 h-7 object-cover rounded-sm border"
                />
              ) : (
                <div className="w-10 h-7 bg-gray-200 flex items-center justify-center rounded-sm">
                  <Youtube className="w-4 h-4 text-gray-400" />
                </div>
              )}
              <span className="line-clamp-2 flex-1 group-hover:text-red-700 text-sm font-medium">
                {yt.title}
              </span>
              <Youtube className="w-4 h-4 text-red-400 opacity-80 group-hover:scale-110" />
            </a>
          );
        })}
      </div>
    </div>
  );
}

export default DynamicNewsSection;
