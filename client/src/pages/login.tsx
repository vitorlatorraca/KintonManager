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
import TabNavigation from "@/components/tab-navigation";
import KintonLogo from "@/components/kinton-logo";

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
      const response = await apiRequest('POST', '/api/auth/login', data);
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
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <>
      <TabNavigation />
      <div className="p-6 space-y-6">
        <div className="text-center mb-8">
          <KintonLogo size="lg" className="mb-6" />
          <p className="kinton-yellow text-lg font-bold">
            COLETE CARIMBOS, GANHE GYOZA GRÁTIS!
          </p>
        </div>

        <Card className="kinton-card">
          <CardContent className="pt-6">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="phone" className="block text-sm font-bold kinton-yellow mb-3 uppercase tracking-wide">
                  Número de Telefone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  {...form.register("phone")}
                  className="kinton-input w-full"
                />
                {form.formState.errors.phone && (
                  <p className="text-red-400 text-sm mt-2 font-medium">{form.formState.errors.phone.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password" className="block text-sm font-bold kinton-yellow mb-3 uppercase tracking-wide">
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    {...form.register("password")}
                    className="kinton-input w-full pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 kinton-yellow hover:text-[#FFA500] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-red-400 text-sm mt-2 font-medium">{form.formState.errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full kinton-button py-4 text-lg"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "ENTRANDO..." : "ENTRAR"}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <div className="border-t border-[#FFD700]/20 pt-6">
                <Link href="/register">
                  <Button variant="link" className="kinton-yellow hover:text-[#FFA500] p-0 text-base font-bold uppercase tracking-wide">
                    Não tem conta? <span className="ml-2">CADASTRE-SE</span>
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
