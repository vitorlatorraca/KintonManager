import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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

const managerLoginSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type ManagerLoginFormData = z.infer<typeof managerLoginSchema>;

export default function ManagerLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const form = useForm<ManagerLoginFormData>({
    resolver: zodResolver(managerLoginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: ManagerLoginFormData) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.user.userType !== "MANAGER" && data.user.userType !== "ADMIN") {
        toast({
          title: "Access denied",
          description: "This account does not have manager privileges.",
          variant: "destructive",
        });
        return;
      }

      login(data.user, data.token);
      toast({
        title: "Welcome to the Manager Portal!",
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

  const onSubmit = (data: ManagerLoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <AppShell>
      <div className="max-w-md mx-auto py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-[-0.02em] text-text-primary mb-3">
            Manager Portal
          </h1>
          <p className="text-base text-text-muted">
            Sign in to access the staff portal
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
                  Staff Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter staff phone number"
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
                    placeholder="Enter password"
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
                {loginMutation.isPending ? "Signing in..." : "Sign in as Staff"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
