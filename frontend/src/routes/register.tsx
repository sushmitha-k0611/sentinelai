import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Radar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { registerUser } from "@/services/auth";
export const Route = createFileRoute("/register")({
  component: Register,
});

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });

  async function onSubmit(e: React.FormEvent) {
  e.preventDefault();

  if (form.password !== form.confirm) {
    toast.error("Passwords do not match");
    return;
  }

  try {
    await registerUser({
    full_name: form.name,
    email: form.email,
    password: form.password,
   });

    toast.success("Account created successfully");

    navigate({ to: "/login" });

  } catch (error: any) {
    toast.error(
      error?.response?.data?.detail || "Registration failed"
    );
  }
}

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <form onSubmit={onSubmit} className="glass w-full max-w-md rounded-2xl p-8">
        <Link to="/" className="mb-6 flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--gradient-cyan)] glow-cyan">
            <Radar className="h-5 w-5 text-[oklch(0.15_0.04_255)]" />
          </div>
          <span className="font-display text-lg font-bold">SentinelAI</span>
        </Link>
        <h1 className="font-display text-2xl font-bold">Create your account</h1>
        <p className="mt-1 text-sm text-muted-foreground">Join the citizen defense network.</p>

        <div className="mt-6 space-y-4">
          {[
            { id: "name", label: "Full Name", type: "text" },
            { id: "email", label: "Email", type: "email" },
            { id: "password", label: "Password", type: "password" },
            { id: "confirm", label: "Confirm Password", type: "password" },
          ].map((f) => (
            <div key={f.id}>
              <Label htmlFor={f.id}>{f.label}</Label>
              <Input
                id={f.id}
                type={f.type}
                value={form[f.id as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [f.id]: e.target.value })}
                className="mt-1"
                required
              />
            </div>
          ))}
          <button type="submit" className="w-full rounded-lg bg-[var(--gradient-cyan)] px-4 py-3 font-semibold text-[oklch(0.15_0.04_255)] glow-cyan">
            Create Account
          </button>
          <div className="text-center text-xs text-muted-foreground">
            Already registered? <Link to="/login" style={{ color: "var(--cyan)" }} className="hover:underline">Sign in</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
