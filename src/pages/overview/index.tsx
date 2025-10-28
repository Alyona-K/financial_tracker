import { useState, useEffect } from "react";
import Welcome from "./ui/Welcome";
import WidgetsSection from "@/pages/overview/ui/WidgetsSection";
import AnalyticsSection from "./ui/AnalyticsSection";
import RecentTransactions from "./ui/RecentTransactions";
import AddEditTransactionModal from "@/features/transaction/AddEditTransaction/ui/AddEditTransactionModal";
import { TransactionFormData } from "@/entities/transaction/model/transaction.types";
import { FORM_MODE } from "@/shared/config/modes";
import { useTransactionsStore } from "@/entities/transaction/model/transaction.store";
import { useCategoriesStore } from "@/entities/category/model/category.store";
import { useNotificationsStore } from "@/shared/store/useNotificationsStore";
import { useWidgetsStore } from "@/entities/widget/model/widget.store";

function OverviewPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { addTransaction, fetchTransactions } = useTransactionsStore();
  const { fetchCategories } = useCategoriesStore();
  const { refreshWidgets } = useWidgetsStore();
  const { setNotificationsCount } = useNotificationsStore();

  // --- Подгрузка данных при открытии страницы ---
  // useEffect(() => {
  //   const initData = async () => {
  //     await Promise.all([fetchCategories(), fetchTransactions()]);
  //     refreshWidgets(); // после загрузки транзакций обновляем виджеты
  //   };
  //   initData();
  // }, []); // один раз при монтировании

  // --- Работа с модалкой ---
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // --- Сабмит транзакции ---
  const handleSubmit = async (data: TransactionFormData) => {
    try {
      await addTransaction(data);
      setNotificationsCount((prev) => prev + 1);
      alert("Transaction added!");
      refreshWidgets(); // обновляем виджеты после добавления транзакции
      handleCloseModal();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section className="overview">
      <div className="container">
        <Welcome />
        <WidgetsSection />
        <AnalyticsSection />
        <RecentTransactions onAddClick={handleOpenModal} />
      </div>

      <AddEditTransactionModal
        key={isModalOpen ? "open" : "closed"}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        mode={FORM_MODE.ADD}
      />
    </section>
  );
}

export default OverviewPage;


//--------------

// import { useState } from "react";
// import Welcome from "./ui/Welcome";
// import WidgetsSection from "@/pages/overview/ui/WidgetsSection";
// import AnalyticsSection from "./ui/AnalyticsSection";
// import RecentTransactions from "./ui/RecentTransactions";
// import AddEditTransactionModal from "@/features/transaction/AddEditTransaction/ui/AddEditTransactionModal";
// import { TransactionFormData } from "@/entities/transaction/model/transaction.types";
// import { FORM_MODE } from "@/shared/config/modes";
// import { useTransactionsStore } from "@/entities/transaction/model/transaction.store";
// import { useNotificationsStore } from "@/shared/store/useNotificationsStore";

// function OverviewPage() {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const { addTransaction } = useTransactionsStore();
//   const { setNotificationsCount } = useNotificationsStore();

//   const handleOpenModal = () => setIsModalOpen(true);
//   const handleCloseModal = () => setIsModalOpen(false);

//   const handleSubmit = async (data: TransactionFormData) => {
//     try {
//       await addTransaction(data); // добавляем в стор
//       setNotificationsCount((prev) => prev + 1); // обновляем счетчик уведомлений
//       alert("Transaction added!"); // уведомление
//       handleCloseModal();
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   return (
//     <section className="overview">
//       <div className="container">
//         <Welcome />
//         <WidgetsSection />
//         <AnalyticsSection />
//         <RecentTransactions onAddClick={handleOpenModal} />
//       </div>

//       <AddEditTransactionModal
//         key={isModalOpen ? "open" : "closed"} // форсируем ререндер при открытии/закрытии
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//         onSubmit={handleSubmit}
//         mode={FORM_MODE.ADD}
//           />
//     </section>
//   );
// }

// export default OverviewPage;

//---------------

// import { useState } from "react";
// import Welcome from "./ui/Welcome";
// import WidgetsSection from "@/pages/overview/ui/WidgetsSection";
// import AnalyticsSection from "./ui/AnalyticsSection";
// import RecentTransactions from "./ui/RecentTransactions";
// import AddEditTransactionModal from "@/features/transaction/AddEditTransaction/ui/AddEditTransactionModal";
// import { TransactionFormData } from "@/entities/transaction/model/transaction.types";
// import { FORM_MODE } from "@/shared/config/modes";
// import { useTransactionsStore } from "@/entities/transaction/model/transaction.store";
// import { useNotificationsStore } from "@/shared/store/useNotificationsStore";

// function OverviewPage() {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const { addTransaction } = useTransactionsStore();
//   const { setNotificationsCount } = useNotificationsStore();

//   const handleOpenModal = () => setIsModalOpen(true);
//   const handleCloseModal = () => setIsModalOpen(false);

//   const handleSubmit = async (data: TransactionFormData) => {
//     try {
//       await addTransaction(data); // добавляем в стор
//       setNotificationsCount((prev) => prev + 1); // обновляем счетчик уведомлений
//       alert("Transaction added!"); // уведомление
//       handleCloseModal();
//     } catch (e) {
//       console.error(e);
//     }
//   };
//   return (
//     <section className="overview">
//       <div className="container">
//         <Welcome />
//         <WidgetsSection />
//         <AnalyticsSection />
//         <RecentTransactions onAddClick={handleOpenModal} />
//       </div>
//       <AddEditTransactionModal
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//         onSubmit={handleSubmit}
//         mode={FORM_MODE.ADD}
//       />
//     </section>
//   );
// }

// export default OverviewPage;
