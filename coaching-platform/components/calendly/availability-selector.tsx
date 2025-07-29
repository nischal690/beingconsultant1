"use client";

import React, { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { Calendar, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchAvailableTimeSlots } from "@/lib/calendly/api";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface TimeSlot {
  start_time: string;
  end_time: string;
}

interface AvailabilitySelectorProps {
  token: string;
  eventTypeUri: string;
  onTimeSelected: (timeSlot: TimeSlot) => void;
  className?: string;
}

export function AvailabilitySelector({
  token,
  eventTypeUri,
  onTimeSelected,
  className = "",
}: AvailabilitySelectorProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [timezone, setTimezone] = useState<string>(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  // Group time slots by date
  const timeSlotsByDate = availableSlots.reduce<Record<string, TimeSlot[]>>(
    (acc, slot) => {
      const date = format(parseISO(slot.start_time), "yyyy-MM-dd");
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(slot);
      return acc;
    },
    {}
  );

  // Get unique dates
  const availableDates = Object.keys(timeSlotsByDate);

  // Extract fetchSlots function outside useEffect for reusability
  const fetchSlots = async () => {
    setLoading(true);
    setError(null);
    setSelectedTimeSlot(null); // Reset selected time slot when fetching new slots
    setAvailableSlots([]); // Clear existing slots while loading

    // Calculate start and end time for a 7-day window
    const now = new Date();
    
    // Format dates according to Calendly API requirements (YYYY-MM-DDTHH:MM:SS.000000Z)
    // Calendly requires start_time strictly in the future. Use tomorrow (24-hour buffer) to ensure slots are bookable.
    const startDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);

    // Helper to format ISO string without milliseconds
    const isoNoMs = (d: Date) => d.toISOString().split('.')[0] + '.000000Z';
    const startTime = isoNoMs(startDate);
    const endTime = isoNoMs(endDate);
    
    console.log('[AvailabilitySelector] Using date range:', { startTime, endTime, timezone });

    try {
      // Show toast notification when changing timezone
      toast.info(`Loading availability for ${timezone.replace('_', ' ')}...`);
      
      const result = await fetchAvailableTimeSlots(
        token,
        eventTypeUri,
        startTime,
        endTime,
        timezone
      );

      if (result.success && result.data.collection) {
        console.log(`[AvailabilitySelector] Fetched ${result.data.collection.length} slots for timezone ${timezone}`);
        setAvailableSlots(result.data.collection);
        
        // Auto-select the first date if available
        if (result.data.collection.length > 0) {
          const firstDate = format(
            parseISO(result.data.collection[0].start_time),
            "yyyy-MM-dd"
          );
          setSelectedDate(firstDate);
          toast.success(`Showing availability for ${timezone.replace('_', ' ')}`);
        } else {
          setSelectedDate(null);
          toast.warning(`No available slots found for ${timezone.replace('_', ' ')}`);
        }
      } else {
        console.error('[AvailabilitySelector] Failed to fetch slots:', result);
        setError("Failed to fetch available time slots");
        setAvailableSlots([]);
        toast.error(`Failed to load availability for ${timezone.replace('_', ' ')}`);
      }
    } catch (err) {
      console.error("Error fetching time slots:", err);
      setError("An error occurred while fetching available time slots");
      setAvailableSlots([]);
      toast.error(`Error loading availability for ${timezone.replace('_', ' ')}`);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on component mount and when timezone changes
  useEffect(() => {
    fetchSlots();
  }, [token, eventTypeUri, timezone]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
  };

  const handleTimeSelect = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleConfirmSelection = () => {
    if (selectedTimeSlot) {
      onTimeSelected(selectedTimeSlot);
    }
  };

  const formatTime = (isoString: string) => {
    return format(parseISO(isoString), "h:mm a");
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center">
            <h3 className="text-lg font-medium">View vailable slot</h3>
            <RefreshCw className="ml-2 h-4 w-4 animate-spin text-primary" />
          </div>
          <Select disabled value={timezone}>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder={timezone.replace('_', ' ')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={timezone}>{timezone.replace('_', ' ')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
        <p className="text-center text-sm text-muted-foreground animate-pulse">
          Loading availability for {timezone.replace('_', ' ')}...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 border border-red-300 bg-red-50 rounded-md ${className}`}>
        <p className="text-red-500">{error}</p>
        <Button
          variant="outline"
          className="mt-2"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  if (availableSlots.length === 0) {
    return (
      <div className={`p-4 border border-amber-300 bg-amber-50 rounded-md ${className}`}>
        <p className="text-amber-700">No available time slots found for the next 7 days.</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col">
          <h3 className="text-lg font-medium">View available slot</h3>
          <p className="text-sm text-muted-foreground">Current timezone: IST GMT +5.5</p>
          {loading && (
            <div className="flex items-center mt-1">
              <RefreshCw className="mr-2 h-4 w-4 animate-spin text-primary" />
              <span className="text-sm">Loading...</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => fetchSlots()} 
            disabled={loading}
            title="Refresh availability"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <Tabs value={selectedDate || undefined} onValueChange={handleDateSelect}>
        <TabsList className="grid grid-cols-3 md:grid-cols-7">
          {availableDates.map((date) => (
            <TabsTrigger key={date} value={date}>
              <div className="flex flex-col items-center">
                <span>{format(parseISO(date), "EEE")}</span>
                <span>{format(parseISO(date), "MMM d")}</span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {availableDates.map((date) => (
          <TabsContent key={date} value={date} className="mt-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {timeSlotsByDate[date].map((slot, index) => {
                const isSelected =
                  selectedTimeSlot?.start_time === slot.start_time;
                return (
                  <Card
                    key={index}
                    className={`cursor-pointer transition-all ${isSelected ? "border-primary ring-2 ring-primary ring-opacity-50" : ""}`}
                    onClick={() => handleTimeSelect(slot)}
                  >
                    <CardContent className="p-3 flex items-center justify-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{formatTime(slot.start_time)}</span>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {selectedTimeSlot && (
        <div className="flex justify-end">
          <Button onClick={handleConfirmSelection}>
            Proceed 
          </Button>
        </div>
      )}
    </div>
  );
}
