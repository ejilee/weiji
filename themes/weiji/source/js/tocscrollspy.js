window.addEventListener("DOMContentLoaded", () => {
  const articleBody = document.getElementsByClassName("article-entry")[0];
  const articleToc = document.getElementById("article-toc");
  const allTocLis = articleToc.querySelectorAll("li.toc-item");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const headerTitle = entry.target.getAttribute("title");
        const headerTitleFixed = headerTitle
          .replace(/[`~!@#$%^*()_|+\=?;:,\{\}\[\]\\\/]/gi, "")
          .replace(/&/g, "amp")
          .replace(/</g, "lt")
          .replace(/>/g, "gt")
          .replace(/\s+/g, "-")
          .replace(/\./g, "-")
          .replace(/---/g, "-");

        console.log(headerTitleFixed);

        if (entry.intersectionRatio > 0) {
          allTocLis.forEach((el) => {
            el.classList.remove("active");
          });
          articleToc
            .querySelector(`li a[href="#${headerTitleFixed}"]`)
            .parentElement.classList.add("active");
        }
      });
    },
    { rootMargin: "-60px" }
  );

  articleBody.querySelectorAll(".headerlink").forEach((headerlink) => {
    observer.observe(headerlink);
  });
});
