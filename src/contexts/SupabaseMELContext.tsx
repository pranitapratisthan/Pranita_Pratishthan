import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

// Use Supabase generated types matching actual DB schema
type Equipment = {
  id: string;
  name: string;
  photo_url: string | null;
  photo_path: string | null;
  total_quantity: number;
  available_quantity: number;
  rental_duration: number;
  deposit_amount: number;
  created_at: string;
  updated_at: string;
};

type MELUser = {
  id: string;
  user_id: string | null;
  username: string;
  full_name: string;
  email: string;
  created_at: string;
  updated_at: string;
};

type Rental = {
  id: string;
  equipment_id: string | null;
  equipment_name: string;
  patient_name: string;
  mobile_number: string;
  pickup_date: string;
  return_date: string;
  status: string;
  created_by_user_id: string | null;
  created_at: string;
  updated_at: string;
};

type PresidentSecretary = {
  id: string;
  role: string;
  name: string;
  message: string | null;
  photo_url: string | null;
  photo_path: string | null;
  updated_at: string;
};

type PopupEvent = {
  id: string;
  enabled: boolean;
  title: string;
  description?: string | null;
  date?: string | null;
  location?: string | null;
  banner_image_url?: string | null;
  created_at?: string;
  updated_at?: string;
};

interface SupabaseMELContextType {
  equipment: Equipment[];
  melUsers: MELUser[];
  rentals: Rental[];
  currentMELUser: MELUser | null;
  president: PresidentSecretary | null;
  secretary: PresidentSecretary | null;
  loading: boolean;
  popup: PopupEvent | null;
  fetchPopup: () => Promise<void>;
  updatePopup: (data: Partial<PopupEvent> & { id?: string; banner_file?: File | null }) => Promise<void>;
  addEquipment: (equipment: Omit<Equipment, 'id' | 'created_at'>) => Promise<void>;
  updateEquipment: (id: string, updates: Partial<Equipment>) => Promise<void>;
  deleteEquipment: (id: string) => Promise<void>;
  deleteMELUser: (id: string) => Promise<void>;
  addRental: (rental: Omit<Rental, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateRental: (id: string, updates: Partial<Rental>) => Promise<void>;
  getOverdueRentals: () => Rental[];
  setCurrentMELUser: (user: MELUser | null) => void;
  refreshData: () => Promise<void>;
  updatePresidentSecretary: (
    updates: Omit<PresidentSecretary, 'id' | 'updated_at'> & { id?: string; photo_file?: File | null }
  ) => Promise<void>;
  fetchPresidentAndSecretary: () => Promise<void>;
}

const SupabaseMELContext = createContext<SupabaseMELContextType | undefined>(undefined);

export const useSupabaseMEL = () => {
  const context = useContext(SupabaseMELContext);
  if (!context) {
    throw new Error('useSupabaseMEL must be used within a SupabaseMELProvider');
  }
  return context;
};

export const SupabaseMELProvider = ({ children }: { children: ReactNode }) => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [melUsers, setMELUsers] = useState<MELUser[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [currentMELUser, setCurrentMELUser] = useState<MELUser | null>(null);
  const [president, setPresident] = useState<PresidentSecretary | null>(null);
  const [secretary, setSecretary] = useState<PresidentSecretary | null>(null);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState<PopupEvent | null>(null);
  const { user, isAdmin } = useAuth();

  const fetchEquipment = async () => {
    try {
      const { data, error } = await supabase
        .from('equipment_inventory')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setEquipment(data || []);
    } catch (error) {
      console.error('Error fetching equipment:', error);
      toast.error('Failed to load equipment');
    }
  };

  const fetchMELUsers = async () => {
    try {
      // For admin users, we need to fetch all MEL users
      // The RLS policy allows admins to view via is_admin function
      const { data, error } = await supabase
        .from('mel_users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching MEL users:', error);
        // Don't show error toast for permission issues - admin might not have access yet
        if (!error.message.includes('permission')) {
          toast.error('Failed to load MEL users');
        }
        return;
      }
      
      console.log('Fetched MEL users:', data?.length || 0);
      setMELUsers(data || []);
    } catch (error) {
      console.error('Error fetching MEL users:', error);
    }
  };

  const fetchRentals = async () => {
    try {
      const { data, error } = await supabase
        .from('patient_history')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setRentals(data || []);
    } catch (error) {
      console.error('Error fetching rentals:', error);
      toast.error('Failed to load rentals');
    }
  };

  const fetchCurrentMELUser = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('mel_users')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching current MEL user:', error);
      }
      
      setCurrentMELUser(data || null);
    } catch (error) {
      console.error('Error fetching current MEL user:', error);
    }
  };

  const fetchPresidentAndSecretary = async () => {
    try {
      const { data, error } = await supabase
        .from('president_secretary')
        .select('*')
        .in('role', ['president', 'secretary']);
      
      if (error) throw error;
      
      const presidentData = data?.find(p => p.role === 'president');
      const secretaryData = data?.find(p => p.role === 'secretary');
      
      setPresident(presidentData || null);
      setSecretary(secretaryData || null);
    } catch (error) {
      console.error('Error fetching president and secretary:', error);
      toast.error('Failed to load president and secretary data');
    }
  };

  const fetchPopup = async () => {
    try {
      // First try to get enabled popup for display
      const { data: enabledPopup, error: enabledError } = await supabase
        .from('popup_events')
        .select('*')
        .eq('enabled', true)
        .maybeSingle();
      
      if (!enabledError && enabledPopup) {
        setPopup(enabledPopup);
        return;
      }

      // If no enabled popup, get the most recent one for admin editing
      const { data: anyPopup, error: anyError } = await supabase
        .from('popup_events')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (!anyError) {
        setPopup(anyPopup);
      }
    } catch (error) {
      console.error('Error fetching popup:', error);
    }
  };

  const updatePopup = async (changes: Partial<PopupEvent> & { id?: string; banner_file?: File | null }) => {
    try {
      let bannerUrl: string | null | undefined = changes.banner_image_url;
      let bannerPath: string | null | undefined = undefined;

      if (changes.banner_file) {
        const fileExt = changes.banner_file.name.split('.').pop();
        const fileName = `popup_${Date.now()}.${fileExt}`;
        
        // Use 'images' bucket which is confirmed to exist
        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(fileName, changes.banner_file, {
            cacheControl: '3600',
            upsert: true
          });
        
        if (uploadError) {
          console.error('Popup image upload error:', uploadError);
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }
        
        const { data } = supabase.storage
          .from('images')
          .getPublicUrl(fileName);
        
        bannerUrl = data.publicUrl;
        bannerPath = fileName;
      }

      // Build clean payload without banner_file
      const { banner_file, id, ...cleanChanges } = changes;
      
      const payload: any = {
        ...cleanChanges,
        updated_at: new Date().toISOString(),
      };

      // Only update banner URL if we have a new one
      if (bannerUrl !== undefined) {
        payload.banner_image_url = bannerUrl;
      }
      if (bannerPath) {
        payload.banner_image_path = bannerPath;
      }

      const popupId = changes.id || popup?.id;

      if (popupId) {
        const { error } = await supabase
          .from('popup_events')
          .update(payload)
          .eq('id', popupId);
        if (error) {
          console.error('Popup update error:', error);
          throw new Error(`Database update failed: ${error.message}`);
        }
      } else {
        // Create new popup
        payload.title = payload.title || 'New Event';
        const { error } = await supabase
          .from('popup_events')
          .insert([payload]);
        if (error) {
          console.error('Popup insert error:', error);
          throw new Error(`Database insert failed: ${error.message}`);
        }
      }
      toast.success('Popup updated successfully!');
      await fetchPopup();
    } catch (error) {
      console.error('Error updating popup:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update popup');
    }
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      await Promise.allSettled([
        fetchEquipment(),
        fetchMELUsers(),
        fetchRentals(),
        fetchCurrentMELUser(),
        fetchPresidentAndSecretary(),
        fetchPopup(),
      ]);
    } catch (e) {
      console.error('SupabaseMELContext.refreshData error:', e);
    } finally {
      setLoading(false);
    }
  };

  const uploadPresidentSecretaryPhoto = async (
    file: File,
    bucketName: string = 'president_secretary'
  ): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file);
    
    if (uploadError) throw uploadError;
    
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);
    
    return publicUrl;
  };

  const updatePresidentSecretary = async (
    updates: Omit<PresidentSecretary, 'id' | 'updated_at'> & { id?: string; photo_file?: File | null }
  ) => {
    try {
      // Determine photo URL - only update if new file is provided
      let photoUrl: string | null | undefined;

      if (updates.photo_file) {
        // New photo selected - upload it
        photoUrl = await uploadPresidentSecretaryPhoto(updates.photo_file);
      } else {
        // No new photo - keep existing URL (don't set to null)
        photoUrl = updates.photo_url;
      }

      const payload: any = {
        role: updates.role,
        name: updates.name,
        message: updates.message,
        updated_at: new Date().toISOString(),
      };

      // Only include photo_url in payload if we have a value
      if (photoUrl !== undefined) {
        payload.photo_url = photoUrl;
      }

      const recordId = updates.id;

      if (recordId) {
        const { error } = await supabase
          .from('president_secretary')
          .update(payload)
          .eq('id', recordId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('president_secretary')
          .insert([{ ...payload, photo_url: photoUrl || null }]);
        if (error) throw error;
      }

      toast.success('President/Secretary updated successfully');
      await fetchPresidentAndSecretary();
    } catch (error) {
      console.error('Error updating president/secretary:', error);
      toast.error('Failed to update president/secretary');
    }
  };

  const addEquipment = async (equipmentData: Omit<Equipment, 'id' | 'created_at'>) => {
    try {
      const { error } = await supabase.from('equipment_inventory').insert([equipmentData]);
      if (error) throw error;
      toast.success('Equipment added successfully');
      await fetchEquipment();
    } catch (error) {
      console.error('Error adding equipment:', error);
      toast.error('Failed to add equipment');
    }
  };

  const updateEquipment = async (id: string, updates: Partial<Equipment>) => {
    try {
      const { error } = await supabase.from('equipment_inventory').update(updates).eq('id', id);
      if (error) throw error;
      toast.success('Equipment updated successfully');
      await fetchEquipment();
    } catch (error) {
      console.error('Error updating equipment:', error);
      toast.error('Failed to update equipment');
    }
  };

  const deleteEquipment = async (id: string) => {
    try {
      const { error } = await supabase.from('equipment_inventory').delete().eq('id', id);
      if (error) throw error;
      toast.success('Equipment deleted successfully');
      await fetchEquipment();
    } catch (error) {
      console.error('Error deleting equipment:', error);
      toast.error('Failed to delete equipment');
    }
  };

  const deleteMELUser = async (id: string) => {
    try {
      const { error } = await supabase.from('mel_users').delete().eq('id', id);
      if (error) throw error;
      toast.success('User deleted successfully');
      await fetchMELUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const addRental = async (rentalData: Omit<Rental, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Insert rental record
      const { error } = await supabase.from('patient_history').insert([rentalData]);
      if (error) throw error;
      
      // Update equipment availability (decrease by 1)
      if (rentalData.equipment_id) {
        const equipmentItem = equipment.find(e => e.id === rentalData.equipment_id);
        if (equipmentItem && equipmentItem.available_quantity > 0) {
          const { error: updateError } = await supabase
            .from('equipment_inventory')
            .update({ 
              available_quantity: equipmentItem.available_quantity - 1,
              updated_at: new Date().toISOString()
            })
            .eq('id', rentalData.equipment_id);
          
          if (updateError) {
            console.error('Error updating equipment availability:', updateError);
          }
        }
      }
      
      toast.success('Rental added successfully');
      await Promise.all([fetchRentals(), fetchEquipment()]);
    } catch (error) {
      console.error('Error adding rental:', error);
      toast.error('Failed to add rental');
    }
  };

  const updateRental = async (id: string, updates: Partial<Rental>) => {
    try {
      // Find the original rental to check status change
      const originalRental = rentals.find(r => r.id === id);
      
      const { error } = await supabase.from('patient_history').update(updates).eq('id', id);
      if (error) throw error;
      
      // If status changed to 'returned', increase equipment availability
      if (updates.status === 'returned' && originalRental?.status === 'rented' && originalRental.equipment_id) {
        const equipmentItem = equipment.find(e => e.id === originalRental.equipment_id);
        if (equipmentItem) {
          const newAvailable = Math.min(equipmentItem.available_quantity + 1, equipmentItem.total_quantity);
          const { error: updateError } = await supabase
            .from('equipment_inventory')
            .update({ 
              available_quantity: newAvailable,
              updated_at: new Date().toISOString()
            })
            .eq('id', originalRental.equipment_id);
          
          if (updateError) {
            console.error('Error updating equipment availability:', updateError);
          }
        }
      }
      
      toast.success('Rental updated successfully');
      await Promise.all([fetchRentals(), fetchEquipment()]);
    } catch (error) {
      console.error('Error updating rental:', error);
      toast.error('Failed to update rental');
    }
  };

  const getOverdueRentals = (): Rental[] => {
    const today = new Date().toISOString().split('T')[0];
    return rentals.filter(rental => 
      rental.status === 'rented' && new Date(rental.return_date) < new Date(today)
    );
  };

  useEffect(() => {
    refreshData();
  }, [user]);

  const contextValue: SupabaseMELContextType = {
    equipment,
    melUsers,
    rentals,
    currentMELUser,
    president,
    secretary,
    loading,
    popup,
    fetchPopup,
    updatePopup,
    addEquipment,
    updateEquipment,
    deleteEquipment,
    deleteMELUser,
    addRental,
    updateRental,
    getOverdueRentals,
    setCurrentMELUser,
    refreshData,
    updatePresidentSecretary,
    fetchPresidentAndSecretary,
  };

  return (
    <SupabaseMELContext.Provider value={contextValue}>
      {children}
    </SupabaseMELContext.Provider>
  );
};