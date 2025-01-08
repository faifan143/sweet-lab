"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock, User, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { loginUser } from "@/redux/reducers/userSlice";
import useSnackbar from "@/hooks/useSnackbar";
import CustomizedSnackbars from "@/components/common/CustomizedSnackbars";

const LoginScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { setSnackbarConfig, snackbarConfig } = useSnackbar();

  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(loginUser(formData)).then((data) => {
        if (data.meta.requestStatus == "fulfilled") {
          setSnackbarConfig({
            open: true,
            severity: "success",
            message: "تم تسجيل الدخول بنجاح",
          });
          router.replace("/");
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: error + "",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden"
      dir="rtl"
    >
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
      </div>

      {/* Decorative elements - Hidden on mobile */}
      <motion.div
        className="absolute top-20 right-20 text-blue-400/30 hidden md:block"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <Sparkles size={40} />
      </motion.div>

      {/* Main container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative bg-gray-900/50 backdrop-blur-lg p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-[90%] sm:max-w-[440px] md:max-w-md border border-gray-700"
      >
        <motion.div
          variants={itemVariants}
          className="text-center mb-6 sm:mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
            تسجيل الدخول
          </h1>
          <p className="text-gray-300 mt-2 text-sm sm:text-base">
            مرحباً بعودتك
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-gray-200 text-right text-sm">
              اسم المستخدم
            </label>
            <div className="relative group">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full p-2.5 sm:p-3 bg-gray-800/50 border border-gray-700 rounded-lg sm:rounded-xl pr-10 text-right text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all text-sm sm:text-base"
                placeholder="أدخل اسم المستخدم"
                dir="rtl"
              />
              <User className="absolute left-3 top-3 sm:top-3.5 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-gray-200 text-right text-sm">
              كلمة المرور
            </label>
            <div className="relative group">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-2.5 sm:p-3 bg-gray-800/50 border border-gray-700 rounded-lg sm:rounded-xl pr-10 text-right text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all text-sm sm:text-base"
                placeholder="أدخل كلمة المرور"
                dir="rtl"
              />
              <Lock className="absolute left-3 top-3 sm:top-3.5 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
            </div>
          </motion.div>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full p-2.5 sm:p-3 rounded-lg sm:rounded-xl font-semibold relative overflow-hidden group text-sm sm:text-base"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 transition-transform group-hover:scale-105" />
            <span className="relative text-white">تسجيل الدخول</span>
          </motion.button>
        </form>
      </motion.div>

      <CustomizedSnackbars
        open={snackbarConfig.open}
        message={snackbarConfig.message}
        severity={snackbarConfig.severity}
        onClose={() => setSnackbarConfig((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
};

export default LoginScreen;
