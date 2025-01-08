"use client";
import { motion } from "framer-motion";
import {
  BookOpenCheck,
  LogOut,
  Menu,
  Moon,
  Package,
  Receipt,
  Sun,
  UserCog,
  X,
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "../providers/ThemeProvider";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { logout } from "@/redux/reducers/userSlice";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => dispatch(logout());

  const navItems = [
    { name: "دفتر اليومية", icon: BookOpenCheck, href: "/" },
    { name: "الصفحة الادارية", icon: UserCog, href: "/manager" },
    { name: "المواد", icon: Package, href: "/materials" },
    { name: "الفواتير", icon: Receipt, href: "/invoices" },
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
    <nav className="fixed w-full top-0 z-50" dir="rtl">
      <div className="bg-navbar-bg backdrop-blur-md border-b border-navbar-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="hidden md:flex items-center justify-between flex-1 mr-8">
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
                    <a
                      href={item.href}
                      className="flex items-center px-3 py-2 text-muted-foreground hover:text-primary transition-colors duration-300 gap-2 group"
                    >
                      <item.icon className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                      <span>{item.name}</span>
                    </a>
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/50 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right" />
                  </motion.div>
                ))}
              </motion.div>

              <div className="flex items-center justify-center gap-4">
                {/* Theme Toggle */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:text-primary transition-colors duration-300 mr-4"
                >
                  <motion.div
                    initial={false}
                    animate={{ rotate: theme === "dark" ? 0 : 180 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  >
                    {theme === "dark" ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                  </motion.div>
                </motion.button>
                {/* Logout Button */}
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
            <div className="md:hidden flex items-center gap-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:text-primary transition-colors duration-300"
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: theme === "dark" ? 0 : 180 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </motion.div>
              </motion.button>

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
        <motion.div
          className={`md:hidden ${isOpen ? "block" : "hidden"}`}
          initial={false}
          animate={
            isOpen ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }
          }
          transition={{ duration: 0.3 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center px-3 py-2 rounded-md text-muted-foreground hover:bg-secondary hover:text-primary transition-all duration-300 gap-2"
              >
                <item.icon className="h-4 w-4 opacity-70" />
                <span>{item.name}</span>
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </nav>
  );
};

export default Navbar;
