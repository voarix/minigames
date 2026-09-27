const autoplayDelay = 4000;

interface CarouselAutoplay {
  readonly start: () => void;
  readonly pause: () => void;
  readonly reset: () => void;
  readonly destroy: () => void;
}

export const createCarouselAutoplay = (
  onNext: () => void,
): CarouselAutoplay => {
  let timerId: number | undefined;
  let remainingTime = autoplayDelay;
  let startedAt = 0;
  let isDestroyed = false;

  const start = (): void => {
    if (isDestroyed || timerId !== undefined) return;

    startedAt = performance.now();
    timerId = setTimeout(() => {
      timerId = undefined;
      remainingTime = autoplayDelay;
      onNext();
      start();
    }, remainingTime);
  };

  const pause = (): void => {
    if (timerId === undefined) return;

    clearTimeout(timerId);
    timerId = undefined;
    const elapsedTime = performance.now() - startedAt;
    remainingTime = Math.max(0, remainingTime - elapsedTime);
  };

  const reset = (): void => {
    pause();
    remainingTime = autoplayDelay;
    start();
  };

  const destroy = (): void => {
    pause();
    isDestroyed = true;
  };

  return { start, pause, reset, destroy };
};
