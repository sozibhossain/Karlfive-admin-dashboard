"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Eye, Trash2, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { reportApi } from "@/lib/api"

export default function ReportsPage() {
  const queryClient = useQueryClient()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [feedback, setFeedback] = useState("")

  const { data, isLoading } = useQuery({
    queryKey: ["reports"],
    queryFn: reportApi.getAllReports,
  })

  const deleteMutation = useMutation({
    mutationFn: reportApi.deleteReport,
    onSuccess: () => {
      toast.success("Report deleted successfully")
      queryClient.invalidateQueries({ queryKey: ["reports"] })
      setDeleteDialogOpen(false)
    },
    onError: () => {
      toast.error("Failed to delete report")
    },
  })

  const feedbackMutation = useMutation({
    mutationFn: ({ id, feedback }: { id: string; feedback: string }) => reportApi.updateReportFeedback(id, feedback),
    onSuccess: () => {
      toast.success("Feedback sent successfully")
      queryClient.invalidateQueries({ queryKey: ["reports"] })
      setShowDetails(false)
      setFeedback("")
    },
    onError: () => {
      toast.error("Failed to send feedback")
    },
  })

  const handleDelete = (report: any) => {
    setSelectedReport(report)
    setDeleteDialogOpen(true)
  }

  const handleView = (report: any) => {
    setSelectedReport(report)
    setShowDetails(true)
  }

  const confirmDelete = () => {
    if (selectedReport) {
      deleteMutation.mutate(selectedReport._id)
    }
  }

  const handleSendFeedback = () => {
    if (selectedReport && feedback) {
      feedbackMutation.mutate({ id: selectedReport._id, feedback })
    }
  }

  const handleIgnore = () => {
    setShowDetails(false)
    setFeedback("")
  }

  if (showDetails && selectedReport) {
    return (
      <DashboardLayout>
        <div className="p-6 max-w-4xl mx-auto">
          <button
            onClick={() => setShowDetails(false)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-3xl font-bold text-center mb-8">Reports</h1>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Report Title:</Label>
              <Input value={selectedReport.even} readOnly className="bg-gray-50" />
            </div>
            <div className="space-y-2">
              <Label>Report Description:</Label>
              <Textarea value={selectedReport.description} readOnly className="min-h-[200px] bg-gray-50" />
            </div>
            <hr className="my-6" />
            <div className="space-y-2">
              <Label htmlFor="feedback">Feedback</Label>
              <Textarea
                id="feedback"
                placeholder="Write here"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="min-h-[200px] bg-gray-50"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                onClick={handleSendFeedback}
                disabled={feedbackMutation.isPending || !feedback}
                className="bg-[#a8d5ce] hover:bg-[#8fc4bb] text-gray-700"
              >
                {feedbackMutation.isPending ? "Sending..." : "Send Feedback"}
              </Button>
              <Button onClick={handleIgnore} variant="destructive" className="bg-red-600 hover:bg-red-700">
                Ignore
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center">Reports</h1>

        <Card className="bg-[#e8f5f3]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Report date</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 10 }).map((_, i) => (
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
                        <Skeleton className="h-4 w-16 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                : data?.data?.map((report: any) => (
                    <TableRow key={report._id}>
                      <TableCell className="font-medium">{report.user?.name || "Ross David"}</TableCell>
                      <TableCell>{report.even}</TableCell>
                      <TableCell>5 Jun 2025</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleView(report)} className="p-1 hover:bg-gray-200 rounded">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDelete(report)} className="p-1 hover:bg-gray-200 rounded">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </button>
                        </div>
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
              Are you sure you want to delete this report? This action cannot be undone.
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
    </DashboardLayout>
  )
}
