"use client";
import CustomerModal from "@/components/common/customers/CustomerModal";
import CustomerSummaryModal from "@/components/common/customers/CustomerSummaryModal";
import Navbar from "@/components/common/Navbar";
import PageSpinner from "@/components/common/PageSpinner";
import SplineBackground from "@/components/common/SplineBackground";
import CustomerCategoryModal from "@/components/common/customers/CustomerCategoryModal";
import { useFetchCustomers } from "@/hooks/customers/useCustomers";
import { useFetchCategories } from "@/hooks/customers/useCustomersCategories";
import { AllCustomerType } from "@/types/customers.type";
import { CustomerCategory } from "@/types/customerCategories.types";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Edit,
  FileText,
  Filter,
  LayoutGrid,
  Loader2,
  Phone,
  Plus,
  Search,
  Tag,
  Trash2,
  Undo2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

// Format currency function
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("ar-SY", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(amount);
};

// Main Customers Page Component
const Customers = () => {
  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterByDebt, setFilterByDebt] = useState(false);
  const [filterByCategoryId, setFilterByCategoryId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // State for customer operations modal
  const [customerModalConfig, setCustomerModalConfig] = useState<{
    isOpen: boolean;
    mode: "create" | "update" | "delete";
    customerData: AllCustomerType | null;
  }>({
    isOpen: false,
    mode: "create",
    customerData: null,
  });

  // State for category operations modal
  const [categoryModalConfig, setCategoryModalConfig] = useState<{
    isOpen: boolean;
    mode: "create" | "update" | "delete";
    categoryData: CustomerCategory | null;
  }>({
    isOpen: false,
    mode: "create",
    categoryData: null,
  });

  // Fetch customers using the provided hook
  const { data: customersData = [], isLoading: isLoadingCustomers, error: customersError } = useFetchCustomers();

  // Fetch categories using the provided hook
  const { data: categoriesData = [], isLoading: isLoadingCategories } = useFetchCategories();

  const customers = useMemo(() => {
    return customersData.map((customer) => {
      // Calculate total debt from active debts
      const totalDebt = customer.debts
        .filter((debt) => debt.status === "active")
        .reduce((sum, debt) => sum + debt.remainingAmount, 0);

      return {
        ...customer,
        totalDebt,
      };
    });
  }, [customersData]);

  const itemsPerPage = 12;

  // Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterByDebt, filterByCategoryId]);

  // Filter and paginate customers
  const filteredCustomers = customers.filter((customer) => {
    // Apply search filter
    const searchMatch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchTerm.toLowerCase());

    // Apply debt filter
    const debtMatch = filterByDebt ? customer.totalDebt > 0 : true;

    // Apply category filter
    const categoryMatch = filterByCategoryId
      ? customer.categoryId === filterByCategoryId
      : true;

    return searchMatch && debtMatch && categoryMatch;
  });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Edit category handler
  const handleEditCategory = (category: CustomerCategory) => {
    setCategoryModalConfig({
      isOpen: true,
      mode: "update",
      categoryData: category,
    });
  };

  // Delete category handler
  const handleDeleteCategory = (category: CustomerCategory) => {
    setCategoryModalConfig({
      isOpen: true,
      mode: "delete",
      categoryData: category,
    });
  };

  const handleViewCustomer = (customerId: number) => {
    setSelectedCustomerId(customerId);
    setIsCustomerModalOpen(true);
  };

  // Handler for adding new customer
  const handleAddCustomer = () => {
    setCustomerModalConfig({
      isOpen: true,
      mode: "create",
      customerData: null,
    });
  };

  // Handler for editing customer
  const handleEditCustomer = (
    customer: AllCustomerType,
    e: React.MouseEvent
  ) => {
    e.stopPropagation(); // Prevent triggering view customer modal
    setCustomerModalConfig({
      isOpen: true,
      mode: "update",
      customerData: customer,
    });
  };

  // Handler for deleting customer
  const handleDeleteCustomer = (
    customer: AllCustomerType,
    e: React.MouseEvent
  ) => {
    e.stopPropagation(); // Prevent triggering view customer modal
    setCustomerModalConfig({
      isOpen: true,
      mode: "delete",
      customerData: customer,
    });
  };

  // Handler for adding new category
  const handleAddCategory = () => {
    setCategoryModalConfig({
      isOpen: true,
      mode: "create",
      categoryData: null,
    });
  };

  // Listen for custom event to open the category modal
  useEffect(() => {
    const handleAddCategoryEvent = () => handleAddCategory();
    window.addEventListener('add-category', handleAddCategoryEvent);
    return () => {
      window.removeEventListener('add-category', handleAddCategoryEvent);
    };
  }, []);

  // Close the customer operations modal
  const closeCustomerModal = () => {
    setCustomerModalConfig((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  // Close the category operations modal
  const closeCategoryModal = () => {
    setCategoryModalConfig((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  // Toggle category filter
  const toggleCategoryFilter = (categoryId: number) => {
    if (filterByCategoryId === categoryId) {
      // If clicking the already selected category, clear the filter
      setFilterByCategoryId(null);
    } else {
      // Otherwise, set the filter to this category
      setFilterByCategoryId(categoryId);
    }
  };

  const isLoading = isLoadingCustomers || isLoadingCategories;
  const error = customersError;

  return (
    <div className="min-h-screen bg-slate-900 relative transition-colors duration-300">
      {isLoading && <PageSpinner />}
      <SplineBackground activeTab="customers" />

      <div className="relative z-10">
        <Navbar />

        <main className="py-16 p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Page Header */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-white mb-2">
                إدارة العملاء
              </h1>
              <p className="text-slate-400">
                عرض وإدارة بيانات العملاء وحساباتهم
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mb-6 flex justify-center gap-4">
              <button
                onClick={handleAddCustomer}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg 
                        bg-blue-500 text-white hover:bg-blue-600 transition-colors
                        shadow-lg shadow-blue-500/20"
                dir="rtl"
              >
                <Plus className="h-5 w-5" />
                إضافة عميل جديد
              </button>

              <button
                onClick={handleAddCategory}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg 
                        bg-purple-500 text-white hover:bg-purple-600 transition-colors
                        shadow-lg shadow-purple-500/20"
                dir="rtl"
              >
                <Tag className="h-5 w-5" />
                إضافة تصنيف
              </button>
            </div>

            {/* Search and Filters */}
            <div
              className="mb-8 flex flex-col md:flex-row gap-4 px-4"
              dir="rtl"
            >
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="بحث عن عميل..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 pr-10 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Filter by debt */}
              <button
                onClick={() => setFilterByDebt(!filterByDebt)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${filterByDebt
                  ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30"
                  : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
                  }`}
              >
                <Filter className="h-5 w-5" />
                عملاء لديهم ديون
              </button>

              {/* View Toggle */}
              <div className="flex rounded-lg overflow-hidden border border-white/10">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center gap-2 px-4 py-2 transition-colors ${viewMode === "grid"
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-white/5 text-white hover:bg-white/10"
                    }`}
                >
                  <LayoutGrid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`flex items-center gap-2 px-4 py-2 transition-colors ${viewMode === "table"
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-white/5 text-white hover:bg-white/10"
                    }`}
                >
                  <FileText className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Categories Filter */}
            {categoriesData.length > 0 && (
              <div className="mb-6" dir="rtl">

                <div className="overflow-x-auto no-scrollbar">
                  <div className="flex gap-2 px-4 pb-2">
                    {categoriesData.map((category) => (
                      <div key={category.id} className="relative group">
                        <button
                          onClick={() => toggleCategoryFilter(category.id)}
                          className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-sm transition-colors ${filterByCategoryId === category.id
                            ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                            : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
                            }`}
                        >
                          <Tag className="h-3.5 w-3.5 inline-block mx-1.5" />
                          {category.name}
                        </button>
                        <div className="absolute right-0 top-full mt-1 hidden group-hover:block bg-slate-800 rounded-lg shadow-lg border border-slate-700 z-10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditCategory(category);
                            }}
                            className="w-full text-right px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700 rounded-t-lg"
                          >
                            <Edit className="h-3 w-3 inline-block mx-1.5" />
                            تعديل
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCategory(category);
                            }}
                            className="w-full text-right px-3 py-1.5 text-xs text-red-400 hover:bg-slate-700 rounded-b-lg"
                          >
                            <Trash2 className="h-3 w-3 inline-block mx-1.5" />
                            حذف
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Customers Content */}
            <div className="container mx-auto px-4" dir="rtl">
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-10 w-10 text-blue-400 animate-spin" />
                </div>
              ) : error ? (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-8 text-center">
                  <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-red-400 mb-2">
                    خطأ في تحميل البيانات
                  </h3>
                  <p className="text-slate-300">
                    حدث خطأ أثناء تحميل بيانات العملاء. يرجى المحاولة مرة أخرى.
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                  >
                    <Undo2 className="h-4 w-4 inline-block mx-2" />
                    إعادة تحميل
                  </button>
                </div>
              ) : paginatedCustomers.length === 0 ? (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 text-center text-gray-400">
                  {searchTerm || filterByDebt || filterByCategoryId
                    ? "لا توجد نتائج للبحث"
                    : "لا يوجد عملاء"}
                </div>
              ) : viewMode === "grid" ? (
                // Grid View
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <AnimatePresence>
                    {paginatedCustomers.map((customer, index) => (
                      <motion.div
                        key={customer.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-sm border border-white/10 rounded-xl p-6 
                                  hover:shadow-lg hover:shadow-blue-500/5 hover:border-blue-500/30 transition-all duration-300"
                        onClick={() => handleViewCustomer(customer.id)}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-medium text-white line-clamp-1">
                            {customer.name}
                          </h3>
                          {customer.totalDebt > 0 && (
                            <div className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                              {formatCurrency(customer.totalDebt)} ل.س
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-3 mb-4">
                          <Phone className="w-5 h-5 text-blue-500" />
                          <div>
                            <div className="text-sm text-gray-400">
                              رقم الهاتف
                            </div>
                            <div className="text-white" dir="ltr">
                              {customer.phone}
                            </div>
                          </div>
                        </div>

                        {customer.category && (
                          <div className="mb-6 flex">
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                              <Tag className="h-3 w-3 inline-block mx-1" />
                              {customer.category.name}
                            </span>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewCustomer(customer.id);
                            }}
                            className="flex-1 flex items-center justify-center gap-2 px-2 py-2 rounded-lg 
                                    bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors
                                    border border-blue-500/20"
                          >
                            <FileText className="w-4 h-4" />
                            عرض
                          </button>
                          <button
                            onClick={(e) => handleEditCustomer(customer, e)}
                            className="flex-1 flex items-center justify-center gap-2 px-2 py-2 rounded-lg 
                                    bg-slate-600/30 text-slate-300 hover:bg-slate-600/50 transition-colors
                                    border border-slate-600/30"
                          >
                            <Edit className="w-4 h-4" />
                            تعديل
                          </button>
                          <button
                            onClick={(e) => handleDeleteCustomer(customer, e)}
                            className="flex items-center justify-center gap-2 px-2 py-2 rounded-lg 
                                    bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors
                                    border border-red-500/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                // Table View
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-700/50">
                      <tr>
                        <th className="text-right text-slate-200 p-4">الاسم</th>
                        <th className="text-right text-slate-200 p-4">
                          رقم الهاتف
                        </th>
                        <th className="text-right text-slate-200 p-4">
                          التصنيف
                        </th>
                        <th className="text-right text-slate-200 p-4">
                          الديون
                        </th>
                        <th className="text-right text-slate-200 p-4">
                          الإجراءات
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedCustomers.map((customer) => (
                        <tr
                          key={customer.id}
                          className="border-t border-white/10 hover:bg-slate-700/20 transition-colors"
                          onClick={() => handleViewCustomer(customer.id)}
                        >
                          <td className="p-4 text-slate-300 font-medium">
                            {customer.name}
                          </td>
                          <td className="p-4 text-slate-300" dir="ltr">
                            {customer.phone}
                          </td>
                          <td className="p-4">
                            {customer.category ? (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                {customer.category.name}
                              </span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                          <td className="p-4">
                            {customer.totalDebt > 0 ? (
                              <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                                {formatCurrency(customer.totalDebt)} ل.س
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-full text-sm font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                لا يوجد
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            <div
                              className="flex gap-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => handleViewCustomer(customer.id)}
                                className="flex items-center gap-1 px-2 py-1.5 rounded-lg 
                                        bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors
                                        border border-blue-500/20 text-sm"
                              >
                                <FileText className="w-3 h-3" />
                                عرض
                              </button>
                              <button
                                onClick={(e) => handleEditCustomer(customer, e)}
                                className="flex items-center gap-1 px-2 py-1.5 rounded-lg 
                                        bg-slate-600/30 text-slate-300 hover:bg-slate-600/50 transition-colors
                                        border border-slate-600/30 text-sm"
                              >
                                <Edit className="w-3 h-3" />
                                تعديل
                              </button>
                              <button
                                onClick={(e) =>
                                  handleDeleteCustomer(customer, e)
                                }
                                className="flex items-center gap-1 px-2 py-1.5 rounded-lg 
                                        bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors
                                        border border-red-500/20 text-sm"
                              >
                                <Trash2 className="w-3 h-3" />
                                حذف
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                className="mt-8 flex justify-center items-center gap-4"
                dir="rtl"
              >
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-white/5 text-white disabled:opacity-50 hover:bg-white/10 transition-colors border border-white/10"
                >
                  السابق
                </button>

                <div className="flex items-center gap-2" dir="rtl">
                  <span className="text-white">الصفحة</span>
                  <select
                    value={currentPage}
                    onChange={(e) => setCurrentPage(Number(e.target.value))}
                    className="bg-white/5 border border-white/10 rounded-lg text-white px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
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
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-4 py-2 rounded-lg bg-white/5 text-white disabled:opacity-50 hover:bg-white/10 transition-colors border border-white/10"
                >
                  التالي
                </button>
              </div>
            )}

            {/* Results count */}
            <div className="mt-4 text-center text-gray-400">
              إجمالي النتائج: {filteredCustomers.length}
            </div>
          </div>
        </main>
      </div>

      {/* Customer Summary Modal */}
      <CustomerSummaryModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        customerId={selectedCustomerId}
      />

      {/* Customer Operations Modal (Create/Update/Delete) */}
      <CustomerModal
        isOpen={customerModalConfig.isOpen}
        onClose={closeCustomerModal}
        mode={customerModalConfig.mode}
        customerData={customerModalConfig.customerData}
        categories={categoriesData}
      />

      {/* Category Operations Modal (Create/Update/Delete) */}
      <CustomerCategoryModal
        isOpen={categoryModalConfig.isOpen}
        onClose={closeCategoryModal}
        mode={categoryModalConfig.mode}
        categoryData={categoryModalConfig.categoryData}
      />
    </div>
  );
};

export default Customers;