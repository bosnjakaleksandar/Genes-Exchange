export class InfinitySliderController {
  private readonly slider: HTMLElement;
  private readonly originalCount: number = 0;
  private position = 0;
  private readonly speed = 1;
  private animationId: number | null = null;

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

    this.animate();
  }

  private animate = (): void => {
    this.position -= this.speed;

    const firstImage = this.slider.children[0] as HTMLElement;
    const imageWidth = firstImage.offsetWidth + 40;
    const totalWidth = imageWidth * this.originalCount;

    if (Math.abs(this.position) >= totalWidth) {
      this.position = 0;
    }

    this.slider.style.transform = `translateX(${this.position}px)`;
    this.animationId = requestAnimationFrame(this.animate);
  };

  destroy(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}
