import { showLoading, hideLoading, withLoading } from '../stores/loadingStore.js';

export function useLoading() {
  return {
    show: showLoading,
    hide: hideLoading,
    with: withLoading,
  };
}