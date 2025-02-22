import { useState } from "react";

export const useMessageHandler = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState<"success" | "error">("error");

  const handleMessage = (message: string, severity: "success" | "error") => {
    setMessage(message);
    setSeverity(severity);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return {
    message,
    open,
    severity,
    handleMessage,
    handleClose,
  };
};
