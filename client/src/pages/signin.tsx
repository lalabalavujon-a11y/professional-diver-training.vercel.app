import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { LayoutDashboard, Mail, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isCredentials, setIsCredentials] = useState(true);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const { toast } = useToast();

  const credentialsSignInMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      return apiRequest("POST", "/api/auth/credentials", credentials);
    },
    onSuccess: (data) => {
      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully.",
      });
      // Redirect to dashboard
      window.location.href = '/dashboard';
    },
    onError: (error: any) => {
      toast({
        title: "Sign In Failed",
        description: error.message || "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    },
  });

  const magicLinkMutation = useMutation({
    mutationFn: async (emailData: { email: string }) => {
      return apiRequest("POST", "/api/auth/magic-link", emailData);
    },
    onSuccess: () => {
      setMagicLinkSent(true);
      toast({
        title: "Magic Link Sent!",
        description: "Check your email for a sign-in link.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send magic link. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCredentialsSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    credentialsSignInMutation.mutate({ email, password });
  };

  const handleMagicLinkRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    magicLinkMutation.mutate({ email });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Link href="/">
              <a className="inline-block">
                <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
                  <LayoutDashboard className="w-6 h-6 text-white" />
                </div>
              </a>
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900" data-testid="text-signin-title">
            Sign In
          </CardTitle>
          <CardDescription className="text-slate-600">
            Access your diving education account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {magicLinkSent && !isCredentials ? (
            <div className="text-center">
              <div className="mb-4">
                <Mail className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900" data-testid="text-check-email">
                  Check Your Email
                </h3>
                <p className="text-slate-600 mt-2">
                  We sent a sign-in link to <strong>{email}</strong>. Click the link to access your account.
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setMagicLinkSent(false)}
                className="w-full mb-2"
                data-testid="button-try-again"
              >
                Try Different Email
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setIsCredentials(true)}
                className="w-full text-sm"
                data-testid="button-use-password"
              >
                Use password instead
              </Button>
            </div>
          ) : (
            <>
              {/* Sign In Method Toggle */}
              <div className="flex border border-gray-200 rounded-lg mb-6" data-testid="signin-method-toggle">
                <button
                  onClick={() => setIsCredentials(true)}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-l-lg transition-colors ${
                    isCredentials
                      ? "bg-primary-500 text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  data-testid="button-credentials"
                >
                  Password
                </button>
                <button
                  onClick={() => setIsCredentials(false)}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-r-lg transition-colors ${
                    !isCredentials
                      ? "bg-primary-500 text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  data-testid="button-magic-link"
                >
                  Magic Link
                </button>
              </div>

              {/* Credentials Form */}
              {isCredentials ? (
                <form onSubmit={handleCredentialsSignIn} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full"
                      data-testid="input-email"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        className="w-full pr-10"
                        data-testid="input-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        data-testid="button-toggle-password"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-slate-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-slate-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button 
                    type="submit"
                    disabled={!email || !password || credentialsSignInMutation.isPending}
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white"
                    data-testid="button-signin-credentials"
                  >
                    {credentialsSignInMutation.isPending ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              ) : (
                /* Magic Link Form */
                <form onSubmit={handleMagicLinkRequest} className="space-y-4">
                  <div>
                    <label htmlFor="magic-email" className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address
                    </label>
                    <Input
                      id="magic-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full"
                      data-testid="input-magic-email"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      We'll send you a secure link to sign in without a password.
                    </p>
                  </div>

                  <Button 
                    type="submit"
                    disabled={!email || magicLinkMutation.isPending}
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white"
                    data-testid="button-request-magic-link"
                  >
                    {magicLinkMutation.isPending ? (
                      <>
                        <Mail className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Send Magic Link
                      </>
                    )}
                  </Button>
                </form>
              )}

              {/* Demo Account Alert */}
              <Alert className="mt-6 border-primary-200 bg-primary-50">
                <AlertCircle className="h-4 w-4 text-primary-600" />
                <AlertDescription className="text-primary-700">
                  <strong>Demo Account:</strong> admin@diverwell.app / admin123
                </AlertDescription>
              </Alert>

              {/* Footer Links */}
              <div className="mt-6 text-center">
                <p className="text-sm text-slate-600">
                  Don't have an account?{" "}
                  <span className="text-slate-500">
                    Contact an administrator for an invitation.
                  </span>
                </p>
              </div>
            </>
          )}

          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <Link href="/">
              <a className="text-sm text-primary-600 hover:text-primary-700" data-testid="link-back-home">
                ← Back to Home
              </a>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
