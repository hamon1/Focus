const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

// 캔버스를 창 크기에 꽉 채움
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        
        // this.color = `hsl(${Math.random() * 360}, 80%, 60%)`;

        const hue = Math.random() * 15 + 45; 
        const saturation = Math.random() * 20 + 80;
        const lightness = Math.random() * 20 + 50;
        
        this.color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

        this.size = Math.random() * 4 + 1.5;
        
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        
        this.gravity = 0.05;   // 중력 세기
        this.friction = 0.97;  // 공기 저항
        this.alpha = 1;
        this.decay = Math.random() * 0.01; // 사라지는 속도
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        // ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        // ctx.fill();
        ctx.beginPath();
        ctx.fillRect(
            this.x - this.size / 2, 
            this.y - this.size / 2, 
            this.size, 
            this.size
        );
        ctx.restore();
    }

    update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
    }
}

let particles = [];

function init() {
    // 창 정중앙에서 30~40개 파티클 방출
    for (let i = 0; i < 20; i++) {
        particles.push(new Particle(canvas.width / 2, canvas.height / 2));
    }
    animate();
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach((p, i) => {
        p.update();
        p.draw();
        if (p.alpha <= 0) particles.splice(i, 1);
    });

    if (particles.length > 0) {
        requestAnimationFrame(animate);
    }
}

// 스크립트 로드 즉시 실행
init();