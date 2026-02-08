import { SignupForm } from "@/components/modules/auth/signup-form";
import Image from "next/image";
import login from "../../../../public/image/loginPage.jpg";

export default function SignupPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignupForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src={login}
          alt="Login page background"
          fill
          className="object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
