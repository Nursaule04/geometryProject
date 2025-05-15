document.addEventListener("DOMContentLoaded", () => {
    const transitionEl = document.getElementById("transition");
    transitionEl.classList.remove("active");

    document.querySelectorAll('a[href]').forEach(link => {
      const url = new URL(link.href);
      const isSameOrigin = url.origin === window.location.origin;

      if (isSameOrigin) {
        link.addEventListener('click', e => {
          if (link.target === "_blank" || e.ctrlKey || e.metaKey) return; 
          e.preventDefault();
          transitionEl.classList.add("active");

          setTimeout(() => {
            window.location.href = link.href;
          }, 500); 
        });
      }
    });
  });