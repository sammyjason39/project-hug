import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, ArrowRight } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { GlassCard } from "@/components/shared/GlassCard";
import { Button } from "@/components/ui/button";

const registerSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Work email is required").email("Enter a valid email address"),
  phone: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type RegisterValues = z.infer<typeof registerSchema>;

export default function Register() {
  const { registerUser, login } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { first_name: "", last_name: "", email: "", phone: "", password: "" },
  });

  const onSubmit = async (values: RegisterValues) => {
    setAuthError("");
    const result = await registerUser(values);
    if (result.success) {
      // Auto login after successful registration
      const loginResult = await login({
        email: values.email,
        password: values.password,
      });
      if (loginResult.success) {
        navigate("/core/dashboard");
      } else {
        navigate("/auth/login"); // Fallback if auto-login fails
      }
    } else {
      // Feedback_Message on failed submit; react-hook-form preserves entered input.
      setAuthError(result.error || "Registration failed");
    }
  };

  const fieldClass =
    "w-full px-4 py-3 rounded-xl border border-border bg-background text-sm";
  const labelClass = "text-label ml-0.5";
  const errorClass = "text-destructive text-xs ml-0.5 mt-1";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4">
      <GlassCard className="max-w-xl w-full overflow-hidden">
        <div className="p-8 sm:p-10">
          <div className="flex flex-col items-start mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border text-label text-primary mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              New organization
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">Create account</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Set up your workspace and provision your company.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {authError && (
              <div
                role="alert"
                className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl"
              >
                {authError}
              </div>
            )}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="reg-first-name" className={labelClass}>First name</label>
                <input
                  id="reg-first-name"
                  type="text"
                  autoComplete="given-name"
                  aria-invalid={!!errors.first_name}
                  className={fieldClass}
                  {...register("first_name")}
                />
                {errors.first_name && <p className={errorClass}>{errors.first_name.message}</p>}
              </div>
              <div className="space-y-1.5">
                <label htmlFor="reg-last-name" className={labelClass}>Last name</label>
                <input
                  id="reg-last-name"
                  type="text"
                  autoComplete="family-name"
                  aria-invalid={!!errors.last_name}
                  className={fieldClass}
                  {...register("last_name")}
                />
                {errors.last_name && <p className={errorClass}>{errors.last_name.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="reg-email" className={labelClass}>Work email</label>
              <input
                id="reg-email"
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                className={fieldClass}
                placeholder="name@company.com"
                {...register("email")}
              />
              {errors.email && <p className={errorClass}>{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="reg-phone" className={labelClass}>Phone (optional)</label>
              <input
                id="reg-phone"
                type="tel"
                autoComplete="tel"
                className={fieldClass}
                placeholder="+1 (555) 000-0000"
                {...register("phone")}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="reg-password" className={labelClass}>Password</label>
              <input
                id="reg-password"
                type="password"
                autoComplete="new-password"
                aria-invalid={!!errors.password}
                className={fieldClass}
                placeholder="Min 8 characters"
                {...register("password")}
              />
              {errors.password && <p className={errorClass}>{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account…
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/auth/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
