"use client";

import type React from "react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, ArrowLeft, Edit } from "lucide-react";
import { toast } from "sonner";
import { venueApi } from "@/lib/api";

export default function VenueManagementPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    courtName: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["venues"],
    queryFn: venueApi.getAllVenues,
  });

  const createMutation = useMutation({
    mutationFn: venueApi.createVenue,
    onSuccess: () => {
      toast.success("Venue created successfully");
      queryClient.invalidateQueries({ queryKey: ["venues"] });
      setShowForm(false);
      setFormData({ name: "", courtName: "" });
    },
    onError: () => {
      toast.error("Failed to create venue");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string; courtName: string } }) =>
      venueApi.updateVenue(id, data),
    onSuccess: () => {
      toast.success("Venue updated successfully");
      queryClient.invalidateQueries({ queryKey: ["venues"] });
      setShowForm(false);
      setIsEditMode(false);
      setSelectedVenue(null);
      setFormData({ name: "", courtName: "" });
    },
    onError: () => {
      toast.error("Failed to update venue");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: venueApi.deleteVenue,
    onSuccess: () => {
      toast.success("Venue deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["venues"] });
      setDeleteDialogOpen(false);
      setSelectedVenue(null);
    },
    onError: () => {
      toast.error("Failed to delete venue");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode && selectedVenue) {
      updateMutation.mutate({ id: selectedVenue._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (venue: any) => {
    setSelectedVenue(venue);
    setFormData({
      name: venue.name,
      courtName: venue.courtName,
    });
    setIsEditMode(true);
    setShowForm(true);
  };

  const handleDelete = (venue: any) => {
    setSelectedVenue(venue);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedVenue) {
      deleteMutation.mutate(selectedVenue._id);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setIsEditMode(false);
    setSelectedVenue(null);
    setFormData({ name: "", courtName: "" });
  };

  if (showForm) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-center mb-8">
            {isEditMode ? "Update Venue" : "Create Venue"}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Write here"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="courtName">Court name</Label>
              <Input
                id="courtName"
                placeholder="Write here"
                value={formData.courtName}
                onChange={(e) => setFormData({ ...formData, courtName: e.target.value })}
                required
                className="bg-gray-50"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="bg-[#a8d5ce] hover:bg-[#8fc4bb] text-gray-700"
              >
                {createMutation.isPending || updateMutation.isPending
                  ? "Saving..."
                  : isEditMode
                  ? "Update"
                  : "Save"}
              </Button>
            </div>
          </form>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Venue Management</h1>
          <Button onClick={() => setShowForm(true)} className="bg-[#a8d5ce] hover:bg-[#8fc4bb] text-gray-700">
            Create +
          </Button>
        </div>

        <Card className="bg-[#e8f5f3]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Court</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-8 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                : data?.data?.map((venue: any) => (
                    <TableRow key={venue._id}>
                      <TableCell className="font-medium">{venue.name}</TableCell>
                      <TableCell>{venue.courtName}</TableCell>
                      <TableCell className="text-right">
                        <button
                          onClick={() => handleEdit(venue)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(venue)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedVenue?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              No
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Yes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}