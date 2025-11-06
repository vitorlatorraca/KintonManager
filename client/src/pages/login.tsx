import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import AppShell from "@/components/app-shell";

const loginSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
    },
    onSuccess: (data) => {
      login(data.user, data.token);
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Sign in failed",
        description:
          error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <AppShell>
      <div className="max-w-md mx-auto py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-[-0.02em] text-text-primary mb-3">
            Welcome back
          </h1>
          <p className="text-base text-text-muted">
            Sign in to your Kinton Manager account
          </p>
        </div>

        <Card className="card-base">
          <CardContent className="pt-6">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <Label
                  htmlFor="phone"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  {...form.register("phone")}
                  className="input-base w-full"
                />
                {form.formState.errors.phone && (
                  <p className="text-danger text-sm mt-2 font-medium">
                    {form.formState.errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="password"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...form.register("password")}
                    className="input-base w-full pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-danger text-sm mt-2 font-medium">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full btn-primary py-3"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <div className="border-t border-line pt-6">
                <p className="text-sm text-text-muted mb-3">
                  Don't have an account?
                </p>
                <Link href="/register">
                  <Button variant="ghost" className="btn-ghost">
                    Create account
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
