"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
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

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Creating user...");
      try {
        const { error } = await authClient.signIn.email(value);

        if (error) {
          toast.error(error.message || "An error occurred", {
            id: toastId,
          });
          return;
        }

        toast.success("User created successfully", {
          id: toastId,
        });
        router.push("/");
      } catch (err: any) {
        toast.error(err.message || "Something went wrong", {
          id: toastId,
        });
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <div className="flex flex-col items-center gap-1 text-center pb-10">
        <h1 className="text-2xl font-bold">
          <span className="text-indigo-500">Sign In</span> to your account
        </h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to signin to your account
        </p>
      </div>

      <FieldGroup>
        <form.Field
          name="email"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        ></form.Field>
        <form.Field
          name="password"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  type="password"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        ></form.Field>
        <Button className="bg-indigo-400 hover:bg-indigo-600">Sign In</Button>
        <FieldDescription className="px-6 text-center">
          Already have an account?{" "}
          <Link href="/signup">
            <span className="text-indigo-600">Sign up</span>
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
