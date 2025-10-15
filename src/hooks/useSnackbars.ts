import { useState } from "react";
import type { AlertProps } from "@mui/material/Alert";
import type { SnackbarCloseReason } from "@mui/material/Snackbar";

export interface NotificationState {
  open: boolean;
  message: string;
  severity: AlertProps['severity'];
}

interface UseSnackbarsResult {
  notification: NotificationState;
  handleClose: (event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => void;
  openNotification: (message: string, severity: AlertProps['severity']) => void;
}

export function useSnackbars(): UseSnackbarsResult {
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setNotification(prev => ({ ...prev, open: false }));
  };

  const openNotification = (message: string, severity: AlertProps['severity']) => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  return {
    notification,
    handleClose,
    openNotification,
  };
}