import { Timer } from './timer.js';

const canvas = document.getElementById('clock');
const ctx = canvas.getContext('2d');

const timer = new Timer();

let task = "";
let animationId;

document.getElementById('startBtn').onclick = () => {
    console.log("START CLICKED");

    task = document.getElementById('task').value;
    timer.start();
    animate();
};

document.getElementById('pauseBtn').onclick = () => {
    if (timer.running) timer.pause();
    else timer.resume();
};

document.getElementById('stopBtn').onclick = async () => {
    const time = timer.stop();

    await window.api.saveSession({
        task,
        duration: time,
        date: new Date()
    });

    cancelAnimationFrame(animationId);
};

function animate() {
    draw();
    animationId = requestAnimationFrame(animate);
}

function draw() {
    const ms = timer.getTime();
    const minutes = ms / 60000;

    ctx.clearRect(0, 0, 300, 300);

    const layers = Math.floor(minutes / 60);
    const progress = (minutes % 60) / 60;

    // 레이어 반복
    for (let i = 0; i <= layers; i++) {
        drawArc(i === layers ? progress : 1, i);
    }
}

function drawArc(progress, layer) {
    const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A29BFE'];

    ctx.beginPath();
    ctx.arc(
        150,
        150,
        100 - layer * 10,
        -Math.PI / 2,
        -Math.PI / 2 + progress * Math.PI * 2
    );

    ctx.strokeStyle = colors[layer % colors.length];
    ctx.lineWidth = 20;
    ctx.stroke();
}