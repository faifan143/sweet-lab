import React from "react";

interface TraysCountInputProps {
  trayCount: number | undefined;
  setTrayCount: React.Dispatch<React.SetStateAction<number | undefined>>;
}

const TraysCountInput: React.FC<TraysCountInputProps> = ({ trayCount, setTrayCount }) => {
  return (
    <div className="space-y-2">
      <label className="block text-slate-200">عدد الفوارغ</label>
      <div className="relative">
        <input
          type="number"
          min="0"
          value={trayCount === undefined ? "" : trayCount}
          onChange={(e) => {
            const value = e.target.value === "" ? undefined : Number(e.target.value);
            setTrayCount(value);
          }}
          className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200"
        />
        {trayCount === undefined && (
          <div className="text-red-400 text-sm mt-1">
            يجب إدخال عدد الفوارغ
          </div>
        )}
      </div>
    </div>
  );
};

export default TraysCountInput;