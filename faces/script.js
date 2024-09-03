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

    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    function Firework() {
        this.x = random(canvas.width * 0.2, canvas.width * 0.8);
        this.y = canvas.height;
        this.sx = random(-2, 2);
        this.sy = random(-12, -15);
        this.size = random(2, 4);
        this.color = `hsl(${random(0, 360)}, 100%, 50%)`;

        this.update = function() {
            this.x += this.sx;
            this.y += this.sy;
            this.sy += 0.1;
            if (this.size > 0.2) this.size -= 0.1;
        }

        this.draw = function() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function Particle(x, y, color) {
        this.x = x;
        this.y = y;
        this.sx = random(-3, 3);
        this.sy = random(-3, 3);
        this.size = random(1, 3);
        this.color = color;
        this.life = 150;

        this.update = function() {
            this.x += this.sx;
            this.y += this.sy;
            this.sy += 0.05;
            if (this.size > 0.1) this.size -= 0.02;
            this.life--;
        }

        this.draw = function() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function createFireworks(num) {
        for (let i = 0; i < num; i++) {
            fireworks.push(new Firework());
        }
    }

    function animate() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        fireworks.forEach((fw, index) => {
            fw.update();
            fw.draw();

            if (fw.sy >= random(-3, 0) || fw.size <= 0.2) {
                for (let i = 0; i < 100; i++) {
                    particles.push(new Particle(fw.x, fw.y, fw.color));
                }
                fireworks.splice(index, 1);
            }
        });

        particles.forEach((p, index) => {
            p.update();
            p.draw();
            if (p.life <= 0) particles.splice(index, 1);
        });

        requestAnimationFrame(animate);
    }

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
