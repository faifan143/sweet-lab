"use client";
import { logout } from "@/redux/reducers/userSlice";
import { AppDispatch } from "@/redux/store";
import { motion } from "framer-motion";
import {
  BoxesIcon,
  CalendarDays,
  Clock,
  LayoutDashboard,
  LogOut,
  LogOutIcon,
  Menu,
  Package,
  Receipt,
  Wallet,
  X,
} from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import RouteWrapper from "./RouteWrapper";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => dispatch(logout());

  const navItems = [
    {
      name: "دفتر اليومية",
      icon: CalendarDays,
      href: "/",
    },
    {
      name: "الصفحة الادارية",
      icon: LayoutDashboard,
      href: "/manager",
    },
    {
      name: "الورديات",
      icon: Clock,
      href: "/shifts",
    },
    {
      name: "المواد",
      icon: Package,
      href: "/materials",
    },
    {
      name: "الفوارغ",
      icon: BoxesIcon,
      href: "/trays",
    },
    {
      name: "الفواتير",
      icon: Receipt,
      href: "/invoices",
    },
    {
      name: "الديون",
      icon: Wallet,
      href: "/debts",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <nav className=" w-full top-0 z-50 relative" dir="rtl">
      <div className="bg-navbar-bg backdrop-blur-md border-b border-navbar-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 custom:px-4">
          <div className="flex justify-between h-16">
            {/* Logo/Brand */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center"
            >
              <span className="text-xl font-bold text-primary">SweetLab</span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className=" custom:hidden flex  items-center justify-between flex-1 mr-8">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex space-x-8"
              >
                {navItems.map((item) => (
                  <motion.div
                    key={item.name}
                    variants={itemVariants}
                    className="relative group"
                  >
                    <RouteWrapper href={item.href}>
                      <div className="flex items-center px-3 py-2 text-muted-foreground hover:text-primary transition-colors duration-300 gap-2 group">
                        <item.icon className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                        <span>{item.name}</span>
                      </div>
                    </RouteWrapper>
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/50 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right" />
                  </motion.div>
                ))}
              </motion.div>
              <div className="flex items-center justify-center gap-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center gap-2 p-2 rounded-lg bg-secondary text-secondary-foreground hover:text-primary transition-colors duration-300"
                >
                  <LogOut className="h-5 w-5" />
                </motion.button>
              </div>
            </div>

            {/* Mobile Menu and Theme Toggle */}
            <div className="hidden custom:flex items-center gap-4">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-muted-foreground hover:text-primary transition-colors duration-300"
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            className="hidden custom:block absolute top-16 left-0 right-0 bg-navbar-bg border-b border-navbar-border" // Added absolute positioning and background
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <RouteWrapper key={item.name} href={item.href}>
                  <div className="flex items-center px-3 py-2 rounded-md text-muted-foreground hover:bg-secondary hover:text-primary transition-all duration-300 gap-2">
                    <item.icon className="h-4 w-4 opacity-70" />
                    <span>{item.name}</span>
                  </div>
                </RouteWrapper>
              ))}
              <div
                onClick={handleLogout}
                className="flex items-center px-3 py-2 rounded-md text-muted-foreground hover:bg-secondary hover:text-primary transition-all duration-300 gap-2 cursor-pointer"
              >
                <LogOutIcon className="h-4 w-4 opacity-70" />
                <span>تسجيل خروج</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
