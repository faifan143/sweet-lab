import { motion } from "framer-motion";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import ActionButton from "./ActionButtons";

interface TableItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface TabContentProps {
  type: string;
  onAddIncome: () => void;
  onAddExpense: () => void;
}

const TabContent: React.FC<TabContentProps> = ({
  type,
  onAddIncome,
  onAddExpense,
}) => {
  const tableData: { [key: string]: TableItem[] } = {
    بسطة: [
      { id: 1, name: "منتج 1", quantity: 50, price: 100 },
      { id: 2, name: "منتج 2", quantity: 30, price: 150 },
    ],
    جامعة: [
      { id: 1, name: "كتاب", quantity: 20, price: 200 },
      { id: 2, name: "قرطاسية", quantity: 100, price: 50 },
    ],
    عام: [
      { id: 1, name: "منتج عام 1", quantity: 75, price: 80 },
      { id: 2, name: "منتج عام 2", quantity: 60, price: 120 },
    ],
  };

  return (
    <div>
      {/* Context-specific action buttons */}
      <div className="flex justify-end gap-4 mb-6 mt-6">
        <ActionButton
          icon={<ArrowUpCircle className="h-5 w-5" />}
          label={`اضافة دخل ${type}`}
          onClick={onAddIncome}
          variant="income"
        />
        <ActionButton
          icon={<ArrowDownCircle className="h-5 w-5" />}
          label={`اضافة خرج ${type}`}
          onClick={onAddExpense}
          variant="expense"
        />
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="overflow-x-auto"
      >
        <table className="w-full text-right">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="p-3 text-slate-300">المعرف</th>
              <th className="p-3 text-slate-300">الاسم</th>
              <th className="p-3 text-slate-300">الكمية</th>
              <th className="p-3 text-slate-300">السعر</th>
            </tr>
          </thead>
          <tbody>
            {tableData[type].map((item) => (
              <tr key={item.id} className="border-b border-slate-700/50">
                <td className="p-3 text-slate-300">{item.id}</td>
                <td className="p-3 text-slate-300">{item.name}</td>
                <td className="p-3 text-slate-300">{item.quantity}</td>
                <td className="p-3 text-slate-300">${item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default TabContent;
