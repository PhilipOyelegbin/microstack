import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders app header title", () => {
  render(<App />);
  const linkElement = screen.getByText(/Modern Note App/i);
  expect(linkElement).toBeInTheDocument();
});
