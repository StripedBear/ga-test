document.addEventListener('click', function (e) {
  const img = e.target.closest('.gallery img');
  if (!img) return;

  const overlay = document.getElementById('lightbox');
  const lightboxImg = overlay.querySelector('.lightbox-img');
  const closeBtn = overlay.querySelector('.lightbox-close');
  const prevBtn = overlay.querySelector('.lightbox-prev');
  const nextBtn = overlay.querySelector('.lightbox-next');


  const images = Array.from(document.querySelectorAll('.gallery img'));


  let currentIndex = images.indexOf(img);


  function updateImage() {
    lightboxImg.src = images[currentIndex].src;
  }

  updateImage();
  overlay.style.display = 'flex';


  closeBtn.onclick = () => {
    overlay.style.display = 'none';
    lightboxImg.src = '';
  };

  prevBtn.onclick = () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateImage();
  };

  nextBtn.onclick = () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateImage();
  };
});
