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
  
  if (testimonialsTrack && navigationTrack) {
    var testimonials = qa('.js-testimonials-track .c-testimonial');
    var navSlides = qa('.js-navigation-carousel-track .c-navigation-carousel__slide');
    var currentIndex = 0;
    var isAnimating = false;
    var slideWidth = 100; // percentage
    var isMobile = window.innerWidth < 720;
    
    // Update slide width on resize
    window.addEventListener('resize', function() {
      isMobile = window.innerWidth < 720;
      updateCarousel();
    });
    
    function updateCarousel() {
      if (isAnimating) return;
      
      var testimonialsOffset = -currentIndex * slideWidth;
      var navOffset = -currentIndex * slideWidth;
      
      if (!isMobile) {
        // On desktop, show 3 slides, center the active one
        navOffset = -currentIndex * (100 / 3);
      }
      
      testimonialsTrack.style.transform = 'translateX(' + testimonialsOffset + '%)';
      navigationTrack.style.transform = 'translateX(' + navOffset + '%)';
      
      // Update active class for navigation slides
      navSlides.forEach(function(slide, i) {
        slide.classList.toggle('active', i === currentIndex);
      });
    }
    
    function nextSlide() {
      if (isAnimating) return;
      isAnimating = true;
      currentIndex = (currentIndex + 1) % testimonials.length;
      updateCarousel();
      setTimeout(function() {
        isAnimating = false;
      }, 700);
    }
    
    function prevSlide() {
      if (isAnimating) return;
      isAnimating = true;
      currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
      updateCarousel();
      setTimeout(function() {
        isAnimating = false;
      }, 700);
    }
    
    // Initialize first slide
    if (testimonials.length > 0) {
      updateCarousel();
    }
    
    // Attach event listeners
    if (nextBtn) {
      nextBtn.addEventListener('click', function(e) {
        e.preventDefault();
        nextSlide();
      });
    }
    
    if (prevBtn) {
      prevBtn.addEventListener('click', function(e) {
        e.preventDefault();
        prevSlide();
      });
    }
    
    // Click on navigation slides
    navSlides.forEach(function(slide, index) {
      slide.addEventListener('click', function(e) {
        e.preventDefault();
        if (index !== currentIndex && !isAnimating) {
          isAnimating = true;
          currentIndex = index;
          updateCarousel();
          setTimeout(function() {
            isAnimating = false;
          }, 700);
        }
      });
    });
    
    // Auto-play (optional)
    var autoPlayInterval = setInterval(function() {
      nextSlide();
    }, 5000);
    
    // Pause on hover
    var carouselWrapper = q('.c-testimonials-wrapper');
    if (carouselWrapper) {
      carouselWrapper.addEventListener('mouseenter', function() {
        clearInterval(autoPlayInterval);
      });
      carouselWrapper.addEventListener('mouseleave', function() {
        autoPlayInterval = setInterval(function() {
          nextSlide();
        }, 5000);
      });
    }
  }
})();