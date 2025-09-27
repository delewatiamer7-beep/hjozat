import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, MapPin, Calendar, Clock, Users, Eye, Edit, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock data - in real app this would come from Supabase
const mockOwnerFields = [
  {
    id: "1",
    name: "Premier Stadium Field",
    location: "Downtown Sports Complex",
    pricePerHour: 120,
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop",
    status: "Active",
    bookings: 45,
    rating: 4.9
  },
  {
    id: "2",
    name: "Training Ground Alpha",
    location: "Sports Academy Center",
    pricePerHour: 85,
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop",
    status: "Active",
    bookings: 32,
    rating: 4.7
  }
];

const mockBookings = [
  {
    id: "1",
    fieldName: "Premier Stadium Field",
    customerName: "John Smith",
    phone: "+1-555-0123",
    date: "2024-01-15",
    time: "14:00",
    status: "Pending",
    amount: 120
  },
  {
    id: "2",
    fieldName: "Training Ground Alpha",
    customerName: "Sarah Johnson",
    phone: "+1-555-0456",
    date: "2024-01-16",
    time: "18:00",
    status: "Confirmed",
    amount: 85
  },
  {
    id: "3",
    fieldName: "Premier Stadium Field",
    customerName: "Mike Wilson",
    phone: "+1-555-0789",
    date: "2024-01-17",
    time: "16:00",
    status: "Cancelled",
    amount: 120
  }
];

const OwnerDashboard = () => {
  const [fields] = useState(mockOwnerFields);
  const [bookings] = useState(mockBookings);

  const handleAddField = () => {
    toast({
      title: "Add New Field",
      description: "This feature requires backend integration with Supabase.",
    });
  };

  const handleEditField = (fieldId: string) => {
    toast({
      title: "Edit Field",
      description: "This feature requires backend integration with Supabase.",
    });
  };

  const handleDeleteField = (fieldId: string) => {
    toast({
      title: "Delete Field",
      description: "This feature requires backend integration with Supabase.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Owner Dashboard</h1>
              <p className="text-muted-foreground">Manage your fields and bookings</p>
            </div>
            <Button 
              onClick={handleAddField}
              className="bg-primary hover:bg-primary-glow text-primary-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Field
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Fields</p>
                <p className="text-3xl font-bold text-primary">{fields.length}</p>
              </div>
              <MapPin className="w-8 h-8 text-primary/60" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                <p className="text-3xl font-bold text-primary">{bookings.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-primary/60" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {bookings.filter(b => b.status === "Pending").length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600/60" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                <p className="text-3xl font-bold text-green-600">
                  ${bookings.filter(b => b.status === "Confirmed").reduce((sum, b) => sum + b.amount, 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-green-600/60" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="fields" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="fields">My Fields</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
          </TabsList>

          {/* Fields Tab */}
          <TabsContent value="fields" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">My Fields</h2>
              <Button 
                onClick={handleAddField}
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Field
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fields.map((field) => (
                <Card key={field.id} className="overflow-hidden hover:shadow-card transition-all duration-300">
                  <div className="relative">
                    <img 
                      src={field.image} 
                      alt={field.name}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className="absolute top-4 right-4 bg-green-100 text-green-800">
                      {field.status}
                    </Badge>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{field.name}</h3>
                      <div className="flex items-center text-muted-foreground text-sm mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        {field.location}
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        ${field.pricePerHour}<span className="text-sm font-normal">/hr</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{field.bookings} bookings</span>
                      <span className="font-medium">★ {field.rating}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleEditField(field.id)}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleDeleteField(field.id)}
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Recent Bookings</h2>
              <div className="flex gap-2">
                <Badge variant="secondary">All: {bookings.length}</Badge>
                <Badge className="bg-yellow-100 text-yellow-800">
                  Pending: {bookings.filter(b => b.status === "Pending").length}
                </Badge>
              </div>
            </div>

            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="p-4 font-semibold">Field</th>
                      <th className="p-4 font-semibold">Customer</th>
                      <th className="p-4 font-semibold">Date & Time</th>
                      <th className="p-4 font-semibold">Status</th>
                      <th className="p-4 font-semibold">Amount</th>
                      <th className="p-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="border-b hover:bg-muted/50">
                        <td className="p-4">
                          <div className="font-medium">{booking.fieldName}</div>
                        </td>
                        <td className="p-4">
                          <div>
                            <div className="font-medium">{booking.customerName}</div>
                            <div className="text-sm text-muted-foreground">{booking.phone}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <div className="font-medium">{booking.date}</div>
                            <div className="text-sm text-muted-foreground">{booking.time}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </td>
                        <td className="p-4 font-semibold">${booking.amount}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-3 h-3" />
                            </Button>
                            {booking.status === "Pending" && (
                              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                                Confirm
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OwnerDashboard;