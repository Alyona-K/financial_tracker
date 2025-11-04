// Мок стора уведомлений
jest.mock("@/shared/store/useNotificationsStore", () => ({
  useNotificationsStore: jest.fn(() => ({ notificationsCount: 3 })),
}));

// Моки картинок (т.к. Webpack/TS не умеют их напрямую)
jest.mock("@/assets/images/fintrack-logo.png", () => "logo-mock", { virtual: true });
jest.mock("@/assets/images/sprite.svg", () => "sprite-mock", { virtual: true });

import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Sidebar from "@shared/ui/Sidebar";

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