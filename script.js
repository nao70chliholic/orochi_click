const startButton = document.getElementById('startButton');
const target = document.getElementById('target');
const timerDisplay = document.getElementById('timer');
const resultDisplay = document.getElementById('result');
const breakTimeInput = document.getElementById('breakTimeInput');
const breakTimeContainer = document.getElementById('break-time-container');

const EIGHT_HOURS_IN_MS = 8 * 60 * 60 * 1000;
let timerInterval;

// --- 初期化処理 ---
window.addEventListener('load', initializeGame);
breakTimeInput.addEventListener('input', updateInitialTimerDisplay);

function initializeGame() {
    const endTime = localStorage.getItem('endTime');
    if (endTime) {
        // 実行中のタイマーがある場合
        breakTimeContainer.classList.add('hidden');
        startButton.classList.add('hidden');
        startTimer(parseInt(endTime, 10));
    } else {
        // 新規ゲームの場合
        updateInitialTimerDisplay();
    }
}

function updateInitialTimerDisplay() {
    const breakMinutes = parseInt(breakTimeInput.value, 10) || 0;
    const totalSeconds = (EIGHT_HOURS_IN_MS / 1000) + (breakMinutes * 60);
    timerDisplay.textContent = formatTime(totalSeconds);
}

// --- ゲーム開始処理 ---
startButton.addEventListener('click', () => {
    const breakMinutes = parseInt(breakTimeInput.value, 10) || 0;
    const breakTimeInMs = breakMinutes * 60 * 1000;
    const totalWorkTimeMs = EIGHT_HOURS_IN_MS + breakTimeInMs;

    const startTime = new Date().getTime();
    const endTime = startTime + totalWorkTimeMs;

    localStorage.setItem('endTime', endTime);

    breakTimeContainer.classList.add('hidden');
    startButton.classList.add('hidden');
    resultDisplay.textContent = '';

    startTimer(endTime);
});

// --- タイマー処理 ---
function startTimer(endTime) {
    timerInterval = setInterval(() => {
        const now = new Date().getTime();
        const timeLeft = endTime - now;

        if (timeLeft > 0) {
            timerDisplay.textContent = formatTime(Math.ceil(timeLeft / 1000));
        } else {
            clearInterval(timerInterval);
            timerDisplay.textContent = "00:00:00";
            showTarget();
        }
    }, 1000);
}

// --- クリックターゲット処理 ---
function showTarget() {
    target.classList.remove('hidden');
    const targetTimer = setTimeout(() => {
        target.classList.add('hidden');
        endGame(false); // 失敗
    }, 10000); // 10秒

    target.onclick = () => {
        clearTimeout(targetTimer);
        target.classList.add('hidden');
        endGame(true); // 成功
    };
}

// --- ゲーム終了処理 ---
function endGame(isSuccess) {
    localStorage.removeItem('endTime');
    if (isSuccess) {
        resultDisplay.textContent = '退勤成功！お疲れ様でした！';
        resultDisplay.style.color = 'green';
    } else {
        resultDisplay.textContent = '退勤失敗...明日も頑張ろう...';
        resultDisplay.style.color = 'red';
    }
    startButton.textContent = 'もう一度勤務する';
    startButton.classList.remove('hidden');
    breakTimeContainer.classList.remove('hidden');
    updateInitialTimerDisplay(); // タイマー表示をリセット
}

// --- ユーティリティ ---
function formatTime(seconds) {
    if (seconds < 0) seconds = 0;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}