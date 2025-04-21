import Dashboard from "~/routes/dashboard";
import { render, screen } from "../utils/test-utils";
import { Mock } from "vitest";
import { useContext } from "react";
const mockContextValues = useContext as Mock;

vi.mock("react", async () => {
  const mod = await vi.importActual("react");
  return {
    ...mod,
    useContext: vi.fn(),
  };
});

describe("stored.dashboard-tests", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });
  it("render", () => {
    mockContextValues.mockReturnValue({ darkmode: [true, vi.fn()] });
    render(<Dashboard />);
  });
  it("dashboard component also owns the styles of darkmode based on context state value", () => {
    mockContextValues.mockReturnValue({ darkmode: [false, vi.fn()] });
    render(<Dashboard />);

    expect(screen.getByTestId("Dashboard")).toHaveStyle({
      color: "rgb(18, 18, 18)",
    });
  });
  it("dashboard component also owns the styles of darkmode based on context state value", () => {
    mockContextValues.mockReturnValue({ menu: [false, vi.fn()] });
    render(<Dashboard />);

    expect(screen.getByTestId("child-navbar")).toHaveStyle({ display: "none" });
  });
});
