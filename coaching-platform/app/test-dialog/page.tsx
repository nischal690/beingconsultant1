"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MembershipDialog } from "@/components/membership/membership-dialog";

export default function TestDialogPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-8">Dialog Test Page</h1>
      
      <Button 
        variant="default"
        size="lg"
        onClick={() => {
          console.log('Test button clicked!');
          alert('Button clicked!');
          setDialogOpen(true);
        }}
        className="bg-yellow-500 text-black hover:bg-yellow-400 mb-8"
      >
        Open Membership Dialog
      </Button>

      <div className="mt-8 p-4 bg-gray-800 rounded-lg">
        <p>Dialog state: {dialogOpen ? 'Open' : 'Closed'}</p>
      </div>

      <MembershipDialog 
        open={dialogOpen} 
        onOpenChange={(open) => {
          console.log('Dialog onOpenChange called with:', open);
          setDialogOpen(open);
        }} 
        onPlanSelect={(plan, method, appliedCoupon) => {
          console.log('Selected plan:', plan);
          console.log('Payment method:', method);
          console.log('Applied coupon:', appliedCoupon);
          setDialogOpen(false);
        }}
      />
    </div>
  );
}
