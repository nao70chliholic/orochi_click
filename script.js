const startButton = document.getElementById('startButton');
const target = document.getElementById('target');
const timerDisplay = document.getElementById('timer');
const resultDisplay = document.getElementById('result');

let timer;
const EIGHT_HOURS_IN_SECONDS = 8 * 60 * 60;
let timeLeft = EIGHT_HOURS_IN_SECONDS;
let gameStarted = false;

// 初期表示を更新
timerDisplay.textContent = formatTime(timeLeft);

startButton.addEventListener('click', startGame);

function startGame() {
    if (gameStarted) return;

    gameStarted = true;
    timeLeft = EIGHT_HOURS_IN_SECONDS;
    resultDisplay.textContent = '';
    startButton.classList.add('hidden');
    timerDisplay.textContent = formatTime(timeLeft);

    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = formatTime(timeLeft);

        if (timeLeft <= 0) {
            clearInterval(timer);
            showTarget();
        }
    }, 1000);
}

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

function endGame(isSuccess) {
    gameStarted = false;
    if (isSuccess) {
        resultDisplay.textContent = '退勤成功！お疲れ様でした！';
        resultDisplay.style.color = 'green';
    } else {
        resultDisplay.textContent = '退勤失敗...明日も頑張ろう...';
        resultDisplay.style.color = 'red';
    }
    startButton.textContent = 'もう一度勤務する';
    startButton.classList.remove('hidden');
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}