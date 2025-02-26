document.addEventListener('DOMContentLoaded', () => {
    // Menu Burger
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.nav_menu');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Fermer le menu quand on clique sur un lien
    document.querySelectorAll('.menuItem').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));

    // Carousel functionality (ne s'exécutera que sur la page d'accueil)
    const slides = document.querySelectorAll('.carousel-slide');
    if (slides.length > 0) {
        const prevButton = document.querySelector('.prev');
        const nextButton = document.querySelector('.next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentSlide = 0;
        let autoSlideInterval;
        let resetTimeout;

        // Create dots
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetAutoSlide();
            });
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.dot');

        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            slides[index].classList.add('active');
            dots[index].classList.add('active');
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }

        function previousSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        }

        function goToSlide(index) {
            currentSlide = index;
            showSlide(currentSlide);
        }

        function startAutoSlide() {
            // S'assurer qu'il n'y a pas d'intervalle existant
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
            }
            autoSlideInterval = setInterval(nextSlide, 5000);
        }

        function resetAutoSlide() {
            // Nettoyer l'intervalle existant
            clearInterval(autoSlideInterval);
            // Nettoyer le timeout existant s'il y en a un
            if (resetTimeout) {
                clearTimeout(resetTimeout);
            }
            // Créer un nouveau timeout
            resetTimeout = setTimeout(startAutoSlide, 5000);
        }

        // Show first slide
        showSlide(0);

        // Event listeners avec debounce pour éviter les clics rapides
        let isClickable = true;
        
        prevButton.addEventListener('click', () => {
            if (isClickable) {
                isClickable = false;
                previousSlide();
                resetAutoSlide();
                // Réactiver les clics après 500ms
                setTimeout(() => {
                    isClickable = true;
                }, 500);
            }
        });
        
        nextButton.addEventListener('click', () => {
            if (isClickable) {
                isClickable = false;
                nextSlide();
                resetAutoSlide();
                // Réactiver les clics après 500ms
                setTimeout(() => {
                    isClickable = true;
                }, 500);
            }
        });

        // Start auto-advance
        startAutoSlide();
    }

    // Smooth scroll (ne s'exécutera que sur la page d'accueil)
    const menuItems = document.querySelectorAll('.menuItem[href^="#"]');
    if (menuItems.length > 0) {
        // Fonction de scroll fluide
        function smoothScroll(target, duration) {
            const targetElement = document.querySelector(target);
            const targetPosition = targetElement.offsetTop - 50; // -50px pour laisser un peu d'espace en haut
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            let startTime = null;

            function animation(currentTime) {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const run = ease(timeElapsed, startPosition, distance, duration);
                window.scrollTo(0, run);
                if (timeElapsed < duration) requestAnimationFrame(animation);
            }

            // Fonction d'easing pour un scroll plus naturel
            function ease(t, b, c, d) {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t + b;
                t--;
                return -c / 2 * (t * (t - 2) - 1) + b;
            }

            requestAnimationFrame(animation);
        }

        // Ajouter l'événement de scroll fluide aux liens du menu
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.currentTarget.getAttribute('href');
                smoothScroll(target, 1000); // 1000ms = 1 seconde pour l'animation
                
                // Fermer le menu burger si ouvert
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
});