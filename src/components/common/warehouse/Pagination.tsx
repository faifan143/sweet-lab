// Pagination Component
export const Pagination = ({
  totalCount,
  currentPage,
  onPageChange,
}: {
  totalCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}) => {
  const totalPages = Math.ceil(totalCount / 10);

  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex justify-center items-center gap-4" dir="rtl">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-lg bg-white/5 text-white disabled:opacity-50 hover:bg-white/10 transition-colors"
      >
        السابق
      </button>

      <div className="flex items-center gap-2" dir="rtl">
        <span className="text-white">الصفحة</span>
        <select
          value={currentPage}
          onChange={(e) => onPageChange(Number(e.target.value))}
          className="bg-white/5 border border-white/10 rounded-lg text-white px-2 py-1"
        >
          {[...Array(totalPages)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
        <span className="text-white">من {totalPages}</span>
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-lg bg-white/5 text-white disabled:opacity-50 hover:bg-white/10 transition-colors"
      >
        التالي
      </button>
    </div>
  );
};
