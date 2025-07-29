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
import TabNavigation from "@/components/tab-navigation";
import KintonLogo from "@/components/kinton-logo";

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
        title: "Welcome to Manager Portal!",
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
    <>
      <TabNavigation />
      <div className="p-6">
        <div className="text-center mb-8">
          <KintonLogo size="lg" className="mb-6" />
          <p className="kinton-yellow text-lg font-bold">PORTAL DO GERENTE</p>
        </div>

        <Card className="kinton-card">
          <CardContent className="pt-6">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label
                  htmlFor="phone"
                  className="block text-sm font-bold kinton-yellow mb-3 uppercase tracking-wide"
                >
                  Telefone do Staff
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Digite o telefone do staff"
                  {...form.register("phone")}
                  className="kinton-input w-full"
                />
                {form.formState.errors.phone && (
                  <p className="text-red-400 text-sm mt-2 font-medium">
                    {form.formState.errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    {...form.register("password")}
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-[#2C3E50] hover:bg-gray-700 text-white py-3"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Signing in..." : "Staff Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
