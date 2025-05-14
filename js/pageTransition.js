document.addEventListener("DOMContentLoaded", () => {
    const transitionEl = document.getElementById("transition");

    // Плавное появление после загрузки
    transitionEl.classList.remove("active");

    // Перехват всех переходов по ссылкам
    document.querySelectorAll('a[href]').forEach(link => {
      const url = new URL(link.href);
      const isSameOrigin = url.origin === window.location.origin;

      if (isSameOrigin) {
        link.addEventListener('click', e => {
          if (link.target === "_blank" || e.ctrlKey || e.metaKey) return; // игнорировать новые вкладки
          e.preventDefault();
          transitionEl.classList.add("active");

          // дождаться анимации и перейти
          setTimeout(() => {
            window.location.href = link.href;
          }, 500); // время совпадает с CSS transition
        });
      }
    });
  });