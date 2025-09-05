document.addEventListener('DOMContentLoaded', function() {
    const unicorn = document.querySelector('.unicorn');
    const unicornSvg = unicorn.querySelector('svg');
    const mouth = unicornSvg.querySelector('.mouth');
    const logos = document.querySelectorAll('.logo');
    
    let isEating = false;
    let eatCount = 0;
    
    // Function to check if unicorn is close to a logo
    function checkCollision(logo) {
        const unicornRect = unicorn.getBoundingClientRect();
        const logoRect = logo.getBoundingClientRect();
        
        const unicornCenterX = unicornRect.left + unicornRect.width * 0.3; // Mouth position
        const unicornCenterY = unicornRect.top + unicornRect.height * 0.4;
        
        const logoCenterX = logoRect.left + logoRect.width / 2;
        const logoCenterY = logoRect.top + logoRect.height / 2;
        
        const distance = Math.sqrt(
            Math.pow(unicornCenterX - logoCenterX, 2) + 
            Math.pow(unicornCenterY - logoCenterY, 2)
        );
        
        return distance < 80; // Collision threshold
    }
    
    // Function to eat a logo
    function eatLogo(logo) {
        if (isEating) return;
        
        isEating = true;
        eatCount++;
        
        // Add chomping animation to unicorn
        unicorn.classList.add('chomping');
        
        // Add eating animation to logo
        logo.classList.add('eating');
        
        // Create eating sound effect (visual feedback)
        createEatingEffect(logo);
        
        // Remove logo after animation
        setTimeout(() => {
            logo.style.display = 'none';
            unicorn.classList.remove('chomping');
            isEating = false;
            
            // Check if all logos are eaten
            if (eatCount >= logos.length) {
                setTimeout(showVictoryMessage, 500);
            }
        }, 2000);
    }
    
    // Function to create eating effect
    function createEatingEffect(logo) {
        const logoRect = logo.getBoundingClientRect();
        
        // Create particle effects
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = '8px';
            particle.style.height = '8px';
            particle.style.backgroundColor = getRandomColor();
            particle.style.borderRadius = '50%';
            particle.style.left = logoRect.left + Math.random() * logoRect.width + 'px';
            particle.style.top = logoRect.top + Math.random() * logoRect.height + 'px';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '20';
            
            document.body.appendChild(particle);
            
            // Animate particle
            const angle = Math.random() * 2 * Math.PI;
            const distance = 50 + Math.random() * 50;
            const endX = logoRect.left + Math.cos(angle) * distance;
            const endY = logoRect.top + Math.sin(angle) * distance;
            
            particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${endX - logoRect.left}px, ${endY - logoRect.top}px) scale(0)`, opacity: 0 }
            ], {
                duration: 1000,
                easing: 'ease-out'
            }).onfinish = () => particle.remove();
        }
    }
    
    // Function to get random color for particles
    function getRandomColor() {
        const colors = ['#ff69b4', '#ffd700', '#87ceeb', '#98fb98', '#dda0dd', '#f0e68c'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // Function to show victory message
    function showVictoryMessage() {
        const message = document.createElement('div');
        message.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(45deg, #ff69b4, #ffd700);
                color: white;
                padding: 30px 50px;
                border-radius: 20px;
                font-size: 28px;
                font-weight: bold;
                text-align: center;
                box-shadow: 0 8px 25px rgba(0,0,0,0.3);
                z-index: 100;
                animation: victoryPulse 2s ease-in-out infinite;
            ">
                🦄 OMNOMNOM! 🦄<br>
                <span style="font-size: 18px;">All logos have been consumed!</span>
            </div>
        `;
        
        // Add victory animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes victoryPulse {
                0%, 100% { transform: translate(-50%, -50%) scale(1); }
                50% { transform: translate(-50%, -50%) scale(1.05); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(message);
        
        // Reset after 5 seconds
        setTimeout(resetGame, 5000);
    }
    
    // Function to reset the game
    function resetGame() {
        eatCount = 0;
        isEating = false;
        
        // Remove victory message
        const victoryMessage = document.querySelector('div[style*="position: fixed"]');
        if (victoryMessage && victoryMessage.parentNode) {
            victoryMessage.parentNode.removeChild(victoryMessage);
        }
        
        // Reset logos
        logos.forEach(logo => {
            logo.style.display = 'block';
            logo.classList.remove('eating');
        });
        
        unicorn.classList.remove('chomping');
    }
    
    // Main animation loop
    function animationLoop() {
        if (!isEating) {
            logos.forEach(logo => {
                if (logo.style.display !== 'none' && checkCollision(logo)) {
                    eatLogo(logo);
                }
            });
        }
        
        requestAnimationFrame(animationLoop);
    }
    
    // Add click handlers for manual eating
    logos.forEach(logo => {
        logo.addEventListener('click', () => {
            if (logo.style.display !== 'none' && !isEating) {
                eatLogo(logo);
            }
        });
        
        // Add hover effect
        logo.addEventListener('mouseenter', () => {
            if (logo.style.display !== 'none') {
                logo.querySelector('.logo-text').style.transform = 'scale(1.1) rotate(5deg)';
            }
        });
        
        logo.addEventListener('mouseleave', () => {
            if (logo.style.display !== 'none') {
                logo.querySelector('.logo-text').style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
    
    // Start the animation loop
    animationLoop();
    
    // Add some random sparkle effects
    function createSparkles() {
        const sparkle = document.createElement('div');
        sparkle.innerHTML = '✨';
        sparkle.style.position = 'absolute';
        sparkle.style.left = Math.random() * window.innerWidth + 'px';
        sparkle.style.top = Math.random() * window.innerHeight + 'px';
        sparkle.style.fontSize = (10 + Math.random() * 20) + 'px';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '1';
        
        document.body.appendChild(sparkle);
        
        sparkle.animate([
            { transform: 'scale(0) rotate(0deg)', opacity: 0 },
            { transform: 'scale(1) rotate(180deg)', opacity: 1 },
            { transform: 'scale(0) rotate(360deg)', opacity: 0 }
        ], {
            duration: 3000,
            easing: 'ease-in-out'
        }).onfinish = () => sparkle.remove();
    }
    
    // Create sparkles periodically
    setInterval(createSparkles, 2000);
});