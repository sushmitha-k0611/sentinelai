import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Topbar } from "@/components/Topbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { scamTypeOptions, indianStates } from "@/lib/dummy-data";
import { submitReport } from "@/services/report";

export const Route = createFileRoute("/_app/report-fraud")({
  head: () => ({
    meta: [{ title: "Report Fraud · SentinelAI" }],
  }),
  component: ReportFraud,
});

function ReportFraud() {
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    victim_name: "",
    phone: "",
    email: "",
    fraud_type: "",
    amount: "",
    incident_date: "",
    description: "",
    evidence: "",
    city: "",
    state: "",
    latitude: "",
    longitude: "",
  });

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function detectLocation() {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        set("latitude", position.coords.latitude.toFixed(6));
        set("longitude", position.coords.longitude.toFixed(6));

        toast.success("Location detected successfully");
      },
      () => toast.error("Unable to fetch current location")
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSubmitting(true);

      const user = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      const response = await submitReport({
        user_id: user.id,

        victim_name: form.victim_name,

        phone: form.phone,

        email: form.email,

        fraud_type: form.fraud_type,

        amount: Number(form.amount),

        incident_date: form.incident_date,

        description: form.description,

        evidence: form.evidence,

        city: form.city,

        state: form.state,

        latitude: Number(form.latitude),

        longitude: Number(form.longitude),
      });

      toast.success(response.message);

      setForm({
        victim_name: "",
        phone: "",
        email: "",
        fraud_type: "",
        amount: "",
        incident_date: "",
        description: "",
        evidence: "",
        city: "",
        state: "",
        latitude: "",
        longitude: "",
      });
    } catch (err: any) {
      toast.error(
        err.response?.data?.detail ||
          "Unable to submit report"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Topbar
        title="Report Fraud"
        subtitle="File a verifiable report — feeds the national intelligence grid"
      />

      <main className="p-4 md:p-8">
        <form
          onSubmit={submit}
          className="glass mx-auto max-w-4xl rounded-2xl p-6 md:p-8"
        >
          <div className="space-y-6"></div>
                      <div className="grid gap-5 md:grid-cols-2">

              <div>
                <Label>
                  Victim Name
                  <span style={{ color: "var(--destructive)" }}> *</span>
                </Label>

                <Input
                  value={form.victim_name}
                  onChange={(e) =>
                    set("victim_name", e.target.value)
                  }
                  placeholder="Enter victim name"
                  className="mt-1 border-border/60 bg-secondary/30"
                  required
                />
              </div>

              <div>
                <Label>
                  Phone Number
                  <span style={{ color: "var(--destructive)" }}> *</span>
                </Label>

                <Input
                  value={form.phone}
                  onChange={(e) =>
                    set("phone", e.target.value)
                  }
                  placeholder="9876543210"
                  className="mt-1 border-border/60 bg-secondary/30"
                  required
                />
              </div>

              <div>
                <Label>Email</Label>

                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    set("email", e.target.value)
                  }
                  placeholder="abc@gmail.com"
                  className="mt-1 border-border/60 bg-secondary/30"
                />
              </div>

              <div>
                <Label>
                  Fraud Type
                  <span style={{ color: "var(--destructive)" }}> *</span>
                </Label>

                <Select
                  value={form.fraud_type}
                  onValueChange={(v) =>
                    set("fraud_type", v)
                  }
                >
                  <SelectTrigger className="mt-1 border-border/60 bg-secondary/30">
                    <SelectValue placeholder="Select Fraud Type" />
                  </SelectTrigger>

                  <SelectContent>
                    {scamTypeOptions.map((item) => (
                      <SelectItem
                        key={item}
                        value={item}
                      >
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Amount Lost (₹)</Label>

                <Input
                  type="number"
                  value={form.amount}
                  onChange={(e) =>
                    set("amount", e.target.value)
                  }
                  placeholder="5000"
                  className="mt-1 border-border/60 bg-secondary/30"
                />
              </div>

              <div>
                <Label>Incident Date</Label>

                <Input
                  type="date"
                  value={form.incident_date}
                  onChange={(e) =>
                    set("incident_date", e.target.value)
                  }
                  className="mt-1 border-border/60 bg-secondary/30"
                />
              </div>

            </div>

            <div>

              <Label>
                Fraud Description
                <span style={{ color: "var(--destructive)" }}> *</span>
              </Label>

              <Textarea
                rows={6}
                value={form.description}
                onChange={(e) =>
                  set("description", e.target.value)
                }
                placeholder="Describe the fraud in detail..."
                className="mt-1 resize-none border-border/60 bg-secondary/30 font-mono text-sm"
                required
              />

            </div>

            <div>

              <Label>Evidence Link / File Name</Label>

              <Input
                value={form.evidence}
                onChange={(e) =>
                  set("evidence", e.target.value)
                }
                placeholder="Screenshot.png or Google Drive Link"
                className="mt-1 border-border/60 bg-secondary/30"
              />

            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <div>

                <Label>State</Label>

                <Select
                  value={form.state}
                  onValueChange={(v) =>
                    set("state", v)
                  }
                >
                  <SelectTrigger className="mt-1 border-border/60 bg-secondary/30">
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>

                  <SelectContent>

                    {indianStates.map((state) => (
                      <SelectItem
                        key={state}
                        value={state}
                      >
                        {state}
                      </SelectItem>
                    ))}

                  </SelectContent>

                </Select>

              </div>

              <div>

                <Label>City</Label>

                <Input
                  value={form.city}
                  onChange={(e) =>
                    set("city", e.target.value)
                  }
                  placeholder="Hyderabad"
                  className="mt-1 border-border/60 bg-secondary/30"
                />

              </div>
                          <div className="grid gap-5 md:grid-cols-2">

              <div>

                <Label>Latitude</Label>

                <Input
                  value={form.latitude}
                  onChange={(e) =>
                    set("latitude", e.target.value)
                  }
                  placeholder="17.385044"
                  className="mt-1 border-border/60 bg-secondary/30"
                />

              </div>

              <div>

                <Label>Longitude</Label>

                <Input
                  value={form.longitude}
                  onChange={(e) =>
                    set("longitude", e.target.value)
                  }
                  placeholder="78.486671"
                  className="mt-1 border-border/60 bg-secondary/30"
                />

              </div>

            </div>

            <button
              type="button"
              onClick={detectLocation}
              className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-secondary/40 px-4 py-2 text-sm hover:bg-secondary/60 transition"
            >
              <MapPin className="h-4 w-4 text-[var(--cyan)]" />
              Use Current Location
            </button>

            <div className="rounded-xl border border-border/60 bg-secondary/20 p-4">

              <h3 className="font-semibold">
                Before submitting
              </h3>

              <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                <li>Provide accurate information.</li>
                <li>Attach screenshots or proof whenever possible.</li>
                <li>Your report helps improve AI fraud intelligence.</li>
                <li>False reports may lead to legal action.</li>
              </ul>

            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-6">

              <p className="max-w-xl text-xs text-muted-foreground">
                Your report will be securely stored and shared only with
                authorized cybercrime authorities for investigation.
              </p>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--gradient-cyan)] px-6 py-3 font-semibold text-[oklch(0.15_0.04_255)] disabled:opacity-60 glow-cyan"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Report
                  </>
                )}
              </button>

            </div>
                      </div>
        </form>
      </main>
    </>
  );
}

export default ReportFraud;