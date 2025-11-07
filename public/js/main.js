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
  var categoryFilter = q('#blog-category-filter');
  if (categoryFilter) {
    categoryFilter.addEventListener('change', function() {
      var selectedCategory = this.value;
      var posts = qa('.blog-post-card');
      posts.forEach(function(post) {
        var postCategories = post.getAttribute('data-categories') || '';
        if (!selectedCategory || postCategories.indexOf(selectedCategory) !== -1) {
          post.classList.remove('hidden');
        } else {
          post.classList.add('hidden');
        }
      });
    });
  }

  // Blog load more
  var loadMoreBtn = q('#blog-load-more-btn');
  if (loadMoreBtn) {
    var hiddenPosts = qa('.blog-post-card.hidden');
    var postsPerPage = 9;
    var visibleCount = 0;
    
    function showMorePosts() {
      var toShow = Math.min(postsPerPage, hiddenPosts.length - visibleCount);
      for (var i = visibleCount; i < visibleCount + toShow; i++) {
        if (hiddenPosts[i]) {
          hiddenPosts[i].classList.remove('hidden');
        }
      }
      visibleCount += toShow;
      
      if (visibleCount >= hiddenPosts.length) {
        loadMoreBtn.style.display = 'none';
      }
    }
    
    // Initially hide posts beyond first page
    var allPosts = qa('.blog-post-card');
    allPosts.forEach(function(post, index) {
      if (index >= postsPerPage) {
        post.classList.add('hidden');
        if (hiddenPosts.indexOf(post) === -1) {
          hiddenPosts.push(post);
        }
      }
    });
    
    if (hiddenPosts.length > 0) {
      loadMoreBtn.addEventListener('click', showMorePosts);
    } else {
      loadMoreBtn.style.display = 'none';
    }
  }
})();