document.addEventListener('click', function (e) {
  const img = e.target.closest('.gallery img');
  if (!img) return;

  const overlay = document.getElementById('lightbox');
  const lightboxImg = overlay.querySelector('.lightbox-img');
  const closeBtn = overlay.querySelector('.lightbox-close');
  const prevBtn = overlay.querySelector('.lightbox-prev');
  const nextBtn = overlay.querySelector('.lightbox-next');

  // собираем все изображения галереи
  const images = Array.from(document.querySelectorAll('.gallery img'));

  // определяем текущий индекс
  let currentIndex = images.indexOf(img);

  // функция обновления картинки
  function updateImage() {
    lightboxImg.src = images[currentIndex].src;
  }

  updateImage();
  overlay.style.display = 'flex';

  // закрытие
  closeBtn.onclick = () => {
    overlay.style.display = 'none';
    lightboxImg.src = '';
  };

  // переключение назад
  prevBtn.onclick = () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateImage();
  };

  // переключение вперед
  nextBtn.onclick = () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateImage();
  };
});
