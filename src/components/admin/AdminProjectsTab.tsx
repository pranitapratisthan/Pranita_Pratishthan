
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Project {
  id: string;
  name: string;
  description: string;
  details: string;
  image_url: string;
}

const AdminProjectsTab = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState({
    name: '', description: '', details: '', image: null as File | null
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    setProjects(data || []);
    if (error) {
      console.error('Error fetching projects:', error);
      toast.error('Project fetch failed');
    }
  };

  const ensureBucketExists = async () => {
    try {
      // Check if bucket exists
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.error('Error listing buckets:', listError);
        return false;
      }

      const galleryBucket = buckets?.find(bucket => bucket.name === 'gallery');
      
      if (!galleryBucket) {
        console.error('Gallery bucket does not exist');
        toast.error('Storage bucket not found. Please contact administrator.');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking bucket:', error);
      return false;
    }
  };

  const handleAdd = async () => {
    if (!form.name || !form.description) {
      toast.error('Name and description are required');
      return;
    }
    
    setUploading(true);
    
    try {
      let publicUrl = '';
      let filename = '';

      // Only upload image if one is selected
      if (form.image) {
        // Ensure bucket exists
        const bucketExists = await ensureBucketExists();
        if (!bucketExists) {
          setUploading(false);
          return;
        }

        const ext = (form.image as File).name.split('.').pop();
        filename = `project_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
        
        console.log('Uploading project file:', filename);
        
        const { error: uploadErr, data: uploadData } = await supabase.storage
          .from('gallery')
          .upload(filename, form.image as File, { 
            cacheControl: '3600',
            upsert: false 
          });

        if (uploadErr) {
          console.error('Upload error:', uploadErr);
          throw new Error(`Upload failed: ${uploadErr.message}`);
        }

        console.log('Project upload successful:', uploadData);

        const { data } = supabase.storage
          .from('gallery').getPublicUrl(filename);
        publicUrl = data.publicUrl;

        console.log('Project public URL:', publicUrl);
      }

      const { error: insertError } = await supabase.from('projects').insert({
        name: form.name,
        description: form.description,
        details: form.details,
        image_url: publicUrl || null,
        image_path: filename || null
      });

      if (insertError) {
        console.error('Database insert error:', insertError);
        throw new Error(`Database error: ${insertError.message}`);
      }

      setForm({ name: '', description: '', details: '', image: null });
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
      
      toast.success('Project added successfully');
      fetchProjects();
    } catch (error) {
      console.error('Error adding project:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add project');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (proj: Project) => {
    try {
      // Delete from storage if image exists
      if (proj.image_url) {
        const filename = proj.image_url.split('/').pop();
        if (filename) {
          const { error: storageError } = await supabase.storage
            .from('gallery')
            .remove([filename]);
          
          if (storageError) {
            console.warn('Storage deletion warning:', storageError);
          }
        }
      }

      const { error: deleteError } = await supabase.from('projects').delete().eq('id', proj.id);
      
      if (deleteError) throw deleteError;

      toast.success('Project removed');
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Remove failed');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Program/Project Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <Input placeholder="Name" value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <Input placeholder="Description" value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <Input placeholder="Details" value={form.details}
            onChange={e => setForm(f => ({ ...f, details: e.target.value }))} />
          <Input type="file" accept="image/*"
            onChange={e => setForm(f => ({ ...f, image: e.target.files?.[0] || null }))}
            disabled={uploading}
          />
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={handleAdd} disabled={uploading || !form.name || !form.description}>
            {uploading ? 'Uploading...' : 'Add Program'}
          </Button>
          <span className="text-sm text-gray-500">* Image is optional</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
          {projects.map(proj => (
            <div key={proj.id} className="border rounded p-3">
              {proj.image_url && <img src={proj.image_url} alt={proj.name} className="w-full h-32 object-cover mb-2 rounded" />}
              <div className="font-bold">{proj.name}</div>
              <div className="text-xs text-gray-500">{proj.description}</div>
              <div className="text-xs mt-2">{proj.details}</div>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 mt-2"
                onClick={() => handleDelete(proj)}
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

export default AdminProjectsTab;
