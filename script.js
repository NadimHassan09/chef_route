// Gold Ashes Animation
(function() {
    const ashesContainer = document.getElementById('gold-ashes');
    const isMobile = window.matchMedia('(max-width: 767.98px)').matches;
    const particleCount = isMobile ? 24 : 60;
    
    // Create gold ash particles
    function createGoldAsh() {
        const ash = document.createElement('div');
        ash.className = 'gold-ash';
        
        // Random starting position anywhere on screen
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;
        
        // Random size variation
        const size = 2 + Math.random() * 4;
        ash.style.width = size + 'px';
        ash.style.height = size + 'px';
        
        // Random opacity
        ash.style.opacity = 0.4 + Math.random() * 0.4;
        
        // Set initial position
        ash.style.left = startX + 'px';
        ash.style.top = startY + 'px';
        
        // Random movement parameters in all directions
        const moveX = (Math.random() - 0.5) * 600; // Random horizontal movement
        const moveY = (Math.random() - 0.5) * 600; // Random vertical movement (both up and down)
        const rotation = Math.random() * 720; // Random rotation
        
        // Random animation duration
        const duration = 15 + Math.random() * 25;
        
        // Create unique animation name
        const animationId = 'float-' + Math.random().toString(36).substr(2, 9);
        
        // Create random intermediate points for more organic movement
        const mid1X = (Math.random() - 0.5) * 400;
        const mid1Y = (Math.random() - 0.5) * 400;
        const mid2X = (Math.random() - 0.5) * 400;
        const mid2Y = (Math.random() - 0.5) * 400;
        
        // Create keyframes with random path
        const keyframes = `
            @keyframes ${animationId} {
                0% {
                    transform: translate(0, 0) rotate(0deg);
                    opacity: ${ash.style.opacity};
                }
                25% {
                    transform: translate(${mid1X}px, ${mid1Y}px) rotate(${rotation * 0.25}deg);
                    opacity: ${parseFloat(ash.style.opacity) * 0.9};
                }
                50% {
                    transform: translate(${mid2X}px, ${mid2Y}px) rotate(${rotation * 0.5}deg);
                    opacity: ${parseFloat(ash.style.opacity) * 0.7};
                }
                75% {
                    transform: translate(${moveX * 0.8}px, ${moveY * 0.8}px) rotate(${rotation * 0.75}deg);
                    opacity: ${parseFloat(ash.style.opacity) * 0.5};
                }
                100% {
                    transform: translate(${moveX}px, ${moveY}px) rotate(${rotation}deg);
                    opacity: ${parseFloat(ash.style.opacity) * 0.3};
                }
            }
        `;
        
        // Add keyframes to style
        if (!document.getElementById('dynamic-ashes-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'dynamic-ashes-styles';
            document.head.appendChild(styleSheet);
        }
        
        const styleSheet = document.getElementById('dynamic-ashes-styles');
        styleSheet.textContent += keyframes;
        
        // Start animation immediately from a random point in the cycle
        // Use negative delay to start partway through animation (makes them appear already in motion)
        const randomProgress = Math.random(); // 0 to 1, represents how far through animation to start
        const negativeDelay = -(randomProgress * duration); // Negative delay to start mid-animation
        
        ash.style.animationName = animationId;
        ash.style.animationDuration = duration + 's';
        ash.style.animationDelay = negativeDelay + 's';
        ash.style.animationTimingFunction = 'ease-in-out';
        ash.style.animationIterationCount = '1';
        ash.style.animationFillMode = 'forwards';
        
        ashesContainer.appendChild(ash);
        
        // Regenerate animation after it completes to keep movement random
        setTimeout(() => {
            ash.remove();
            styleSheet.textContent = styleSheet.textContent.replace(
                new RegExp(`@keyframes ${animationId}[^}]*\\}[^}]*\\}[^}]*\\}[^}]*\\}[^}]*\\}`, 'g'),
                ''
            );
            createGoldAsh();
        }, duration * 1000);
    }
    
    // Initialize particles
    function initParticles() {
        // Clear existing particles
        const existingAshes = document.querySelectorAll('.gold-ash');
        existingAshes.forEach(ash => ash.remove());
        
        // Create all particles immediately
        for (let i = 0; i < particleCount; i++) {
            createGoldAsh();
        }
    }
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            initParticles();
        }, 250);
    });
    
    // Start animation when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initParticles);
    } else {
        initParticles();
    }
    
    // Continuously create new particles
    setInterval(() => {
        if (document.querySelectorAll('.gold-ash').length < particleCount) {
            createGoldAsh();
        }
    }, 2000);
})();

/* Menu coverflow — seamless infinite loop */
(function () {
    const coverflow = document.querySelector('.menu-coverflow');
    if (!coverflow) return;

    const viewport = coverflow.querySelector('.menu-coverflow-viewport');
    const track = coverflow.querySelector('.menu-coverflow-track');
    const originals = [...coverflow.querySelectorAll('.menu-coverflow-slide')];
    const count = originals.length;
    if (!count || !viewport || !track) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    originals.forEach((slide) => {
        const img = slide.querySelector('img');
        if (img) img.setAttribute('loading', 'eager');
    });

    function cloneSlide(slide, type) {
        const clone = slide.cloneNode(true);
        clone.dataset.clone = type;
        clone.setAttribute('aria-hidden', 'true');
        clone.removeAttribute('tabindex');
        const img = clone.querySelector('img');
        if (img) {
            img.setAttribute('loading', 'eager');
            img.decoding = 'async';
        }
        return clone;
    }

    const cloneLast = cloneSlide(originals[count - 1], 'prepend');
    const cloneFirst = cloneSlide(originals[0], 'append');
    track.insertBefore(cloneLast, originals[0]);
    track.appendChild(cloneFirst);

    const slides = [...track.querySelectorAll('.menu-coverflow-slide')];
    const total = slides.length;
    const FIRST_REAL = 1;
    const LAST_REAL = count;
    const CLONE_FIRST = count + 1;
    const CLONE_LAST = 0;

    let positionIndex = FIRST_REAL;
    let paused = false;
    let intervalId = null;
    let isAnimating = false;
    const intervalMs = 4000;
    const mobileQuery = window.matchMedia('(max-width: 767.98px)');

    function isMobileSlider() {
        return mobileQuery.matches;
    }

    let firstImagePrimed = false;

    function preloadFirstImage() {
        if (firstImagePrimed) return;
        const src = originals[0].querySelector('img')?.getAttribute('src');
        if (!src) return;
        firstImagePrimed = true;

        const loader = new Image();
        loader.src = src;

        const firstImg = originals[0].querySelector('img');
        const cloneFirstImg = slides[CLONE_FIRST]?.querySelector('img');
        [firstImg, cloneFirstImg].forEach((img) => {
            if (img?.decode) img.decode().catch(() => {});
        });
    }

    function preloadRemainingImages() {
        const firstSrc = originals[0].querySelector('img')?.getAttribute('src');
        const sources = new Set();
        slides.forEach((slide) => {
            const src = slide.querySelector('img')?.getAttribute('src');
            if (src && src !== firstSrc) sources.add(src);
        });
        sources.forEach((src) => {
            const img = new Image();
            img.src = src;
        });
    }

    function maybePreloadFirstForLoop() {
        if (positionIndex === LAST_REAL - 1) {
            preloadFirstImage();
        }
    }

    function getOffset(index) {
        let offset = index - positionIndex;
        if (offset > total / 2) offset -= total;
        if (offset < -total / 2) offset += total;
        return offset;
    }

    function getLogicalIndex(pos) {
        if (slides[pos].dataset.clone === 'prepend') return count - 1;
        if (slides[pos].dataset.clone === 'append') return 0;
        return pos - 1;
    }

    function setTransitionEnabled(enabled) {
        track.classList.toggle('no-transition', !enabled);
    }

    function centerOffsetFor(index) {
        const slide = slides[index];
        const viewportCenter = viewport.offsetWidth / 2;
        const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
        return viewportCenter - slideCenter;
    }

    function applySlideStates() {
        slides.forEach((slide, i) => {
            const offset = getOffset(i);
            slide.classList.remove('is-active', 'is-side', 'is-hidden');
            if (offset === 0) {
                slide.classList.add('is-active');
            } else if (Math.abs(offset) === 1) {
                slide.classList.add('is-side');
            } else {
                slide.classList.add('is-hidden');
            }
        });

        const activeSlide = slides[positionIndex];
        if (!activeSlide.matches(':hover') && document.activeElement !== activeSlide) {
            paused = false;
        }
    }

    function render(animate) {
        applySlideStates();

        if (isMobileSlider()) {
            setTransitionEnabled(false);
            track.style.transform = 'translateX(0)';
            maybePreloadFirstForLoop();
            return;
        }

        setTransitionEnabled(animate && !reducedMotion);
        void track.offsetHeight;
        track.style.transform = `translateX(${centerOffsetFor(positionIndex)}px)`;
        maybePreloadFirstForLoop();
    }

    function snapIfClone() {
        const active = slides[positionIndex];
        if (!active.dataset.clone) {
            isAnimating = false;
            return;
        }

        positionIndex = active.dataset.clone === 'append' ? FIRST_REAL : LAST_REAL;

        setTransitionEnabled(false);
        applySlideStates();
        track.offsetHeight;
        track.style.transform = `translateX(${centerOffsetFor(positionIndex)}px)`;

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setTransitionEnabled(true);
                isAnimating = false;
            });
        });
    }

    function goTo(logicalIndex) {
        positionIndex = ((logicalIndex % count) + count) % count + FIRST_REAL;
        isAnimating = false;
        render(true);
    }

    function next() {
        if (isAnimating) return;
        isAnimating = true;
        positionIndex += 1;
        render(true);

        if (reducedMotion || isMobileSlider()) snapIfClone();
    }

    function prev() {
        if (isAnimating) return;
        isAnimating = true;
        positionIndex -= 1;
        render(true);

        if (reducedMotion || isMobileSlider()) snapIfClone();
    }

    function onTransitionEnd(e) {
        if (e.target !== track || e.propertyName !== 'transform') return;
        if (positionIndex === CLONE_FIRST || positionIndex === CLONE_LAST) {
            snapIfClone();
        } else {
            isAnimating = false;
        }
    }

    function startAutoplay() {
        if (reducedMotion || intervalId) return;
        intervalId = setInterval(() => {
            if (!paused) next();
        }, intervalMs);
    }

    track.addEventListener('transitionend', onTransitionEnd);

    slides.forEach((slide, i) => {
        if (slide.dataset.clone) return;

        const logical = getLogicalIndex(i);
        slide.setAttribute('tabindex', '0');
        slide.addEventListener('click', () => goTo(logical));
        slide.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                goTo(logical);
            }
        });
        slide.addEventListener('mouseenter', () => {
            if (slide.classList.contains('is-active')) paused = true;
        });
        slide.addEventListener('mouseleave', () => {
            if (slide.classList.contains('is-active')) paused = false;
        });
        slide.addEventListener('focusin', () => {
            if (slide.classList.contains('is-active')) paused = true;
        });
        slide.addEventListener('focusout', () => {
            if (slide.classList.contains('is-active')) paused = false;
        });
    });

    function onResize() {
        isAnimating = false;
        render(false);
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(onResize, 100);
    });

    if (typeof ResizeObserver !== 'undefined') {
        const ro = new ResizeObserver(() => onResize());
        ro.observe(viewport);
    }

    mobileQuery.addEventListener('change', onResize);

    let touchStartX = 0;
    let touchStartY = 0;
    viewport.addEventListener(
        'touchstart',
        (e) => {
            touchStartX = e.changedTouches[0].clientX;
            touchStartY = e.changedTouches[0].clientY;
        },
        { passive: true }
    );
    viewport.addEventListener(
        'touchend',
        (e) => {
            const dx = e.changedTouches[0].clientX - touchStartX;
            const dy = e.changedTouches[0].clientY - touchStartY;
            if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
            if (dx < 0) next();
            else prev();
        },
        { passive: true }
    );

    render(false);
    requestAnimationFrame(() => {
        render(false);
        requestAnimationFrame(() => {
            onResize();
            startAutoplay();
        });
    });

    window.addEventListener('load', onResize);
    preloadRemainingImages();
})();

/* Booking form → receipt page */
(function () {
    const form = document.getElementById('reservationForm');
    if (!form) return;

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const params = new URLSearchParams({
            name: formData.get('name') || '',
            email: formData.get('email') || '',
            date: formData.get('date') || '',
            time: formData.get('time') || '',
            guests: formData.get('guests') || '1',
        });

        window.location.href = `receipt.html?${params.toString()}`;
    });
})();
