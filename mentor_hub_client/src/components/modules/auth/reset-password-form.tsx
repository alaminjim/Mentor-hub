"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, ArrowRight, Loader2, KeyRound } from "lucide-react";
import { useState, useEffect } from "react";

const formSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      toast.error("Invalid dynamic link. Redirecting...");
      router.push("/forgot-password");
    }
  }, [email, router]);

  const form = useForm({
    defaultValues: {
      otp: "",
      newPassword: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      const toastId = toast.loading("Resetting your password...");
      try {
        // Step 1: Verify OTP and Reset
        // Since Better-Auth email-otp reset works by changing password after verification
        // We use the resetPassword method if using standard flow, 
        // but here the user wanted OTP specifically. 
        // Better-auth verifyOtp usually returns a result.
        
        const { error } = await authClient.emailOtp.resetPassword({
          email,
          otp: value.otp,
          password: value.newPassword,
        });

        if (error) {
          toast.error(error.message || "Invalid OTP or request failed", { id: toastId });
          setIsLoading(false);
          return;
        }

        toast.success("Password reset successful! You can now sign in.", { id: toastId });
        router.push("/signin");
      } catch (err: any) {
        toast.error(err.message || "Something went wrong", { id: toastId });
        setIsLoading(false);
      }
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-[420px] mx-auto bg-white/40 backdrop-blur-2xl p-8 rounded-3xl border border-white/20 shadow-2xl"
    >
      <div className="mb-8 text-center">
        <div className="size-16 bg-sky-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <KeyRound className="size-8 text-sky-500" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">
          Set New Password<span className="text-sky-500">.</span>
        </h1>
        <p className="text-slate-500 font-medium text-sm">
          A code was sent to <span className="text-sky-600 font-bold">{email}</span>. Please verify it to update your password.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
        <FieldGroup className="space-y-4">
          <form.Field
            name="otp"
            children={(field) => (
              <Field className="space-y-2">
                <FieldLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">6-Digit Security Code</FieldLabel>
                <div className="relative">
                  <Input
                    id={field.name}
                    placeholder="0 0 0 0 0 0"
                    maxLength={6}
                    className="h-14 rounded-2xl bg-white border-slate-100 focus:ring-4 focus:ring-sky-500/10 transition-all font-black text-center text-2xl tracking-[10px] placeholder:tracking-normal placeholder:font-medium placeholder:text-sm"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value.replace(/\D/g, ""))}
                  />
                </div>
                {field.state.meta.isTouched && field.state.meta.errors && (
                  <FieldError className="text-[10px] font-bold text-rose-500 uppercase" errors={field.state.meta.errors} />
                )}
              </Field>
            )}
          />

          <form.Field
            name="newPassword"
            children={(field) => (
              <Field className="space-y-2">
                <FieldLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">New Secure Password</FieldLabel>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <Input
                    id={field.name}
                    type="password"
                    placeholder="••••••••"
                    className="pl-12 h-14 rounded-2xl bg-white border-slate-100 focus:ring-4 focus:ring-sky-500/10 transition-all font-medium"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
                {field.state.meta.isTouched && field.state.meta.errors && (
                  <FieldError className="text-[10px] font-bold text-rose-500 uppercase" errors={field.state.meta.errors} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <Button 
          type="submit"
          disabled={isLoading}
          className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-black text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-slate-900/20 transition-all flex items-center justify-center gap-2 group relative overflow-hidden"
        >
          {isLoading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <>
              Update Password <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </form>
    </motion.div>
  );
}
