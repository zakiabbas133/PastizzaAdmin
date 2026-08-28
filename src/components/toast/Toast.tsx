import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, X, XCircle } from "lucide-react";

export type ToastType = "success" | "error";

interface ToastProps {
  show: boolean;
  message: string;
  type?: ToastType;
  onClose: () => void;
}

export default function Toast({
  show,
  message,
  type = "success",
  onClose,
}: ToastProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{
            opacity: 0,
            y: -20,
            scale: 0.95,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: -20,
            scale: 0.95,
          }}
          transition={{
            duration: 0.25,
            ease: "easeOut",
          }}
          className="fixed right-4 top-4 z-[999999] w-[calc(100%-2rem)] max-w-sm"
        >
          <div
            className={`
              flex items-start gap-3 rounded-xl border bg-white p-4
              shadow-lg dark:bg-gray-900
              ${
                type === "success"
                  ? "border-success-200 dark:border-success-500/30"
                  : "border-error-200 dark:border-error-500/30"
              }
            `}
          >
            {/* Icon */}
            <div
              className={`
                flex h-9 w-9 shrink-0 items-center justify-center rounded-full
                ${
                  type === "success"
                    ? "bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400"
                    : "bg-error-50 text-error-600 dark:bg-error-500/10 dark:text-error-400"
                }
              `}
            >
              {type === "success" ? (
                <CheckCircle2 size={20} />
              ) : (
                <XCircle size={20} />
              )}
            </div>

            {/* Message */}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
                {type === "success" ? "Success" : "Error"}
              </p>

              <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                {message}
              </p>
            </div>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
