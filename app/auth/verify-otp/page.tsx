"use client";

import type React from "react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import Image from "next/image";

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [otp, setOtp] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      router.push(`/auth/reset-password?email=${encodeURIComponent(email)}&otp=${otp}`);
    } else {
      toast.error("Please enter a valid 6-digit OTP");
    }
  };

  const handleResend = () => {
    toast.success("OTP resent successfully");
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center text-white mb-4">
              <h2 className="text-2xl font-bold">Verify Email</h2>
              <p className="text-muted-foreground">We sent a code to {email}</p>
            </div>
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <div className="text-center">
              <button
                type="button"
                onClick={handleResend}
                className="text-sm text-[#4a9b8e] hover:underline"
              >
                Resend
              </button>
            </div>
            <Button
              type="submit"
              className="w-full bg-[#4a9b8e] hover:bg-[#1a2f2a] text-white"
            >
              Verify
            </Button>
          </form>
        </CardContent>
      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOTPContent />
    </Suspense>
  );
}