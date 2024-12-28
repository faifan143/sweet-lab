// InvoiceForm.tsx
import { FC } from "react";

interface InvoiceFormProps {
  type: string;
}

const InvoiceForm: FC<InvoiceFormProps> = ({ type }) => {
  if (type === "فاتورة منتجات") {
    return (
      <div>
        <h2>فاتورة منتجات</h2>
        <form>
          <input placeholder="اسم المنتج" className="mb-2 p-2 border" />
          <input placeholder="الكمية" className="mb-2 p-2 border" />
          <input placeholder="السعر" className="mb-2 p-2 border" />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            إرسال
          </button>
        </form>
      </div>
    );
  } else if (type === "مباشرة") {
    return (
      <div>
        <h2>مباشرة</h2>
        <form>
          <input placeholder="المبلغ" className="mb-2 p-2 border" />
          <input placeholder="البيان" className="mb-2 p-2 border" />
          <button type="submit" className="bg-green-500 text-white p-2 rounded">
            إرسال
          </button>
        </form>
      </div>
    );
  } else if (type === "صرف") {
    return (
      <div>
        <h2>صرف</h2>
        <form>
          <input placeholder="المبلغ" className="mb-2 p-2 border" />
          <input placeholder="البيان" className="mb-2 p-2 border" />
          <button type="submit" className="bg-red-500 text-white p-2 rounded">
            إرسال
          </button>
        </form>
      </div>
    );
  }
  return null;
};

export default InvoiceForm;
