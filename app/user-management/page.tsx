"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { CustomPagination } from "@/components/custom-pagination"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { userApi } from "@/lib/api"
import { format } from "date-fns"

export default function UserManagementPage() {
  const queryClient = useQueryClient()
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [newRole, setNewRole] = useState("")

  const { data, isLoading } = useQuery({
    queryKey: ["users", currentPage],
    queryFn: () => userApi.getAllUsers(currentPage, 10),
  })

  const deleteMutation = useMutation({
    mutationFn: userApi.deleteUser,
    onSuccess: () => {
      toast.success("User deleted successfully")
      queryClient.invalidateQueries({ queryKey: ["users"] })
      setDeleteDialogOpen(false)
    },
    onError: () => {
      toast.error("Failed to delete user")
    },
  })

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => userApi.updateUserRole(id, role),
    onSuccess: () => {
      toast.success("User role updated successfully")
      queryClient.invalidateQueries({ queryKey: ["users"] })
      setEditDialogOpen(false)
    },
    onError: () => {
      toast.error("Failed to update user role")
    },
  })

  const handleDelete = (user: any) => {
    setSelectedUser(user)
    setDeleteDialogOpen(true)
  }

  const handleEdit = (user: any) => {
    setSelectedUser(user)
    setNewRole(user.role)
    setEditDialogOpen(true)
  }

  const confirmDelete = () => {
    if (selectedUser) {
      deleteMutation.mutate(selectedUser._id)
    }
  }

  const confirmEdit = () => {
    if (selectedUser && newRole) {
      updateRoleMutation.mutate({ id: selectedUser._id, role: newRole })
    }
  }

  const renderUserTable = (users: any[], title: string, role: string) => {
    const filteredUsers = users?.filter((user) => user.role === role) || []

    if (filteredUsers.length === 0) return null

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{title}</h2>
          {role !== "player" && (
            <Button className="bg-[#a8d5ce] hover:bg-[#8fc4bb] text-gray-700">Add new {role} +</Button>
          )}
        </div>
        <Card className="bg-[#e8f5f3]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Added date</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                : filteredUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{format(new Date(user.createdAt), "d MMM yyyy")}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1 hover:bg-gray-200 rounded">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleEdit(user)} className="p-1 hover:bg-gray-200 rounded">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDelete(user)} className="p-1 hover:bg-gray-200 rounded">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
          {filteredUsers.length > 0 && (
            <div className="p-4">
              <CustomPagination
                currentPage={currentPage}
                totalPages={Math.ceil((data?.meta?.total || 0) / 10)}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </Card>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center">User Management</h1>

        {renderUserTable(data?.data || [], "Players list", "player")}
        {renderUserTable(data?.data || [], "Managers list", "manager")}
        {renderUserTable(data?.data || [], "Referees list", "referee")}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              No
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? "Deleting..." : "Yes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update User Role</DialogTitle>
            <DialogDescription>Change the role for {selectedUser?.name}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={newRole} onValueChange={setNewRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="player">Player</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="referee">Referee</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmEdit}
              disabled={updateRoleMutation.isPending}
              className="bg-[#0a5f4f] hover:bg-[#084539]"
            >
              {updateRoleMutation.isPending ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
