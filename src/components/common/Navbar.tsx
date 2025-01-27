/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { logout } from "@/redux/reducers/userSlice";
import { AppDispatch } from "@/redux/store";
import { AnimatePresence, motion } from "framer-motion";
import {
  BoxesIcon,
  CalendarDays,
  Clock,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  Menu,
  Package,
  Receipt,
  Wallet,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import RouteWrapper from "./RouteWrapper";

interface SubNavItem {
  name: string;
  icon: any;
  href: string;
  onClick?: () => void;
}

interface NavItem {
  name: string;
  icon: any;
  href?: string;
  items?: SubNavItem[];
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
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
      name: "المزيد",
      icon: LayoutGrid,
      items: [
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
        {
          name: "تسجيل الخروج",
          icon: LogOut,
          href: "/lgoin",
          onClick: handleLogout,
        },
      ],
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

  const renderNavItem = (item: NavItem) => {
    if (item.items) {
      return (
        <div
          className="relative group"
          onMouseEnter={() => setActiveMenu(item.name)}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <div className="flex items-center px-3 py-2 text-gray-300 hover:text-white transition-colors gap-2 group cursor-pointer">
            <item.icon className="h-4 w-4 opacity-80 group-hover:opacity-100 transition-opacity text-blue-400" />
            <span className="group-hover:text-blue-400 transition-colors">
              {item.name}
            </span>
          </div>

          <AnimatePresence>
            {activeMenu === item.name && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full right-0 mt-2 w-[300px] bg-gray-900/70 rounded-xl border border-gray-800 shadow-xl backdrop-blur-lg"
                style={{ zIndex: 1000 }}
              >
                <div className="p-4 space-y-2">
                  {item.items.map((subItem) => (
                    <RouteWrapper
                      key={subItem.name}
                      href={subItem.href}
                      onClick={subItem.onClick}
                    >
                      <motion.div
                        whileHover={{ x: 4 }}
                        className="flex items-center px-3 py-3 rounded-lg text-gray-300 hover:bg-gray-800/50 hover:text-blue-400 transition-all gap-3"
                      >
                        <subItem.icon className="h-5 w-5 text-blue-400" />
                        <span className="font-medium">{subItem.name}</span>
                      </motion.div>
                    </RouteWrapper>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400/50 scale-x-0 group-hover:scale-x-100 transition-transform origin-right" />
        </div>
      );
    }

    return (
      <RouteWrapper href={item.href!}>
        <div className="flex items-center px-3 py-2 text-gray-300 hover:text-white transition-colors gap-2 group">
          <item.icon className="h-4 w-4 opacity-80 group-hover:opacity-100 transition-opacity text-blue-400" />
          <span className="group-hover:text-blue-400 transition-colors">
            {item.name}
          </span>
        </div>
      </RouteWrapper>
    );
  };

  return (
    <nav className="w-full top-0 z-50 relative" dir="rtl">
      <div className="bg-navbar-bg backdrop-blur-md border-b border-navbar-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Desktop Navigation */}
            <div className="md:flex hidden items-center justify-between flex-1 ">
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
                    {renderNavItem(item)}
                  </motion.div>
                ))}
              </motion.div>
              {/* <div className="flex items-center justify-center gap-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center gap-2 p-2 rounded-lg bg-secondary text-secondary-foreground hover:text-primary transition-colors duration-300"
                >
                  <LogOut className="h-5 w-5" />
                </motion.button>
              </div> */}
            </div>
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
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

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center"
            >
              <span className="text-xl font-bold text-primary">SweetLab</span>
            </motion.div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            className="md:hidden absolute top-16 left-0 right-0 bg-navbar-bg border-b border-navbar-border"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) =>
                item.items ? (
                  <div key={item.name} className="space-y-1">
                    <div className="px-3 py-2 text-gray-400 font-medium">
                      {item.name}
                    </div>
                    {item.items.map((subItem) => (
                      <RouteWrapper key={subItem.name} href={subItem.href}>
                        <motion.div
                          whileHover={{ x: 4 }}
                          className="flex items-center px-6 py-2 rounded-lg text-gray-300 hover:bg-gray-800/50 hover:text-blue-400 transition-all gap-2"
                        >
                          <subItem.icon className="h-4 w-4 text-blue-400" />
                          <span>{subItem.name}</span>
                        </motion.div>
                      </RouteWrapper>
                    ))}
                  </div>
                ) : (
                  <RouteWrapper key={item.name} href={item.href!}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      className="flex items-center px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800/50 hover:text-blue-400 transition-all gap-2"
                    >
                      <item.icon className="h-4 w-4 text-blue-400" />
                      <span>{item.name}</span>
                    </motion.div>
                  </RouteWrapper>
                )
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
