import { useContext } from "react";
import Navbar from "~/components/navbar";
import { Mock } from "vitest";

import { render, screen, fireEvent } from "../utils/test-utils";

const mockContextValues = useContext as Mock;

vi.mock("react", async () => {
  const mod = await vi.importActual("react");
  return {
    ...mod,
    useContext: vi.fn(),
  };
});

describe("Navbar", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });
  it("render navbar", () => {
    mockContextValues.mockReturnValue({ darkmode: [true, vi.fn()] });
    render(<Navbar />);
  });
  it("dark mode styles being applied depending on the state", () => {
    mockContextValues.mockReturnValue({ darkmode: [false, vi.fn()] });
    render(<Navbar />);

    expect(screen.getByTestId("navbar")).toHaveStyle({
      color: "rgb(18, 18, 18)",
    });
    //   mockContextValues.mockReturnValue({darkmode:[true,vi.fn()]});
    //   expect(screen.getByTestId('navbar')).toHaveStyle({color: 'rgb(255, 255, 255)'})
  });
  it("nav bar is diplayed according to ismenuOpen state", () => {
    mockContextValues.mockReturnValue({ menu: [false, vi.fn()] });
    render(<Navbar />);

    expect(screen.getByTestId("navbar")).toHaveStyle({ margin: "-300px" });
    //   mockContextValues.mockReturnValue({darkmode:[true,vi.fn()]});
    //   expect(screen.getByTestId('navbar')).toHaveStyle({color: 'rgb(255, 255, 255)'})
  });
  it("they render the component depending on the navbar links:COUPONS", () => {
    mockContextValues.mockReturnValue({ menu: [false, vi.fn()] });
    render(<Navbar />);
    fireEvent.click(screen.getByLabelText("coupons"));
    expect(screen.findByText("Promotion"));
  });
  it("they render the component depending on the navbar links:POINTS", () => {
    mockContextValues.mockReturnValue({ menu: [false, vi.fn()] });
    render(<Navbar />);
    fireEvent.click(screen.getByLabelText("points"));
    expect(screen.findByText("Get Balances"));
  });
  it("they render the component depending on the navbar links:EXCHANGE", () => {
    mockContextValues.mockReturnValue({ menu: [false, vi.fn()] });
    render(<Navbar />);
    fireEvent.click(screen.getByLabelText("exchange"));
    expect(screen.findByText("Get eligibility"));
  });
  it("they render the component depending on the navbar links:FEEDBACK", () => {
    mockContextValues.mockReturnValue({ menu: [false, vi.fn()] });
    render(<Navbar />);
    fireEvent.click(screen.getByLabelText("feedback"));
    expect(
      screen.findByText(
        "Please feel free to post your comment or queries regarding the tool"
      )
    );
  });
});
