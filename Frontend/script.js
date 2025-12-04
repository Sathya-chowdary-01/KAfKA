window.addEventListener('DOMContentLoaded', () => {
    const welcomeText = document.getElementById('welcome-text');
    const tagline = document.getElementById('tagline');
    const continueBtn = document.getElementById('continue-btn');

    // Reveal animation
    setTimeout(() => { welcomeText.style.opacity = 1; }, 500);
    setTimeout(() => { tagline.style.opacity = 1; }, 2500);

    // Continue button -> login page
    continueBtn.addEventListener('click', () => {
        window.location.href = 'login.html';
    });
});
