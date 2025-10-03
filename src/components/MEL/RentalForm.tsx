
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useSupabaseMEL } from '@/contexts/SupabaseMELContext';
import { useAuth } from '@/contexts/AuthContext';

const RentalForm = () => {
  const { equipment, addRental } = useSupabaseMEL();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    patientName: '',
    mobileNumber: '',
    equipmentId: '',
    pickupDate: new Date().toISOString().split('T')[0]
  });

  const selectedEquipment = equipment.find(eq => eq.id === formData.equipmentId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEquipment || selectedEquipment.available_quantity === 0) {
      toast.error('Selected equipment is not available');
      return;
    }

    if (!user) {
      toast.error('User not logged in');
      return;
    }

    const pickupDate = new Date(formData.pickupDate);
    const returnDate = new Date(pickupDate);
    returnDate.setDate(returnDate.getDate() + selectedEquipment.rental_duration);

    const rental = {
      patient_name: formData.patientName,
      mobile_number: formData.mobileNumber,
      equipment_id: formData.equipmentId,
      equipment_name: selectedEquipment.name,
      pickup_date: formData.pickupDate,
      return_date: returnDate.toISOString().split('T')[0],
      status: 'rented',
      created_by_user_id: user.id
    };

    try {
      await addRental(rental);
      toast.success('Rental created successfully!');
      
      // Reset form
      setFormData({
        patientName: '',
        mobileNumber: '',
        equipmentId: '',
        pickupDate: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Error creating rental:', error);
      toast.error('Failed to create rental');
    }
  };

  const availableEquipment = equipment.filter(eq => eq.available_quantity > 0);

  // Temporarily disable problematic rental form until schema is fixed
  return <div className="p-4">Rental form temporarily disabled for schema updates</div>;
};

export default RentalForm;
