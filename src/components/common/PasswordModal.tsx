"use client";

import React, { useState, useEffect, memo, useCallback, useRef } from "react";
import { X, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PasswordModalProps {
  title: string;
  entityName: string;
  entityType?: "workshop" | "employee";
  onClose: () => void;
  onVerify: (password: string) => Promise<boolean>;
  isOpen: boolean;
}

const PasswordModal: React.FC<PasswordModalProps> = memo(({
  title,
  entityName,
  entityType = "workshop",
  onClose,
  onVerify,
  isOpen
}) => {
  const [password, setPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setPassword("");
      setError("");
      setShowPassword(false);
      setAttempts(0);
      // Focus on password input when modal opens
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password.trim()) {
      setError("كلمة المرور مطلوبة");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      const isValid = await onVerify(password);

      if (!isValid) {
        setAttempts(prev => prev + 1);
        setError(
          attempts >= 2
            ? "كلمة المرور غير صحيحة. الرجاء التأكد من كلمة المرور والمحاولة مرة أخرى"
            : "كلمة المرور غير صحيحة"
        );
        setPassword("");
        // Refocus after error
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }
    } catch (error) {
      console.error("Error verifying password:", error);
      setError("حدث خطأ أثناء التحقق من كلمة المرور");
    } finally {
      setIsVerifying(false);
    }
  }, [password, attempts, onVerify]);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError("");
  }, [error]);

  const handleTogglePassword = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const handleModalClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Prevent rendering if not open
  if (!isOpen) return null;

  const getEntityTypeText = () => {
    switch (entityType) {
      case "employee":
        return "الموظف";
      case "workshop":
      default:
        return "الورشة";
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
        dir="rtl"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 w-full max-w-sm shadow-2xl border border-white/10"
          onClick={handleModalClick}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Lock className="h-6 w-6 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">
                {title || "التحقق من الهوية"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
              aria-label="إغلاق"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Entity name display */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 mb-6">
            <p className="text-sm text-slate-400">{getEntityTypeText()}</p>
            <p className="text-white font-medium">{entityName}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="password-input" className="block text-sm font-medium text-slate-300 mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  id="password-input"
                  ref={inputRef}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white
                    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 
                    transition-all pr-12 ${error ? "border-red-500" : "border-white/10"}`}
                  placeholder="أدخل كلمة المرور"
                  autoComplete="off"
                  disabled={isVerifying}
                />
                <button
                  type="button"
                  onClick={handleTogglePassword}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 
                    hover:text-white transition-colors p-1"
                  tabIndex={-1}
                  aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-400"
                  role="alert"
                >
                  {error}
                </motion.p>
              )}
              {attempts >= 3 && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-yellow-400"
                  role="alert"
                >
                  تأكد من صحة كلمة المرور أو تواصل مع المسؤول
                </motion.p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isVerifying || !password.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg
                  bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors
                  disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 
                  focus:ring-blue-500/50"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    جاري التحقق...
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5" />
                    تأكيد
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-lg border border-white/10 text-slate-300
                  hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 
                  focus:ring-white/20"
              >
                إلغاء
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});

PasswordModal.displayName = 'PasswordModal';

export default PasswordModal;
