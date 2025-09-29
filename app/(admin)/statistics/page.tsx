"use client";
import { Card } from "@/components/ui/card";
import { Line } from "react-chartjs-2";
import { FaBox, FaChartLine, FaClock, FaUser } from "react-icons/fa";

const PageStatistics = () => {


  const stats = [
    {
      label: "Total Users",
      value: "489",
      icon: <FaUser />,
      color: "bg-white/80 backdrop-blur-sm border border-purple-200/60",
      iconBg: "bg-gradient-to-r from-purple-500 to-violet-500",
      change: "+8.5% Up from yesterday",
      trendColor: "text-emerald-600",
      glowColor: "shadow-purple-200/30",
    },
    {
      label: "Total Mentors",
      value: "293",
      icon: <FaBox />,
      color: "bg-white/80 backdrop-blur-sm border border-orange-200/60",
      iconBg: "bg-gradient-to-r from-orange-500 to-amber-500",
      change: "+1.3% Up from past week",
      trendColor: "text-emerald-600",
      glowColor: "shadow-orange-200/30",
    },
    {
      label: "Total Services Packages",
      value: "10",
      icon: <FaChartLine />,
      color: "bg-white/80 backdrop-blur-sm border border-emerald-200/60",
      iconBg: "bg-gradient-to-r from-emerald-500 to-green-500",
      change: "-4.3% Down from yesterday",
      trendColor: "text-red-500",
      glowColor: "shadow-emerald-200/30",
    },
    {
      label: "Total Revenue",
      value: "$2,040",
      icon: <FaClock />,
      color: "bg-white/80 backdrop-blur-sm border border-cyan-200/60",
      iconBg: "bg-gradient-to-r from-cyan-500 to-blue-500",
      change: "+1.8% Up from yesterday",
      trendColor: "text-emerald-600",
      glowColor: "shadow-cyan-200/30",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-cyan-700 bg-clip-text text-transparent mb-2">Dashboard Statistics</h1>
        <p className="text-slate-600">Tổng quan về hoạt động và hiệu suất hệ thống</p>
      </div>
    
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className={`p-6 flex flex-col gap-3 ${stat.color} shadow-lg ${stat.glowColor} cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 hover:border-opacity-40`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`rounded-xl p-3 text-white text-xl ${stat.iconBg} shadow-lg`}
              >
                {stat.icon}
              </div>
              <span className="font-semibold text-slate-600 text-sm">{stat.label}</span>
            </div>
            <span className="text-3xl font-bold mt-2 text-slate-800">{stat.value}</span>
            <span className={`text-xs mt-1 font-medium ${stat.trendColor}`}>
              {stat.change}
            </span>
          </Card>
        ))}
      </div>
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-800 mb-1">Learner Package Purchases</h2>
            <p className="text-slate-600 text-sm">Theo dõi doanh thu theo tháng</p>
          </div>

          <select className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all">
            {Array.from({ length: 10 }, (_, i) => {
              const year = 2025 + i;
              return <option key={year} className="bg-white">{year}</option>;
            })}
          </select>
        </div>
        <div className="h-80 bg-slate-50/50 rounded-xl p-4">
          <Line
            data={{
              labels: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
              ],
              datasets: [
                {
                  label: "Sales",
                  data: [20, 40, 35, 50, 64, 30, 45, 60, 55, 48],
                  borderColor: "#06b6d4",
                  backgroundColor: "rgba(6,182,212,0.1)",
                  tension: 0.4,
                  fill: true,
                  pointBackgroundColor: "#06b6d4",
                  pointBorderColor: "#0891b2",
                  pointHoverBackgroundColor: "#67e8f9",
                  pointHoverBorderColor: "#0891b2",
                  borderWidth: 3,
                  pointRadius: 5,
                  pointHoverRadius: 7,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
              },
              scales: {
                y: { 
                  beginAtZero: true, 
                  grid: { color: "#e2e8f0" },
                  ticks: { color: "#64748b" },
                  border: { display: false },
                },
                x: { 
                  grid: { color: "#e2e8f0" },
                  ticks: { color: "#64748b" },
                  border: { display: false },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PageStatistics;
