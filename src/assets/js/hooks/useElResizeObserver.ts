import { onActivated, onDeactivated, onMounted, onUnmounted, Ref } from 'vue';

export const useElResizeObserver = (
  target: Ref<HTMLElement | undefined>,
  callback: (e: DOMRectReadOnly) => void,
  options?: { immediate?: boolean },
) => {
  const _options = {
    implements: options?.immediate || false,
  };

  let resizeObserver: ResizeObserver | null = null;

  const _bind = () => {
    if (!target.value) return;

    if (_options.implements) {
      callback(target.value.getBoundingClientRect());
    }

    resizeObserver = new ResizeObserver(entries => {
      entries.forEach(entry => {
        if (entry.target === target.value) {
          callback(entry.contentRect);
        }
      });
    });

    resizeObserver.observe(target.value);
  };

  const _unBind = () => {
    if (!resizeObserver) return;

    resizeObserver.disconnect();

    resizeObserver = null;
  };

  onMounted(_bind);

  onActivated(_bind);

  onUnmounted(_unBind);

  onDeactivated(_unBind);
};
