import { useEffect, useState } from "react";
import TransactionsTable from "./ui/TransactionsTable";
import TransactionsControls from "./ui/TransactionsControls";
import { SectionHeader } from "@/shared/ui/SectionHeader";
import AddEditTransactionModal from "@/features/transaction/AddEditTransaction/ui/AddEditTransactionModal";
import { FORM_MODE } from "@/shared/config/modes";
import { useTransactionsStore } from "@/entities/transaction/model/transaction.store";
import { useUserStore } from "@/entities/user/model/user.store";
import { TransactionFormData } from "@/entities/transaction/model/transaction.types";
import { useNotificationsStore } from "@/shared/store/useNotificationsStore";
import { useScrollToSection } from "@/shared/lib/useScrollToSection";

function TransactionsPage() {
  useScrollToSection();
  const {
    fetchTransactions,
    transactions,
    isLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactionsStore();

  const { setNotificationsCount } = useNotificationsStore();

  const [searchQuery, setSearchQuery] = useState("");

  const [dateRange, setDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: null,
    end: null,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<FORM_MODE>(FORM_MODE.ADD);
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionFormData | null>(null);

  const user = useUserStore((s) => s.user);

  // --- FETCH TRANSACTIONS ON USER LOAD ---
  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user, fetchTransactions]);

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setDateRange({ start, end });
  };

  const handleAddClick = () => {
    setModalMode(FORM_MODE.ADD);
    setSelectedTransaction(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (id: string) => {
    const tx = transactions.find((t) => t.id === id);
    if (!tx) return;
    setSelectedTransaction(tx);
    setModalMode(FORM_MODE.EDIT);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    await deleteTransaction(id);
    setNotificationsCount((prev: number) => prev + 1);
    alert("Transaction deleted!");
  };

  const handleModalSubmit = async (data: TransactionFormData) => {
    try {
      let result;
      if (modalMode === FORM_MODE.ADD) {
        const { id, ...rest } = data;
        result = await addTransaction({ ...rest, categoryId: data.categoryId });
      } else if (modalMode === FORM_MODE.EDIT) {
        if (!data.id) return;
        result = await updateTransaction({
          ...data,
          categoryId: data.categoryId,
        });
      }

      setNotificationsCount((prev) => prev + 1);

      alert(
        modalMode === FORM_MODE.ADD
          ? "Transaction added!"
          : "Transaction updated!"
      );

      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section className="transactions">
      <div className="container">
        <SectionHeader
          title="Transactions"
          text="Here you can manage all your transactions: search, filter, add new ones or edit existing ones."
        />
        <TransactionsControls
          onSearchChange={setSearchQuery}
          onDateRangeChange={handleDateRangeChange}
          onAddClick={handleAddClick}
        />
        {isLoading ? (
          <div className="transactions__loading">Loading...</div>
        ) : (
          <div id="transactions-table" className="scroll-section">
            <TransactionsTable
              searchQuery={searchQuery}
              dateRange={dateRange}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          </div>
        )}
        <AddEditTransactionModal
          isOpen={isModalOpen}
          mode={modalMode}
          initialData={selectedTransaction || undefined}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleModalSubmit}
        />
      </div>
    </section>
  );
}

export default TransactionsPage;
