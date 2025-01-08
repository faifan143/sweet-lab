/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import InvoiceCharts from "@/components/common/InvoiceChart";
import Navbar from "@/components/common/Navbar";
import PageSpinner from "@/components/common/PageSpinner";
import SplineBackground from "@/components/common/SplineBackground";
import { useFunds, useTransferToMain } from "@/hooks/funds/useFunds";
import {
  formatAmount,
  useInvoiceStats,
} from "@/hooks/invoices/useInvoiceStats";
import { useUsers } from "@/hooks/users/useUsers";
import { Role } from "@/types/types";
import { apiClient } from "@/utils/axios";
import { motion } from "framer-motion";
import {
  ArrowRightLeft,
  BarChart3,
  CheckCircle,
  ChevronDown,
  CircleDollarSign,
  Clock,
  DollarSign,
  Eye,
  Loader2,
  PlusCircle,
  Receipt,
  UserPlus,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

// Typesconst
const rolesOptions = [
  { label: "مدير", value: "MANAGER" },
  { label: "مسؤول", value: "ADMIN" },
  { label: "موظف", value: "EMPLOYEE" },
];

interface TransactionHistory {
  id: number;
  date: Date;
  amount: number;
  type: "transfer" | "deposit" | "withdrawal";
  description: string;
}

interface SectionProps {
  id: string;
  title: string;
  icon: any;
  defaultExpanded?: boolean;
  children: React.ReactNode;
}

// Section Component
const Section = ({
  title,
  icon: Icon,
  defaultExpanded = false,
  children,
}: SectionProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 overflow-hidden">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-700/30"
      >
        <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
          <Icon className="h-5 w-5 text-slate-400" />
          {title}
        </h2>
        <ChevronDown
          className={`h-5 w-5 text-slate-400 transform transition-transform duration-300 sm:hidden ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </div>

      {(isExpanded || window.innerWidth >= 640) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="p-4 border-t border-slate-700/50"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
};

const Page = () => {
  // States
  const [transferAmount, setTransferAmount] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<TransactionHistory[]>([
    {
      id: 1,
      date: new Date(),
      amount: 1000,
      type: "transfer",
      description: "تحويل إلى الخزينة",
    },
    {
      id: 2,
      date: new Date(Date.now() - 86400000),
      amount: 500,
      type: "deposit",
      description: "إيداع نقدي",
    },
  ]);
  const transgerToMain = useTransferToMain();
  const {
    data: fundsData,
    isSuccess: fundsSuccess,
    isLoading: isLoadingFunds,
  } = useFunds();

  useEffect(() => {
    if (fundsSuccess) {
      console.log("funds : ", fundsData);
    }
  }, [fundsData, fundsSuccess]);
  const { data: users, isLoading: isLoadingUsers } = useUsers();
  const { data: invoiceStats, isLoading: isLoadingInvoices } =
    useInvoiceStats();

  // Handlers
  const handleAddUser = async () => {
    if (!username) {
      alert("Please enter a username.");
      return;
    }

    setIsLoading(true);

    try {
      await apiClient.post("/users", {
        username,
        password: password,
        roles: selectedRoles,
      });
      alert("User added successfully!");
      setUsername("");
    } catch (error: any) {
      console.error(error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransferFunds = async () => {
    const amount = Number(transferAmount);
    if (!amount || amount <= 0) return;

    const generalFund =
      fundsData?.find((f) => f.fundType === "general")?.currentBalance || 0;

    if (amount > generalFund) {
      alert("رصيد غير كافي في الصندوق العام");
      return;
    }

    try {
      await transgerToMain.mutateAsync({ amount });

      // Add to transactions history
      setTransactions((prev) => [
        {
          id: prev.length + 1,
          date: new Date(),
          amount,
          type: "transfer",
          description: "تحويل إلى الخزينة",
        },
        ...prev,
      ]);

      setTransferAmount("");
    } catch (error) {
      console.error("Error transferring funds:", error);
      alert("حدث خطأ أثناء التحويل");
    }
  };

  // Stats data
  const statsData = [
    {
      icon: Receipt,
      label: "الصندوق البسطة",
      value: fundsData?.find((fund) => fund.fundType == "booth")
        ?.currentBalance,
      color: "text-slate-200",
    },
    {
      icon: Receipt,
      label: "الصندوق الجامعة",
      value: fundsData?.find((fund) => fund.fundType == "university")
        ?.currentBalance,
      color: "text-slate-200",
    },
    {
      icon: Receipt,
      label: "الصندوق العام",
      value: fundsData?.find((fund) => fund.fundType == "general")
        ?.currentBalance,
      color: "text-slate-200",
    },
    {
      icon: CircleDollarSign,
      label: "إجمالي الأموال",
      value: fundsData
        ? fundsData.reduce((acc, fund) => acc + fund.currentBalance, 0)
        : "0",
      color: "text-emerald-400",
    },
  ];

  return (
    <div className="min-h-screen bg-background relative transition-colors duration-300">
      <SplineBackground activeTab="عام" />
      {isLoadingFunds && <PageSpinner />}
      <div className="relative z-10">
        <Navbar />
        <main className="py-24 sm:py-32 px-4 sm:px-6" dir="rtl">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Stats Overview */}
            <Section
              id="overview"
              title="نظرة عامة"
              icon={BarChart3}
              defaultExpanded
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {statsData.map((stat, index) => (
                  <div key={index} className="bg-slate-700/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <stat.icon className="h-4 w-4" />
                      <span className="text-sm">{stat.label}</span>
                    </div>
                    <p
                      className={`text-xl sm:text-2xl font-semibold ${stat.color}`}
                    >
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </Section>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* User Management */}
                <Section id="users" title="إدارة المستخدمين" icon={UserPlus}>
                  <div className="space-y-4">
                    {/* Add User Form */}
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Username Input */}
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="اسم المستخدم"
                          className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-emerald-500/50"
                        />

                        {/* Password Input */}
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="كلمة المرور"
                          className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-emerald-500/50"
                        />
                      </div>
                      {/* Roles Selection */}
                      <div className="flex flex-wrap gap-2">
                        {rolesOptions.map((role) => (
                          <button
                            key={role.value}
                            onClick={() => {
                              setSelectedRoles((prev) =>
                                prev.includes(role.value as Role)
                                  ? prev.filter((r) => r !== role.value)
                                  : [...prev, role.value as Role]
                              );
                            }}
                            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                              selectedRoles.includes(role.value as Role)
                                ? "bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/50"
                                : "bg-slate-700/50 text-slate-300 border-2 border-transparent hover:border-slate-600/50"
                            }`}
                          >
                            {role.label}
                          </button>
                        ))}
                      </div>
                      {/* Add Button */}
                      <button
                        onClick={handleAddUser}
                        disabled={
                          isLoading ||
                          !username ||
                          !password ||
                          selectedRoles.length === 0
                        }
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <PlusCircle className="h-5 w-5" />
                        )}
                        <span>إضافة مستخدم جديد</span>
                      </button>
                    </div>

                    {/* Users List */}
                    <div className="mt-4 space-y-2 max-h-[400px] overflow-y-auto no-scrollbar">
                      {isLoadingUsers ? (
                        <div className="flex justify-center py-4">
                          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                        </div>
                      ) : users && users.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {users.map((user) => (
                            <div
                              key={user.id}
                              className="bg-slate-700/30 rounded-lg p-4 transition-all hover:bg-slate-700/40"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="bg-slate-600/50 p-2 rounded-lg">
                                    <Users className="h-5 w-5 text-slate-300" />
                                  </div>
                                  <div>
                                    <p className="text-slate-200 font-medium">
                                      {user.username}
                                    </p>
                                    <p className="text-sm text-slate-400">
                                      {new Date(
                                        user.createdAt
                                      ).toLocaleDateString("ar-SA")}
                                    </p>
                                  </div>
                                </div>
                                <button className="p-2 hover:bg-slate-600/30 rounded-lg transition-colors">
                                  <Eye className="h-4 w-4 text-blue-400" />
                                </button>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                {user.roles.map((role, index) => (
                                  <span
                                    key={index}
                                    className={`text-xs px-2 py-1 rounded-full ${
                                      role === "ADMIN"
                                        ? "bg-red-400/10 text-red-400"
                                        : role === "MANAGER"
                                        ? "bg-blue-400/10 text-blue-400"
                                        : "bg-emerald-400/10 text-emerald-400"
                                    }`}
                                  >
                                    {role === "ADMIN"
                                      ? "مسؤول"
                                      : role === "MANAGER"
                                      ? "مدير"
                                      : "موظف"}
                                  </span>
                                ))}
                              </div>

                              <div className="mt-3 pt-3 border-t border-slate-600/30">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-slate-400">
                                    آخر تحديث:
                                  </span>
                                  <span className="text-slate-300">
                                    {new Date(
                                      user.updatedAt
                                    ).toLocaleDateString("ar-SA")}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-slate-400">
                          لا يوجد مستخدمين حالياً
                        </div>
                      )}
                    </div>
                  </div>
                </Section>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Fund Management */}
                <Section id="funds" title="إدارة الأموال" icon={ArrowRightLeft}>
                  <div className="space-y-6">
                    {/* Fund Balances */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-slate-700/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-slate-400 mb-1">
                          <DollarSign className="h-4 w-4" />
                          <span className="text-sm">رصيد الصندوق العام</span>
                        </div>
                        <p className="text-xl sm:text-2xl font-semibold text-slate-200">
                          {fundsData
                            ? fundsData.find((f) => f.fundType === "general")
                                ?.currentBalance || 0
                            : "0"}
                        </p>
                      </div>

                      <div className="bg-slate-700/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-slate-400 mb-1">
                          <DollarSign className="h-4 w-4" />
                          <span className="text-sm">رصيد الخزينة</span>
                        </div>
                        <p className="text-xl sm:text-2xl font-semibold text-slate-200">
                          {fundsData
                            ? fundsData.find((f) => f.fundType === "main")
                                ?.currentBalance || 0
                            : "0"}
                        </p>
                      </div>
                    </div>

                    {/* Transfer Form */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <input
                        type="number"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                        placeholder="المبلغ المراد تحويله"
                        className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-emerald-500/50"
                      />
                      <button
                        onClick={handleTransferFunds}
                        className="flex items-center justify-center gap-2 px-6 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors"
                      >
                        <ArrowRightLeft className="h-5 w-5" />
                        <span>تحويل</span>
                      </button>
                    </div>

                    {/* Transaction History */}
                    <div>
                      <h3 className="text-md font-semibold text-slate-200 mb-4">
                        سجل المعاملات
                      </h3>
                      <div className="space-y-3 max-h-[300px] overflow-y-auto no-scrollbar">
                        {transactions.map((transaction) => (
                          <div
                            key={transaction.id}
                            className="bg-slate-700/30 rounded-lg p-3 flex items-center justify-between"
                          >
                            <div>
                              <p className="text-slate-200">
                                {transaction.description}
                              </p>
                              <p className="text-sm text-slate-400">
                                {new Date(transaction.date).toLocaleDateString(
                                  "ar-SA"
                                )}
                              </p>
                            </div>
                            <p
                              className={`font-semibold ${
                                transaction.type === "deposit"
                                  ? "text-emerald-400"
                                  : transaction.type === "withdrawal"
                                  ? "text-red-400"
                                  : "text-blue-400"
                              }`}
                            >
                              {transaction.type === "withdrawal" ? "-" : ""}$
                              {transaction.amount.toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Section>

                {/* Invoice Stats */}
                <Section id="invoices" title="متابعة الفواتير" icon={Receipt}>
                  <div className="space-y-6">
                    {isLoadingInvoices ? (
                      <div className="flex justify-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-slate-700/30 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-emerald-400 mb-1">
                              <CheckCircle className="h-4 w-4" />
                              <span className="text-sm">المدفوعة</span>
                            </div>
                            <p className="text-xl sm:text-2xl font-semibold text-emerald-400">
                              {invoiceStats?.paidInvoices || 0}
                            </p>
                            <p className="text-sm text-slate-400">
                              من أصل {invoiceStats?.totalInvoices || 0} فاتورة
                            </p>
                          </div>

                          <div className="bg-slate-700/30 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-yellow-400 mb-1">
                              <Clock className="h-4 w-4" />
                              <span className="text-sm">قيد الانتظار</span>
                            </div>
                            <p className="text-xl sm:text-2xl font-semibold text-yellow-400">
                              {invoiceStats?.unpaidInvoices || 0}
                            </p>
                            <p className="text-sm text-slate-400">
                              بقيمة {invoiceStats?.unpaidAmount || 0}
                            </p>
                          </div>
                        </div>

                        {/* Chart Area */}
                        <div className="bg-slate-700/30 rounded-lg p-4">
                          <InvoiceCharts />
                        </div>

                        {/* Additional Stats */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-700/30 rounded-lg p-4">
                            <p className="text-sm text-slate-400 mb-1">
                              معدل التحصيل
                            </p>
                            <p className="text-xl font-semibold text-blue-400">
                              {Math.round(invoiceStats?.collectionRate || 0)}%
                            </p>
                          </div>
                          <div className="bg-slate-700/30 rounded-lg p-4">
                            <p className="text-sm text-slate-400 mb-1">
                              متوسط القيمة
                            </p>
                            <p className="text-xl font-semibold text-purple-400">
                              {formatAmount(invoiceStats?.averageAmount || 0)}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </Section>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;
