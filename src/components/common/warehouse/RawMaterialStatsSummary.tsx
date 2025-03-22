// Raw Material Stats Summary Component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const RawMaterialStatsSummary = ({ summary }: { summary: any }) => {
  if (!summary) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white/5 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-white mb-2">إجمالي التكلفة</h3>
        <p className="text-2xl text-emerald-400">{summary.totalCost} ر.س</p>
      </div>
      <div className="bg-white/5 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-white mb-2">
          عدد المنتجات الفريدة
        </h3>
        <p className="text-2xl text-blue-400">{summary.totalUniqueItems}</p>
      </div>
      <div className="bg-white/5 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-white mb-2">
          الكمية الإجمالية
        </h3>
        <p className="text-2xl text-purple-400">{summary.totalQuantity}</p>
      </div>
    </div>
  );
};
