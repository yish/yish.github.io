document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('slider');
    const image2 = document.getElementById('image2');
    const canvas = document.getElementById('fireworks');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let fireworks = [];
    let particles = [];
    let balloons = [];
    let audioContext;

    // ... (keep the existing audio-related functions)

    function Balloon() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 50;
        this.speed = Math.random() * 1 + 0.5;
        this.size = 50;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        this.popped = false;

        this.update = function() {
            if (!this.popped) {
                this.y -= this.speed;
                if (this.y <= 0) {
                    this.pop();
                }
            }
        }

        this.draw = function() {
            if (!this.popped) {
                ctx.save();
                ctx.translate(this.x, this.y);

                // Draw balloon body
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(this.size/2, -this.size/2, this.size/2, -this.size, 0, -this.size);
                ctx.bezierCurveTo(-this.size/2, -this.size, -this.size/2, -this.size/2, 0, 0);
                ctx.fillStyle = this.color;
                ctx.fill();

                // Draw balloon knot
                ctx.beginPath();
                ctx.moveTo(-3, 0);
                ctx.lineTo(3, 0);
                ctx.lineTo(0, 5);
                ctx.closePath();
                ctx.fillStyle = this.color;
                ctx.fill();

                // Draw "picture" circle
                ctx.beginPath();
                ctx.arc(0, -this.size/2, this.size/4, 0, Math.PI * 2);
                ctx.fillStyle = 'white';
                ctx.fill();
                ctx.strokeStyle = 'rgba(0,0,0,0.3)';
                ctx.stroke();

                ctx.restore();
            }
        }

        this.pop = function() {
            this.popped = true;
            createSparkles(this.x, this.y);
            playSound(523.25, 0.1); // Play a short high-pitched sound
        }
    }

    function createSparkles(x, y) {
        for (let i = 0; i < 30; i++) {
            particles.push(new Particle(x, y, `hsl(${Math.random() * 360}, 100%, 50%)`));
        }
    }

    // ... (keep the existing Firework, Particle, random, createFireworks functions)

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

        balloons.forEach((balloon, index) => {
            balloon.update();
            balloon.draw();
            if (balloon.popped && balloon.y < 0) balloons.splice(index, 1);
        });

        requestAnimationFrame(animate);
    }

    animate();

    let fireworksInterval;
    let balloonsInterval;
    let celebrationTimeout;

    function startCelebration() {
        createFireworks(10);
        fireworksInterval = setInterval(() => createFireworks(3), 1000);
        playCelebrationSound();
        
        celebrationTimeout = setTimeout(() => {
            clearInterval(fireworksInterval);
            balloonsInterval = setInterval(() => {
                balloons.push(new Balloon());
            }, 1000);
        }, 5000);

        setTimeout(() => {
            clearInterval(balloonsInterval);
        }, 15000);
    }

    function stopCelebration() {
        clearInterval(fireworksInterval);
        clearInterval(balloonsInterval);
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
