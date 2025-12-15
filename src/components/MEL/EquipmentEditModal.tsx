import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Equipment {
  id: string;
  name: string;
  photo_url: string | null;
  total_quantity: number;
  available_quantity: number;
  rental_duration: number;
  deposit_amount: number;
}

interface EquipmentEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipment: Equipment | null;
  onSave: (id: string, updates: Partial<Equipment>) => Promise<void>;
}

export const EquipmentEditModal = ({
  open,
  onOpenChange,
  equipment,
  onSave
}: EquipmentEditModalProps) => {
  const [form, setForm] = useState({
    name: '',
    photo_url: '',
    total_quantity: 0,
    available_quantity: 0,
    rental_duration: 7,
    deposit_amount: 0
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (equipment) {
      setForm({
        name: equipment.name,
        photo_url: equipment.photo_url || '',
        total_quantity: equipment.total_quantity,
        available_quantity: equipment.available_quantity,
        rental_duration: equipment.rental_duration,
        deposit_amount: equipment.deposit_amount
      });
    }
  }, [equipment]);

  const handleSave = async () => {
    if (!equipment) return;
    setSaving(true);
    try {
      await onSave(equipment.id, {
        name: form.name,
        photo_url: form.photo_url || null,
        total_quantity: form.total_quantity,
        available_quantity: form.available_quantity,
        rental_duration: form.rental_duration,
        deposit_amount: form.deposit_amount
      });
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Equipment</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="photo_url">Photo URL (optional)</Label>
            <Input
              id="photo_url"
              value={form.photo_url}
              onChange={(e) => setForm({ ...form, photo_url: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="total_quantity">Total Quantity</Label>
              <Input
                id="total_quantity"
                type="number"
                value={form.total_quantity}
                onChange={(e) => setForm({ ...form, total_quantity: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="available_quantity">Available</Label>
              <Input
                id="available_quantity"
                type="number"
                value={form.available_quantity}
                onChange={(e) => setForm({ ...form, available_quantity: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="rental_duration">Rental Duration (days)</Label>
              <Input
                id="rental_duration"
                type="number"
                value={form.rental_duration}
                onChange={(e) => setForm({ ...form, rental_duration: parseInt(e.target.value) || 7 })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="deposit_amount">Deposit ₹</Label>
              <Input
                id="deposit_amount"
                type="number"
                value={form.deposit_amount}
                onChange={(e) => setForm({ ...form, deposit_amount: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
