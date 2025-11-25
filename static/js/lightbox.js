document.addEventListener('click', function (e) {
  const img = e.target.closest('.gallery img');
  if (!img) return;

  const overlay = document.getElementById('lightbox');
  const lightboxImg = overlay.querySelector('.lightbox-img');
  lightboxImg.src = img.src;
  overlay.style.display = 'flex';

  overlay.querySelector('.lightbox-close').onclick = () => {
    overlay.style.display = 'none';
    lightboxImg.src = '';
  };
});
