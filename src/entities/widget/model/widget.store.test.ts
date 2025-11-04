// Моки API и конфигов
jest.mock("@/shared/lib/api", () => ({
  api: { get: jest.fn(), post: jest.fn(), patch: jest.fn(), delete: jest.fn() },
}));
jest.mock("@/shared/config/config", () => ({
  API_URL: "http://localhost:3001",
}));

import { act } from "@testing-library/react";
import { useWidgetsStore } from "./widget.store";
import { defaultWidgets } from "@/shared/hooks/useWidgetsData";
import { WidgetCardData } from "./widget.types";

describe("Widgets Store", () => {
  const mockWidgets: WidgetCardData[] = [
    {
      id: "1",
      title: "Income",
      amount: 1000,
      changePercent: 5,
      cardType: "income",
      iconId: "icon1",
    },
    {
      id: "2",
      title: "Expenses",
      amount: 500,
      changePercent: -2,
      cardType: "expenses",
      iconId: "icon2",
    },
  ];

  beforeEach(() => {
    useWidgetsStore.setState({ widgets: defaultWidgets, openMenuId: null });
  });

  it("should initialize with default widgets", () => {
    const state = useWidgetsStore.getState();
    expect(state.widgets).toEqual(defaultWidgets);
    expect(state.openMenuId).toBeNull();
  });

  it("should set widgets manually", () => {
    act(() => {
      useWidgetsStore.getState().setWidgets(mockWidgets);
    });
    const state = useWidgetsStore.getState();
    expect(state.widgets).toEqual(mockWidgets);
  });

  it("should clear widgets to default", () => {
    act(() => {
      useWidgetsStore.getState().setWidgets(mockWidgets);
      useWidgetsStore.getState().clearWidgets();
    });
    const state = useWidgetsStore.getState();
    expect(state.widgets).toEqual(defaultWidgets);
  });

  it("should set and clear openMenuId", () => {
    act(() => {
      useWidgetsStore.getState().setOpenMenuId("1");
    });
    let state = useWidgetsStore.getState();
    expect(state.openMenuId).toBe("1");

    act(() => {
      useWidgetsStore.getState().setOpenMenuId(null);
    });
    state = useWidgetsStore.getState();
    expect(state.openMenuId).toBeNull();
  });
});
