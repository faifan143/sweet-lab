// TransactionTypeModal.tsx
import { FC } from "react";

interface TransactionTypeModalProps {
  onClose: () => void;
  onSelect: (type: string) => void;
}

const TransactionTypeModal: FC<TransactionTypeModalProps> = ({
  onClose,
  onSelect,
}) => {
  const handleSelection = (type: string) => {
    onSelect(type);
    onClose(); // Close modal after selection
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">اختر نوع العملية</h2>
        <div className="space-y-4">
          <button
            onClick={() => handleSelection("فاتورة منتجات")}
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            فاتورة منتجات
          </button>
          <button
            onClick={() => handleSelection("مباشرة")}
            className="w-full bg-green-500 text-white py-2 rounded"
          >
            مباشرة
          </button>
          <button
            onClick={() => handleSelection("صرف")}
            className="w-full bg-red-500 text-white py-2 rounded"
          >
            صرف
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionTypeModal;
