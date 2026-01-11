import type z from 'zod';
import type { DashboardStatsSchema } from './dashboard.schema';

export type DashboardStats = z.infer<typeof DashboardStatsSchema>;
