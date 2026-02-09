import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export function TutorSignupForm({
  ...props
}: React.ComponentProps<typeof Card>) {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle className="text-center text-2xl">
          Create an account
        </CardTitle>
        <CardDescription>
          Enter information & below to create{" "}
          <span className="text-indigo-600 font-semibold">TUTOR</span> account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input id="name" type="text" placeholder="John Doe" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                required
                placeholder="******"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="role">Role</FieldLabel>
              <Input id="role" type="text" required defaultValue={"TUTOR"} />
            </Field>
            <FieldGroup>
              <Field>
                <Button
                  className="bg-indigo-400 hover:bg-indigo-600"
                  type="submit"
                >
                  Create Account
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <Link href="/signin">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
