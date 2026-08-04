export interface DiplomadoSkill {
  icon: string;
  title: string;
  description: string;
  size: 'large' | 'small';
}

export interface DiplomadoPricing {
  amount: string;
  currency: string;
  label: string;
  headline: string;
  headlineAccent: string;
  tagline: string;
  checklist: string[];
  ctaLabel: string;
  ctaHref: string;
  /** Matrícula Preferencial (pago único) en USD */
  singleAmount: string;
  /** Reserva de vacante del plan financiado en USD */
  reservationAmount: string;
  /** Valor de cada cuota mensual en USD */
  monthlyAmount: string;
  /** Cantidad de cuotas */
  installments: number;
  /** Condiciones de pago en texto plano */
  paymentConditions: string;
}

export interface DiplomadoMeta {
  title: string;
  description: string;
  canonical: string;
}

export interface DiplomadoDetail {
  slug: string;
  chip: string;
  title: string;
  headline: string;
  headlineAccent: string;
  heroDescription: string;
  heroImageUrl: string;
  chips: string[];
  skillsTitle: string;
  skillsAccent: string;
  skillsSubtitle: string;
  skills: DiplomadoSkill[];
  pricing: DiplomadoPricing;
  meta: DiplomadoMeta;
  /** Enfoque del diplomado (para la grilla de la home) */
  enfoque: string[];
  /** Promesa principal (para la grilla de la home) */
  promesa: string;
  /** Fecha de inicio (para la grilla de la home) */
  fechaInicio: string;
  /** Condición de cupo (para la grilla de la home) */
  plazas: string;
}
