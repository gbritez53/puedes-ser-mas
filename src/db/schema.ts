import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const admissions = sqliteTable('admissions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  // Email ya no se recolecta en el formulario; se conserva nullable para datos históricos.
  email: text('email'),
  phone: text('phone').notNull(),
  diplomado: text('diplomado').notNull(),
  desafioPrincipal: text('desafio_principal').notNull(),
  porQueSerSeleccionado: text('por_que_ser_seleccionado').notNull(),
  ipHash: text('ip_hash'),
  userAgent: text('user_agent'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

export type Admission = typeof admissions.$inferSelect;
export type NewAdmission = typeof admissions.$inferInsert;

export const diagnosticos = sqliteTable('diagnosticos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  track: text('track').notNull(),
  scoreA: integer('score_a').notNull(),
  scoreB: integer('score_b').notNull(),
  scoreC: integer('score_c').notNull(),
  scoreD: integer('score_d').notNull(),
  closingText: text('closing_text').notNull(),
  // JSON.stringify de string[] con las aspiraciones elegidas en la última pregunta.
  aspirations: text('aspirations').notNull(),
  // JSON.stringify de { question, answer }[] con todas las respuestas, para dar contexto completo antes de la llamada.
  answers: text('answers').notNull(),
  ipHash: text('ip_hash'),
  userAgent: text('user_agent'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

export type Diagnostico = typeof diagnosticos.$inferSelect;
export type NewDiagnostico = typeof diagnosticos.$inferInsert;
