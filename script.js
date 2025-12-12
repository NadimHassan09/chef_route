// Gold Ashes Animation
(function() {
    const ashesContainer = document.getElementById('gold-ashes');
    const particleCount = 60; // Number of gold ash particles
    
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
