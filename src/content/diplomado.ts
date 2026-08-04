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
}
