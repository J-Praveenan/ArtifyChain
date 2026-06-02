import { toast } from "react-toastify";

export const showSuccess = (message: string) => {
  toast.success(message);
};

export const showError = (message: string) => {
  toast.error(message);
};

export const showWarning = (message: string) => {
  toast.warning(message);
};

export const showInfo = (message: string) => {
  toast.info(message);
};

export const showLoading = (message: string) => {
  return toast.loading(message);
};

export const updateSuccess = (
  toastId: any,
  message: string
) => {
  toast.update(toastId, {
    render: message,
    type: "success",
    isLoading: false,
    autoClose: 3000,
  });
};

export const updateError = (
  toastId: any,
  message: string
) => {
  toast.update(toastId, {
    render: message,
    type: "error",
    isLoading: false,
    autoClose: 3000,
  });
};