document.addEventListener("DOMContentLoaded", () => {
    console.log("Page loaded successfully!");
});

document.addEventListener('mousemove', function(event) {
    const glow = document.querySelector('.green-glow');
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Set a transition to smoothly follow the cursor
    glow.style.transition = 'left 0.3s ease, top 0.3s ease'; // 0.3s delay for smoother movement

    // Set the new position of the glow with a small delay
    setTimeout(function() {
        glow.style.left = mouseX - glow.offsetWidth / 2 + 'px';
        glow.style.top = mouseY - glow.offsetHeight / 2 + 'px';
    }, 50); // Slight delay before applying the position change
});
