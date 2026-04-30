import React from "react";
import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = globalThis.ResizeObserver ?? ResizeObserverMock;

vi.mock("recharts", () => {
  const ChartContainer = ({ children }) => (
    <div data-testid="recharts-container">{children}</div>
  );

  return {
    ResponsiveContainer: ({ children }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
    BarChart: ChartContainer,
    PieChart: ChartContainer,
    LineChart: ChartContainer,
    Bar: () => <div data-testid="bar-chart-item" />,
    Pie: ({ children }) => <div data-testid="pie-chart-item">{children}</div>,
    Line: () => <div data-testid="line-chart-item" />,
    Cell: () => null,
    CartesianGrid: () => null,
    XAxis: () => null,
    YAxis: () => null,
    Tooltip: () => null,
    Legend: () => null
  };
});