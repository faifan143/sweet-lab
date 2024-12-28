import { motion } from "framer-motion";
import { BookOpenCheck, Package, X, Menu } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "دفتر اليومية", icon: BookOpenCheck, href: "/" },
    { name: "المواد", icon: Package, href: "/materials" },
    // { name: "الفواتير", icon: Receipt, href: "/invoices" },
    // { name: "الديون", icon: Wallet, href: "/debts" },
    // { name: "المستودع", icon: BoxIcon, href: "/warehouse" },
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
      {/* Softer gradient background with blur */}
      <div className="bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-md border-b border-slate-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
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
                      className="flex  items-center px-3 py-2 text-slate-300 hover:text-sky-300 transition-colors duration-300 gap-2 group"
                    >
                      <item.icon className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                      <span>{item.name}</span>
                    </a>
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-300/50 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right" />
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-slate-300 hover:text-sky-300 transition-colors duration-300"
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>

            {/* Logo/Brand */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center"
            >
              <span className="text-xl font-bold text-sky-300">SweetLab</span>
            </motion.div>
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
                className="flex items-center px-3 py-2 rounded-md text-slate-300 hover:bg-slate-800/50 hover:text-sky-300 transition-all duration-300 gap-2"
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
