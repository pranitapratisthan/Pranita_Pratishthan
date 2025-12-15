import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Trash2, Edit, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useSupabaseMEL } from '@/contexts/SupabaseMELContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { EquipmentEditModal } from './EquipmentEditModal';
import { UserEditModal } from './UserEditModal';

interface SupabaseMELAdminPanelProps {
  onBackToUser: () => void;
}

const SupabaseMELAdminPanel = ({ onBackToUser }: SupabaseMELAdminPanelProps) => {
  const { createMELUser } = useAuth();
  const navigate = useNavigate();
  const {
    equipment,
    melUsers,
    rentals,
    addEquipment,
    updateEquipment,
    deleteEquipment,
    deleteMELUser,
    updateRental,
    getOverdueRentals,
    refreshData,
    loading
  } = useSupabaseMEL();

  const [newEquipment, setNewEquipment] = useState({
    name: '',
    photo_url: '',
    photo_path: null as string | null,
    total_quantity: '' as string | number,
    available_quantity: '' as string | number,
    rental_duration: '' as string | number,
    deposit_amount: '' as string | number,
    updated_at: new Date().toISOString()
  });

  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    full_name: '',
    email: ''
  });

  // Modal states
  const [deleteEquipmentDialog, setDeleteEquipmentDialog] = useState<{ open: boolean; id: string; name: string }>({ open: false, id: '', name: '' });
  const [deleteUserDialog, setDeleteUserDialog] = useState<{ open: boolean; id: string; name: string }>({ open: false, id: '', name: '' });
  const [editEquipment, setEditEquipment] = useState<any>(null);
  const [editUser, setEditUser] = useState<any>(null);

  const handleAddEquipment = async () => {
    if (!newEquipment.name) {
      toast.error('Equipment name is required');
      return;
    }

    try {
      await addEquipment({
        ...newEquipment,
        total_quantity: Number(newEquipment.total_quantity) || 0,
        available_quantity: Number(newEquipment.available_quantity) || 0,
        rental_duration: Number(newEquipment.rental_duration) || 7,
        deposit_amount: Number(newEquipment.deposit_amount) || 0,
      });
      setNewEquipment({
        name: '',
        photo_url: '',
        photo_path: null,
        total_quantity: '',
        available_quantity: '',
        rental_duration: '',
        deposit_amount: '',
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error adding equipment:', error);
    }
  };

  const handleAddUser = async () => {
    if (!newUser.username || !newUser.password || !newUser.full_name || !newUser.email) {
      toast.error('All fields are required');
      return;
    }

    const { error } = await createMELUser({
      username: newUser.username,
      password: newUser.password,
      fullName: newUser.full_name,
      email: newUser.email
    });

    if (error) {
      toast.error('Failed to create user: ' + error.message);
    } else {
      toast.success('MEL user created successfully!');
      setNewUser({
        username: '',
        password: '',
        full_name: '',
        email: ''
      });
      await refreshData();
    }
  };

  const handleDeleteEquipment = async () => {
    if (deleteEquipmentDialog.id) {
      await deleteEquipment(deleteEquipmentDialog.id);
      setDeleteEquipmentDialog({ open: false, id: '', name: '' });
    }
  };

  const handleDeleteUser = async () => {
    if (deleteUserDialog.id) {
      await deleteMELUser(deleteUserDialog.id);
      setDeleteUserDialog({ open: false, id: '', name: '' });
    }
  };

  const handleMarkReturned = async (rentalId: string) => {
    await updateRental(rentalId, { status: 'returned' });
  };

  const overdueRentals = getOverdueRentals();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mt-12 mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onBackToUser}
              className="border-marathi-orange text-marathi-orange hover:bg-marathi-orange hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              मागे
            </Button>
            <h2 className="text-4xl font-bold text-marathi-orange">
              MEL Settings
            </h2>
          </div>
          <div className="w-24 h-1 saffron-gradient mx-auto mb-6"></div>
        </div>

        <Tabs defaultValue="equipment" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="equipment">Equipment</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="rentals">Rentals</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
          </TabsList>

          <TabsContent value="equipment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Equipment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Equipment name *"
                    value={newEquipment.name}
                    onChange={(e) => setNewEquipment({...newEquipment, name: e.target.value})}
                  />
                  <Input
                    placeholder="Equipment photo URL (optional)"
                    value={newEquipment.photo_url}
                    onChange={(e) => setNewEquipment({...newEquipment, photo_url: e.target.value})}
                  />
                  <Input
                    type="number"
                    placeholder="Total quantity (e.g., 10)"
                    value={newEquipment.total_quantity === '' ? '' : newEquipment.total_quantity}
                    onChange={(e) => setNewEquipment({...newEquipment, total_quantity: e.target.value === '' ? '' : parseInt(e.target.value) || 0})}
                  />
                  <Input
                    type="number"
                    placeholder="Available quantity (e.g., 8)"
                    value={newEquipment.available_quantity === '' ? '' : newEquipment.available_quantity}
                    onChange={(e) => setNewEquipment({...newEquipment, available_quantity: e.target.value === '' ? '' : parseInt(e.target.value) || 0})}
                  />
                  <Input
                    type="number"
                    placeholder="Rental duration in days (e.g., 7)"
                    value={newEquipment.rental_duration === '' ? '' : newEquipment.rental_duration}
                    onChange={(e) => setNewEquipment({...newEquipment, rental_duration: e.target.value === '' ? '' : parseInt(e.target.value) || 7})}
                  />
                  <Input
                    type="number"
                    placeholder="Deposit amount ₹ (e.g., 500)"
                    value={newEquipment.deposit_amount === '' ? '' : newEquipment.deposit_amount}
                    onChange={(e) => setNewEquipment({...newEquipment, deposit_amount: e.target.value === '' ? '' : parseInt(e.target.value) || 0})}
                  />
                </div>
                <Button onClick={handleAddEquipment} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Equipment
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Equipment ({equipment.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {equipment.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        {item.photo_url && (
                          <img src={item.photo_url} alt={item.name} className="w-16 h-16 object-cover rounded" />
                        )}
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-600">
                            Available: <span className={item.available_quantity === 0 ? 'text-red-600 font-bold' : 'text-green-600'}>{item.available_quantity}</span>/{item.total_quantity} | 
                            Duration: {item.rental_duration} days | 
                            Deposit: ₹{item.deposit_amount}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setEditEquipment(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600"
                          onClick={() => setDeleteEquipmentDialog({ open: true, id: item.id, name: item.name })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New MEL User</CardTitle>
                <p className="text-sm text-gray-600">Only administrators can create MEL user accounts</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Username"
                    value={newUser.username}
                    onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  />
                  <Input
                    placeholder="Full Name"
                    value={newUser.full_name}
                    onChange={(e) => setNewUser({...newUser, full_name: e.target.value})}
                  />
                  <Input
                    placeholder="Email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  />
                  <Input
                    placeholder="Password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  />
                </div>
                <Button onClick={handleAddUser} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Create MEL User
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>MEL Users ({melUsers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {melUsers.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No MEL users found. Create one above.</p>
                ) : (
                  <div className="space-y-4">
                    {melUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{user.full_name}</h4>
                          <p className="text-sm text-gray-600">
                            Username: {user.username} | Email: {user.email}
                          </p>
                          <p className="text-xs text-gray-500">
                            Created: {new Date(user.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setEditUser(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600"
                            onClick={() => setDeleteUserDialog({ open: true, id: user.id, name: user.full_name })}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rentals">
            <Card>
              <CardHeader>
                <CardTitle>All Rentals ({rentals.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rentals.map((rental) => (
                    <div key={rental.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{rental.equipment_name}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant={rental.status === 'returned' ? 'secondary' : 'default'}>
                            {rental.status}
                          </Badge>
                          {rental.status === 'rented' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleMarkReturned(rental.id)}
                              className="text-green-600"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Mark Returned
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                        <p>Patient: {rental.patient_name}</p>
                        <p>Mobile: {rental.mobile_number}</p>
                        <p>Pickup: {new Date(rental.pickup_date).toLocaleDateString()}</p>
                        <p>Return: {new Date(rental.return_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overdue">
            <Card>
              <CardHeader>
                <CardTitle>Overdue Equipment ({overdueRentals.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {overdueRentals.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No overdue equipment.</p>
                  ) : (
                    overdueRentals.map((rental) => (
                      <div key={rental.id} className="p-4 border rounded-lg border-red-200 bg-red-50">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-red-800">{rental.equipment_name}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="destructive">Overdue</Badge>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleMarkReturned(rental.id)}
                              className="text-green-600 bg-white"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Mark Returned
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-red-700">
                          <p>Patient: {rental.patient_name}</p>
                          <p>Mobile: {rental.mobile_number}</p>
                          <p>Due: {new Date(rental.return_date).toLocaleDateString()}</p>
                          <p>Days Late: {Math.ceil((new Date().getTime() - new Date(rental.return_date).getTime()) / (1000 * 60 * 60 * 24))}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        open={deleteEquipmentDialog.open}
        onOpenChange={(open) => setDeleteEquipmentDialog({ ...deleteEquipmentDialog, open })}
        title="Delete Equipment"
        description={`Are you sure you want to delete "${deleteEquipmentDialog.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteEquipment}
        confirmText="Delete"
        variant="destructive"
      />

      <ConfirmDialog
        open={deleteUserDialog.open}
        onOpenChange={(open) => setDeleteUserDialog({ ...deleteUserDialog, open })}
        title="Delete User"
        description={`Are you sure you want to delete user "${deleteUserDialog.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteUser}
        confirmText="Delete"
        variant="destructive"
      />

      {/* Edit Modals */}
      <EquipmentEditModal
        open={!!editEquipment}
        onOpenChange={(open) => !open && setEditEquipment(null)}
        equipment={editEquipment}
        onSave={updateEquipment}
      />

      <UserEditModal
        open={!!editUser}
        onOpenChange={(open) => !open && setEditUser(null)}
        user={editUser}
        onSaved={refreshData}
      />
    </div>
  );
};

export default SupabaseMELAdminPanel;
