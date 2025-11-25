<script>
  document.addEventListener("DOMContentLoaded", function () {
    const slides = document.querySelectorAll('.simple-slider .slide');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');

    let current = 0;

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
    }

    prevBtn.addEventListener('click', () => {
      current = (current - 1 + slides.length) % slides.length;
      showSlide(current);
    });

    nextBtn.addEventListener('click', () => {
      current = (current + 1) % slides.length;
      showSlide(current);
    });

    showSlide(current);
  });
</script>
