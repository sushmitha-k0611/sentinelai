import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Topbar } from "@/components/Topbar";
import api from "@/services/api";
import { toast } from "sonner";
import jsPDF from "jspdf";
import { Progress } from "@/components/ui/progress";

import {
  Upload,
  Loader2,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

export const Route = createFileRoute("/_app/currency-detection")({
  component: CurrencyDetection,
});

type CurrencyResult = {
  prediction: string;
  confidence: string;
  security_features: string[];
  explanation: string;
};

function CurrencyDetection() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState<CurrencyResult | null>(null);

  const [history, setHistory] = useState<any[]>([]);

  const loadHistory = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!user.id) return;

    try {
      const response = await api.get(`/currency/history/${user.id}`);

      setHistory(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedImage(file);

    setPreview(URL.createObjectURL(file));
  };
  const downloadReport = () => {
  if (!result) return;

  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("SentinelAI", 20, 20);

  doc.setFontSize(16);
  doc.text("Counterfeit Currency Detection Report", 20, 35);

  doc.setFontSize(12);

  doc.text(`Prediction: ${result.prediction}`, 20, 55);

  doc.text(`Confidence: ${result.confidence}`, 20, 65);

  doc.text("Security Features:", 20, 80);

  let y = 90;

  result.security_features.forEach((feature) => {
    doc.text(`• ${feature}`, 25, y);
    y += 8;
  });

  y += 5;

  doc.text("AI Explanation:", 20, y);

  y += 10;

  const explanation = doc.splitTextToSize(
    result.explanation,
    170
  );

  doc.text(explanation, 20, y);

  y += explanation.length * 8 + 10;

  doc.text(
    `Generated On: ${new Date().toLocaleString()}`,
    20,
    y
  );

  doc.save("SentinelAI_Currency_Report.pdf");
};

  const detectCurrency = async () => {
    if (!selectedImage) {
      toast.error("Please select an image.");

      return;
    }

    try {
      setLoading(true);

      setResult(null);

      const user = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      const formData = new FormData();

      formData.append("user_id", user.id);

      formData.append("image", selectedImage);

      const response = await api.post(
        "/currency/detect",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      setResult(response.data);

      toast.success("Currency analyzed successfully.");

      loadHistory();
    } catch (error) {
      console.log(error);

      toast.error("Currency detection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Topbar
        title="Counterfeit Currency Detection"
        subtitle="Upload an Indian currency note for AI analysis"
      />

      <main className="space-y-6 p-4 md:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">

  {/* Upload Card */}

  <div className="glass rounded-2xl p-6">

    <div className="flex items-center gap-2">

      <Upload className="h-5 w-5 text-[var(--cyan)]" />

      <h3 className="font-display text-lg font-bold">

        Upload Currency Image

      </h3>

    </div>

    <p className="mt-2 text-sm text-muted-foreground">

      Upload a clear image of an Indian currency note.

    </p>

    <input
      type="file"
      accept="image/*"
      onChange={handleImageChange}
      className="mt-5 w-full rounded-lg border border-border bg-secondary/30 p-2"
    />

    {preview && (

      <div className="mt-5">

        <img
          src={preview}
          alt="Currency Preview"
          className="h-72 w-full rounded-xl border object-contain"
        />

      </div>

    )}

    <button
      onClick={detectCurrency}
      disabled={loading}
      className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[var(--gradient-cyan)] px-5 py-2.5 font-semibold text-[oklch(0.15_0.04_255)] disabled:opacity-60 glow-cyan"
    >

      {loading ? (

        <Loader2 className="h-4 w-4 animate-spin" />

      ) : (

        <Upload className="h-4 w-4" />

      )}

      {loading ? "Analyzing..." : "Detect Currency"}

    </button>

  </div>

  {/* AI Result Card */}

  <div className="glass rounded-2xl p-6">

    <div className="flex items-center gap-2">

      <ShieldCheck className="h-5 w-5 text-[var(--cyan)]" />

      <h3 className="font-display text-lg font-bold">

        AI Analysis Result

      </h3>

    </div>

    {!result && !loading && (

      <div className="mt-12 text-center text-muted-foreground">

        Upload an image and click Detect Currency.

      </div>

    )}

    {loading && (

      <div className="mt-12 text-center">

        <Loader2 className="mx-auto h-8 w-8 animate-spin" />

        <p className="mt-3">

          Gemini AI is analyzing your currency...

        </p>

      </div>

    )}

    {result && (

      <div className="mt-6 space-y-5">
                {/* Prediction */}

<div className="rounded-xl border border-border p-4">

  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
    Prediction
  </div>

  <div className="mt-4 flex justify-center">

    <span
      className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold ${
        result.prediction.toLowerCase().includes("genuine")
          ? "bg-green-100 text-green-700 border border-green-300"
          : "bg-red-100 text-red-700 border border-red-300"
      }`}
    >
      {result.prediction.toLowerCase().includes("genuine") ? (
        <>
          <ShieldCheck className="h-4 w-4" />
          GENUINE
        </>
      ) : (
        <>
          <AlertTriangle className="h-4 w-4" />
          SUSPICIOUS
        </>
      )}
    </span>

  </div>

</div>

        {/* Confidence */}

        <div className="rounded-xl border border-border p-4">

  <div className="flex justify-between">

    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      Confidence
    </div>

    <div className="font-bold text-cyan-400">
      {result.confidence}
    </div>

  </div>

  <Progress
    value={Number(result.confidence.replace("%", ""))}
    className="mt-3 h-3"
  />

</div>

        {/* Security Features */}

        <div className="rounded-xl border border-border p-4">

          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Security Features
          </div>

          <ul className="mt-3 space-y-2">

            {result.security_features.map((feature, index) => (

              <li
                key={index}
                className="flex items-center gap-2"
              >

                <ShieldCheck className="h-4 w-4 text-green-500" />

                <span>{feature}</span>

              </li>

            ))}

          </ul>

        </div>

        {/* Explanation */}

        <div className="rounded-xl border border-border bg-secondary/30 p-4">

          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            AI Explanation
          </div>

          <p className="mt-2 leading-relaxed">
            {result.explanation}
          </p>

        </div>

        <div className="pt-4">
  <button
    onClick={downloadReport}
    className="rounded-lg bg-[var(--gradient-cyan)] px-5 py-2.5 font-semibold text-[oklch(0.15_0.04_255)] hover:opacity-90"
  >
    Download PDF Report
  </button>
</div>

      </div>

    )}

  </div>

</div>
      {/* Currency Scan History */}

      <div className="glass rounded-2xl">

        <div className="border-b border-border/60 p-6">

          <h3 className="font-display text-lg font-bold">

            Currency Scan History

          </h3>

          <p className="text-xs text-muted-foreground">

            Previous AI currency analyses

          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead>

              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">

                <th className="px-6 py-3">Image</th>

                <th className="px-6 py-3">Prediction</th>

                <th className="px-6 py-3">Confidence</th>

                <th className="px-6 py-3">Date</th>

              </tr>

            </thead>

            <tbody>

              {history.map((item: any) => (

                <tr
                  key={item.id}
                  className="border-t border-border/40 hover:bg-secondary/30"
                >

                  <td className="px-6 py-4">

                    {item.image_name}

                  </td>

                  <td className="px-6 py-4">

                    {item.prediction}

                  </td>

                  <td className="px-6 py-4">

                    {item.confidence}

                  </td>

                  <td className="px-6 py-4 text-muted-foreground">

                    {new Date(item.created_at).toLocaleString()}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </main>

    </>

  );

}