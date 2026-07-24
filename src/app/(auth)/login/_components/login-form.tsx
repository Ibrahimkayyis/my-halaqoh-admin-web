"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff } from "lucide-react";

import { loginSchema, type LoginFormValues } from "@/features/auth/schemas/login.schema";
import { login } from "@/features/auth/actions/auth.actions";
import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();
  const { t } = useTranslation("auth");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const errorMessage = useAuthStore((s) => s.errorMessage);

  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsSubmitting(true);
    await login(values.identifier, values.password);
    setIsSubmitting(false);

    const status = useAuthStore.getState().status;
    if (status === "authenticated") {
      router.push("/");
    }
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {t("login.title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("login.subtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name="identifier"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="login-identifier">{t("login.identifierLabel")}</FieldLabel>
                <Input
                  {...field}
                  id="login-identifier"
                  placeholder={t("login.identifierPlaceholder")}
                  aria-invalid={fieldState.invalid}
                  autoComplete="username"
                  className="rounded-[8px]"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="login-password">{t("login.passwordLabel")}</FieldLabel>
                </div>
                <div className="relative">
                  <Input
                    {...field}
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("login.passwordPlaceholder")}
                    aria-invalid={fieldState.invalid}
                    autoComplete="current-password"
                    className="rounded-[8px]"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          {errorMessage && (
            <p className="text-sm font-medium text-destructive">{errorMessage}</p>
          )}
          <Button type="submit" className="w-full rounded-[8px] font-medium" disabled={isSubmitting}>
            {isSubmitting ? t("login.submitting") : t("login.submitBtn")}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}