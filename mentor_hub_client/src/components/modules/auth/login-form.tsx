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
import { Chrome, Lock, Mail, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export function LoginForm() {
  const router = useRouter();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: formSchema,
      onBlur: formSchema,
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Authenticating...");
      try {
        const { error } = await authClient.signIn.email(value);

        if (error) {
          toast.error(error.message || "An error occurred", { id: toastId });
          return;
        }

        toast.success("Welcome back!", { id: toastId });
        router.push("/");
      } catch (err: any) {
        toast.error(err.message || "Something went wrong", { id: toastId });
      }
    },
  });

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: window.location.origin,
      });
    } catch (err) {
      toast.error("Google login failed");
      setIsGoogleLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-[420px] mx-auto pt-10 pb-6"
    >
      <div className="mb-8 text-left">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2"
        >
          Welcome Back <span className="text-sky-500">!</span>
        </motion.h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium capitalize">
          Access your premium dashboard
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
            name="email"
            children={(field) => (
              <Field className="space-y-1.5">
                <FieldLabel className="text-xs font-black uppercase tracking-widest text-slate-400">Email Address</FieldLabel>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <Input
                    id={field.name}
                    placeholder="name@company.com"
                    className="pl-12 h-14 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white focus:ring-4 focus:ring-sky-500/10 transition-all font-medium"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
                {field.state.meta.isTouched && field.state.meta.errors && (
                  <FieldError className="text-[10px] font-bold uppercase tracking-tighter text-rose-500" errors={field.state.meta.errors} />
                )}
              </Field>
            )}
          />

          <form.Field
            name="password"
            children={(field) => (
              <Field className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <FieldLabel className="text-xs font-black uppercase tracking-widest text-slate-400">Password</FieldLabel>
                  <Link href="/forgot-password" className="text-[9px] font-black uppercase tracking-widest text-sky-500 hover:text-sky-600 transition-colors">Forgot Password?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <Input
                    id={field.name}
                    type="password"
                    placeholder="••••••••"
                    className="pl-12 h-14 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white focus:ring-4 focus:ring-sky-500/10 transition-all font-medium"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
                {field.state.meta.isTouched && field.state.meta.errors && (
                  <FieldError className="text-[10px] font-bold uppercase tracking-tighter text-rose-500" errors={field.state.meta.errors} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <Button 
          type="submit"
          className="w-full h-14 rounded-2xl bg-slate-900 dark:bg-sky-500 text-white font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 group relative overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">
            Sign In Now <ArrowRight className="size-4" />
          </span>
        </Button>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-100 dark:border-slate-800" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-white dark:bg-slate-950 px-3 text-slate-400 font-bold tracking-widest">Or Continue With</span>
          </div>
        </div>

        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            className="w-full h-14 rounded-2xl border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-4 font-bold text-slate-700 relative overflow-hidden group bg-white shadow-sm"
          >
            <div className="flex items-center justify-center gap-3">
                <svg viewBox="0 0 24 24" className="size-6 shrink-0" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.27 1.07-3.71 1.07-2.85 0-5.27-1.92-5.4-4.5H2.86v2.85C4.7 20.48 8.08 23 12 23z" fill="#34A853"/>
                  <path d="M6.6 14.14c-.11-.33-.18-.69-.18-1.06 0-.37.07-.73.18-1.06V9.17H2.86C2.13 10.61 1.71 12.26 1.71 14c0 1.74.42 3.39 1.15 4.83l3.74-2.69z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 8.08 1 4.7 3.52 2.86 6.55l3.74 2.85c.13-2.58 2.55-4.5 5.4-4.5z" fill="#EA4335"/>
                </svg>
                <span className="text-sm">Continue with Google</span>
            </div>
          </Button>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 pt-2">
          <Button
            type="button"
            variant="ghost"
            className="text-[10px] h-9 px-3 border border-slate-100 rounded-full hover:bg-sky-50 transition-colors font-bold text-slate-500 hover:text-sky-600"
            onClick={() => {
              form.setFieldValue("email", "admin@gmail.com");
              form.setFieldValue("password", "12345678");
            }}
          >
            Admin Demo
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="text-[10px] h-9 px-3 border border-slate-100 rounded-full hover:bg-sky-50 transition-colors font-bold text-slate-500 hover:text-sky-600"
            onClick={() => {
              form.setFieldValue("email", "jerry123@gmail.com");
              form.setFieldValue("password", "12345678");
            }}
          >
            Tutor Demo
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="text-[10px] h-9 px-3 border border-slate-100 rounded-full hover:bg-sky-50 transition-colors font-bold text-slate-500 hover:text-sky-600"
            onClick={() => {
              form.setFieldValue("email", "jimalamin7@gmail.com");
              form.setFieldValue("password", "12345678Jim");
            }}
          >
            Student Demo
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="text-[10px] h-9 px-3 border border-slate-100 rounded-full hover:bg-sky-50 transition-colors font-bold text-slate-500 hover:text-sky-600"
            onClick={() => {
              form.setFieldValue("email", "jimislam690@gmail.com");
              form.setFieldValue("password", "12345678");
            }}
          >
            Manager Demo
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="text-[10px] h-9 px-3 border border-slate-100 rounded-full hover:bg-sky-50 transition-colors font-bold text-slate-500 hover:text-sky-600"
            onClick={() => {
              form.setFieldValue("email", "mdalaminislam6999@gmail.com");
              form.setFieldValue("password", "12345678");
            }}
          >
            Organizer Demo
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="text-[10px] h-9 px-3 border border-slate-100 rounded-full hover:bg-sky-50 transition-colors font-bold text-slate-500 hover:text-sky-600"
            onClick={() => {
              form.setFieldValue("email", "alaminislam200408@gmail.com");
              form.setFieldValue("password", "12345678");
            }}
          >
            Vendor Demo
          </Button>
        </div>

        <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest pt-2">
          Don't have account?{" "}
          <Link href="/signup" className="text-sky-500 hover:text-sky-600 underline underline-offset-4 transition-colors">Create Now</Link>
        </p>
      </form>
    </motion.div>
  );
}
