"use client";

import { useState } from "react";

interface DealAiPanelProps {
  dealId: string;
}

export function DealAiPanel({ dealId }: DealAiPanelProps) {
  const [emailLoading, setEmailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<{
    action: string;
    priority: string;
    reason: string;
  } | null>(null);

  async function generateEmail() {
    setEmailLoading(true);
    setGeneratedEmail(null);

    const res = await fetch("/api/ai/generate-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dealId }),
    });

    if (res.ok) {
      const data = await res.json();
      setGeneratedEmail(data.email);
    }
    setEmailLoading(false);
  }

  async function suggestAction() {
    setActionLoading(true);
    setSuggestion(null);

    const res = await fetch("/api/ai/suggest-action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dealId }),
    });

    if (res.ok) {
      const data = await res.json();
      setSuggestion(data);
    }
    setActionLoading(false);
  }

  const priorityColors: Record<string, string> = {
    HIGH: "bg-destructive/10 text-destructive border-destructive/20",
    MEDIUM: "bg-warning/10 text-warning border-warning/20",
    LOW: "bg-muted text-muted-foreground border-border",
  };

  return (
    <div className="bg-card border border-border rounded-xl">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <span className="text-purple-600">IA</span> Asistente comercial
        </h3>
      </div>

      <div className="p-4 space-y-3">
        {/* Suggest Action */}
        <button
          onClick={suggestAction}
          disabled={actionLoading}
          className="w-full text-left p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors disabled:opacity-50"
        >
          <p className="text-sm font-medium">
            {actionLoading ? "Analizando..." : "Sugerir próxima acción"}
          </p>
          <p className="text-xs text-muted-foreground">
            IA analiza el deal y recomienda qué hacer
          </p>
        </button>

        {suggestion && (
          <div
            className={`p-3 rounded-lg border ${
              priorityColors[suggestion.priority] || ""
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium">
                Prioridad: {suggestion.priority}
              </span>
            </div>
            <p className="text-sm font-medium">{suggestion.action}</p>
            <p className="text-xs mt-1 opacity-75">{suggestion.reason}</p>
          </div>
        )}

        {/* Generate Email */}
        <button
          onClick={generateEmail}
          disabled={emailLoading}
          className="w-full text-left p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors disabled:opacity-50"
        >
          <p className="text-sm font-medium">
            {emailLoading ? "Generando..." : "Generar email de seguimiento"}
          </p>
          <p className="text-xs text-muted-foreground">
            Email personalizado según el contexto del deal
          </p>
        </button>

        {generatedEmail && (
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-purple-700">
                Email generado:
              </p>
              <button
                onClick={() => navigator.clipboard.writeText(generatedEmail)}
                className="text-xs text-purple-600 hover:underline"
              >
                Copiar
              </button>
            </div>
            <p className="text-sm text-purple-900 whitespace-pre-wrap">
              {generatedEmail}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
