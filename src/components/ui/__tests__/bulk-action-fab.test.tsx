import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent, render } from "@testing-library/react";
import { BulkActionFab } from "../bulk-action-fab";

describe("BulkActionFab Component", () => {
  it("should render idle FAB button when isSelectionMode is false", () => {
    const onEnter = vi.fn();
    render(
      <BulkActionFab
        isSelectionMode={false}
        selectedCount={0}
        onEnterSelectionMode={onEnter}
        onExitSelectionMode={vi.fn()}
        onDelete={vi.fn()}
        triggerLabel="Hapus Masal"
      />
    );

    const triggerBtn = screen.getByRole("button", { name: /Hapus Masal/i });
    expect(triggerBtn).toBeInTheDocument();

    fireEvent.click(triggerBtn);
    expect(onEnter).toHaveBeenCalledTimes(1);
  });

  it("should render action controls when isSelectionMode is true", () => {
    const onExit = vi.fn();
    const onDelete = vi.fn();

    render(
      <BulkActionFab
        isSelectionMode={true}
        selectedCount={3}
        onEnterSelectionMode={vi.fn()}
        onExitSelectionMode={onExit}
        onDelete={onDelete}
        cancelLabel="Batal"
        deleteLabel="Hapus"
      />
    );

    expect(screen.getByText(/3 dipilih/i)).toBeInTheDocument();

    const cancelBtn = screen.getByRole("button", { name: /Batal/i });
    fireEvent.click(cancelBtn);
    expect(onExit).toHaveBeenCalledTimes(1);

    const deleteBtn = screen.getByRole("button", { name: /Hapus/i });
    fireEvent.click(deleteBtn);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("should disable delete button when selectedCount is 0 in selection mode", () => {
    render(
      <BulkActionFab
        isSelectionMode={true}
        selectedCount={0}
        onEnterSelectionMode={vi.fn()}
        onExitSelectionMode={vi.fn()}
        onDelete={vi.fn()}
        deleteLabel="Hapus"
      />
    );

    const deleteBtn = screen.getByRole("button", { name: /Hapus/i });
    expect(deleteBtn).toBeDisabled();
  });
});
