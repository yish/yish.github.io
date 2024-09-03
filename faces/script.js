document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('slider');
    const image2 = document.getElementById('image2');
    const canvas = document.getElementById('fireworks');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let fireworks = [];
    let particles = [];

    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    function Firework() {
        this.x = canvas.width / 2;
        this.y = canvas.height;
        this.sx = random(-2, 2);
        this.sy = random(-10, -15);
        this.size = 4;
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
        this.sx = random(-1, 1);
        this.sy = random(-1, 1);
        this.size = 2;
        this.color = color;
        this.life = 100;

        this.update = function() {
            this.x += this.sx;
            this.y += this.sy;
            this.sy += 0.02;
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
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        fireworks.forEach((fw, index) => {
            fw.update();
            fw.draw();

            if (fw.sy >= 0 || fw.size <= 0.2) {
                for (let i = 0; i < 50; i++) {
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

    slider.addEventListener('input', function() {
        image2.style.opacity = this.value / 100;

        if (this.value == 0 || this.value == 100) {
            createFireworks(5);
        }
    });
});
