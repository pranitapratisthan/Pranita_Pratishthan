import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useSupabaseMEL } from '@/contexts/SupabaseMELContext';
import { useAuth } from '@/contexts/AuthContext';

const RentalForm = () => {
  const { equipment, addRental } = useSupabaseMEL();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    patientName: '',
    mobileNumber: '',
    aadhaarNumber: '',
    address: '',
    equipmentId: '',
    pickupDate: new Date().toISOString().split('T')[0]
  });

  const selectedEquipment = equipment.find(eq => eq.id === formData.equipmentId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.patientName.trim()) {
      toast.error('Please enter patient name');
      return;
    }

    if (!formData.mobileNumber || formData.mobileNumber.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    if (!selectedEquipment) {
      toast.error('Please select equipment');
      return;
    }

    if (selectedEquipment.available_quantity <= 0) {
      toast.error('This equipment is currently unavailable. Please select another equipment.');
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
      patient_name: formData.patientName.trim(),
      mobile_number: formData.mobileNumber,
      aadhaar_number: formData.aadhaarNumber.trim() || null,
      address: formData.address.trim() || null,
      equipment_id: formData.equipmentId,
      equipment_name: selectedEquipment.name,
      pickup_date: formData.pickupDate,
      return_date: returnDate.toISOString().split('T')[0],
      status: 'rented',
      created_by_user_id: user.id
    };

    try {
      await addRental(rental);
      // Reset form only on success
      setFormData({
        patientName: '',
        mobileNumber: '',
        aadhaarNumber: '',
        address: '',
        equipmentId: '',
        pickupDate: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Error creating rental:', error);
      // Error already shown by addRental
    }
  };

  const availableEquipment = equipment.filter(eq => eq.available_quantity > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Rental</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Patient Name</label>
            <Input
              required
              value={formData.patientName}
              onChange={(e) => setFormData({...formData, patientName: e.target.value})}
              placeholder="Enter patient name"
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Mobile Number</label>
            <Input
              required
              value={formData.mobileNumber}
              onChange={(e) => {
                // Only allow digits, max 10
                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                setFormData({...formData, mobileNumber: value});
              }}
              placeholder="Enter 10-digit mobile number"
              maxLength={10}
              pattern="[0-9]{10}"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Aadhaar Card Number (Optional)</label>
            <Input
              value={formData.aadhaarNumber}
              onChange={(e) => {
                // Only allow digits, max 12
                const value = e.target.value.replace(/\D/g, '').slice(0, 12);
                setFormData({...formData, aadhaarNumber: value});
              }}
              placeholder="Enter 12-digit Aadhaar number"
              maxLength={12}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Full Address (Optional)</label>
            <Textarea
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              placeholder="Enter full address"
              rows={3}
              maxLength={500}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Equipment</label>
            <Select
              value={formData.equipmentId}
              onValueChange={(value) => setFormData({...formData, equipmentId: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select equipment" />
              </SelectTrigger>
              <SelectContent>
                {availableEquipment.map((eq) => (
                  <SelectItem key={eq.id} value={eq.id}>
                    {eq.name} (Available: {eq.available_quantity})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Pickup Date</label>
            <Input
              type="date"
              required
              value={formData.pickupDate}
              onChange={(e) => setFormData({...formData, pickupDate: e.target.value})}
            />
          </div>

          {selectedEquipment && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Rental Duration:</strong> {selectedEquipment.rental_duration} days
              </p>
              <p className="text-sm text-gray-600">
                <strong>Deposit Amount:</strong> ₹{selectedEquipment.deposit_amount}
              </p>
            </div>
          )}

          <Button type="submit" className="w-full">
            Create Rental
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RentalForm;
