"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { paymentApi } from "@/lib/api";

// Mock function to resolve IDs to names (replace with actual API calls if available)
const resolveNames = (userId: string, leagueId: string, teamId: string) => {
  // Placeholder: Map IDs to names. Replace with API calls to fetch user, league, and team details.
  const userMap: { [key: string]: string } = {
    "68a9310b60a8cc4db5a8b6cf": "Player One",
    "68ca80d7de3bca1e6f2beef8": "Player Two",
  };
  const customerMap: { [key: string]: string } = {
    "68a93e86620256fd9d6fe200": "Dianne Russell",
    "68abf9b2df4fd5323d35907e": "Cody Fisher",
    "68a93fedd9159d4637e5ec5b": "Arlene McCoy",
    "68a93f98945c86132f699e5d": "Savannah Nguyen",
    "68d25bd0c1fb8733fdc373ee": "Robert Fox",
    "68d25946c1fb8733fdc373dd": "Jane Doe",
  };
  return {
    userName: userMap[userId] || "Unknown User",
    customerName: customerMap[leagueId] || "Unknown Customer",
  };
};

export default function RegistrationFeesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["payments"],
    queryFn: paymentApi.getAllPayments,
  });

  // Use provided data or fallback to empty array
  const payments = data?.data || [];

  // Calculate pagination
  const totalItems = payments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPayments = payments.slice(startIndex, endIndex);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
      case "succeeded":
        return <Badge className="bg-green-500 hover:bg-green-600 text-white">Successful</Badge>;
      case "failed":
      case "cancelled":
        return <Badge className="bg-red-500 hover:bg-red-600 text-white">Cancelled</Badge>;
      case "pending":
        return <Badge className="bg-orange-500 hover:bg-orange-600 text-white">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Format date (assuming createdAt is not provided, using a placeholder or transactionId-based date)
  const formatDate = (transactionId: string) => {
    // Placeholder: Use a fixed date or derive from transactionId if needed
    // Replace with actual createdAt field from API if available
    return "06/24/2025"; // Adjust based on actual data
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center">Registration Fees</h1>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: itemsPerPage }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-24" />
                      </TableCell>
                    </TableRow>
                  ))
                : paginatedPayments.map((payment: any) => {
                    const { userName, customerName } = resolveNames(
                      payment.userId,
                      payment.league,
                      payment.team
                    );
                    return (
                      <TableRow key={payment._id}>
                        <TableCell className="font-medium">{userName}</TableCell>
                        <TableCell>{customerName}</TableCell>
                        <TableCell>{formatDate(payment.transactionId)}</TableCell>
                        <TableCell>${payment.amount}</TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      </TableRow>
                    );
                  })}
            </TableBody>
          </Table>
        </Card>

        {/* Pagination Controls */}
        {totalItems > itemsPerPage && (
          <div className="flex items-center justify-between mt-4">
            <Button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              variant="outline"
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}