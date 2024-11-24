const board = document.getElementById('game-board');
const resetBtn = document.getElementById('reset-btn');
const message = document.getElementById('message');
const attemptsHistory = document.getElementById('attempts-history');
const toggleHistoryBtn = document.getElementById('toggle-history-btn');
const historyContainer = document.getElementById('history-container');

let cards = [];
let flippedCards = [];
let matches = 0;
let attempts = 0;
let isGameOver = false;

const images = ['🍎', '🍌', '🍇', '🍎', '🍌', '🍇'];

function initGame() {
    isGameOver = false;
    matches = 0;
    attempts = 0;
    flippedCards = [];
    cards = [];
    message.textContent = '';
    board.innerHTML = '';
    loadHistory();
    const shuffledImages = images.sort(() => Math.random() - 0.5);

    shuffledImages.forEach((image, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.image = image;

        const front = document.createElement('div');
        front.classList.add('front');
        front.textContent = image;

        const back = document.createElement('div');
        back.classList.add('back');

        card.appendChild(front);
        card.appendChild(back);
        board.appendChild(card);

        cards.push(card);

        card.addEventListener('click', () => flipCard(card));
    });
}

function flipCard(card) {
    if (flippedCards.length < 2 && !card.classList.contains('flipped') && !isGameOver) {
        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            attempts++;
            setTimeout(checkMatch, 800);
        }
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.image === card2.dataset.image) {
        matches++;
        flippedCards = [];
        if (matches === images.length / 2) {
            message.textContent = 'PARABÉNS! Você venceu!';
            saveGame(true);
        }
    } else {
        flippedCards.forEach(card => card.classList.remove('flipped'));
        flippedCards = [];
    }
}

function saveGame(won) {
    const games = localStorage.getItem('games') ? JSON.parse(localStorage.getItem('games')) : [];
    games.push({
        attempts: attempts,
        result: won ? 'Venceu' : 'Não venceu'
    });
    localStorage.setItem('games', JSON.stringify(games));
    updateHistory();
}

function loadHistory() {
    const games = JSON.parse(localStorage.getItem('games')) || [];
    attemptsHistory.innerHTML = '';
    games.forEach((game, index) => {
        const li = document.createElement('li');
        li.textContent = `Partida ${index + 1}: ${game.attempts} tentativas, ${game.result}`;
        attemptsHistory.appendChild(li);
    });
}

function updateHistory() {
    loadHistory();
}

resetBtn.addEventListener('click', () => {
    if (!isGameOver) {
        saveGame(false);
    }
    initGame();
});

toggleHistoryBtn.addEventListener('click', () => {
    if (historyContainer.style.display === 'none') {
        historyContainer.style.display = 'block';
        toggleHistoryBtn.textContent = 'Ocultar Histórico';
    } else {
        historyContainer.style.display = 'none';
        toggleHistoryBtn.textContent = 'Mostrar Histórico';
    }
});

initGame();
