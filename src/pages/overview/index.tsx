import { useState } from "react";
import Welcome from "./ui/Welcome";
import WidgetsSection from "@/pages/overview/ui/WidgetsSection";
import AnalyticsSection from "./ui/AnalyticsSection";
import RecentTransactions from "./ui/RecentTransactions";
import AddEditTransactionModal from "@/features/transaction/AddEditTransaction/ui/AddEditTransactionModal";
import { TransactionFormData } from "@/entities/transaction/model/transaction.types";
import { FORM_MODE } from "@/shared/config/modes";
import { useTransactionsStore } from "@/entities/transaction/model/transaction.store";
import { useNotificationsStore } from "@/shared/store/useNotificationsStore";

function OverviewPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { addTransaction } = useTransactionsStore();
  const { setNotificationsCount } = useNotificationsStore();

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmit = async (data: TransactionFormData) => {
    try {
      await addTransaction(data); // добавляем в стор
      setNotificationsCount((prev) => prev + 1); // обновляем счетчик уведомлений
      alert("Transaction added!"); // уведомление
      handleCloseModal();
    } catch (e) {
      console.error(e);
    }
  };

  // создаём initialData для модалки с сегодняшней датой
  // const initialData: TransactionFormData = {
  //   id: undefined,
  //   date: new Date().toISOString().slice(0, 10),
  //   categoryId: "", // пустая категория
  //   type: "Income", // дефолтный тип
  //   amount: "", // пустая сумма
  //   description: "", // пустое описание
  // };

  return (
    <section className="overview">
      <div className="container">
        <Welcome />
        <WidgetsSection />
        <AnalyticsSection />
        <RecentTransactions onAddClick={handleOpenModal} />
      </div>

      <AddEditTransactionModal
        key={isModalOpen ? "open" : "closed"} // форсируем ререндер при открытии/закрытии
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        mode={FORM_MODE.ADD}
        // initialData={initialData}
      />
    </section>
  );
}

export default OverviewPage;

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
