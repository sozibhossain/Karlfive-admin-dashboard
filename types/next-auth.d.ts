declare module "next-auth" {
  interface Session {
    accessToken?: string
    refreshToken?: string
    user: {
      _id?: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
    }
  }

  interface User {
    _id?: string
    accessToken?: string
    refreshToken?: string
    role?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    _id?: string
    role?: string
  }
}
