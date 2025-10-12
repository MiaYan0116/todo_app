/**
 * @file TodoForm.test.tsx
 * Tests for the TodoForm component (creation + editing form).
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoForm } from "./TodoForm";
import { TodoState } from "../../types/todo";

const mockOnSave = jest.fn();
const mockOnOpenChange = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

describe("<TodoForm />", () => {
  test("renders all input fields when open", () => {
    render(
      <TodoForm
        open={true}
        onSave={mockOnSave}
        onOpenChange={mockOnOpenChange}
        editingTodo={null}
      />
    );

    expect(screen.getByLabelText(/user id/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /todo/i })).toBeInTheDocument();
  });

  test("allows typing in form fields", async () => {
    render(
      <TodoForm
        open={true}
        onSave={mockOnSave}
        onOpenChange={mockOnOpenChange}
        editingTodo={null}
      />
    );

    const userIdInput = screen.getByLabelText(/user id/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const dueDateInput = screen.getByLabelText(/due date/i);

    await userEvent.type(userIdInput, "user123");
    await userEvent.type(descriptionInput, "Write Jest tests");
    await userEvent.type(dueDateInput, "2025-10-15");

    expect(userIdInput).toHaveValue("user123");
    expect(descriptionInput).toHaveValue("Write Jest tests");
    expect(dueDateInput).toHaveValue("2025-10-15");
  });

  test("calls onSave and closes form when submitted with valid data", async () => {
    render(
      <TodoForm
        open={true}
        onSave={mockOnSave}
        onOpenChange={mockOnOpenChange}
        editingTodo={null}
      />
    );

    await userEvent.type(screen.getByLabelText(/user id/i), "u1");
    await userEvent.type(screen.getByLabelText(/description/i), "New Task");
    await userEvent.type(screen.getByLabelText(/due date/i), "2025-10-12");

    const submitBtn = screen.getByRole("button", { name: /add todo/i });
    await userEvent.click(submitBtn);

    expect(mockOnSave).toHaveBeenCalledTimes(1);
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);

    const savedTodo = mockOnSave.mock.calls[0][0];
    expect(savedTodo.description).toBe("New Task");
    expect(savedTodo.state).toBe(TodoState.TODO);
  });

  test("does not call onSave if required fields are missing", async () => {
    render(
      <TodoForm
        open={true}
        onSave={mockOnSave}
        onOpenChange={mockOnOpenChange}
        editingTodo={null}
      />
    );

    // Leave required fields empty
    const submitBtn = screen.getByRole("button", { name: /add todo/i });
    await userEvent.click(submitBtn);

    expect(mockOnSave).not.toHaveBeenCalled();
  });

  test("pre-fills fields in edit mode", () => {
    const editingTodo = {
      taskId: "1",
      userId: "99",
      description: "Fix bugs",
      dueDate: "2025-10-11",
      state: TodoState.IN_PROGRESS,
      createdAt: "2025-10-10T10:00:00Z",
    };

    render(
      <TodoForm
        open={true}
        onSave={mockOnSave}
        onOpenChange={mockOnOpenChange}
        editingTodo={editingTodo}
      />
    );

    expect(screen.getByDisplayValue("99")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Fix bugs")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2025-10-11")).toBeInTheDocument();
  });

  test("calls onOpenChange(false) when cancel is clicked", async () => {
    render(
      <TodoForm
        open={true}
        onSave={mockOnSave}
        onOpenChange={mockOnOpenChange}
        editingTodo={null}
      />
    );

    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    await userEvent.click(cancelBtn);

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });
});
