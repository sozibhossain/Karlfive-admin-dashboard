import axiosInstance from "./axios"

// Auth APIs
export const authApi = {
  login: async (data: { email: string; password: string }) => {
    const response = await axiosInstance.post("/auth/login", data)
    return response.data
  },
  sendResetOtp: async (data: { email: string }) => {
    const response = await axiosInstance.post("/auth/send-reset-otp", data)
    return response.data
  },
  resetPassword: async (data: { email: string; newPassword: string; otp: string }) => {
    const response = await axiosInstance.post("/auth/reset-password", data)
    return response.data
  },
  changePassword: async (data: { oldPassword: string; newPassword: string }) => {
    const response = await axiosInstance.post("/user/change-password", data)
    return response.data
  },
}

// User Management APIs
export const userApi = {
  getAllUsers: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get(`/admin/alluser?page=${page}&limit=${limit}`)
    return response.data
  },
  deleteUser: async (id: string) => {
    const response = await axiosInstance.delete(`/admin/updated-role/${id}`)
    return response.data
  },
  updateUserRole: async (id: string, role: string) => {
    const response = await axiosInstance.patch(`/admin/updated-role/${id}`, { role })
    return response.data
  },
}

// Venue Management APIs
export const venueApi = {
  getAllVenues: async () => {
    const response = await axiosInstance.get("/admin/all-vanue")
    return response.data
  },
  createVenue: async (data: { name: string; courtName: string }) => {
    const response = await axiosInstance.post("/admin/create-vanue", data)
    return response.data
  },
  updateVenue: async (id: string, data: { name: string; courtName: string }) => {
    const response = await axiosInstance.patch(`/admin/Update-vanue/${id}`, data)
    return response.data
  },
  deleteVenue: async (id: string) => {
    const response = await axiosInstance.delete(`/admin/delete-vanue/${id}`)
    return response.data
  },
  getSingleVenue: async (id: string) => {
    const response = await axiosInstance.get(`/admin/single-vanue/${id}`)
    return response.data
  },
}

// Report APIs
export const reportApi = {
  getAllReports: async () => {
    const response = await axiosInstance.get("/report/all-report")
    return response.data
  },
  getReportDetails: async (id: string) => {
    const response = await axiosInstance.get(`/report/${id}`)
    return response.data
  },
  updateReportFeedback: async (id: string, feedback: string) => {
    const response = await axiosInstance.patch(`/report/${id}`, { feedback })
    return response.data
  },
  deleteReport: async (id: string) => {
    const response = await axiosInstance.delete(`/report/${id}`)
    return response.data
  },
}

// Payment APIs
export const paymentApi = {
  getAllPayments: async () => {
    const response = await axiosInstance.get("/payment/all-payment")
    return response.data
  },
}
