import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, MapPin, Calendar, Clock, Users, Eye, Edit, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useOwnerFields } from "@/hooks/useFields";
import { useOwnerBookings } from "@/hooks/useBookings";
import { AddFieldDialog } from "@/components/AddFieldDialog";
import { useUpdateField, useDeleteField } from "@/hooks/useFieldMutations";

const OwnerDashboard = () => {
  const { user } = useAuth();
  const { data: fields = [], isLoading: fieldsLoading } = useOwnerFields(user?.id || "");
  const { data: bookings = [], isLoading: bookingsLoading } = useOwnerBookings(user?.id || "");
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  const updateField = useUpdateField();
  const deleteField = useDeleteField();

  const handleAddField = () => {
    setShowAddDialog(true);
  };

  const handleEditField = (fieldId: string) => {
    toast({
      title: "Edit Field",
      description: "Edit functionality coming soon!",
    });
  };

  const handleDeleteField = (fieldId: string) => {
    if (confirm("Are you sure you want to delete this field? This action cannot be undone.")) {
      deleteField.mutate(fieldId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
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
                  ${bookings.filter(b => b.status === "confirmed").reduce((sum, b) => sum + b.total_amount, 0)}
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

            {fieldsLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(3).fill(0).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-6 space-y-4">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : fields.length === 0 ? (
              <div className="text-center py-16">
                <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No fields added yet</h3>
                <p className="text-muted-foreground mb-6">Start by adding your first field to begin receiving bookings</p>
                <Button onClick={handleAddField} className="bg-primary hover:bg-primary-glow">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Field
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fields.map((field) => (
                  <Card key={field.id} className="overflow-hidden hover:shadow-card transition-all duration-300">
                    <div className="relative">
                      <img 
                        src={field.images?.find(img => img.is_primary)?.image_url || field.images?.[0]?.image_url || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop"} 
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
                          ${field.price_per_hour}<span className="text-sm font-normal">/hr</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">0 bookings</span>
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
            )}
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

            {bookingsLoading ? (
              <Card className="p-6">
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                  ))}
                </div>
              </Card>
            ) : bookings.length === 0 ? (
              <div className="text-center py-16">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
                <p className="text-muted-foreground">Once customers start booking your fields, you'll see them here</p>
              </div>
            ) : (
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
                            <div className="font-medium">{booking.fields?.name}</div>
                          </td>
                          <td className="p-4">
                            <div>
                              <div className="font-medium">{booking.customer_name}</div>
                              <div className="text-sm text-muted-foreground">{booking.customer_phone}</div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div>
                              <div className="font-medium">{booking.booking_date}</div>
                              <div className="text-sm text-muted-foreground">{booking.start_time}</div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </td>
                          <td className="p-4 font-semibold">${booking.total_amount}</td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-3 h-3" />
                              </Button>
                              {booking.status === "pending" && (
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
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <AddFieldDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog} 
      />
    </div>
  );
};

export default OwnerDashboard;