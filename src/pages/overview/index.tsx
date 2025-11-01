import { useState, useEffect } from "react";
import Welcome from "./ui/Welcome";
import WidgetsSection from "@/pages/overview/ui/WidgetsSection";
import AnalyticsSection from "./ui/AnalyticsSection";
import RecentTransactions from "./ui/RecentTransactions";
import AddEditTransactionModal from "@/features/transaction/AddEditTransaction/ui/AddEditTransactionModal";
import { TransactionFormData } from "@/entities/transaction/model/transaction.types";
import { FORM_MODE } from "@/shared/config/modes";
import { useTransactionsStore } from "@/entities/transaction/model/transaction.store";
import { useNotificationsStore } from "@/shared/store/useNotificationsStore";
import { useWidgetsStore } from "@/entities/widget/model/widget.store";
import { useWidgetsData } from "@/shared/hooks/useWidgetsData";

function OverviewPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { addTransaction } = useTransactionsStore();
  const { setNotificationsCount } = useNotificationsStore();

  // --- хук расчёта виджетов ---
  const { widgets: calculatedWidgets } = useWidgetsData();
  const { setWidgets } = useWidgetsStore();

  // синхронизируем стор с вычисленными виджетами
  useEffect(() => {
    setWidgets(calculatedWidgets);
  }, [calculatedWidgets, setWidgets]);

  // --- Работа с модалкой ---
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // --- Сабмит транзакции ---
  const handleSubmit = async (data: TransactionFormData) => {
    try {
      await addTransaction(data);
      setNotificationsCount((prev) => prev + 1);
      alert("Transaction added!");
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
