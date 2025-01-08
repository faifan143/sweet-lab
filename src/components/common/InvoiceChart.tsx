"use client";
import {
  formatAmount,
  useInvoiceStats,
} from "@/hooks/invoices/useInvoiceStats";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const InvoiceCharts = () => {
  const { data: stats, isLoading } = useInvoiceStats();

  if (isLoading) {
    return (
      <div className="h-[240px] flex items-center justify-center">
        <div className="animate-spin h-6 w-6 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const pieData = [
    { name: "مدفوع", value: stats?.paidInvoices || 0, color: "#10B981" },
    {
      name: "قيد الانتظار",
      value: stats?.unpaidInvoices || 0,
      color: "#FBBF24",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Revenue Chart */}
      <div className="bg-slate-700/30 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">
          إيرادات الأسبوع
        </h3>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={stats?.weeklyData}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#334155"
              />
              <XAxis
                dataKey="name"
                stroke="#94A3B8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#94A3B8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${formatAmount(value)} ل.س`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-lg">
                        <p className="text-slate-400">{label}</p>
                        <p className="text-emerald-400 font-semibold">
                          {formatAmount(payload[0].value as number)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#10B981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorTotal)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status Distribution Chart */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-700/30 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">
            توزيع حالات الفواتير
          </h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="transparent"
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-lg">
                          <p className="text-slate-400">{payload[0].name}</p>
                          <p
                            className="text-lg font-semibold"
                            style={{ color: payload[0].payload.color }}
                          >
                            {formatAmount(payload[0].value as number)}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex justify-center gap-4 mt-4">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-slate-400">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="space-y-4">
          <div className="bg-slate-700/30 rounded-lg p-4">
            <p className="text-sm text-slate-400 mb-1">إجمالي المبيعات</p>
            <p className="text-2xl font-semibold text-emerald-400">
              {stats?.totalAmount ? formatAmount(stats.totalAmount) : "0.00"}
            </p>

            <div className="flex items-center gap-1 text-sm text-emerald-400 mt-1">
              <span>↑ 12%</span>
              <span className="text-slate-400">من الأسبوع الماضي</span>
            </div>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-4">
            <p className="text-sm text-slate-400 mb-1">متوسط قيمة الفاتورة</p>
            <p className="text-2xl font-semibold text-blue-400">
              {stats?.averageAmount
                ? formatAmount(stats.averageAmount)
                : "0.00"}
            </p>
            <div className="flex items-center gap-1 text-sm text-blue-400 mt-1">
              <span>↑ 8%</span>
              <span className="text-slate-400">من الشهر الماضي</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceCharts;
