const infinitySlider = () => {
  const slider = document.querySelector('.about__infinity-slider') as HTMLElement;
  if (!slider) return;

  const images = Array.from(slider.children) as HTMLElement[];
  images.forEach((img) => {
    const clone = img.cloneNode(true) as HTMLElement;
    slider.appendChild(clone);
  });

  let position = 0;
  const speed = 1;

  const animate = () => {
    position -= speed;

    const firstImage = slider.children[0] as HTMLElement;
    const imageWidth = firstImage.offsetWidth + 40;
    const totalWidth = imageWidth * images.length;

    if (Math.abs(position) >= totalWidth) {
      position = 0;
    }

    slider.style.transform = `translateX(${position}px)`;
    requestAnimationFrame(animate);
  };

  animate();
};

export default infinitySlider;
