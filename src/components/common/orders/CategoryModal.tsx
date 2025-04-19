import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useCreateOrderCategory } from '@/hooks/useOrders';

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose }) => {
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const { mutate: createCategory, isPending } = useCreateOrderCategory();

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!name.trim()) return;

        createCategory({
            name: name.trim(),
            description: description.trim()
        }, {
            onSuccess: () => {
                onClose();
                setName('');
                setDescription('');
            }
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div
                className="bg-slate-800 rounded-lg shadow-xl w-full max-w-md"
                dir="rtl"
            >
                <div className="flex justify-between items-center p-4 border-b border-slate-700">
                    <h3 className="text-lg font-semibold text-slate-200">إضافة تصنيف جديد</h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-200 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4">
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                            اسم التصنيف *
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-slate-700/30 border border-slate-600 rounded-lg p-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="أدخل اسم التصنيف"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
                            الوصف
                        </label>
                        <textarea
                            id="description"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-slate-700/30 border border-slate-600 rounded-lg p-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="أدخل وصف التصنيف (اختياري)"
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-lg text-sm transition-colors"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            disabled={isPending || !name.trim()}
                            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
                        >
                            {isPending ? 'جاري الحفظ...' : 'حفظ التصنيف'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryModal;