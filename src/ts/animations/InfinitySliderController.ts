export class InfinitySliderController {
  private readonly slider: HTMLElement;
  private readonly originalCount: number = 0;
  private position = 0;
  private readonly speed = 1;
  private animationId: number | null = null;
  private isPaused = false;
  private isDragging = false;
  private dragStartX = 0;
  private dragStartPosition = 0;
  private hasDragged = false;
  private suppressClick = false;

  constructor(selector = '.about__infinity-slider') {
    this.slider = document.querySelector(selector) as HTMLElement;
    if (!this.slider) return;

    const images = Array.from(this.slider.children) as HTMLElement[];
    this.originalCount = images.length;

    // Clone images for seamless loop
    images.forEach((img) => {
      const clone = img.cloneNode(true) as HTMLElement;
      this.slider.appendChild(clone);
    });

    this.slider.addEventListener('pointerenter', this.pause);
    this.slider.addEventListener('pointerleave', this.resumeIfTooltipClosed);
    this.slider.addEventListener('focusin', this.pause);
    this.slider.addEventListener('focusout', this.resumeIfTooltipClosed);
    this.slider.addEventListener('pointerdown', this.handlePointerDown);
    this.slider.addEventListener('pointermove', this.handlePointerMove);
    this.slider.addEventListener('pointerup', this.handlePointerEnd);
    this.slider.addEventListener('pointercancel', this.handlePointerEnd);
    this.slider.addEventListener('click', this.handleClick, true);
    this.slider.addEventListener('wheel', this.handleWheel, { passive: false });

    this.animate();
  }

  private animate = (): void => {
    if (!this.isPaused) {
      this.position -= this.speed;
    }

    this.position = this.normalizePosition(this.position);
    this.applyPosition();
    this.animationId = requestAnimationFrame(this.animate);
  };

  private handlePointerDown = (event: PointerEvent): void => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    if ((event.target as HTMLElement).closest('a, button')) return;

    this.isDragging = true;
    this.dragStartX = event.clientX;
    this.dragStartPosition = this.position;
    this.hasDragged = false;
    this.pause();
    this.slider.classList.add('is-dragging');
    this.slider.setPointerCapture(event.pointerId);
  };

  private handlePointerMove = (event: PointerEvent): void => {
    if (!this.isDragging) return;

    const dragDistance = event.clientX - this.dragStartX;
    if (Math.abs(dragDistance) > 4) this.hasDragged = true;

    this.position = this.normalizePosition(this.dragStartPosition + dragDistance);
    this.applyPosition();

    if (this.hasDragged) event.preventDefault();
  };

  private handlePointerEnd = (event: PointerEvent): void => {
    if (!this.isDragging) return;

    this.isDragging = false;
    this.slider.classList.remove('is-dragging');

    if (this.slider.hasPointerCapture(event.pointerId)) {
      this.slider.releasePointerCapture(event.pointerId);
    }

    if (this.hasDragged) {
      this.suppressClick = true;
      window.setTimeout(() => {
        this.suppressClick = false;
      }, 100);
    }

    this.resumeIfTooltipClosed();
  };

  private handleClick = (event: MouseEvent): void => {
    if (!this.suppressClick) return;

    event.preventDefault();
    event.stopPropagation();
    this.suppressClick = false;
  };

  private handleWheel = (event: WheelEvent): void => {
    const horizontalDelta =
      Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.shiftKey ? event.deltaY : 0;

    if (horizontalDelta === 0) return;

    event.preventDefault();
    this.pause();
    this.position = this.normalizePosition(this.position - horizontalDelta);
    this.applyPosition();
    this.resumeIfTooltipClosed();
  };

  private applyPosition(): void {
    this.slider.style.transform = `translateX(${this.position}px)`;
  }

  private normalizePosition(position: number): number {
    const totalWidth = this.getTotalWidth();
    if (totalWidth === 0) return position;

    let normalizedPosition = position;

    while (normalizedPosition <= -totalWidth) {
      normalizedPosition += totalWidth;
    }

    while (normalizedPosition > 0) {
      normalizedPosition -= totalWidth;
    }

    return normalizedPosition;
  }

  private getTotalWidth(): number {
    const firstImage = this.slider.children[0] as HTMLElement | undefined;
    if (!firstImage) return 0;

    const sliderStyles = window.getComputedStyle(this.slider);
    const gap = parseFloat(sliderStyles.columnGap || sliderStyles.gap || '0') || 0;
    const imageWidth = firstImage.offsetWidth + gap;

    return imageWidth * this.originalCount;
  }

  private pause = (): void => {
    this.isPaused = true;
  };

  private resume = (): void => {
    this.isPaused = false;
  };

  private resumeIfTooltipClosed = (): void => {
    requestAnimationFrame(() => {
      if (this.isDragging) return;
      if (this.slider.matches(':hover') || this.slider.matches(':focus-within')) return;

      this.resume();
    });
  };

  destroy(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    this.slider.removeEventListener('pointerenter', this.pause);
    this.slider.removeEventListener('pointerleave', this.resumeIfTooltipClosed);
    this.slider.removeEventListener('focusin', this.pause);
    this.slider.removeEventListener('focusout', this.resumeIfTooltipClosed);
    this.slider.removeEventListener('pointerdown', this.handlePointerDown);
    this.slider.removeEventListener('pointermove', this.handlePointerMove);
    this.slider.removeEventListener('pointerup', this.handlePointerEnd);
    this.slider.removeEventListener('pointercancel', this.handlePointerEnd);
    this.slider.removeEventListener('click', this.handleClick, true);
    this.slider.removeEventListener('wheel', this.handleWheel);
  }
}
