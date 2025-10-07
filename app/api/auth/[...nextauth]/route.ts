import NextAuth, { type NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import axios from "axios"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`, {
            email: credentials?.email,
            password: credentials?.password,
          })

          const { data } = response.data

          if (data && data.user) {
            return {
              id: data.user._id,
              _id: data.user._id,
              email: data.user.email,
              name: data.user.name,
              image: data.user.profileImage,
              role: data.user.role,
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
            }
          }
          return null
        } catch (error) {
          console.error("Login error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token._id = user._id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.refreshToken = token.refreshToken
      if (session.user) {
        session.user._id = token._id
        session.user.role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
