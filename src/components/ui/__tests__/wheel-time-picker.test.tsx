import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent, within } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { WheelTimePicker } from "../wheel-time-picker";

describe("WheelTimePicker Component", () => {
  it("should render title and 24-hour time values", () => {
    const handleChange = vi.fn();
    renderWithProviders(
      <WheelTimePicker
        value="09:00"
        onChange={handleChange}
        title="Time"
      />
    );

    // Title should be visible
    expect(screen.getByText("Time")).toBeInTheDocument();

    const hoursListbox = screen.getByRole("listbox", { name: "Pilih Jam" });
    const minutesListbox = screen.getByRole("listbox", { name: "Pilih Menit" });

    // 9 should be displayed and selected in hours
    const selectedHour = within(hoursListbox).getByRole("option", { name: "9", selected: true });
    expect(selectedHour).toBeInTheDocument();

    // 00 should be displayed and selected in minutes
    const selectedMinute = within(minutesListbox).getByRole("option", { name: "00", selected: true });
    expect(selectedMinute).toBeInTheDocument();
  });

  it("should select new hour when an hour option is clicked", () => {
    const handleChange = vi.fn();
    renderWithProviders(
      <WheelTimePicker
        value="09:00"
        onChange={handleChange}
        title="Time"
      />
    );

    const hoursListbox = screen.getByRole("listbox", { name: "Pilih Jam" });
    const hour14 = within(hoursListbox).getByRole("option", { name: "14" });
    fireEvent.click(hour14);

    expect(handleChange).toHaveBeenCalledWith("14:00");
  });

  it("should select new minute when a minute option is clicked", () => {
    const handleChange = vi.fn();
    renderWithProviders(
      <WheelTimePicker
        value="09:00"
        onChange={handleChange}
        title="Time"
      />
    );

    const minutesListbox = screen.getByRole("listbox", { name: "Pilih Menit" });
    const minute30 = within(minutesListbox).getByRole("option", { name: "30" });
    fireEvent.click(minute30);

    expect(handleChange).toHaveBeenCalledWith("09:30");
  });

  it("should handle keyboard navigation on hour and minute listboxes", () => {
    const handleChange = vi.fn();
    renderWithProviders(
      <WheelTimePicker
        value="09:00"
        onChange={handleChange}
        title="Time"
      />
    );

    const hourListbox = screen.getByRole("listbox", { name: "Pilih Jam" });
    fireEvent.keyDown(hourListbox, { key: "ArrowDown" });
    expect(handleChange).toHaveBeenCalledWith("10:00");

    const minuteListbox = screen.getByRole("listbox", { name: "Pilih Menit" });
    fireEvent.keyDown(minuteListbox, { key: "ArrowDown" });
    expect(handleChange).toHaveBeenCalledWith("10:01");
  });

  it("should support padHour option to format hour with leading zero", () => {
    const handleChange = vi.fn();
    renderWithProviders(
      <WheelTimePicker
        value="09:00"
        onChange={handleChange}
        title="Time"
        padHour={true}
      />
    );

    const hoursListbox = screen.getByRole("listbox", { name: "Pilih Jam" });
    const hour09 = within(hoursListbox).getByRole("option", { name: "09", selected: true });
    expect(hour09).toBeInTheDocument();
  });
});
