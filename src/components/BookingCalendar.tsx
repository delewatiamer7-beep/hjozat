import { useState, useEffect } from "react";
import { format, addDays, isSameDay } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Clock, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeSlot {
  time: string;
  status: "available" | "booked" | "pending";
}

interface BookingCalendarProps {
  fieldId: string;
  bookedSlots: { date: string; start_time: string; status: string }[];
  onSlotSelect: (date: Date, time: string) => void;
  selectedDate?: Date;
  selectedTime?: string;
}

const timeSlots = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00", "22:00"
];

export const BookingCalendar = ({
  fieldId,
  bookedSlots,
  onSlotSelect,
  selectedDate,
  selectedTime,
}: BookingCalendarProps) => {
  const { t, isRTL } = useLanguage();
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(new Date());
  const [hoveredSlot, setHoveredSlot] = useState<{ date: Date; time: string } | null>(null);

  // Generate 7 days starting from currentWeekStart
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  const getSlotStatus = (date: Date, time: string): "available" | "booked" | "pending" => {
    const dateStr = format(date, "yyyy-MM-dd");
    const booking = bookedSlots.find(
      (slot) => slot.date === dateStr && slot.start_time === time
    );
    
    if (!booking) return "available";
    if (booking.status === "pending") return "pending";
    return "booked";
  };

  const isSlotSelected = (date: Date, time: string) => {
    return selectedDate && selectedTime && 
           isSameDay(date, selectedDate) && 
           time === selectedTime;
  };

  const isPastSlot = (date: Date, time: string) => {
    const now = new Date();
    const slotDate = new Date(date);
    const [hours] = time.split(":").map(Number);
    slotDate.setHours(hours, 0, 0, 0);
    return slotDate < now;
  };

  const handlePrevWeek = () => {
    const newStart = addDays(currentWeekStart, -7);
    if (newStart >= new Date(new Date().setHours(0, 0, 0, 0))) {
      setCurrentWeekStart(newStart);
    }
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7));
  };

  const handleSlotClick = (date: Date, time: string) => {
    const status = getSlotStatus(date, time);
    if (status === "available" && !isPastSlot(date, time)) {
      onSlotSelect(date, time);
    }
  };

  const getSlotClasses = (date: Date, time: string) => {
    const status = getSlotStatus(date, time);
    const isPast = isPastSlot(date, time);
    const isSelected = isSlotSelected(date, time);
    const isHovered = hoveredSlot && isSameDay(hoveredSlot.date, date) && hoveredSlot.time === time;

    const baseClasses = "h-10 w-full text-xs font-medium rounded-md transition-all duration-200 flex items-center justify-center gap-1";

    if (isPast) {
      return cn(baseClasses, "bg-muted/50 text-muted-foreground/50 cursor-not-allowed");
    }

    if (isSelected) {
      return cn(baseClasses, "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 scale-105");
    }

    switch (status) {
      case "booked":
        return cn(baseClasses, "bg-destructive/20 text-destructive cursor-not-allowed border border-destructive/30");
      case "pending":
        return cn(baseClasses, "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 cursor-not-allowed border border-yellow-500/30");
      case "available":
        return cn(
          baseClasses, 
          "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground cursor-pointer border border-primary/30",
          isHovered && "bg-primary/30 scale-102"
        );
      default:
        return baseClasses;
    }
  };

  return (
    <Card className="p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">{t('calendar.title')}</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevWeek}
            disabled={currentWeekStart <= new Date(new Date().setHours(0, 0, 0, 0))}
          >
            {isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
          <span className="text-sm font-medium min-w-[140px] text-center">
            {format(currentWeekStart, "MMM d")} - {format(addDays(currentWeekStart, 6), "MMM d, yyyy")}
          </span>
          <Button variant="outline" size="icon" onClick={handleNextWeek}>
            {isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary/10 border border-primary/30" />
          <span>{t('calendar.available')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-destructive/20 border border-destructive/30" />
          <span>{t('calendar.booked')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-500/20 border border-yellow-500/30" />
          <span>{t('calendar.pending')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary" />
          <span>{t('calendar.selected')}</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Day Headers */}
          <div className="grid grid-cols-8 gap-2 mb-2">
            <div className="flex items-center justify-center text-sm font-medium text-muted-foreground">
              <Clock className="w-4 h-4" />
            </div>
            {weekDays.map((day) => (
              <div 
                key={day.toISOString()} 
                className={cn(
                  "text-center p-2 rounded-lg",
                  isSameDay(day, new Date()) && "bg-primary/10"
                )}
              >
                <div className="text-xs text-muted-foreground">
                  {format(day, "EEE")}
                </div>
                <div className={cn(
                  "text-lg font-bold",
                  isSameDay(day, new Date()) && "text-primary"
                )}>
                  {format(day, "d")}
                </div>
              </div>
            ))}
          </div>

          {/* Time Slots Grid */}
          <div className="space-y-2">
            {timeSlots.map((time) => (
              <div key={time} className="grid grid-cols-8 gap-2">
                <div className="flex items-center justify-center text-sm font-medium text-muted-foreground">
                  {time}
                </div>
                {weekDays.map((day) => {
                  const status = getSlotStatus(day, time);
                  const isPast = isPastSlot(day, time);
                  
                  return (
                    <button
                      key={`${day.toISOString()}-${time}`}
                      className={getSlotClasses(day, time)}
                      onClick={() => handleSlotClick(day, time)}
                      onMouseEnter={() => setHoveredSlot({ date: day, time })}
                      onMouseLeave={() => setHoveredSlot(null)}
                      disabled={status !== "available" || isPast}
                      title={
                        isPast 
                          ? t('calendar.past') 
                          : status === "booked" 
                            ? t('calendar.booked') 
                            : status === "pending"
                              ? t('calendar.pending')
                              : t('calendar.clickToBook')
                      }
                    >
                      {status === "booked" && <X className="w-3 h-3" />}
                      {status === "pending" && <Clock className="w-3 h-3" />}
                      {isSlotSelected(day, time) && <Check className="w-3 h-3" />}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Slot Info */}
      {selectedDate && selectedTime && (
        <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/30">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary text-primary-foreground">
              {t('calendar.selectedSlot')}
            </Badge>
            <span className="font-medium">
              {format(selectedDate, "EEEE, MMMM d, yyyy")} - {selectedTime}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};
