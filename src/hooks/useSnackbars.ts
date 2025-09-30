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

/**
 * Hook para gerenciar o estado de uma única notificação (Snackbar) com conteúdo dinâmico.
 */
export function useSnackbars(): UseSnackbarsResult {
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: '',
    severity: 'success', // Define um default, mas pode ser qualquer um
  });

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    // Fecha o snackbar
    setNotification(prev => ({ ...prev, open: false }));
  };

  const openNotification = (message: string, severity: AlertProps['severity']) => {
    // Garante que o snackbar feche e abra novamente (útil se a mensagem mudar enquanto estiver aberto)
    setNotification({
      open: false,
      message: '', // Limpa momentaneamente
      severity: 'success', 
    });
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