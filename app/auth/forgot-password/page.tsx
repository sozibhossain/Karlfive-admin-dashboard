"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { authApi } from "@/lib/api";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authApi.sendResetOtp({ email });
      toast.success("OTP sent to your email");
      router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (error) {
      toast.error("Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#090909] text-white p-4">
      <div className="w-full max-w-md">
        <div className="space-y-4 flex text-center justify-center mb-4">
          <Image
            src="/logo.png"
            alt="Goal Control"
            width={500}
            height={500}
            className="h-[88px] w-[88px] object-contain"
          />
        </div>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center text-white mb-4">
              <h2 className="text-2xl font-bold">Forgot Password</h2>
              <p className="text-muted-foreground">
                Enter your email to receive a verification code
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-black"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#4a9b8e] hover:bg-[#1a2f2a] text-white"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send OTP"}
            </Button>
          </form>
        </CardContent>
      </div>
    </div>
  );
}