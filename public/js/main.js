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
          var t=q(href);
          if(t){
            e.preventDefault();
            var headerHeight=q('.site-header')?q('.site-header').offsetHeight:0;
            var top=t.getBoundingClientRect().top+w.pageYOffset-headerHeight;
            if("scrollBehavior" in d.documentElement.style){
              w.scrollTo({top:Math.max(0,top),behavior:"smooth"});
            }else{
              w.scrollTo(0,Math.max(0,top));
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
})();