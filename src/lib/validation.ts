import { z } from 'zod';
import { fishTypes, taskTypes } from './domain';
export const uuid = z.uuid();
export const classSchema = z.object({
  name: z.string().trim().min(1).max(80),
  grade: z.string().trim().max(30),
  show_names: z.boolean(),
});
export const studentSchema = z.object({
  class_id: uuid,
  name: z.string().trim().min(2).max(100),
  student_number: z.string().trim().max(30),
  fish_type: z.enum(fishTypes),
});
export const taskSchema = z.object({
  class_id: uuid,
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().max(2000),
  type: z.enum(taskTypes),
  xp_reward: z.coerce.number().int().min(1).max(500),
  feed_reward: z.coerce.number().int().min(0).max(100),
  due_date: z.union([z.literal(''), z.iso.date()]),
  student_ids: z.array(uuid).min(1).max(200),
});
export const announcementSchema = z.object({
  class_id: uuid,
  title: z.string().trim().min(2).max(120),
  body: z.string().trim().min(2).max(3000),
  visible_to_parents: z.boolean(),
});
export const credentialsSchema = z.object({
  email: z.email().max(254),
  password: z.string().min(8).max(128),
  role: z.enum(['teacher', 'parent']),
});
