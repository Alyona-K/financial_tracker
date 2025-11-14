import { useState, useEffect } from "react";
import { SectionHeader } from "@/shared/ui/SectionHeader";
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
import { useUserStore } from "@/entities/user/model/user.store";
import { useScrollToSection } from "@/shared/lib/useScrollToSection";

function OverviewPage() {
  useScrollToSection();

  const user = useUserStore((s) => s.user);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { addTransaction } = useTransactionsStore();
  const { setNotificationsCount } = useNotificationsStore();

  // --- WIDGETS DATA HOOK ---
  const { widgets: calculatedWidgets } = useWidgetsData();
  const { setWidgets } = useWidgetsStore();

  // --- SYNC WIDGETS STORE ---
  useEffect(() => {
    setWidgets(calculatedWidgets);
  }, [calculatedWidgets, setWidgets]);

  // --- MODAL HANDLERS ---
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // --- TRANSACTION SUBMIT HANDLER ---
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
        <SectionHeader
          title={`Welcome, ${user?.firstName ?? "Guest"}!`}
          text="This dashboard provides a personalized overview of your financial well-being and allows you to easily access key features of FinTrack."
        />
        <div id="widgets" className="scroll-section">
          <WidgetsSection />
        </div>

        <div id="analytics" className="scroll-section">
          <AnalyticsSection />
        </div>

        <div id="recent-transactions" className="scroll-section">
          <RecentTransactions onAddClick={handleOpenModal} />
        </div>
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
