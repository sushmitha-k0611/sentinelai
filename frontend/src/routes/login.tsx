import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Radar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { loginUser } from "@/services/auth";
export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("sushmithakunu611@gmail.com");
  const [password, setPassword] = useState("123456");

  async function onSubmit(e: React.FormEvent) {
  e.preventDefault();

  try {
    const response = await loginUser({
   email,
   password,
   });

   localStorage.setItem("user", JSON.stringify(response.user));
  console.log(response);
console.log(response.user);
console.log(localStorage.getItem("user"));
    toast.success("Welcome back!");

    navigate({ to: "/dashboard" });

  } catch (error: any) {
    toast.error(
      error?.response?.data?.detail || "Invalid email or password"
    );
  }
}

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between p-10 lg:flex">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--gradient-cyan)] glow-cyan">
            <Radar className="h-5 w-5 text-[oklch(0.15_0.04_255)]" />
          </div>
          <span className="font-display text-lg font-bold">SentinelAI</span>
        </Link>
        <div>
          <h2 className="font-display text-4xl font-bold leading-tight">
            Secure access to the <span className="text-gradient-cyan">National Fraud Grid.</span>
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            All sessions are auditable. Unauthorized access is a punishable offense under the IT Act.
          </p>
        </div>
        <div className="text-xs text-muted-foreground">© SentinelAI · MEITY Sandbox Demo</div>
      </div>

      <div className="flex items-center justify-center p-6">
        <form onSubmit={onSubmit} className="glass w-full max-w-md rounded-2xl p-8">
          <h1 className="font-display text-2xl font-bold">Sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">Use your secure credentials to continue.</p>

          <div className="mt-6 space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1" required />
            </div>
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" className="accent-[var(--cyan)]" /> Remember me
              </label>
              <a href="#" className="text-cyan hover:underline" style={{ color: "var(--cyan)" }}>Forgot password?</a>
            </div>
            <button type="submit" className="w-full rounded-lg bg-[var(--gradient-cyan)] px-4 py-3 font-semibold text-[oklch(0.15_0.04_255)] glow-cyan">
              Sign in to SentinelAI
            </button>
            <div className="text-center text-xs text-muted-foreground">
              No account? <Link to="/register" className="text-cyan hover:underline" style={{ color: "var(--cyan)" }}>Register</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
