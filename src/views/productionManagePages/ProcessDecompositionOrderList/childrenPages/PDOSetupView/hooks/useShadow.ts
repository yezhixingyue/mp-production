import { ref, watch } from 'vue';

export const useShadow = () => {
  const shadow = ref({
    top: false,
    bottom: false,
  });

  const oMainPTop = ref<HTMLElement>();
  const oMainPBottom = ref<HTMLElement>();

  const options = {
    threshold: 1,
  };

  const intersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.target === oMainPTop.value) {
        shadow.value.top = !entry.isIntersecting;
      }
      if (entry.target === oMainPBottom.value) {
        shadow.value.bottom = !entry.isIntersecting;
      }
    });
  }, options);

  watch(() => oMainPTop.value, (val, oldVal) => {
    if (val && !oldVal) {
      intersectionObserver.observe(val);
      if (oMainPBottom.value) intersectionObserver.observe(oMainPBottom.value);
    }
  }, { immediate: true });

  return { shadow, oMainPTop, oMainPBottom };
};
