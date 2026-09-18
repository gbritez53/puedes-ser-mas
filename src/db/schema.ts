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
  // Capturados en el checkpoint, a mitad del cuestionario (pregunta 4 de 7).
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),
  // Se completan recién si termina las 7 preguntas; quedan null si abandona después del checkpoint.
  painSentence: text('pain_sentence'),
  category: text('category'),
  level: text('level'),
  levelInferred: integer('level_inferred', { mode: 'boolean' }),
  // JSON.stringify de { question, selected, other }[] con todas las respuestas, para dar contexto completo antes de la llamada.
  answers: text('answers'),
  completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
  ipHash: text('ip_hash'),
  userAgent: text('user_agent'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

export type Diagnostico = typeof diagnosticos.$inferSelect;
export type NewDiagnostico = typeof diagnosticos.$inferInsert;
