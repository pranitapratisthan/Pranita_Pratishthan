import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Project {
  id: string;
  name: string;
  description: string;
  details: string;
}

const AdminProjectsTab = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState({
    name: '', description: '', details: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    setProjects(data || []);
    if (error) {
      console.error('Error fetching projects:', error);
      toast.error('Project fetch failed');
    }
  };

  const handleAdd = async () => {
    if (!form.name || !form.description) {
      toast.error('Name and description are required');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const { error: insertError } = await supabase.from('projects').insert({
        name: form.name,
        description: form.description,
        details: form.details,
        image_url: null,
        image_path: null
      });

      if (insertError) {
        console.error('Database insert error:', insertError);
        throw new Error(`Database error: ${insertError.message}`);
      }

      setForm({ name: '', description: '', details: '' });
      toast.success('Project added successfully');
      fetchProjects();
    } catch (error) {
      console.error('Error adding project:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (proj: Project) => {
    try {
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Input placeholder="Name" value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <Input placeholder="Description" value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <Input placeholder="Details" value={form.details}
            onChange={e => setForm(f => ({ ...f, details: e.target.value }))} />
        </div>
        <Button onClick={handleAdd} disabled={submitting || !form.name || !form.description}>
          {submitting ? 'Adding...' : 'Add Program'}
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
          {projects.map(proj => (
            <div key={proj.id} className="border rounded p-3">
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
