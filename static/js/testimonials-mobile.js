/**
 * Mobile Testimonials Carousel
 */
(function() {
  'use strict';

  function initMobileCarousel() {
    var mobileCarousel = document.querySelector('.js-testimonials-mobile');
    if (!mobileCarousel) return;

    // Проверяем видимость элемента
    if (mobileCarousel.offsetParent === null) {
      // Элемент скрыт, не инициализируем
      return;
    }

    var container = mobileCarousel.querySelector('.c-testimonials-mobile__container');
    var track = mobileCarousel.querySelector('.js-testimonials-mobile-track');
    var slides = mobileCarousel.querySelectorAll('.js-testimonials-mobile-slide');
    var prevBtn = mobileCarousel.querySelector('.js-testimonials-mobile-prev');
    var nextBtn = mobileCarousel.querySelector('.js-testimonials-mobile-next');
    var companyLogo = mobileCarousel.querySelector('.js-testimonials-mobile-logo');
    var companyName = mobileCarousel.querySelector('.js-testimonials-mobile-company');
    var companyAuthor = mobileCarousel.querySelector('.js-testimonials-mobile-author');

    if (!track || !container || slides.length === 0) return;

    var currentIndex = 0;
    var isAnimating = false;
    var slideCount = slides.length;
    var transitionDuration = 500;
    var autoPlayInterval = null;
    var slideWidth = 0;

    // Данные о компаниях
    var companiesData = [];
    for (var i = 0; i < slides.length; i++) {
      companiesData.push({
        logo: slides[i].getAttribute('data-logo') || '',
        company: slides[i].getAttribute('data-company') || '',
        author: slides[i].getAttribute('data-author') || ''
      });
    }

    // Установить размеры слайдов
    function setupSlides() {
      // Получаем ширину контейнера
      slideWidth = mobileCarousel.offsetWidth || 320;

      if (slideWidth === 0) {
        slideWidth = 320;
      }

      // Устанавливаем стили контейнера
      container.style.width = slideWidth + 'px';
      container.style.overflow = 'hidden';

      // Установить ширину каждого слайда
      for (var i = 0; i < slides.length; i++) {
        slides[i].style.width = slideWidth + 'px';
        slides[i].style.minWidth = slideWidth + 'px';
      }

      // Установить ширину трека
      track.style.display = 'flex';
      track.style.width = (slideWidth * slideCount) + 'px';

      // Обновить позицию
      updateCarousel(false);
    }

    // Обновить отображение компании
    function updateCompanyInfo() {
      var data = companiesData[currentIndex];
      if (companyLogo && data && data.logo) {
        companyLogo.src = data.logo;
        companyLogo.alt = data.company || '';
      }
      if (companyName && data) {
        companyName.textContent = data.company || '';
      }
      if (companyAuthor && data) {
        companyAuthor.textContent = data.author || '';
      }
    }

    // Обновить позицию карусели
    function updateCarousel(animate) {
      if (animate !== false) {
        track.style.transition = 'transform 0.5s ease';
      } else {
        track.style.transition = 'none';
      }
      var offset = -currentIndex * slideWidth;
      track.style.transform = 'translateX(' + offset + 'px)';
      updateCompanyInfo();
    }

    // Следующий слайд
    function nextSlide() {
      if (isAnimating) return;
      isAnimating = true;

      currentIndex++;
      if (currentIndex >= slideCount) {
        currentIndex = 0;
      }
      updateCarousel(true);

      setTimeout(function() {
        isAnimating = false;
      }, transitionDuration);
    }

    // Предыдущий слайд
    function prevSlide() {
      if (isAnimating) return;
      isAnimating = true;

      currentIndex--;
      if (currentIndex < 0) {
        currentIndex = slideCount - 1;
      }
      updateCarousel(true);

      setTimeout(function() {
        isAnimating = false;
      }, transitionDuration);
    }

    // Обработчики кнопок
    if (nextBtn) {
      nextBtn.addEventListener('click', function(e) {
        e.preventDefault();
        stopAutoPlay();
        nextSlide();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function(e) {
        e.preventDefault();
        stopAutoPlay();
        prevSlide();
      });
    }

    // Touch/Swipe
    var touchStartX = 0;
    var touchEndX = 0;
    var swipeThreshold = 50;

    track.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoPlay();
    }, { passive: true });

    track.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      var diff = touchStartX - touchEndX;
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    }, { passive: true });

    // Автовоспроизведение
    function startAutoPlay() {
      stopAutoPlay();
      autoPlayInterval = setInterval(function() {
        if (!isAnimating) {
          nextSlide();
        }
      }, 5000);
    }

    function stopAutoPlay() {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
      }
    }

    // Пересчитать при изменении размера окна
    var resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        setupSlides();
      }, 100);
    });

    // Инициализация
    setupSlides();
    startAutoPlay();

    console.log('Mobile carousel initialized. Slides:', slideCount, 'Width:', slideWidth);
  }

  // Запуск
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileCarousel);
  } else {
    initMobileCarousel();
  }

})();
