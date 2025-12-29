// To make images retina, add a class "2x" to the img element

function isRetina() {
	var mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),\
					  (min--moz-device-pixel-ratio: 1.5),\
					  (-o-min-device-pixel-ratio: 3/2),\
					  (min-resolution: 1.5dppx)";

	if (window.devicePixelRatio > 1)
		return true;

	if (window.matchMedia && window.matchMedia(mediaQuery).matches)
		return true;

	return false;
};

function retina() {

	if (!isRetina())
		return;

	let retina = document.querySelectorAll("img[class='2x']");
	retina.forEach(element => {
		let path = element.getAttribute("src");

		path = path.replace(".png", "@2x.png");
		path = path.replace(".jpg", "@2x.jpg");
		element.setAttribute("src", path);
	});
};

function setDarkMode(isDark) {
	var darkBtn = document.getElementById("darkBtn");
	var lightBtn = document.getElementById("lightBtn");
	if (isDark) {
		lightBtn.style.display = "inline-block";
		darkBtn.style.display = "none";
		localStorage.setItem("preferredTheme", "dark");
	} else {
		lightBtn.style.display = "none";
		darkBtn.style.display = "inline-block";
		localStorage.removeItem("preferredTheme");
	}
	document.body.classList.toggle("dark-mode");
}

document.addEventListener(
	"DOMContentLoaded",
	function() {
		retina();
		var darkThemeSelected = localStorage.getItem('preferredTheme') === 'dark';

    // Get buttons
    var darkBtn = document.getElementById("darkBtn");
    var lightBtn = document.getElementById("lightBtn");
    
    // Set their initial visibility based on the preferred theme
    if (darkThemeSelected) {
      darkBtn.style.display = "none";
      lightBtn.style.display = "inline-block";
    } else {
      darkBtn.style.display = "inline-block";
      lightBtn.style.display = "none";
    }
	},
	false
);

// TOC highlight based on scroll position
function initTocHighlight() {
	var tocLinks = document.querySelectorAll('.toc-sidebar #TableOfContents a');
	var headings = [];
	
	if (tocLinks.length === 0) return;
	
	// Get all headings that are linked in TOC
	tocLinks.forEach(function(link) {
		var href = link.getAttribute('href');
		if (href && href.startsWith('#')) {
			var id = href.substring(1);
			var heading = document.getElementById(id);
			if (heading) {
				headings.push({ id: id, element: heading, link: link });
			}
		}
	});
	
	if (headings.length === 0) return;
	
	function highlightToc() {
		var scrollPos = window.scrollY + 120;
		var currentHeading = null;
		
		// Find the current heading
		for (var i = 0; i < headings.length; i++) {
			if (headings[i].element.offsetTop <= scrollPos) {
				currentHeading = headings[i];
			}
		}
		
		// Update active class
		headings.forEach(function(h) {
			h.link.classList.remove('toc-active');
		});
		
		if (currentHeading) {
			currentHeading.link.classList.add('toc-active');
		}
	}
	
	// Initial highlight
	highlightToc();
	
	// Highlight on scroll with throttle
	var ticking = false;
	window.addEventListener('scroll', function() {
		if (!ticking) {
			window.requestAnimationFrame(function() {
				highlightToc();
				ticking = false;
			});
			ticking = true;
		}
	});
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
	initTocHighlight();
});

window.onload = (event) => {
	var lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));

	if ("IntersectionObserver" in window && "IntersectionObserverEntry" in window && "intersectionRatio" in
		window.IntersectionObserverEntry.prototype) {
		let lazyImageObserver = new IntersectionObserver(function (entries, observer) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					let smallImage = entry.target
					let lazyParentImageDiv = smallImage.parentElement;

					//add effect blurring with effect transition
					smallImage.classList.add('loaded');

					// Load large image
					var largeImage = new Image();
					largeImage.src = lazyParentImageDiv.getAttribute('data-large');
					let alt = lazyParentImageDiv.getAttribute('data-alt');
					largeImage.onload = function () {
						largeImage.classList.add('loaded');
						largeImage.alt = alt;
						largeImage.setAttribute('aria-label', alt);
            largeImage.setAttribute('width', lazyParentImageDiv.offsetWidth);
            largeImage.setAttribute('height', '100%');
						smallImage.replaceWith(largeImage);
					};
          lazyParentImageDiv.setAttribute('style', 'border: none;');
					largeImage.classList.remove("lazy");
					if(entry.intersectionRatio > 0){
						lazyImageObserver.unobserve(smallImage);
					}
				}
			});
		});

		lazyImages.forEach(function (lazyImage) {
			lazyImageObserver.observe(lazyImage);
		});
	}
};
