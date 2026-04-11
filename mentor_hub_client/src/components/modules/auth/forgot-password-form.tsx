"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export function ForgotPasswordForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      const toastId = toast.loading("Sending security code...");
      try {
        const { error } = await authClient.emailOtp.sendVerificationOtp({
          email: value.email,
          type: "forget-password",
        });

        if (error) {
          toast.error(error.message || "Failed to send OTP", { id: toastId });
          setIsLoading(false);
          return;
        }

        toast.success("Security code sent to your email!", { id: toastId });
        // Redirect to reset password page with email as query param
        router.push(`/reset-password?email=${encodeURIComponent(value.email)}`);
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
            <ShieldCheck className="size-8 text-sky-500" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">
          Forgot Password<span className="text-sky-500">?</span>
        </h1>
        <p className="text-slate-500 font-medium text-sm">
          Enter your email and we'll send a 6-digit security code to reset your password.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
        <FieldGroup>
          <form.Field
            name="email"
            children={(field) => (
              <Field className="space-y-2">
                <FieldLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Account Email</FieldLabel>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <Input
                    id={field.name}
                    placeholder="name@example.com"
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
          className="w-full h-14 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-sky-500/20 transition-all flex items-center justify-center gap-2 group relative overflow-hidden"
        >
          {isLoading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <>
              Send Security Code <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>

        <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Remember your password?{" "}
          <Link href="/signin" className="text-sky-500 hover:text-sky-600 underline underline-offset-4 decoration-2">Sign In</Link>
        </p>
      </form>
    </motion.div>
  );
}
