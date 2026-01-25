/**
 * PARTICLES ANIMATION
 * Creates an animated particle network (Plexus effect) on canvas
 */

class ParticleNetwork {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };

        // Configuration
        this.config = {
            particleCount: 80,
            particleSize: 2,
            lineDistance: 150,
            particleSpeed: 0.5,
            particleColor: 'rgba(6, 182, 212, 0.8)',
            lineColor: 'rgba(6, 182, 212, 0.15)',
            mouseInteraction: true
        };

        this.init();
        this.bindEvents();
    }

    init() {
        this.resize();
        this.createParticles();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.particles = [];
            this.createParticles();
        });

        if (this.config.mouseInteraction) {
            window.addEventListener('mousemove', (e) => {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
            });

            window.addEventListener('mouseout', () => {
                this.mouse.x = null;
                this.mouse.y = null;
            });
        }
    }

    createParticles() {
        const count = Math.min(this.config.particleCount, Math.floor((this.canvas.width * this.canvas.height) / 15000));

        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.config.particleSpeed,
                vy: (Math.random() - 0.5) * this.config.particleSpeed,
                size: Math.random() * this.config.particleSize + 1
            });
        }
    }

    drawParticle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fillStyle = this.config.particleColor;
        this.ctx.fill();
    }

    drawLine(p1, p2, distance) {
        const opacity = 1 - (distance / this.config.lineDistance);
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.strokeStyle = `rgba(6, 182, 212, ${opacity * 0.2})`;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }

    updateParticle(particle) {
        // Move particle
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > this.canvas.width) {
            particle.vx *= -1;
        }
        if (particle.y < 0 || particle.y > this.canvas.height) {
            particle.vy *= -1;
        }

        // Mouse interaction - push particles away
        if (this.mouse.x !== null && this.config.mouseInteraction) {
            const dx = particle.x - this.mouse.x;
            const dy = particle.y - this.mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.mouse.radius) {
                const force = (this.mouse.radius - distance) / this.mouse.radius;
                particle.x += dx * force * 0.03;
                particle.y += dy * force * 0.03;
            }
        }
    }

    connectParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.config.lineDistance) {
                    this.drawLine(this.particles[i], this.particles[j], distance);
                }
            }

            // Connect to mouse
            if (this.mouse.x !== null && this.config.mouseInteraction) {
                const dx = this.particles[i].x - this.mouse.x;
                const dy = this.particles[i].y - this.mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.mouse.radius) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.mouse.x, this.mouse.y);
                    this.ctx.strokeStyle = `rgba(6, 182, 212, ${(1 - distance / this.mouse.radius) * 0.5})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        for (const particle of this.particles) {
            this.updateParticle(particle);
            this.drawParticle(particle);
        }

        // Draw connections
        this.connectParticles();

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize particles when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        new ParticleNetwork(canvas);
    }
});

export { ParticleNetwork };
