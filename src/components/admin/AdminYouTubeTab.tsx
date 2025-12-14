
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { extractYouTubeVideoId } from '@/lib/youtube';

interface YouTubeVideo {
  id: string;
  title: string;
  video_id: string;
  thumbnail_url: string;
  description: string;
  is_news: boolean;
}

const AdminYouTubeTab = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [title, setTitle] = useState('');
  const [videoId, setVideoId] = useState('');
  const [videoType, setVideoType] = useState('normal');
  const [uploading, setUploading] = useState(false);

  useEffect(() => { fetchVideos(); }, []);

  const fetchVideos = async () => {
    const { data, error } = await supabase
      .from('youtube_videos')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) toast.error('Failed to load videos');
    setVideos(data || []);
  };

  const handleAdd = async () => {
    if (!title || !videoId) {
      toast.error('Title and Video URL required');
      return;
    }

    // Extract clean video ID from URL or use as-is if already clean
    const cleanVideoId = extractYouTubeVideoId(videoId);
    if (!cleanVideoId) {
      toast.error('Invalid YouTube video URL. Please check the format.');
      return;
    }

    setUploading(true);
    try {
      // Auto-generate thumbnail URL from YouTube
      const thumbUrl = `https://img.youtube.com/vi/${cleanVideoId}/maxresdefault.jpg`;
      
      const { error } = await supabase.from('youtube_videos').insert({
        title,
        video_id: cleanVideoId,
        description: '',
        thumbnail_url: thumbUrl,
        is_news: videoType === 'news'
      });
      if (error) throw error;
      setTitle('');
      setVideoId('');
      setVideoType('normal');
      toast.success('Video added successfully');
      fetchVideos();
    } catch (error) {
      console.error('Error adding video:', error);
      toast.error('Failed to add video');
    }
    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await supabase.from('youtube_videos').delete().eq('id', id);
      toast.success('Video deleted');
      fetchVideos();
    } catch {
      toast.error('Delete failed');
    }
  };

  const getVideoThumbnail = (video: YouTubeVideo): string => {
    if (video.thumbnail_url) {
      return video.thumbnail_url;
    }
    const cleanVideoId = extractYouTubeVideoId(video.video_id);
    if (cleanVideoId) {
      return `https://img.youtube.com/vi/${cleanVideoId}/maxresdefault.jpg`;
    }
    return '/placeholder.svg';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>YouTube Video Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input 
            placeholder="Video Title" 
            value={title}
            onChange={e => setTitle(e.target.value)} 
          />
          <Input 
            placeholder="YouTube Video URL (e.g., https://youtube.com/watch?v=...)" 
            value={videoId}
            onChange={e => setVideoId(e.target.value)}
            title="Enter full YouTube URL or youtu.be link"
          />
        </div>
        
        <div className="mb-4">
          <Label className="text-sm font-medium mb-2 block">Video Type</Label>
          <RadioGroup value={videoType} onValueChange={setVideoType} className="flex gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="normal" id="normal" />
              <Label htmlFor="normal">Normal YouTube Video</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="news" id="news" />
              <Label htmlFor="news">News Video</Label>
            </div>
          </RadioGroup>
        </div>

        <Button onClick={handleAdd} disabled={uploading || !title || !videoId} className="mb-8">
          {uploading ? 'Adding...' : 'Add Video'}
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {videos.map(vid => (
            <div key={vid.id} className="border rounded p-3">
              <img 
                src={getVideoThumbnail(vid)} 
                alt={vid.title} 
                className="w-full h-32 object-cover rounded mb-2"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
              <div className="font-bold">{vid.title}</div>
              <div className="text-xs text-gray-700">ID: {vid.video_id}</div>
              <div className="text-xs text-gray-500 mb-2">{vid.description}</div>
              <div className="text-xs font-medium mb-2">
                Type: <span className={vid.is_news ? 'text-red-600' : 'text-blue-600'}>
                  {vid.is_news ? 'News Video' : 'Normal Video'}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600"
                onClick={() => handleDelete(vid.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
export default AdminYouTubeTab;
