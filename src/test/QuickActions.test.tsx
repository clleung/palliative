import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QuickActions } from "@/components/dashboard/QuickActions";

// Wrap with Router since it may use Link
function renderWithRouter(ui: React.ReactElement) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe("QuickActions", () => {
  it("renders all 4 action buttons", () => {
    renderWithRouter(<QuickActions />);
    expect(screen.getByText("Start Navigation")).toBeInTheDocument();
    expect(screen.getByText("New Visit Note")).toBeInTheDocument();
    expect(screen.getByText("Send Robot")).toBeInTheDocument();
    expect(screen.getByText("Report Concern")).toBeInTheDocument();
  });

  it("has accessible heading", () => {
    renderWithRouter(<QuickActions />);
    expect(screen.getByText("Quick Actions")).toBeInTheDocument();
  });

  it("each button has an accessible label with description", () => {
    renderWithRouter(<QuickActions />);
    expect(screen.getByLabelText(/Start Navigation/)).toBeInTheDocument();
    expect(screen.getByLabelText(/New Visit Note/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Report Concern/)).toBeInTheDocument();
  });

  it("Send Robot button opens dialog", () => {
    renderWithRouter(<QuickActions />);
    const sendRobotBtn = screen.getByText("Send Robot");
    fireEvent.click(sendRobotBtn);
    expect(screen.getByText("Send Robot to Patient")).toBeInTheDocument();
  });
});
