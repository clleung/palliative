import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DashboardStats } from "@/components/dashboard/DashboardStats";

describe("DashboardStats", () => {
  it("renders all four stat cards", () => {
    render(<DashboardStats />);
    expect(screen.getByText("Today's Visits")).toBeInTheDocument();
    expect(screen.getByText("Active Patients")).toBeInTheDocument();
    expect(screen.getByText("Urgent Attention")).toBeInTheDocument();
    expect(screen.getByText("Hours This Week")).toBeInTheDocument();
  });

  it("displays correct stat values", () => {
    render(<DashboardStats />);
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("24")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("32")).toBeInTheDocument();
  });

  it("has accessible list structure", () => {
    render(<DashboardStats />);
    const list = screen.getByRole("list", { name: "Dashboard statistics" });
    expect(list).toBeInTheDocument();
    const items = screen.getAllByRole("listitem");
    expect(items.length).toBe(4);
  });

  it("displays trend information", () => {
    render(<DashboardStats />);
    expect(screen.getByText("On track")).toBeInTheDocument();
    expect(screen.getByText("+2 from last week")).toBeInTheDocument();
    expect(screen.getByText("Action needed")).toBeInTheDocument();
    expect(screen.getByText("8 remaining")).toBeInTheDocument();
  });

  it("displays subtexts", () => {
    render(<DashboardStats />);
    expect(screen.getByText("2 remaining")).toBeInTheDocument();
    expect(screen.getByText("3 new this week")).toBeInTheDocument();
    expect(screen.getByText("Needs review")).toBeInTheDocument();
    expect(screen.getByText("of 40 scheduled")).toBeInTheDocument();
  });

  it("each stat card has an aria-label with full context", () => {
    render(<DashboardStats />);
    const items = screen.getAllByRole("listitem");
    items.forEach(item => {
      expect(item.getAttribute("aria-label")).toBeTruthy();
    });
  });
});
