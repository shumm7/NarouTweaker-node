import { Id as ToastId, toast, ToastContainer } from 'material-react-toastify';
import { FontAwseomeIcon } from './Icon';

export function PushSnackbar(message: string, variant?: "default" | "success" | "warn" | "error" | "info", duration?: number): ToastId {
    if (variant === "success") {
        return toast.success(message, {
            theme: "colored",
            position: "bottom-right",
            autoClose: duration,
            icon: ({ theme, type }) => <FontAwseomeIcon icon={{ icon: "circle-check", prefix: "solid" }} />
        });
    } else if (variant === "warn") {
        return toast.warn(message, {
            theme: "colored",
            position: "bottom-right",
            autoClose: duration,
            icon: ({ theme, type }) => <FontAwseomeIcon icon={{ icon: "triangle-exclamation", prefix: "solid" }} />
        });
    } else if (variant === "error") {
        return toast.error(message, {
            theme: "colored",
            position: "bottom-right",
            autoClose: duration,
            icon: ({ theme, type }) => <FontAwseomeIcon icon={{ icon: "circle-exclamation", prefix: "solid" }} />
        });
    } else if (variant === "info") {
        return toast.info(message, {
            theme: "colored",
            position: "bottom-right",
            autoClose: duration,
            icon: ({ theme, type }) => <FontAwseomeIcon icon={{ icon: "circle-info", prefix: "solid" }} />
        });
    } else {
        return toast.success(message, {
            position: "bottom-right",
            autoClose: duration,
        });
    }
}