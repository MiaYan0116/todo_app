/**
 * TODO creation and editing form component
 *
 * Purpose: Handle todo creation and editing in a modal dialog
 * Responsibility: Form state management, validation, and submission
 * Pattern: Controlled form component with local state
 */

"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Todo, TodoState } from "../../types/todo";

interface TodoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (todo: Todo) => void;
  editingTodo?: Todo | null;
}

export function TodoForm({
  open,
  onOpenChange,
  onSave,
  editingTodo,
}: TodoFormProps) {
  const [formData, setFormData] = useState<Todo>({
    taskId: "",
    userId: "",
    description: "",
    dueDate: "",
    state: TodoState.TODO,
  });

  // Reset form when dialog opens or editing todo changes
  useEffect(() => {
    if (editingTodo) {
      setFormData({
        ...editingTodo,
        state: editingTodo.state as TodoState,
      });
    } else {
      setFormData({
        taskId: Date.now().toString(), // Generate unique ID
        userId: "",
        description: "",
        dueDate: "",
        state: TodoState.TODO,
      });
    }
  }, [editingTodo, open]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    // Basic validation
    if (!formData.userId || !formData.description || !formData.dueDate) {
      return;
    }

    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingTodo ? "Edit TODO" : "Add New TODO"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* User ID field */}
            <div className="grid gap-2">
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                value={formData.userId}
                onChange={(e) =>
                  setFormData({ ...formData, userId: e.target.value })
                }
                placeholder="Enter user ID"
                required
              />
            </div>

            {/* Description field */}
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter task description"
                required
                rows={4}
              />
            </div>

            {/* Due date field */}
            <div className="grid gap-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                required
              />
            </div>

            {/* State selector */}
            <div className="grid gap-2">
              <Label htmlFor="state">State</Label>
              <Select
                value={formData.state}
                onValueChange={(value: TodoState) =>
                  setFormData({ ...formData, state: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TodoState.TODO}>TODO</SelectItem>
                  <SelectItem value={TodoState.IN_PROGRESS}>
                    In Progress
                  </SelectItem>
                  <SelectItem value={TodoState.DONE}>Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">{editingTodo ? "Update" : "Add"} TODO</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
