
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Package, Clock, AlertTriangle, LogOut, Download } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseMEL } from '@/contexts/SupabaseMELContext';
import { downloadCSV } from '@/utils/csvExport';
import { supabase } from '@/integrations/supabase/client';
import PasswordChangeModal from '@/components/auth/PasswordChangeModal';
import RentalHistory from './RentalHistory';
import EquipmentList from './EquipmentList';
import RentalForm from './RentalForm';

interface MELDashboardProps {
  onRentEquipment: () => void;
  onViewHistory: () => void;
}

const MELDashboard = ({ onRentEquipment, onViewHistory }: MELDashboardProps) => {
  const { signOut, user } = useAuth();
  const { equipment, rentals, getOverdueRentals, currentMELUser } = useSupabaseMEL();
  const [userName, setUserName] = useState('');
  const [activeView, setActiveView] = useState<'dashboard' | 'equipment' | 'rental' | 'history' | 'overdue'>('dashboard');

  useEffect(() => {
    const fetchUserName = async () => {
      if (user) {
        try {
          const { data: melUserData } = await supabase
            .from('mel_users')
            .select('full_name, username')
            .eq('user_id', user.id)
            .single();
          
          if (melUserData) {
            setUserName(melUserData.full_name || melUserData.username);
          } else {
            setUserName(user.user_metadata?.full_name || user.email || '');
          }
        } catch (error) {
          console.error('Error fetching user name:', error);
          setUserName(user.user_metadata?.full_name || user.email || '');
        }
      }
    };

    fetchUserName();
  }, [user]);

  const totalEquipment = equipment.length;
  const availableEquipment = equipment.filter(item => item.available_quantity > 0).length;
  const totalRentals = rentals.length;
  const overdueRentals = getOverdueRentals();

  const downloadRentalHistory = async () => {
    // Fetch MEL users for creator names
    const { data: melUsersData } = await supabase
      .from('mel_users')
      .select('user_id, full_name, username');
    
    const userMap: { [key: string]: string } = {};
    melUsersData?.forEach(u => {
      if (u.user_id) {
        userMap[u.user_id] = `${u.full_name} (${u.username})`;
      }
    });

    // Create equipment map for deposit amounts
    const equipmentMap: { [key: string]: number } = {};
    equipment.forEach(eq => {
      equipmentMap[eq.id] = eq.deposit_amount;
    });

    const rentalData = rentals.map(rental => ({
      'Patient Name': rental.patient_name,
      'Address': rental.address || '',
      'Mobile Number': rental.mobile_number,
      'Aadhaar Number': rental.aadhaar_number || '',
      'Equipment Name': rental.equipment_name,
      'Deposit Amount (₹)': rental.equipment_id ? equipmentMap[rental.equipment_id] || '' : '',
      'Pickup Date': new Date(rental.pickup_date).toLocaleDateString(),
      'Return Date': new Date(rental.return_date).toLocaleDateString(),
      'Status': rental.status || 'rented',
      'Created By': rental.created_by_user_id ? userMap[rental.created_by_user_id] || rental.created_by_user_id : 'Unknown',
      'Created At': new Date(rental.created_at).toLocaleDateString()
    }));
    downloadCSV(rentalData, 'MEL_Rental_History');
  };

  // Custom MEL Navbar Component
  const MELNavbar = () => (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            {activeView !== 'dashboard' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setActiveView('dashboard')}
              >
                ← Back to Dashboard
              </Button>
            )}
            <div className="flex items-center gap-2">
              <PasswordChangeModal />
              <Button 
                onClick={signOut}
                variant="outline" 
                size="sm"
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
          <div className="text-right">
            <h1 className="text-2xl font-bold text-blue-600">
              Medical Equipment Library
            </h1>
            <p className="text-sm text-gray-600">Welcome, {userName || 'User'}</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Show different views based on activeView state
  if (activeView === 'equipment') {
    return (
      <div className="min-h-screen bg-gray-100">
        <MELNavbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EquipmentList />
        </div>
      </div>
    );
  }

  if (activeView === 'rental') {
    return (
      <div className="min-h-screen bg-gray-100">
        <MELNavbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <RentalForm />
        </div>
      </div>
    );
  }

  if (activeView === 'history') {
    return (
      <div className="min-h-screen bg-gray-100">
        <MELNavbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-4 flex justify-end">
            <Button onClick={downloadRentalHistory} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download CSV
            </Button>
          </div>
          <RentalHistory />
        </div>
      </div>
    );
  }

  if (activeView === 'overdue') {
    return (
      <div className="min-h-screen bg-gray-100">
        <MELNavbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Overdue Equipment ({overdueRentals.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {overdueRentals.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No overdue equipment.</p>
                ) : (
                  overdueRentals.map((rental) => (
                    <div key={rental.id} className="flex justify-between items-center p-3 bg-white rounded border border-red-200">
                      <div>
                        <p className="font-medium text-red-800">{rental.equipment_name}</p>
                        <p className="text-sm text-red-600">
                          Patient: {rental.patient_name} | Due: {new Date(rental.return_date).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="destructive">
                        {Math.ceil((new Date().getTime() - new Date(rental.return_date).getTime()) / (1000 * 60 * 60 * 24))} days late
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Main Dashboard View
  return (
    <div className="min-h-screen bg-gray-100">
      <MELNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Equipment</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEquipment}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{availableEquipment}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rentals</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRentals}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{overdueRentals.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveView('equipment')}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl text-blue-600">Equipments</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">View all available medical equipment</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveView('rental')}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl text-green-600">Create Rental</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">Create new equipment rental</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveView('history')}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl text-purple-600">Rental History</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">View rental history and download CSV</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveView('overdue')}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl text-red-600">Overdue List</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">View overdue equipment ({overdueRentals.length})</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MELDashboard;
