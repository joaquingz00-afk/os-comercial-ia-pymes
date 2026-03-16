// ============================================
// OS Comercial IA — Core Types
// ============================================

// -- Enums --

export type UserRole = "ADMIN" | "MANAGER" | "SELLER" | "VIEWER";

export type AccountStatus =
  | "PROSPECT"
  | "ACTIVE_CLIENT"
  | "INACTIVE"
  | "CHURNED";

export type AccountSegment =
  | "STARTUP"
  | "SMB"
  | "MIDMARKET"
  | "ENTERPRISE"
  | "GOVERNMENT";

export type ContactRole =
  | "DECISION_MAKER"
  | "INFLUENCER"
  | "CHAMPION"
  | "USER"
  | "BLOCKER";

export type DealStage =
  | "PROSPECTING"
  | "QUALIFICATION"
  | "PROPOSAL"
  | "NEGOTIATION"
  | "CLOSED_WON"
  | "CLOSED_LOST";

export type DealSource =
  | "INBOUND"
  | "OUTBOUND"
  | "REFERRAL"
  | "EVENT"
  | "PARTNER";

export type ActivityType =
  | "CALL"
  | "EMAIL"
  | "MEETING"
  | "NOTE"
  | "TASK"
  | "SEQUENCE_STEP";

export type ActivityStatus =
  | "PENDING"
  | "COMPLETED"
  | "CANCELLED"
  | "OVERDUE";

export type ActivityPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type CallOutcome =
  | "CONNECTED"
  | "NO_ANSWER"
  | "VOICEMAIL"
  | "RESCHEDULED";

export type TenantPlan = "STARTER" | "GROWTH" | "SCALE";

// -- Plan Limits --

export const PLAN_LIMITS: Record<
  TenantPlan,
  {
    seats: number;
    accounts: number;
    deals: number;
    aiCalls: number;
    sequences: number;
  }
> = {
  STARTER: {
    seats: 3,
    accounts: 100,
    deals: 200,
    aiCalls: 100,
    sequences: 3,
  },
  GROWTH: {
    seats: 10,
    accounts: 500,
    deals: 1000,
    aiCalls: 500,
    sequences: 10,
  },
  SCALE: {
    seats: 999999,
    accounts: 999999,
    deals: 999999,
    aiCalls: 2000,
    sequences: 999999,
  },
};

// -- Default stage probabilities --

export const STAGE_PROBABILITIES: Record<DealStage, number> = {
  PROSPECTING: 10,
  QUALIFICATION: 25,
  PROPOSAL: 50,
  NEGOTIATION: 75,
  CLOSED_WON: 100,
  CLOSED_LOST: 0,
};

export const STAGE_LABELS: Record<DealStage, string> = {
  PROSPECTING: "Prospección",
  QUALIFICATION: "Calificación",
  PROPOSAL: "Propuesta",
  NEGOTIATION: "Negociación",
  CLOSED_WON: "Ganado",
  CLOSED_LOST: "Perdido",
};

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  CALL: "Llamada",
  EMAIL: "Email",
  MEETING: "Reunión",
  NOTE: "Nota",
  TASK: "Tarea",
  SEQUENCE_STEP: "Secuencia",
};
