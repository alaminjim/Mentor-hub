import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold text-gray-700">
            Create your account
          </h1>
          <p className=" text-sm text-balance text-indigo-400">
            Fill in the form below to create your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input id="name" type="text" placeholder="John Doe" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            required
            placeholder="********"
          />
        </Field>
        <Field>
          <Button className="bg-indigo-400 hover:bg-indigo-600" type="submit">
            Create Account
          </Button>
        </Field>
        <Field>
          <FieldDescription className="px-6 text-center">
            Already have an account?{" "}
            <Link href="/signin">
              <span className="text-indigo-600 font-semibold">Sign in</span>
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
