import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DashboardStats } from "@/components/dashboard/DashboardStats";

describe("DashboardStats", () => {
  it("renders all four stat cards", () => {
    render(<DashboardStats />);
    expect(screen.getByText("Today's Visits")).toBeInTheDocument();
    expect(screen.getByText("Active Patients")).toBeInTheDocument();
    expect(screen.getByText("Urgent Attention")).toBeInTheDocument();
    expect(screen.getByText("Hours This Week")).toBeInTheDocument();
  });

  it("displays stat values", () => {
    render(<DashboardStats />);
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("24")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("32")).toBeInTheDocument();
  });

  it("has accessible list role", () => {
    render(<DashboardStats />);
    const list = screen.getByRole("list", { name: "Dashboard statistics" });
    expect(list).toBeInTheDocument();
    const items = screen.getAllByRole("listitem");
    expect(items.length).toBe(4);
  });
});
