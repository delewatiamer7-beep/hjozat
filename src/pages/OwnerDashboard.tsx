import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, MapPin, Calendar, Clock, Users, Eye, Edit, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useOwnerFields } from "@/hooks/useFields";
import { useOwnerBookings, useUpdateBookingStatus } from "@/hooks/useBookings";
import { AddFieldDialog } from "@/components/AddFieldDialog";
import { EditFieldDialog } from "@/components/EditFieldDialog";
import { useUpdateField, useDeleteField } from "@/hooks/useFieldMutations";

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const [isSwitchingRole, setIsSwitchingRole] = useState(false);
  const { data: fields = [], isLoading: fieldsLoading } = useOwnerFields(user?.id || "");
  const { data: bookings = [], isLoading: bookingsLoading } = useOwnerBookings(user?.id || "");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingField, setEditingField] = useState<any>(null);
  
  const updateField = useUpdateField();
  const deleteField = useDeleteField();
  const updateBookingStatus = useUpdateBookingStatus();

  const handleAddField = () => {
    setShowAddDialog(true);
  };

  const handleConfirmBooking = async (bookingId: string) => {
    try {
      await updateBookingStatus.mutateAsync({ 
        bookingId, 
        status: 'confirmed' 
      });
      toast({
        title: t('toast.confirmSuccess'),
        description: t('toast.confirmSuccessDesc'),
      });
    } catch (error) {
      toast({
        title: t('toast.confirmFailed'),
        description: t('toast.confirmFailedDesc'),
        variant: "destructive",
      });
    }
  };

  const handleEditField = (field: any) => {
    setEditingField(field);
    setShowEditDialog(true);
  };

  const handleDeleteField = (fieldId: string) => {
    if (confirm(t('field.deleteConfirm'))) {
      deleteField.mutate(fieldId);
    }
  };

  const handleSwitchRole = async () => {
    setIsSwitchingRole(true);
    try {
      await signOut();
      toast({
        title: t('nav.switchRoleSuccess'),
        description: t('nav.switchRoleSuccessDesc'),
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to logout',
        variant: "destructive",
      });
      setIsSwitchingRole(false);
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
              <h1 className="text-2xl font-bold text-primary">{t('owner.dashboard')}</h1>
              <p className="text-muted-foreground">{t('owner.manageFields')}</p>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <LanguageSwitcher />
              <Button 
                onClick={handleAddField}
                className="bg-primary hover:bg-primary-glow text-primary-foreground"
              >
                <Plus className="w-4 h-4 ml-2" />
                {t('owner.addField')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('owner.totalFields')}</p>
                <p className="text-3xl font-bold text-primary">{fields.length}</p>
              </div>
              <MapPin className="w-8 h-8 text-primary/60" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('owner.totalBookings')}</p>
                <p className="text-3xl font-bold text-primary">{bookings.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-primary/60" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('owner.pendingBookings')}</p>
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
                <p className="text-sm font-medium text-muted-foreground">{t('owner.revenue')}</p>
                <p className="text-3xl font-bold text-green-600">
                  {bookings.filter(b => b.status === "confirmed").reduce((sum, b) => sum + b.total_amount, 0)} {t('common.sar')}
                </p>
              </div>
              <Users className="w-8 h-8 text-green-600/60" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="fields" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="fields">{t('owner.myFields')}</TabsTrigger>
            <TabsTrigger value="bookings">{t('owner.bookings')}</TabsTrigger>
          </TabsList>

          {/* Fields Tab */}
          <TabsContent value="fields" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{t('owner.myFields')}</h2>
              <Button 
                onClick={handleAddField}
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Plus className="w-4 h-4 ml-2" />
                {t('owner.addField')}
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
                <h3 className="text-xl font-semibold mb-2">{t('owner.noFields')}</h3>
                <p className="text-muted-foreground mb-6">{t('owner.addFirstField')}</p>
                <Button onClick={handleAddField} className="bg-primary hover:bg-primary-glow">
                  <Plus className="w-4 h-4 ml-2" />
                  {t('owner.addField')}
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
                      <Badge className="absolute top-4 left-4 bg-green-100 text-green-800">
                        {field.status}
                      </Badge>
                    </div>
                    
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="text-xl font-bold mb-2">{field.name}</h3>
                        <div className="flex items-center text-muted-foreground text-sm mb-2">
                          <MapPin className="w-4 h-4 ml-1" />
                          {field.location}
                        </div>
                        <div className="text-2xl font-bold text-primary">
                          {field.price_per_booking} {t('common.sar')}<span className="text-sm font-normal">/{t('common.bookNow')}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">0 {t('field.bookings')}</span>
                        <span className="font-medium">★ {field.rating}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handleEditField(field)}
                        >
                          <Edit className="w-3 h-3 ml-1" />
                          {t('field.editButton')}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handleDeleteField(field.id)}
                        >
                          <Trash2 className="w-3 h-3 ml-1" />
                          {t('field.deleteButton')}
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
              <h2 className="text-2xl font-bold">{t('field.recentBookings')}</h2>
              <div className="flex gap-2">
                <Badge variant="secondary">{t('field.all')}: {bookings.length}</Badge>
                <Badge className="bg-yellow-100 text-yellow-800">
                  {t('field.pending')}: {bookings.filter(b => b.status === "Pending").length}
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
                <h3 className="text-xl font-semibold mb-2">{t('owner.noBookings')}</h3>
                <p className="text-muted-foreground">{t('owner.bookingsWillAppear')}</p>
              </div>
            ) : (
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="p-4 text-center font-semibold border-b border-r whitespace-nowrap">{t('owner.fieldName')}</th>
                        <th className="p-4 text-center font-semibold border-b border-r whitespace-nowrap">{t('owner.customer')}</th>
                        <th className="p-4 text-center font-semibold border-b border-r whitespace-nowrap">{t('owner.date')}</th>
                        <th className="p-4 text-center font-semibold border-b border-r whitespace-nowrap">{t('owner.status')}</th>
                        <th className="p-4 text-center font-semibold border-b border-r whitespace-nowrap">{t('owner.amount')}</th>
                        <th className="p-4 text-center font-semibold border-b whitespace-nowrap">{t('owner.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-muted/30 transition-colors">
                          <td className="p-4 text-center border-b border-r whitespace-nowrap">
                            <div className="font-medium">{booking.fields?.name}</div>
                          </td>
                          <td className="p-4 text-center border-b border-r">
                            <div className="font-medium whitespace-nowrap">{booking.customer_name}</div>
                            <div className="text-sm text-muted-foreground whitespace-nowrap">{booking.customer_phone}</div>
                          </td>
                          <td className="p-4 text-center border-b border-r">
                            <div className="font-medium whitespace-nowrap">{booking.booking_date}</div>
                            <div className="text-sm text-muted-foreground whitespace-nowrap">{booking.start_time}</div>
                          </td>
                          <td className="p-4 text-center border-b border-r">
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </td>
                          <td className="p-4 text-center border-b border-r font-semibold whitespace-nowrap">{booking.total_amount} {t('common.sar')}</td>
                          <td className="p-4 text-center border-b">
                            <div className="flex gap-2 justify-center whitespace-nowrap">
                              <Button size="sm" variant="outline">
                                <Eye className="w-3 h-3" />
                              </Button>
                              {booking.status === "pending" && (
                                <Button 
                                  size="sm" 
                                  className="bg-green-600 hover:bg-green-700 hover:shadow-lg hover:scale-105 text-white transition-all duration-200"
                                  onClick={() => handleConfirmBooking(booking.id)}
                                  disabled={updateBookingStatus.isPending}
                                >
                                  {updateBookingStatus.isPending ? t('owner.confirming') : t('owner.confirm')}
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

        {/* Role Switch Button */}
        <div className="flex justify-center mt-12 mb-8">
          <Button 
            onClick={handleSwitchRole}
            disabled={isSwitchingRole}
            variant="outline"
            size="sm"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105"
          >
            {isSwitchingRole ? t('nav.switchingRole') : t('nav.switchRole')}
          </Button>
        </div>
      </div>
      
      <AddFieldDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog} 
      />
      
      <EditFieldDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        field={editingField}
      />
    </div>
  );
};

export default OwnerDashboard;