import Header from "~/components/header";
import { render, screen, fireEvent } from "../utils/test-utils";
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

describe("MyComponent", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("renders correctly with custom render", () => {
    const setIsFullScreenMock = vi.fn();
    mockContextValues.mockReturnValue({
      fullscreen: [false, setIsFullScreenMock],
    });
    render(<Header />);

    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByLabelText("HungerBox")).toBeInTheDocument();
    expect(screen.getByLabelText("Full Screen")).toBeInTheDocument();
    expect(screen.getByLabelText("Dark Mode")).toBeInTheDocument();

    // Assert initial styles
    expect(screen.getByTestId("header")).toHaveStyle({ margin: "0" });
    expect(screen.getByTestId("header")).toHaveStyle({
      color: "rgb(18, 18, 18)",
    });
  });

  it("toggles full screen mode when Full Screen button is clicked", async () => {
    const setIsFullScreenMock = vi.fn();
    mockContextValues.mockReturnValue({
      fullscreen: [true, setIsFullScreenMock],
    });

    render(<Header />);
    screen;
    expect(screen.getByTestId("header")).toHaveStyle({ margin: "-300px" });
    fireEvent.click(screen.getByLabelText("Full Screen"));
    expect(setIsFullScreenMock).toHaveBeenCalledTimes(1);
  });

  it("toggles dark mode when Dark Mode button is clicked", () => {
    const setIsDarkModeMock = vi.fn();
    mockContextValues.mockReturnValue({ darkmode: [true, setIsDarkModeMock] });
    render(<Header />);
    expect(screen.getByTestId("header")).toHaveStyle({
      color: "rgb(255, 255, 255)",
    });
    fireEvent.click(screen.getByLabelText("Dark Mode"));
    expect(setIsDarkModeMock).toHaveBeenCalledTimes(1);
  });

  it('toggles full screen mode when "Escape" key is pressed', () => {
    // Mocking useContext values
    const setIsFullScreenMock = vi.fn();
    mockContextValues.mockReturnValue({
      fullscreen: [true, setIsFullScreenMock],
    });

    render(<Header />);

    // Simulate "Escape" key press
    fireEvent.keyDown(document, { key: "Escape" });

    expect(setIsFullScreenMock).toHaveBeenCalledTimes(1);
  });
});
