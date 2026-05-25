export interface CurriculumClass {
  id: string;
  number: number;
  title: string;
  summary: string;
  duration: string;
  competencies: string[];
}

export interface CurriculumModule {
  id: string;
  number: 1 | 2 | 3 | 4;
  title: string;
  subtitle: string;
  classes: CurriculumClass[];
}

export interface Saboteur {
  id: string;
  name: string;
  description: string;
}

export interface Bonus {
  id: string;
  label: string;
  description: string;
  value?: string;
}

export interface AuthorityCredential {
  id: string;
  label: string;
  institution?: string;
}
