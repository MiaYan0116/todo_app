/**
 * TODO filtering controls component
 *
 * Purpose: Provide UI for filtering todos by search, state, and date
 * Responsibility: Manages filter UI state and communicates changes to parent
 * Pattern: Controlled component with lifted state
 *
 * Architecture note: This is a complex component that could be further decomposed
 * into SearchFilter, StateFilter, DateFilter for even better separation
 */

"use client";

import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Search, X } from "lucide-react";
import {
  DateFilterOption,
  StateFilterOption,
  TodoFilters as TodoFiltersType,
  TodoState,
} from "../../types/todo";
import { TodoStats } from "./TodoStats";

interface TodoFiltersProps {
  filters: TodoFiltersType;
  onFiltersChange: (filters: Partial<TodoFiltersType>) => void;
  onClearAll: () => void;
}

export function TodoFilters({
  filters,
  onFiltersChange,
  onClearAll,
}: TodoFiltersProps) {
  const hasActiveFilters =
    filters.searchQuery ||
    filters.stateFilter !== "All" ||
    filters.dateFilter !== "All";

  return (
    <div className="space-y-4">
      {/* Main filter controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by description or user ID..."
            value={filters.searchQuery}
            onChange={(e) => onFiltersChange({ searchQuery: e.target.value })}
            className="pl-10"
          />
        </div>

        {/* State filter */}
        <Select
          value={filters.stateFilter}
          onValueChange={(value) =>
            onFiltersChange({ stateFilter: value as any })
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All States</SelectItem>
            <SelectItem value={TodoState.TODO}>TODO</SelectItem>
            <SelectItem value={TodoState.IN_PROGRESS}>In Progress</SelectItem>
            <SelectItem value={TodoState.DONE}>Done</SelectItem>
          </SelectContent>
        </Select>

        {/* Date filter */}
        <Select
          value={filters.dateFilter}
          onValueChange={(value) => {
            onFiltersChange({
              dateFilter: value as any,
              // Clear custom dates when switching away from custom
              ...(value !== "Custom" && {
                customDateFrom: "",
                customDateTo: "",
              }),
            });
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Dates</SelectItem>
            <SelectItem value="Today">Today</SelectItem>
            <SelectItem value="This Week">This Week</SelectItem>
            <SelectItem value="This Month">This Month</SelectItem>
            <SelectItem value="Overdue">Overdue</SelectItem>
            <SelectItem value="Custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Custom date range picker (conditional) */}
      {filters.dateFilter === "Custom" && (
        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/50 rounded-lg border">
          <div className="flex-1">
            <label htmlFor="dateFrom" className="block mb-2">
              From Date
            </label>
            <Input
              id="dateFrom"
              type="date"
              value={filters.customDateFrom}
              onChange={(e) =>
                onFiltersChange({ customDateFrom: e.target.value })
              }
            />
          </div>
          <div className="flex-1">
            <label htmlFor="dateTo" className="block mb-2">
              To Date
            </label>
            <Input
              id="dateTo"
              type="date"
              value={filters.customDateTo}
              onChange={(e) =>
                onFiltersChange({ customDateTo: e.target.value })
              }
              min={filters.customDateFrom}
            />
          </div>
          <div className="flex items-end">
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                onFiltersChange({
                  dateFilter: DateFilterOption.ALL,
                  customDateFrom: "",
                  customDateTo: "",
                })
              }
              title="Clear date filter"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Active filters display (removable badges) */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-muted-foreground">Active filters:</span>

          {filters.searchQuery && (
            <FilterBadge
              label={`Search: "${filters.searchQuery}"`}
              onRemove={() => onFiltersChange({ searchQuery: "" })}
            />
          )}

          {filters.stateFilter !== "All" && (
            <FilterBadge
              label={`State: ${filters.stateFilter}`}
              onRemove={() =>
                onFiltersChange({ stateFilter: StateFilterOption.ALL })
              }
            />
          )}

          {filters.dateFilter !== "All" && (
            <FilterBadge
              label={`Date: ${filters.dateFilter}${
                filters.dateFilter === "Custom" &&
                filters.customDateFrom &&
                filters.customDateTo
                  ? ` (${new Date(
                      filters.customDateFrom
                    ).toLocaleDateString()} - ${new Date(
                      filters.customDateTo
                    ).toLocaleDateString()})`
                  : ""
              }`}
              onRemove={() =>
                onFiltersChange({
                  dateFilter: DateFilterOption.ALL,
                  customDateFrom: "",
                  customDateTo: "",
                })
              }
            />
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="h-7"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}

// Internal component: Filter badge with remove button
function FilterBadge({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <Button variant="secondary" size="sm" onClick={onRemove} className="h-7">
      {label}
      <X className="ml-2 h-3 w-3" />
    </Button>
  );
}
