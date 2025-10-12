/**
 * TODO statistics dashboard component
 * 
 * Purpose: Display aggregated todo counts by state
 * Responsibility: Visual presentation of statistics only
 * Pattern: Pure presentational component (no state)
 */

"use client";

import { TodoStats as TodoStatsType } from "../../types/todo";

interface TodoStatsProps {
  stats: TodoStatsType;
}

export function TodoStats({ stats }: TodoStatsProps): JSX.Element {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <StatCard label="Total" value={stats.all} />
      <StatCard label="TODO" value={stats.todo} />
      <StatCard label="In Progress" value={stats.inProgress} />
      <StatCard label="Done" value={stats.done} />
    </div>
  );
}

// Internal component: Single stat card (not exported, internal implementation detail)
function StatCard({ label, value }: { label: string; value: number }): JSX.Element {
  return (
    <div className="bg-card p-4 rounded-lg border">
      <p className="text-muted-foreground mb-1">{label}</p>
      <p>{value}</p>
    </div>
  );
}
