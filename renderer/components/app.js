import { Timer } from './timer.js';


// pomodor 타이머 canvas
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

    window.api.showMeme();

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
    
    
    const duration = timer.getTime();
    addHistory(currentTask.text, duration);

    document.getElementById('current-task').textContent = null;
    removeTask(currentTask.id);

    if (!currentSession) return;
    else {
        currentSession.end_time = new Date().toISOString();
        currentSession.focus_time = Math.floor(time / 60000);
    


        saveSession(currentSession);
        updateGoal(currentGoal.id, time);
    }
    

    cancelAnimationFrame(animationId);
    animationId = null;
    
    currentTask = null;
    currentSession = null;


    console.log("stop");
};

document.getElementById('resetBtn').onclick = () => {
    timer.reset();

    updateDisplay(timer.time);

    currentTask = null;

    document.getElementById('current-task').textContent = '';
}

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

    const baseColor = timer.running ? 'rgba(256, 256, 256, 0.3)' : 'rgba(256, 256, 256, 0.1)';
    const textColor = timer.running ? 'rgba(256, 256, 256, 0.4)' : 'rgba(256, 256, 256, 0.2)'; // 글자도 흐리게

    ctx.beginPath();
    ctx.arc(150, 150, 100, 0, Math.PI * 2);
    ctx.strokeStyle = baseColor;
    ctx.lineWidth = 30;
    ctx.stroke();

    const layers = Math.floor(minutes / 60);
    const progress = (minutes % 60) / 60;

    for (let i = 0; i <= layers; i++) {
        drawArc(i === layers ? progress : 1, i);
    }

    drawTimeText(ms, textColor);
}

function drawArc(progress, layer) {
    const activeColors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A29BFE'];
    // 멈췄을 때는 채도가 낮은 회색 배열 사용
    const pausedColors = ['#bdc3c7', '#95a5a6', '#7f8c8d', '#dcdde1'];

    const colors = timer.running ? activeColors : pausedColors;

    ctx.beginPath();
    ctx.arc(
        150,    // x (center)
        150,    // y (center)
        100, // r
        -Math.PI / 2, // start angle
        -Math.PI / 2 + progress * Math.PI * 2 // finish angle
    );

    ctx.strokeStyle = colors[layer % colors.length];
    ctx.lineWidth = 30;
    ctx.stroke();
}
function drawTimeText(ms, color) {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    // 두 자릿수 포맷팅 (0 -> 00)
    const displayH = h > 0 ? String(h).padStart(2, '0') + ":" : "";
    const displayM = String(m).padStart(2, '0');
    const displayS = String(s).padStart(2, '0');
    const timeString = `${displayH}${displayM}:${displayS}`;

    ctx.fillStyle = color; // text color
    ctx.font = 'bold 40px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    ctx.fillText(timeString, 150, 150);
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
    
    const taskDisplay = document.getElementById('current-task');
    
    taskDisplay.setAttribute('data-text', task.text);
    taskDisplay.textContent = ""; 

    updateButtonStates();
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

function addHistory(goalName, duration) {
    const list = document.getElementById('history-list');

    const item = document.createElement('div');
    item.className = 'history-item';

    const time = new Date().toLocaleTimeString();

    item.textContent = `${goalName} (${time})`;

    list.prepend(item); // 최신 위로
}

function setMode(mode) {
    window.api.setMode(mode);

    document.body.classList.remove('mini', 'timer', 'full');
    document.body.classList.add(mode.toLowerCase());
}

window.setMode = setMode;



