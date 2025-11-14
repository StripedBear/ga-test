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
          var posts = qa('.blog-post-card');
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
    var allPosts = qa('.blog-post-card');
    var postsPerPage = 6;
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
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (!projectsCategoryDropdown.contains(e.target)) {
        projectsCategoryDropdown.classList.remove('open');
      }
    });
    
    // Handle category selection
    var projectsCategoryItems = qa('.projects-categories-item');
    projectsCategoryItems.forEach(function(item) {
      var link = item.querySelector('.projects-categories-link');
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
          });
          item.classList.add('active');
          
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
        });
      }
    });
  }

  // Projects load more
  var projectsLoadMoreBtn = q('#projects-load-more-btn');
  if (projectsLoadMoreBtn) {
    var allProjects = qa('.project-card');
    var projectsPerPage = 6;
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

  // Testimonials carousel
  var testimonialsTrack = q('.js-testimonials-track');
  var navigationTrack = q('.js-navigation-carousel-track');
  var prevBtn = q('.js-testimonials-carousel-prev-slide');
  var nextBtn = q('.js-testimonials-carousel-next-slide');
  
  var testimonials = testimonialsTrack ? qa('.js-testimonials-track .c-testimonial') : [];
  var navSlides = navigationTrack ? qa('.js-navigation-carousel-track .c-navigation-carousel__slide') : [];
  var currentIndex = 0;
  var isAnimating = false;
  var slideWidth = 100; // percentage for testimonials
  var autoPlayInterval = null;
  var realSlideCount = testimonials.length;
  var animationFrameId = null;
  var transitionDuration = 700; // ms
  
  // Clone slides for seamless loop
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
    
    // Clone navigation slides
    var lastNavSlide = navSlides[navSlides.length - 1];
    var firstNavClone = lastNavSlide.cloneNode(true);
    firstNavClone.classList.add('js-clone');
    navigationTrack.insertBefore(firstNavClone, navigationTrack.firstChild);
    
    var firstNavSlide = navSlides[0];
    var lastNavClone = firstNavSlide.cloneNode(true);
    lastNavClone.classList.add('js-clone');
    navigationTrack.appendChild(lastNavClone);
    
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
      testimonialsTrack.style.transition = 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
      navigationTrack.style.transition = 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
    }
    
    // Testimonials: one slide at a time
    var testimonialsOffset = -currentIndex * slideWidth;
    
    // Navigation: always show 3 slides, center the active one
    // To center active slide, we need to show (currentIndex-1), currentIndex, (currentIndex+1)
    // So offset should be -(currentIndex - 1) * (100/3)
    var navOffset = -(currentIndex - 1) * (100 / 3);
    
    testimonialsTrack.style.transform = 'translateX(' + testimonialsOffset + '%)';
    navigationTrack.style.transform = 'translateX(' + navOffset + '%)';
    
    // Update active class for navigation slides (only real slides, not clones)
    navSlides.forEach(function(slide, i) {
      if (slide) {
        var isClone = slide.classList.contains('js-clone');
        if (!isClone) {
          // Calculate real index: i - 1 (account for first clone)
          var realIndex = i - 1;
          // Current real index: currentIndex - 1 (account for first clone)
          var currentRealIndex = currentIndex - 1;
          slide.classList.toggle('active', realIndex === currentRealIndex);
        } else {
          slide.classList.remove('active');
        }
      }
    });
  }
  
  function handleTransitionEnd() {
    if (!testimonialsTrack || !navigationTrack) return;
    
    // If we're at the last clone (which is copy of first slide), jump to first real slide
    if (currentIndex >= testimonials.length - 1) {
      testimonialsTrack.style.transition = 'none';
      navigationTrack.style.transition = 'none';
      currentIndex = 1;
      updateCarousel(true);
      
      // Use requestAnimationFrame for instant jump
      animationFrameId = requestAnimationFrame(function() {
        animationFrameId = requestAnimationFrame(function() {
          testimonialsTrack.style.transition = 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
          navigationTrack.style.transition = 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
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
      
      // Use requestAnimationFrame for instant jump
      animationFrameId = requestAnimationFrame(function() {
        animationFrameId = requestAnimationFrame(function() {
          testimonialsTrack.style.transition = 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
          navigationTrack.style.transition = 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
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
    // isAnimating will be set to false by transitionend handler
  }
  
  // Initialize carousel with clones
  if (testimonials.length > 0 && realSlideCount > 0) {
    cloneSlides();
    updateCarousel(true);
    
    // Use requestAnimationFrame for initial positioning
    animationFrameId = requestAnimationFrame(function() {
      animationFrameId = requestAnimationFrame(function() {
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
      
      // Find index of clicked slide
      var allNavSlides = qa('.js-navigation-carousel-track .c-navigation-carousel__slide');
      var clickedIndex = Array.prototype.indexOf.call(allNavSlides, slide);
      
      if (clickedIndex === -1) return;
      
      // Calculate real index: clickedIndex - 1 (account for first clone)
      var realIndex = clickedIndex - 1;
      if (realIndex < 0) realIndex = realSlideCount - 1;
      if (realIndex >= realSlideCount) realIndex = 0;
      
      goToSlide(realIndex);
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
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', function() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
    }
  });
})();