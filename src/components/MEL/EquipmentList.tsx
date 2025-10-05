
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSupabaseMEL } from '@/contexts/SupabaseMELContext';

const EquipmentList = () => {
  const { equipment } = useSupabaseMEL();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {equipment.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <div className="aspect-video relative">
            <img
              src={item.photo_url || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&h=200&fit=crop'}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2">
              <Badge variant={item.available_quantity > 0 ? "default" : "destructive"}>
                {item.available_quantity > 0 ? 'Available' : 'Out of Stock'}
              </Badge>
            </div>
          </div>
          
          <CardHeader>
            <CardTitle className="text-lg">{item.name}</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Available:</span>
              <span className="font-semibold">
                {item.available_quantity} / {item.total_quantity}
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span>Rental Period:</span>
              <span>{item.rental_duration} days</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span>Deposit:</span>
              <span className="font-semibold">₹{item.deposit_amount}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EquipmentList;
