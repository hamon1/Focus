import { Timer } from './timer.js';

const canvas = document.getElementById('clock');
const ctx = canvas.getContext('2d');

const timer = new Timer();

const tasks = [];
let currentTask = null;
let currentGoal;

let task = "";
let animationId;

document.getElementById('startBtn').onclick = () => {
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

    if (!currentTask) return;

    await window.api.saveSession({
        task: currentTask.text,
        duration: time,
        date: new Date()
    });

    cancelAnimationFrame(animationId);
};

document.getElementById('addTaskBtn').onclick = () => {
    const input = document.getElementById('taskInput');
    const text = input.value.trim();

    if (!text) return;

    const task = {
        id: Date.now(),
        text,
    };

    tasks.push(task);
    input.value = "";

    renderTasks();
}

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
        150,    // x (center)
        150,    // y (center)
        100, // r
        -Math.PI / 2, // start angle
        -Math.PI / 2 + progress * Math.PI * 2 // finish angle
    );

    ctx.strokeStyle = colors[layer % colors.length];
    ctx.lineWidth = 20;
    ctx.stroke();
}

function renderTasks() {
    const list = document.getElementById('taskList');
    list.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement('li');
    
        li.textContent = task.text;
    
        li.onclick = () => {
            selectTask(task);
        };
    
        list.appendChild(li);
    });
}

function selectTask(task) {
    currentTask = task;

    document.getElementById('current-task').textContent = task.text;

    timer.start();
    animate();
}