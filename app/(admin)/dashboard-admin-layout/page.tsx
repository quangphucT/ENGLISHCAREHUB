"use client";
import React from "react";
import { useState } from "react";
import { FaSearch, FaBell, FaBars, FaChartBar, FaClipboardList } from "react-icons/fa";

import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { LogOutIcon, Home, BarChart3, ClipboardCheck, GraduationCap } from "lucide-react";
import PageStatistics from "../statistics/page";
import AssessmentManagementPage from "../assessment-management/paqe";
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type SidebarProps = {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ activeMenu, setActiveMenu }) => {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      description: "Tổng quan hệ thống",
      color: "bg-cyan-500"
    },
    {
      id: "assessment-test",
      label: "Assessment Test",
      icon: ClipboardCheck,
      description: "Quản lý bài kiểm tra",
      color: "bg-blue-500"
    }
  ];

  return (
    <aside className="hidden md:flex flex-col w-72 h-screen bg-white/95 backdrop-blur-xl px-6 py-8 fixed left-0 top-0 z-10 shadow-2xl border-r border-slate-200/60">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-200/60">
        <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-slate-800 font-bold text-xl">English Care Hub</h1>
          <p className="text-slate-500 text-xs">Admin Dashboard</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-3">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeMenu === item.id;
          
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveMenu(item.id)}
              className={`group flex items-center gap-4 w-full px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? "bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200/60 shadow-lg shadow-cyan-500/10" 
                  : "hover:bg-slate-100/60 hover:translate-x-1"
              }`}
            >
              <div className={`p-2.5 rounded-lg transition-all duration-300 ${
                isActive 
                  ? item.color + " shadow-lg" 
                  : "bg-slate-200/60 group-hover:bg-slate-300/60"
              }`}>
                <IconComponent className={`w-5 h-5 ${
                  isActive ? "text-white" : "text-slate-600"
                }`} />
              </div>
              
              <div className="flex-1 text-left">
                <div className={`font-semibold text-sm ${
                  isActive ? "text-slate-800" : "text-slate-600 group-hover:text-slate-800"
                }`}>
                  {item.label}
                </div>
                <div className={`text-xs transition-colors duration-300 ${
                  isActive ? "text-cyan-600" : "text-slate-500 group-hover:text-slate-600"
                }`}>
                  {item.description}
                </div>
              </div>

              {/* Active indicator */}
              {isActive && (
                <div className="w-1 h-8 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-full shadow-sm"></div>
              )}
            </button>
          );
        })}
      </nav>

     
    </aside>
  );
};

const DashboardAdmin = () => {
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard":
        return <PageStatistics />;
      case "assessment-test":
        return <AssessmentManagementPage />;

      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 min-h-screen">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <div className="md:ml-72">
        <main className="p-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 shadow-xl">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardAdmin;
