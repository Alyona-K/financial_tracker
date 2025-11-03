// import { render, screen, waitFor } from "@testing-library/react";
// import { AppInit } from "./AppInit";
// import { useCategoriesStore } from "@/entities/category/model/category.store";
// import { useTransactionsStore } from "@/entities/transaction/model/transaction.store";
// import { useUserStore } from "@/entities/user/model/user.store";

// // Моки сторов
// jest.mock("@/entities/category/model/category.store");
// jest.mock("@/entities/transaction/model/transaction.store");
// jest.mock("@/entities/user/model/user.store");

// describe("AppInit", () => {
//   const fetchCategories = jest.fn();
//   const fetchTransactions = jest.fn();

//   beforeEach(() => {
//     jest.clearAllMocks();
//     (jest.mocked(useCategoriesStore.getState) as jest.Mock).mockReturnValue({ fetchCategories });
//     (jest.mocked(useTransactionsStore.getState) as jest.Mock).mockReturnValue({ fetchTransactions });
//   });

//   it("renders children", () => {
//     (useUserStore.getState as jest.Mock).mockReturnValue({ user: null });

//     render(
//       <AppInit>
//         <div>Child content</div>
//       </AppInit>
//     );

//     expect(screen.getByText("Child content")).toBeInTheDocument();
//   });

//   it("does not call fetch functions if user is null", async () => {
//     (useUserStore.getState as jest.Mock).mockReturnValue({ user: null });

//     render(<AppInit><div>Test</div></AppInit>);

//     await waitFor(() => {
//       expect(fetchCategories).not.toHaveBeenCalled();
//       expect(fetchTransactions).not.toHaveBeenCalled();
//     });
//   });

//   it("calls fetchCategories and fetchTransactions if user exists", async () => {
//     (useUserStore.getState as jest.Mock).mockReturnValue({ user: { id: 1 } });

//     render(<AppInit><div>Test</div></AppInit>);

//     await waitFor(() => {
//       expect(fetchCategories).toHaveBeenCalled();
//       expect(fetchTransactions).toHaveBeenCalled();
//     });
//   });
// });