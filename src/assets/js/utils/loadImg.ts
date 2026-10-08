export const loadImg = (url: string): Promise<HTMLImageElement> => new Promise((resolve, reject) => {
  const img = new Image();
  img.onerror = reject;

  if ('decode' in img && typeof img.decode === 'function') {
    img.src = url;
    img.decode().then(() => resolve(img)).catch(reject);
  } else {
    img.onload = () => resolve(img);
    img.src = url;
    if (img.complete && (img.naturalWidth !== 0 || img.naturalHeight !== 0)) {
      resolve(img);
    }
  }
});

export const waitForImageElement = (img: HTMLImageElement): Promise<void> => {
  if (img.complete) {
    return img.naturalWidth !== 0 || img.naturalHeight !== 0
      ? Promise.resolve()
      : Promise.reject(new Error('Image load failed'));
  }

  if ('decode' in img && typeof img.decode === 'function') {
    return new Promise((resolve, reject) => {
      img.addEventListener('error', reject, { once: true });
      img.decode().then(resolve).catch(reject);
    });
  }

  return new Promise((resolve, reject) => {
    img.addEventListener('load', () => resolve(), { once: true });
    img.addEventListener('error', reject, { once: true });
  });
};
