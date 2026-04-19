import { Timer } from './timer.js';

const canvas = document.getElementById('clock');
const ctx = canvas.getContext('2d');

const timer = new Timer();

const tasks = [];

let currentSession;
let currentTask = null;

let task = "";
let animationId;

let goals = [];
let currentGoal = null;

async function init() {
    goals = await window.api.getGoals();
    currentGoal = goals[0];
}

init();

document.getElementById('startBtn').onclick = () => {
    if (!currentTask) return;

    if (!currentGoal) currentGoal = goals[0];

    if (timer.running) return;

    timer.start();

    currentSession = {
        id: Date.now(),
        goal_id: currentGoal.id,
        task_id: currentTask.id,
        start_time: new Date().toISOString(),
        pause_count: 0
    };

    if (!animationId) animate();
};

document.getElementById('pauseBtn').onclick = () => {
    if (!currentSession) return;

    if (timer.running) {
        console.log("pause");
        currentSession.pause_count += 1;
        timer.pause();
    } else {
        console.log("resume");
        timer.resume();
    }
};

document.getElementById('stopBtn').onclick = async () => {
    const time = timer.stop();
    document.getElementById('current-task').textContent = null;
    removeTask(currentTask.id);

    if (!currentSession) return;
    else {
        currentSession.end_time = new Date().toISOString();
        currentSession.focus_time = Math.floor(time / 60000);
    
        saveSession(currentSession);
        updateGoal(currentGoal.id, time);
    }
    
    // // 타이머 내부 상태 초기화
    // timer.elapsed = 0;
    // timer.running = false;

    // // canvas 초기화
    // ctx.clearRect(0, 0, canvas.width, canvas.height);

    cancelAnimationFrame(animationId);
    animationId = null;
    
    currentTask = null;
    currentSession = null;


    console.log("stop");
};

document.getElementById('addTaskBtn').onclick = () => {
    const input = document.getElementById('taskInput');
    const text = input.value.trim();

    if (!text || !currentGoal) return;

    task = {
        id: Date.now(),
        text,
        goal_id: currentGoal.id
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

    currentGoal = goals.find(g => g.id === task.goal_id) || goals[0];

    document.getElementById('current-task').textContent = task.text;
}

async function saveSession(session) {
    await window.api.saveSession(session);
}

async function updateGoal(goalId, focusTime) {

    const goals = await window.api.getGoals();

    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    goal.total_focus_time += Math.floor(focusTime / 60000);

    // store.set('big_goals', goals);
}

async function findGoal(goalId) {
    const goals = await window.api.getGoals();
    return goals.find(g => g.id === goalId);
}

function removeTask(taskId) {
    const index = tasks.findIndex(t => t.id === taskId);
    if (index === -1) return;

    tasks.splice(index, 1);
    renderTasks();
}