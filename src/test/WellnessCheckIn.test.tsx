import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WellnessCheckIn } from "@/components/wellness/WellnessCheckIn";

describe("WellnessCheckIn", () => {
  it("renders when open", () => {
    render(<WellnessCheckIn open={true} onOpenChange={() => {}} />);
    expect(screen.getByText("How are you feeling?")).toBeInTheDocument();
  });

  it("shows all mood options", () => {
    render(<WellnessCheckIn open={true} onOpenChange={() => {}} />);
    expect(screen.getByLabelText("Mood: Doing well")).toBeInTheDocument();
    expect(screen.getByLabelText("Mood: Managing")).toBeInTheDocument();
    expect(screen.getByLabelText("Mood: Need support")).toBeInTheDocument();
  });

  it("submit button is disabled without mood selection", () => {
    render(<WellnessCheckIn open={true} onOpenChange={() => {}} />);
    const submitBtn = screen.getByText("Submit");
    expect(submitBtn).toBeDisabled();
  });

  it("submit button enables after mood selection", () => {
    render(<WellnessCheckIn open={true} onOpenChange={() => {}} />);
    fireEvent.click(screen.getByLabelText("Mood: Doing well"));
    const submitBtn = screen.getByText("Submit");
    expect(submitBtn).not.toBeDisabled();
  });

  it("shows PTO info", () => {
    render(<WellnessCheckIn open={true} onOpenChange={() => {}} />);
    expect(screen.getByText("12")).toBeInTheDocument(); // PTO days
    expect(screen.getByText("3")).toBeInTheDocument(); // mental health days
  });

  it("shows support resources when struggling", () => {
    render(<WellnessCheckIn open={true} onOpenChange={() => {}} />);
    fireEvent.click(screen.getByLabelText("Mood: Need support"));
    expect(screen.getByText("Employee Assistance Program")).toBeInTheDocument();
    expect(screen.getByText("Request Time Off")).toBeInTheDocument();
    expect(screen.getByText("Talk to Your Supervisor")).toBeInTheDocument();
  });

  it("shows encouragement when managing", () => {
    render(<WellnessCheckIn open={true} onOpenChange={() => {}} />);
    fireEvent.click(screen.getByLabelText("Mood: Managing"));
    expect(screen.getByText(/break can make a big difference/)).toBeInTheDocument();
  });

  it("does not show support resources for 'doing well'", () => {
    render(<WellnessCheckIn open={true} onOpenChange={() => {}} />);
    fireEvent.click(screen.getByLabelText("Mood: Doing well"));
    expect(screen.queryByText("Employee Assistance Program")).not.toBeInTheDocument();
  });

  it("has optional notes textarea", () => {
    render(<WellnessCheckIn open={true} onOpenChange={() => {}} />);
    expect(screen.getByPlaceholderText("Your thoughts are confidential...")).toBeInTheDocument();
  });

  it("has skip button", () => {
    render(<WellnessCheckIn open={true} onOpenChange={() => {}} />);
    expect(screen.getByText("Skip for now")).toBeInTheDocument();
  });
});
