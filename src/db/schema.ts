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
