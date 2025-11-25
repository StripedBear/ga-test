(function(){
  var d=document,w=window;
  function onReady(fn){if(d.readyState!=="loading"){fn()}else{d.addEventListener("DOMContentLoaded",fn)}}
  function q(sel,ctx){return (ctx||d).querySelector(sel)}
  function qa(sel,ctx){return Array.prototype.slice.call((ctx||d).querySelectorAll(sel))}

  onReady(function(){
    qa('a[href^="#"]').forEach(function(a){
      a.addEventListener("click",function(e){
        var href=a.getAttribute("href");
        if(href && href.length>1 && href!="#"){
          e.preventDefault();
          var targetId=href.substring(1);
          var t=q("#"+targetId);
          if(t){
            var headerHeight=q('.site-header')?q('.site-header').offsetHeight:0;
            var top=t.getBoundingClientRect().top+w.pageYOffset-headerHeight;
            if("scrollBehavior" in d.documentElement.style){
              w.scrollTo({top:Math.max(0,top),behavior:"smooth"});
            }else{
              w.scrollTo(0,Math.max(0,top));
            }
            if(w.history && w.history.pushState){
              w.history.pushState(null,null,href);
            }
          }
        }
      });
    });

    var toggle=q('[data-toggle="nav"], .js-menu-toggle');
    var nav=q('[data-target="nav"], .js-nav');
    if(toggle&&nav){
      toggle.addEventListener("click",function(){
        nav.classList.toggle("open");
        toggle.classList.toggle("open");
      });
    }

    qa('a[target="_blank"]').forEach(function(a){
      var rel=a.getAttribute("rel")||"";
      if(rel.indexOf("noopener")===-1||rel.indexOf("noreferrer")===-1){
        a.setAttribute("rel","noopener noreferrer");
      }
    });

    var toObserve=qa("[data-animate], .reveal, .aos");
    if("IntersectionObserver" in w && toObserve.length){
      var obs=new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if(e.isIntersecting){
            e.target.classList.add("in-view");
            obs.unobserve(e.target);
          }
        });
      },{root:null,rootMargin:"0px 0px -10% 0px",threshold:0.15});
      toObserve.forEach(function(el){obs.observe(el)});
    }else{
      toObserve.forEach(function(el){el.classList.add("in-view")});
    }

    var lazy=qa("img[data-src]");
    if("IntersectionObserver" in w && lazy.length){
      var imgObs=new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if(e.isIntersecting){
            var img=e.target;
            var src=img.getAttribute("data-src");
            if(src){img.src=src;img.removeAttribute("data-src");}
            imgObs.unobserve(img);
          }
        });
      },{root:null,rootMargin:"200px",threshold:0});
      lazy.forEach(function(img){imgObs.observe(img)});
    }else{
      lazy.forEach(function(img){
        var src=img.getAttribute("data-src");
        if(src){img.src=src;img.removeAttribute("data-src");}
      });
    }
  });

  // Blog category filter
  var categoryDropdown = q('#blog-category-dropdown');
  var categoryToggle = q('#blog-category-toggle');
  var categoryMenu = q('#blog-categories-menu');
  var categorySelected = q('.blog-categories-selected');
  
  if (categoryDropdown && categoryToggle && categoryMenu) {
    // Toggle dropdown
    categoryToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      categoryDropdown.classList.toggle('open');
    });
    
    // Close dropdown when clicking outside
    d.addEventListener('click', function(e) {
      if (!categoryDropdown.contains(e.target)) {
        categoryDropdown.classList.remove('open');
      }
    });
    
    // Handle category selection
    var categoryItems = qa('.blog-categories-item');
    categoryItems.forEach(function(item) {
      var link = item.querySelector('.blog-categories-link');
      if (link) {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          var value = item.getAttribute('data-value');
          var text = link.textContent.trim();
          
          // Update selected text
          categorySelected.textContent = text;
          
          // Update active state
          categoryItems.forEach(function(i) {
            i.classList.remove('active');
          });
          item.classList.add('active');
          
          // Filter posts
          var posts = qa('.blog-post-entry');
          posts.forEach(function(post) {
            var postCategories = post.getAttribute('data-categories') || '';
            if (!value || postCategories.indexOf(value) !== -1) {
              post.classList.remove('hidden');
            } else {
              post.classList.add('hidden');
            }
          });
          
          // Close dropdown
          categoryDropdown.classList.remove('open');
        });
      }
    });
  }

  // Blog load more
  var loadMoreBtn = q('#blog-load-more-btn');
  if (loadMoreBtn) {
    var allPosts = qa('.blog-post-entry');
    var postsPerPage = 9;
    var visibleCount = postsPerPage;
    
    // Initially hide posts beyond first page
    allPosts.forEach(function(post, index) {
      if (index >= postsPerPage) {
        post.classList.add('hidden');
      }
    });
    
    // Show more posts function
    function showMorePosts() {
      var toShow = Math.min(postsPerPage, allPosts.length - visibleCount);
      
      for (var i = visibleCount; i < visibleCount + toShow; i++) {
        if (allPosts[i]) {
          allPosts[i].classList.remove('hidden');
        }
      }
      
      visibleCount += toShow;
      
      // Hide button if all posts are visible
      if (visibleCount >= allPosts.length) {
        loadMoreBtn.style.display = 'none';
      }
    }
    
    // Attach click handler
    loadMoreBtn.addEventListener('click', function(e) {
      e.preventDefault();
      showMorePosts();
    });
    
    // Hide button if all posts are already visible
    if (allPosts.length <= postsPerPage) {
      loadMoreBtn.style.display = 'none';
    }
  }

  // Projects category filter
  var projectsCategoryDropdown = q('#projects-category-dropdown');
  var projectsCategoryToggle = q('#projects-category-toggle');
  var projectsCategorySelected = q('.projects-categories-selected');
  
  if (projectsCategoryDropdown && projectsCategoryToggle) {
    // Toggle dropdown
    projectsCategoryToggle.addEventListener('click', function(e) {
      e.preventDefault();
      projectsCategoryDropdown.classList.toggle('open');
      projectsCategoryDropdown.classList.toggle('c-dd-nav--open');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (!projectsCategoryDropdown.contains(e.target)) {
        projectsCategoryDropdown.classList.remove('open');
        projectsCategoryDropdown.classList.remove('c-dd-nav--open');
      }
    });
    
    // Handle category selection
    var projectsCategoryItems = qa('.projects-categories-item');
    projectsCategoryItems.forEach(function(item) {
      var link = item.querySelector('.blog-categories-link');
      if (link) {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          var value = item.getAttribute('data-value');
          var text = link.textContent.trim();
          
          // Update selected text
          projectsCategorySelected.textContent = text;
          
          // Update active state
          projectsCategoryItems.forEach(function(i) {
            i.classList.remove('active');
            var iLink = i.querySelector('.blog-categories-link');
            if (iLink) iLink.classList.remove('active');
          });
          item.classList.add('active');
          link.classList.add('active');
          
          // Filter projects
          var projects = qa('.project-card');
          projects.forEach(function(project) {
            var projectPlatforms = project.getAttribute('data-platforms') || '';
            if (!value || projectPlatforms.indexOf(value) !== -1) {
              project.classList.remove('hidden');
            } else {
              project.classList.add('hidden');
            }
          });
          
          // Close dropdown
          projectsCategoryDropdown.classList.remove('open');
          projectsCategoryDropdown.classList.remove('c-dd-nav--open');
        });
      }
    });
  }

  // Projects load more
  var projectsLoadMoreBtn = q('#projects-load-more-btn');
  if (projectsLoadMoreBtn) {
    var allProjects = qa('.project-card');
    var projectsPerPage = 9;
    var visibleProjectsCount = projectsPerPage;
    
    // Initially hide projects beyond first page
    allProjects.forEach(function(project, index) {
      if (index >= projectsPerPage) {
        project.classList.add('hidden');
      }
    });
    
    // Show more projects function
    function showMoreProjects() {
      var toShow = Math.min(projectsPerPage, allProjects.length - visibleProjectsCount);
      
      for (var i = visibleProjectsCount; i < visibleProjectsCount + toShow; i++) {
        if (allProjects[i]) {
          allProjects[i].classList.remove('hidden');
        }
      }
      
      visibleProjectsCount += toShow;
      
      // Hide button if all projects are visible
      if (visibleProjectsCount >= allProjects.length) {
        projectsLoadMoreBtn.style.display = 'none';
      }
    }
    
    // Attach click handler
    projectsLoadMoreBtn.addEventListener('click', function(e) {
      e.preventDefault();
      showMoreProjects();
    });
    
    // Hide button if all projects are already visible
    if (allProjects.length <= projectsPerPage) {
      projectsLoadMoreBtn.style.display = 'none';
    }
  }

  // Testimonials carousel - based on original Owl Carousel implementation
  var testimonialsTrack = q('.js-testimonials-track');
  var navigationTrack = q('.js-navigation-carousel-track');
  var navigationContainer = q('.c-navigation-carousel-container');
  var prevBtn = q('.js-testimonials-carousel-prev-slide');
  var nextBtn = q('.js-testimonials-carousel-next-slide');
  
  var testimonials = testimonialsTrack ? qa('.js-testimonials-track .c-testimonial') : [];
  var navSlides = navigationTrack ? qa('.js-navigation-carousel-track .c-navigation-carousel__slide') : [];
  var currentIndex = 0;
  var isAnimating = false;
  var autoPlayInterval = null;
  var realSlideCount = testimonials.length;
  var isMobile = window.innerWidth < 720;
  var transitionDuration = 700; // ms
  
  // Clone slides for seamless infinite loop
  function cloneSlides() {
    if (!testimonialsTrack || !navigationTrack || testimonials.length === 0) return;
    
    // Clone last testimonial to beginning
    var lastTestimonial = testimonials[testimonials.length - 1];
    var firstClone = lastTestimonial.cloneNode(true);
    firstClone.classList.add('js-clone');
    testimonialsTrack.insertBefore(firstClone, testimonialsTrack.firstChild);
    
    // Clone first testimonial to end
    var firstTestimonial = testimonials[0];
    var lastClone = firstTestimonial.cloneNode(true);
    lastClone.classList.add('js-clone');
    testimonialsTrack.appendChild(lastClone);
    
    // Clone navigation slides - clone enough for seamless loop
    // Clone last 3 slides to beginning (for desktop: need to show 3 slides)
    for (var i = 0; i < 3 && i < navSlides.length; i++) {
      var lastNavSlide = navSlides[navSlides.length - 1 - i];
      if (lastNavSlide) {
        var firstNavClone = lastNavSlide.cloneNode(true);
        firstNavClone.classList.add('js-clone');
        navigationTrack.insertBefore(firstNavClone, navigationTrack.firstChild);
      }
    }
    
    // Clone first 3 slides to end
    for (var j = 0; j < 3 && j < navSlides.length; j++) {
      var firstNavSlide = navSlides[j];
      if (firstNavSlide) {
        var lastNavClone = firstNavSlide.cloneNode(true);
        lastNavClone.classList.add('js-clone');
        navigationTrack.appendChild(lastNavClone);
      }
    }
    
    // Update references
    testimonials = qa('.js-testimonials-track .c-testimonial');
    navSlides = qa('.js-navigation-carousel-track .c-navigation-carousel__slide');
    
    // Start at first real slide (index 1, because clone is at 0)
    currentIndex = 1;
  }
  
  function updateCarousel(disableTransition) {
    if (!testimonialsTrack || !navigationTrack || testimonials.length === 0) return;
    
    if (disableTransition) {
      testimonialsTrack.style.transition = 'none';
      navigationTrack.style.transition = 'none';
    } else {
      testimonialsTrack.style.transition = 'transform 0.7s ease';
      navigationTrack.style.transition = 'transform 0.7s ease';
    }
    
    // Testimonials: one slide at a time
    var testimonialOffset = -currentIndex * 100;
    testimonialsTrack.style.transform = 'translateX(' + testimonialOffset + '%)';
    
    // Navigation: calculate offset to center active slide
    var currentRealIndex = currentIndex - 1; // Account for first clone (0-based for real slides)
    
    // Find all real slides (not clones) and their positions
    var realSlides = [];
    navSlides.forEach(function(slide, i) {
      if (!slide.classList.contains('js-clone')) {
        realSlides.push({
          slide: slide,
          index: i,
          realIndex: realSlides.length
        });
      }
    });
    
    // Update active class and details visibility
    realSlides.forEach(function(item) {
      var isActive = item.realIndex === currentRealIndex;
      item.slide.classList.toggle('active', isActive);
      
      // Hide/show details based on active state
      var details = item.slide.querySelector('.c-navigation-carousel__details');
      if (details) {
        details.style.opacity = isActive ? '1' : '0';
      }
    });
    
    // Remove active class from clones
    navSlides.forEach(function(slide) {
      if (slide.classList.contains('js-clone')) {
        slide.classList.remove('active');
        var details = slide.querySelector('.c-navigation-carousel__details');
        if (details) {
          details.style.opacity = '0';
        }
      }
    });
    
    // Calculate navigation offset to center active slide using pixels
    var activeRealSlide = realSlides.find(function(item) {
      return item.realIndex === currentRealIndex;
    });
    
    if (activeRealSlide && navigationContainer) {
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(function() {
        var containerRect = navigationContainer.getBoundingClientRect();
        var activeRect = activeRealSlide.slide.getBoundingClientRect();
        var containerCenter = containerRect.left + containerRect.width / 2;
        var activeCenter = activeRect.left + activeRect.width / 2;
        var offset = containerCenter - activeCenter;
        
        // Get current transform value
        var currentTransform = 0;
        var transformMatch = navigationTrack.style.transform.match(/translateX\(([^)]+)\)/);
        if (transformMatch) {
          var transformValue = transformMatch[1].trim();
          if (transformValue.indexOf('%') !== -1) {
            // Convert percentage to pixels if needed
            var percentage = parseFloat(transformValue);
            currentTransform = (percentage / 100) * navigationTrack.offsetWidth;
          } else {
            currentTransform = parseFloat(transformValue) || 0;
          }
        }
        
        navigationTrack.style.transform = 'translateX(' + (currentTransform + offset) + 'px)';
      });
    }
  }
  
  function handleTransitionEnd() {
    if (!testimonialsTrack || !navigationTrack) return;
    
    // If we're at the last clone (which is copy of first slide), jump to first real slide
    if (currentIndex >= testimonials.length - 1) {
      testimonialsTrack.style.transition = 'none';
      navigationTrack.style.transition = 'none';
      currentIndex = 1;
      updateCarousel(true);
      requestAnimationFrame(function() {
        requestAnimationFrame(function() {
          testimonialsTrack.style.transition = 'transform 0.7s ease';
          navigationTrack.style.transition = 'transform 0.7s ease';
          isAnimating = false;
        });
      });
    }
    // If we're at the first clone (which is copy of last slide), jump to last real slide
    else if (currentIndex <= 0) {
      testimonialsTrack.style.transition = 'none';
      navigationTrack.style.transition = 'none';
      currentIndex = realSlideCount;
      updateCarousel(true);
      requestAnimationFrame(function() {
        requestAnimationFrame(function() {
          testimonialsTrack.style.transition = 'transform 0.7s ease';
          navigationTrack.style.transition = 'transform 0.7s ease';
          isAnimating = false;
        });
      });
    } else {
      isAnimating = false;
    }
  }
  
  function nextSlide() {
    if (isAnimating || testimonials.length === 0) return;
    isAnimating = true;
    currentIndex++;
    updateCarousel(false);
  }
  
  function prevSlide() {
    if (isAnimating || testimonials.length === 0) return;
    isAnimating = true;
    currentIndex--;
    updateCarousel(false);
  }
  
  var transitionEndHandler = function(e) {
    if (e.target === testimonialsTrack && e.propertyName === 'transform') {
      handleTransitionEnd();
    }
  };
  
  // Listen to transition end events
  if (testimonialsTrack) {
    testimonialsTrack.addEventListener('transitionend', transitionEndHandler);
  }
  
  function goToSlide(targetRealIndex) {
    if (isAnimating || testimonials.length === 0) return;
    if (targetRealIndex < 0 || targetRealIndex >= realSlideCount) return;
    
    // targetRealIndex is 0-based for real slides
    // currentIndex is 1-based (accounting for first clone)
    var targetIndex = targetRealIndex + 1;
    
    if (targetIndex === currentIndex) return;
    
    isAnimating = true;
    currentIndex = targetIndex;
    updateCarousel(false);
  }
  
  // Handle window resize
  window.addEventListener('resize', function() {
    var wasMobile = isMobile;
    isMobile = window.innerWidth < 720;
    if (wasMobile !== isMobile) {
      centerActiveSlide();
    }
  });
  
  // Initialize carousel with clones
  if (testimonials.length > 0 && realSlideCount > 0) {
    cloneSlides();
    updateCarousel(true);
    
    // Use requestAnimationFrame for initial positioning
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        updateCarousel(false);
      });
    });
  }
  
  // Attach event listeners for buttons
  if (nextBtn) {
    nextBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      nextSlide();
    });
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      prevSlide();
    });
  }
  
  // Click on navigation slides - use event delegation
  if (navigationTrack) {
    navigationTrack.addEventListener('click', function(e) {
      var slide = e.target.closest('.c-navigation-carousel__slide');
      if (!slide || slide.classList.contains('js-clone') || isAnimating) return;
      
      e.preventDefault();
      e.stopPropagation();
      
      // Find all real slides (not clones) and get index
      var allRealSlides = [];
      var allNavSlides = qa('.js-navigation-carousel-track .c-navigation-carousel__slide');
      allNavSlides.forEach(function(s) {
        if (!s.classList.contains('js-clone')) {
          allRealSlides.push(s);
        }
      });
      
      var clickedRealIndex = allRealSlides.indexOf(slide);
      if (clickedRealIndex === -1) return;
      
      goToSlide(clickedRealIndex);
    });
  }
  
  if (realSlideCount > 0) {
    // Auto-play
    autoPlayInterval = setInterval(function() {
      if (!isAnimating) {
        nextSlide();
      }
    }, 5000);
    
    // Pause on hover
    var carouselWrapper = q('.c-testimonials-wrapper');
    if (carouselWrapper) {
      carouselWrapper.addEventListener('mouseenter', function() {
        if (autoPlayInterval) {
          clearInterval(autoPlayInterval);
          autoPlayInterval = null;
        }
      });
      carouselWrapper.addEventListener('mouseleave', function() {
        if (!autoPlayInterval) {
          autoPlayInterval = setInterval(function() {
            if (!isAnimating) {
              nextSlide();
            }
          }, 5000);
        }
      });
    }
  }

})();