document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('slider');
    const image2 = document.getElementById('image2');
    const canvas = document.getElementById('fireworks');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let fireworks = [];
    let particles = [];
    let audioContext;

    function initAudio() {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    function playSound(frequency, duration) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + duration);
    }

    function playCelebrationSound() {
        const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
        notes.forEach((note, index) => {
            setTimeout(() => playSound(note, 0.2), index * 200);
        });
    }

    // ... (keep the existing Firework, Particle, random, createFireworks, and animate functions)

    animate();

    let fireworksInterval;
    let celebrationTimeout;

    function startCelebration() {
        createFireworks(10);
        fireworksInterval = setInterval(() => createFireworks(3), 1000);
        playCelebrationSound();
        celebrationTimeout = setTimeout(() => {
            clearInterval(fireworksInterval);
        }, 10000);
    }

    function stopCelebration() {
        clearInterval(fireworksInterval);
        clearTimeout(celebrationTimeout);
    }

    slider.addEventListener('input', function() {
        image2.style.opacity = this.value / 100;

        if (this.value == 0 || this.value == 100) {
            stopCelebration();
            startCelebration();
        } else {
            stopCelebration();
        }
    });

    // Initialize audio context on user interaction
    document.body.addEventListener('click', function() {
        if (!audioContext) {
            initAudio();
        }
    }, { once: true });
});
