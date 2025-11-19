// --- MOCK EXTERNAL STORES AND COMPONENTS ---
jest.mock("@/shared/store/useNotificationsStore", () => ({
  useNotificationsStore: jest.fn((selector) => {
    const state = {
      notificationsCount: 5,
      reset: jest.fn(),
    };
    return selector(state);
  }),
}));

jest.mock("@/entities/auth/model/auth.store", () => ({
  useAuthStore: jest.fn(() => ({
    logout: jest.fn(),
    login: jest.fn().mockResolvedValue(undefined),
  })),
}));

// --- MOCK USER STORE AND ASSETS ---
jest.mock("@/entities/user/model/user.store", () => ({
  useUserStore: jest.fn(() => ({
    user: {
      id: 1,
      firstName: "Test",
      lastName: "User",
      avatar: "",
    },
  })),
}));

jest.mock("@/assets/images/sprite.svg", () => "SvgMock", { virtual: true });
jest.mock("@/assets/images/default_avatar.png", () => "avatar-mock", {
  virtual: true,
});
jest.mock("@/entities/user/ui/ProfileDropdown", () => () => (
  <div>ProfileDropdownMock</div>
));
jest.mock("@shared/ui/TopbarSearch", () => () => <div>TopbarSearchMock</div>);

// --- IMPORT ---
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Topbar from "@shared/ui/Topbar";

// --- SNAPSHOT TEST FOR LOGGED-IN USER ---
describe("Topbar", () => {
  it("matches snapshot when user is logged in", () => {
    const { container } = render(
      <BrowserRouter>
        <Topbar />
      </BrowserRouter>
    );

    expect(container).toMatchSnapshot();
  });
});
