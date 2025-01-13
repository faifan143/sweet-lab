import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import React from "react";

interface TrayConfirmReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
  trayCount: number;
  customerName: string;
}

const TrayConfirmReturnModal: React.FC<TrayConfirmReturnModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  trayCount,
  customerName,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          open={isOpen}
          onClose={onClose}
          PaperProps={{
            style: {
              backgroundColor: "rgb(30 41 59)",
              border: "1px solid rgb(51 65 85)",
              borderRadius: "0.5rem",
            },
          }}
        >
          <DialogTitle
            sx={{
              color: "rgb(226 232 240)",
              textAlign: "right",
              fontSize: "1.25rem",
              fontWeight: "bold",
            }}
          >
            تأكيد إرجاع الصواني
          </DialogTitle>

          <DialogContent>
            <DialogContentText
              sx={{
                color: "rgb(148 163 184)",
                textAlign: "right",
                marginTop: 1,
              }}
              dir="rtl"
            >
              هل أنت متأكد من إرجاع {trayCount} صواني من العميل {customerName}؟
            </DialogContentText>
          </DialogContent>

          <DialogActions
            sx={{ padding: 2, justifyContent: "flex-start", gap: 1 }}
          >
            <Button
              onClick={onClose}
              sx={{
                color: "rgb(203 213 225)",
                "&:hover": {
                  backgroundColor: "rgb(51 65 85)",
                  color: "rgb(241 245 249)",
                },
              }}
            >
              إلغاء
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              sx={{
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                color: "rgb(52 211 153)",
                "&:hover": {
                  backgroundColor: "rgba(16, 185, 129, 0.2)",
                },
                "&.Mui-disabled": {
                  opacity: 0.5,
                },
              }}
            >
              {isLoading ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>جاري الارجاع...</span>
                </div>
              ) : (
                "تأكيد الإرجاع"
              )}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default TrayConfirmReturnModal;
