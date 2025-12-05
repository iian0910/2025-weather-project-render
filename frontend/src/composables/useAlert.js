import { showAlert } from '../stores/alertStore';

export function useAlert() {
  return {
    success: (message, duration = 3000) => showAlert(message, 'success', duration),
    danger:   (message, duration = 3000) => showAlert(message, 'danger', duration),
  };
}
