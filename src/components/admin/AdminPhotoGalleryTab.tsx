
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

interface Photo {
  id: string;
  title: string;
  image_url: string;
  category?: string | null;
  project_id?: string | null;
  created_at: string;
}

const AdminPhotoGalleryTab = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    const { data, error } = await supabase
      .from('photo_gallery')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching photos:', error);
      toast.error('Failed to load gallery');
    }
    setPhotos(data || []);
  };

  // Removed bucket existence check - listBuckets requires admin privileges
  // Upload will fail with clear error if bucket doesn't exist

  const handleAddPhoto = async () => {
    if (!title || !image) {
      toast.error('Photo and title required');
      return;
    }

    setUploading(true);
    
    try {
      const ext = image.name.split('.').pop();
      const filename = `gallery_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      
      console.log('Uploading file:', filename);
      
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('gallery')
        .upload(filename, image, { 
          cacheControl: '3600',
          upsert: false 
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      console.log('Upload successful:', uploadData);

      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filename);

      console.log('Public URL:', publicUrl);

      const { error: insertError } = await supabase
        .from('photo_gallery')
        .insert({
          title,
          category: category || null,
          image_url: publicUrl,
          image_path: filename
        });

      if (insertError) {
        console.error('Database insert error:', insertError);
        throw new Error(`Database error: ${insertError.message}`);
      }

      setTitle('');
      setCategory('');
      setImage(null);
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
      
      toast.success('Photo added successfully');
      fetchPhotos();
    } catch (error) {
      console.error('Error adding photo:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add photo');
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (photo: Photo) => {
    try {
      // Delete from storage if image_path exists
      if (photo.image_url) {
        const filename = photo.image_url.split('/').pop();
        if (filename) {
          const { error: storageError } = await supabase.storage
            .from('gallery')
            .remove([filename]);
          
          if (storageError) {
            console.warn('Storage deletion warning:', storageError);
          }
        }
      }

      const { error: deleteError } = await supabase
        .from('photo_gallery')
        .delete()
        .eq('id', photo.id);

      if (deleteError) throw deleteError;

      toast.success('Photo removed');
      fetchPhotos();
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast.error('Failed to remove photo');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Photo Gallery Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Input
            placeholder="Photo title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <Input
            placeholder="Category (optional)"
            value={category}
            onChange={e => setCategory(e.target.value)}
          />
          <Input
            type="file"
            accept="image/*"
            onChange={e => setImage(e.target.files?.[0] || null)}
            disabled={uploading}
          />
        </div>
        <Button onClick={handleAddPhoto} disabled={uploading || !title || !image}>
          {uploading ? 'Uploading...' : 'Add Photo'}
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
          {photos.map(photo => (
            <div key={photo.id} className="rounded shadow p-3 flex flex-col items-center relative">
              <img src={photo.image_url} alt={photo.title} className="w-full h-48 object-cover mb-2 rounded" />
              <div className="font-bold">{photo.title}</div>
              <div className="text-xs text-gray-600">{photo.category}</div>
              <Button 
                variant="outline" 
                size="sm" 
                className="absolute top-2 right-2 text-red-600" 
                onClick={() => handleDeletePhoto(photo)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPhotoGalleryTab;
