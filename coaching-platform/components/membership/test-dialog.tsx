"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TestDialog({ open, onOpenChange }: TestDialogProps) {
  console.log('TestDialog rendered with open state:', open);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black text-white">
        <DialogHeader>
          <DialogTitle>Test Dialog</DialogTitle>
          <DialogDescription>
            This is a test dialog to verify that the dialog component is working correctly.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          If you can see this, the dialog is working!
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
