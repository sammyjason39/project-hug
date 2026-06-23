import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, ArrowRight } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { GlassCard } from "@/components/shared/GlassCard";
import { Button } from "@/components/ui/button";
import { ForgotPasswordModal } from "./ForgotPasswordModal";

const loginSchema = z.object({
  email: z.string().min(1, "Work email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState("");
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginValues) => {
    setAuthError("");
    const result = await login(values);
    if (result.success) {
      navigate("/core/dashboard");
    } else {
      // Feedback_Message on failed submit; react-hook-form preserves entered input.
      setAuthError(result.error || "Failed to login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <GlassCard className="max-w-md w-full overflow-hidden">
        <div className="p-8 sm:p-10">
          <div className="flex flex-col items-start mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border text-label text-primary mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Enterprise workspace
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">Sign in</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Access your Zenvix operations workspace.
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

            <div className="space-y-1.5">
              <label htmlFor="login-email" className="text-label ml-0.5">
                Work email
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm"
                placeholder="name@company.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-destructive text-xs ml-0.5 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className="text-label">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot password
                </button>
              </div>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm"
                placeholder="••••••••"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-destructive text-xs ml-0.5 mt-1">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            New to the platform?{" "}
            <Link to="/auth/register" className="font-medium text-primary hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </GlassCard>

      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
      />
    </div>
  );
}
