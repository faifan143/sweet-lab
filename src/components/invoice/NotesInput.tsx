import React from "react";
import { FileText } from "lucide-react";

interface NotesInputProps {
  notes: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const NotesInput: React.FC<NotesInputProps> = ({ notes, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="block text-slate-200">ملاحظات</label>
      <div className="relative">
        <FileText className="absolute right-3 top-3 h-5 w-5 text-slate-400" />
        <textarea
          name="notes"
          value={notes || ""}
          onChange={onChange}
          className="w-full pl-4 pr-12 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 resize-none h-24"
          placeholder="إضافة ملاحظات..."
        />
      </div>
    </div>
  );
};

export default NotesInput;