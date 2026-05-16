export class InfinitySliderController {
  private readonly slider: HTMLElement;
  private readonly originalCount: number = 0;
  private position = 0;
  private readonly speed = 1;
  private animationId: number | null = null;
  private isPaused = false;

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
    this.slider.addEventListener('pointerleave', this.resume);
    this.slider.addEventListener('focusin', this.pause);
    this.slider.addEventListener('focusout', this.resume);

    this.animate();
  }

  private animate = (): void => {
    if (!this.isPaused) {
      this.position -= this.speed;
    }

    const firstImage = this.slider.children[0] as HTMLElement;
    const sliderStyles = window.getComputedStyle(this.slider);
    const gap = parseFloat(sliderStyles.columnGap || sliderStyles.gap || '0') || 0;
    const imageWidth = firstImage.offsetWidth + gap;
    const totalWidth = imageWidth * this.originalCount;

    if (Math.abs(this.position) >= totalWidth) {
      this.position = 0;
    }

    this.slider.style.transform = `translateX(${this.position}px)`;
    this.animationId = requestAnimationFrame(this.animate);
  };

  private pause = (): void => {
    this.isPaused = true;
  };

  private resume = (): void => {
    this.isPaused = false;
  };

  destroy(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    this.slider.removeEventListener('pointerenter', this.pause);
    this.slider.removeEventListener('pointerleave', this.resume);
    this.slider.removeEventListener('focusin', this.pause);
    this.slider.removeEventListener('focusout', this.resume);
  }
}
