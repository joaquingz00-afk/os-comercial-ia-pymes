"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ActivityFormProps {
  dealId?: string;
  accountId?: string;
  accountName?: string;
  dealTitle?: string;
}

const activityTypes = [
  { value: "CALL", label: "Llamada", icon: "📞" },
  { value: "EMAIL", label: "Email", icon: "✉️" },
  { value: "MEETING", label: "Reunión", icon: "🤝" },
  { value: "NOTE", label: "Nota", icon: "📝" },
  { value: "TASK", label: "Tarea", icon: "✅" },
];

const callOutcomes = [
  { value: "CONNECTED", label: "Conectó" },
  { value: "NO_ANSWER", label: "No contestó" },
  { value: "VOICEMAIL", label: "Buzón" },
  { value: "RESCHEDULED", label: "Reprogramada" },
];

export function ActivityForm({
  dealId,
  accountId,
  accountName,
  dealTitle,
}: ActivityFormProps) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("NOTE");
  const [loading, setLoading] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data: Record<string, unknown> = {
      type,
      title: formData.get("title") as string,
      description: description || undefined,
      dealId,
      accountId,
      priority: formData.get("priority") || "MEDIUM",
    };

    if (type === "CALL") {
      data.outcome = formData.get("outcome") || undefined;
      data.duration = Number(formData.get("duration")) || undefined;
    }

    if (type === "TASK") {
      const dueDate = formData.get("dueDate") as string;
      if (dueDate) data.dueDate = dueDate;
    }

    if (type === "MEETING") {
      const meetingDate = formData.get("meetingDate") as string;
      if (meetingDate) data.date = meetingDate;
    }

    const nextFollowUp = formData.get("nextFollowUp") as string;
    if (nextFollowUp) data.nextFollowUp = nextFollowUp;

    const res = await fetch("/api/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setOpen(false);
      setDescription("");
      setAiSummary(null);
      router.refresh();
    }
    setLoading(false);
  }

  async function handleSummarize() {
    if (!description || !accountName) return;
    setSummarizing(true);

    const res = await fetch("/api/ai/summarize-meeting", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        notes: description,
        accountName,
        dealTitle,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setAiSummary(data.summary || JSON.stringify(data, null, 2));
    }
    setSummarizing(false);
  }

  if (!open) {
    return (
      <div className="flex gap-2">
        {activityTypes.map((at) => (
          <button
            key={at.value}
            onClick={() => {
              setType(at.value);
              setOpen(true);
            }}
            className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg text-sm hover:bg-muted transition-colors"
          >
            <span>{at.icon}</span>
            {at.label}
          </button>
        ))}
      </div>
    );
  }

  const selectedType = activityTypes.find((t) => t.value === type);

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">
          {selectedType?.icon} Registrar {selectedType?.label}
        </h3>
        <button
          onClick={() => {
            setOpen(false);
            setAiSummary(null);
          }}
          className="text-muted-foreground hover:text-foreground"
        >
          Cerrar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="title"
          required
          className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          placeholder={
            type === "CALL"
              ? "Llamada con María sobre propuesta"
              : type === "MEETING"
                ? "Reunión de demo con equipo técnico"
                : type === "TASK"
                  ? "Enviar propuesta actualizada"
                  : type === "EMAIL"
                    ? "Email de seguimiento"
                    : "Título de la nota"
          }
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
          placeholder={
            type === "MEETING"
              ? "Pega tus notas de reunión aquí... La IA las resumirá."
              : "Descripción o notas adicionales"
          }
        />

        {/* Meeting: AI Summarize button */}
        {type === "MEETING" && description.length > 50 && (
          <button
            type="button"
            onClick={handleSummarize}
            disabled={summarizing}
            className="text-sm px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50"
          >
            {summarizing ? "Analizando..." : "Resumir con IA"}
          </button>
        )}

        {aiSummary && (
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
            <p className="text-xs font-medium text-purple-700 mb-1">
              Resumen IA:
            </p>
            <p className="text-sm text-purple-900 whitespace-pre-wrap">
              {aiSummary}
            </p>
          </div>
        )}

        <div className="flex gap-3 flex-wrap">
          {/* Call-specific fields */}
          {type === "CALL" && (
            <>
              <select
                name="outcome"
                className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
              >
                <option value="">Resultado</option>
                {callOutcomes.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <input
                name="duration"
                type="number"
                min="1"
                placeholder="Minutos"
                className="w-24 px-3 py-2 border border-border rounded-lg bg-background text-sm"
              />
            </>
          )}

          {/* Task-specific fields */}
          {type === "TASK" && (
            <>
              <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground">
                  Vence:
                </label>
                <input
                  name="dueDate"
                  type="date"
                  className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
                />
              </div>
              <select
                name="priority"
                className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
              >
                <option value="LOW">Baja</option>
                <option value="MEDIUM" selected>
                  Media
                </option>
                <option value="HIGH">Alta</option>
                <option value="URGENT">Urgente</option>
              </select>
            </>
          )}

          {/* Meeting date */}
          {type === "MEETING" && (
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground">Fecha:</label>
              <input
                name="meetingDate"
                type="datetime-local"
                className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
              />
            </div>
          )}

          {/* Next follow-up */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground">
              Próximo contacto:
            </label>
            <input
              name="nextFollowUp"
              type="date"
              className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}
