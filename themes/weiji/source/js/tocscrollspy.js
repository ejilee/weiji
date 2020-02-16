window.addEventListener('DOMContentLoaded', () => {

	const articleBody = document.getElementsByClassName("article-entry")[0];	
	const articleToc = document.getElementById("article-toc");
	const allHeadings = articleToc.querySelectorAll("li.toc-item");

	const observer = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			const headerTitle = entry.target.getAttribute('title');
			const headerTitleParsed = headerTitle.replace(/[`~!@#$%^*()_|+\=?;:,.\{\}\[\]\\\/]/gi, '').replace("&",'amp').replace("<",'-lt').replace(">",'-gt').replace(/\s+/g, '-');

			if (entry.intersectionRatio > 0) {
				[].forEach.call(allHeadings, function(el) {
					el.classList.remove("active");
				});
				console.log(headerTitleParsed);
				const linkSpan = articleToc.querySelector(`li a[href="#${headerTitleParsed}"]`);
				if(linkSpan) linkSpan.closest('li.toc-level-1').classList.add('active');
			}

		});
	});

    // Track all sections that have an `id` applied
	articleBody.querySelectorAll('.headerlink').forEach((headerlink) => {
		observer.observe(headerlink);
	});
	
});