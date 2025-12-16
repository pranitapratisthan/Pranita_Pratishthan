import { useEffect, useState } from 'react';
import { useSupabaseMEL } from '@/contexts/SupabaseMELContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

type CreatorInfo = {
  [userId: string]: { name: string; username: string } | null;
};

const RentalHistory = () => {
  const { rentals, updateRental } = useSupabaseMEL();
  const [creatorInfo, setCreatorInfo] = useState<CreatorInfo>({});

  // Fetch creator info for all rentals
  useEffect(() => {
    const fetchCreatorInfo = async () => {
      const userIds = [...new Set(rentals.map(r => r.created_by_user_id).filter(Boolean))];
      if (userIds.length === 0) return;

      const { data, error } = await supabase
        .from('mel_users')
        .select('user_id, full_name, username')
        .in('user_id', userIds);

      if (!error && data) {
        const infoMap: CreatorInfo = {};
        data.forEach(user => {
          if (user.user_id) {
            infoMap[user.user_id] = { name: user.full_name, username: user.username };
          }
        });
        setCreatorInfo(infoMap);
      }
    };

    fetchCreatorInfo();
  }, [rentals]);

  const handleMarkReturned = async (rentalId: string) => {
    try {
      await updateRental(rentalId, { status: 'returned' });
      toast.success('Equipment marked as returned successfully!');
    } catch (error) {
      console.error('Error marking equipment as returned:', error);
      toast.error('Failed to mark equipment as returned');
    }
  };

  const getStatusBadge = (rental: any) => {
    const currentDate = new Date();
    const returnDate = new Date(rental.return_date);
    
    if (rental.status === 'returned') {
      return <Badge variant="secondary">Returned</Badge>;
    } else if (currentDate > returnDate) {
      return <Badge variant="destructive">Overdue</Badge>;
    } else {
      return <Badge variant="default">Active</Badge>;
    }
  };

  const getDaysRemaining = (returnDate: string, status: string) => {
    if (status === 'returned') return 'Returned';
    
    const currentDate = new Date();
    const targetDate = new Date(returnDate);
    const diffTime = targetDate.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else {
      return `${diffDays} days remaining`;
    }
  };

  const getCreatorDisplay = (userId: string | null) => {
    if (!userId) return 'Unknown';
    const creator = creatorInfo[userId];
    if (creator) {
      return `${creator.name} (${creator.username})`;
    }
    return `User ID: ${userId.slice(0, 8)}...`;
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {rentals.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No rental history found.</p>
            </CardContent>
          </Card>
        ) : (
          rentals.map((rental) => (
            <Card key={rental.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg">{rental.equipment_name}</CardTitle>
                {getStatusBadge(rental)}
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-700">Patient:</p>
                    <p>{rental.patient_name}</p>
                  </div>
                  
                  <div>
                    <p className="font-medium text-gray-700">Mobile:</p>
                    <p>{rental.mobile_number}</p>
                  </div>
                  
                  <div>
                    <p className="font-medium text-gray-700">Pickup Date:</p>
                    <p>{new Date(rental.pickup_date).toLocaleDateString()}</p>
                  </div>
                  
                  <div>
                    <p className="font-medium text-gray-700">Return Date:</p>
                    <p>{new Date(rental.return_date).toLocaleDateString()}</p>
                  </div>
                  
                  <div>
                    <p className="font-medium text-gray-700">Status:</p>
                    <p className={rental.status === 'returned' ? 'text-green-600' : new Date() > new Date(rental.return_date) ? 'text-red-600 font-medium' : 'text-blue-600'}>
                      {getDaysRemaining(rental.return_date, rental.status || 'rented')}
                    </p>
                  </div>
                  
                  <div>
                    <p className="font-medium text-gray-700">Created By:</p>
                    <p className="text-gray-600">{getCreatorDisplay(rental.created_by_user_id)}</p>
                  </div>
                </div>
                
                {rental.status === 'rented' && (
                  <div className="mt-4">
                    <Button 
                      onClick={() => handleMarkReturned(rental.id)}
                      variant="outline"
                      size="sm"
                    >
                      Mark as Returned
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default RentalHistory;
