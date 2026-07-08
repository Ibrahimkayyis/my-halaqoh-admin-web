import Image from "next/image";
import { LoginForm } from "./_components/login-form";
import { LoginBrandingPanel } from "./_components/login-branding-panel";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full bg-surface text-foreground">
      {/* Left Panel: Form */}
      <div className="flex w-full flex-1 flex-col p-6 sm:p-8 lg:p-12">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm space-y-8">
            {/* Logo at Top of Form */}
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10">
                <Image
                  src="/logo.svg"
                  alt="MyHalaqoh Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-2xl font-bold tracking-tight text-primary">
                MyHalaqoh
              </span>
            </div>

            <LoginForm />
          </div>
        </div>

        {/* Copyright at Bottom Left */}
        <div className="mt-8 text-center text-sm text-muted-foreground lg:text-left">
          © MyHalaqoh {new Date().getFullYear()}
        </div>
      </div>

      {/* Right Panel: Branding (Hidden on mobile) */}
      <div className="hidden flex-1 lg:flex lg:items-center lg:justify-center p-4 lg:p-6 lg:pl-0">
        <LoginBrandingPanel />
      </div>
    </div>
  );
}