// --- MOCK NOTIFICATIONS STORE ---
jest.mock("@/shared/store/useNotificationsStore", () => ({
  useNotificationsStore: jest.fn(() => ({ notificationsCount: 3 })),
}));

// --- MOCK STATIC ASSETS ---
jest.mock("@/assets/images/fintrack-logo.png", () => "logo-mock", {
  virtual: true,
});
jest.mock("@/assets/images/sprite.svg", () => "SvgMock", { virtual: true });

import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Sidebar from "@shared/ui/Sidebar";

// --- SNAPSHOT TEST FOR SIDEBAR RENDER ---
describe("Sidebar snapshot", () => {
  it("renders correctly", () => {
    const { asFragment } = render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
