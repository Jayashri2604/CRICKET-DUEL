
// Game Rules: Bat beats Ball, Ball beats Stump, Stump beats Bat
// First to 5 points wins the match!

// ----- STUMP SVG DEFINITION -----
const stumpSvgString = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-5 -7 10 13" width="32" height="38">
        <g stroke="#5a3a1a" stroke-width="0.45" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path d="M -4.04,5.0 L -2.59,1.27 L -1.14,-2.46 L 0.31,-6.19 L 0.32,-6.2" stroke="#7a5628" stroke-width="0.5"/>
            <path d="M -4.04,5.0 L -0.04,5.0 L 3.96,5.0" stroke="#6b451c" stroke-width="0.6"/>
            <path d="M -0.36,5.0 L -0.05,1.01 L 0.26,-2.98 L 0.32,-6.2" stroke="#8b6338" stroke-width="0.55"/>
            <path d="M 0.32,-6.2 L 1.57,-2.4 L 2.82,1.39 L 3.96,5.0" stroke="#7a5628" stroke-width="0.5"/>
        </g>
        <g fill="#b87c3a" opacity="0.35">
            <polygon points="-4.04,5.0 -2.59,1.27 -1.14,-2.46 0.31,-6.19 0.32,-6.2 0.26,-2.98 -0.05,1.01 -0.36,5.0" fill="#c28747" opacity="0.4"/>
            <polygon points="0.32,-6.2 1.57,-2.4 2.82,1.39 3.96,5.0 0.26,-2.98" fill="#b87834" opacity="0.3"/>
        </g>
        <path d="M -1.2,2.5 L -0.6,0.8" stroke="#9b6e3e" stroke-width="0.25" fill="none"/>
        <path d="M 1.8,2.0 L 1.2,0.2" stroke="#9b6e3e" stroke-width="0.25" fill="none"/>
        <circle cx="-0.05" cy="3.2" r="0.2" fill="#ab713c"/>
    </svg>
`;

const stumpDataUrl = "data:image/svg+xml," + encodeURIComponent(stumpSvgString);

// Apply stump icon
document.addEventListener('DOMContentLoaded', function() {
    const stumpIcon = document.getElementById('stumpSvgIcon');
    if (stumpIcon) {
        stumpIcon.style.backgroundImage = `url('${stumpDataUrl}')`;
        stumpIcon.style.backgroundSize = "contain";
        stumpIcon.style.backgroundRepeat = "no-repeat";
        stumpIcon.style.width = "28px";
        stumpIcon.style.height = "28px";
    }
});

// Game state
let playerPoints = 0;
let computerPoints = 0;
let roundCounter = 0;
let matchWinnerDeclared = false;

// DOM Elements
const playerScoreSpan = document.getElementById('playerScoreDisplay');
const computerScoreSpan = document.getElementById('computerScoreDisplay');
const roundWinnerMsgDiv = document.getElementById('roundWinnerMsg');
const gameDetailMsgDiv = document.getElementById('gameDetailMsg');
const roundCountSpan = document.getElementById('roundCount');
const resultArea = document.getElementById('resultArea');
const batBtn = document.getElementById('batBtn');
const ballBtn = document.getElementById('ballBtn');
const stumpBtn = document.getElementById('stumpBtn');
const resetBtn = document.getElementById('resetGameBtn');
const bodyEl = document.body;

function setButtonsEnabled(enabled) {
    const btns = [batBtn, ballBtn, stumpBtn];
    btns.forEach(btn => {
        if (enabled) {
            btn.removeAttribute('disabled');
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
        } else {
            btn.setAttribute('disabled', 'disabled');
            btn.style.opacity = '0.6';
            btn.style.cursor = 'not-allowed';
        }
    });
}

function resetGroundColor() {
    bodyEl.classList.remove('winning-ground');
}

function activateWinningGround() {
    bodyEl.classList.add('winning-ground');
}

function getRoundWinner(user, computer) {
    if (user === computer) return 'tie';
    if (user === 'Bat' && computer === 'Ball') return 'player';
    if (user === 'Ball' && computer === 'Stump') return 'player';
    if (user === 'Stump' && computer === 'Bat') return 'player';
    return 'computer';
}

function getComputerChoice() {
    const rand = Math.random();
    if (rand < 1/3) return 'Bat';
    if (rand < 2/3) return 'Ball';
    return 'Stump';
}

function getResultFlavor(userChoice, computerChoice, winner) {
    const userSym = userChoice === 'Bat' ? '🏏' : (userChoice === 'Ball' ? '⚾' : '🗿');
    const compSym = computerChoice === 'Bat' ? '🏏' : (computerChoice === 'Ball' ? '⚾' : '🗿');
    
    if (winner === 'player') {
        if (userChoice === 'Bat' && computerChoice === 'Ball') return `💥 ${userSym} BAT SMASHES ${compSym} BALL! 🚀 +1`;
        if (userChoice === 'Ball' && computerChoice === 'Stump') return `🎯 ${userSym} BULLSEYE! Ball hits STUMP! 🏆 +1`;
        if (userChoice === 'Stump' && computerChoice === 'Bat') return `🌳 STUMP UPROOTS ${compSym} BAT! 🪓 +1`;
        return `✨ ${userSym} beats ${compSym}! +1 Point ✨`;
    } 
    else if (winner === 'computer') {
        if (computerChoice === 'Bat' && userChoice === 'Ball') return `😵 ${compSym} CPU BAT crushes ${userSym} BALL! 👎 -1`;
        if (computerChoice === 'Ball' && userChoice === 'Stump') return `💢 ${compSym} CPU BALL hits STUMP! 🎯 -1`;
        if (computerChoice === 'Stump' && userChoice === 'Bat') return `🌪️ ${compSym} CPU STUMP shatters BAT! 😤 -1`;
        return `🤖 CPU ${computerChoice} beats ${userChoice}! -1`;
    } 
    else {
        if (userChoice === 'Bat' && computerChoice === 'Bat') return `🤝 Double BAT! Tie — No points`;
        if (userChoice === 'Ball' && computerChoice === 'Ball') return `🌀 Both BALLS collide! Tie`;
        return `🗿 STUMP vs STUMP! Tie round`;
    }
}

function displayUserWinCelebration() {
    roundWinnerMsgDiv.innerHTML = '';
    const winBanner = document.createElement('div');
    winBanner.className = 'winning-banner';
    winBanner.innerHTML = `
        <span>🏆</span>
        <span>🔥 YOU WON THE MATCH! 🔥</span>
        <span>🏆</span>
        <span style="font-size: 0.85rem; display: block; margin-top: 4px;">⭐ CHAMPION OF THE PITCH! ⭐</span>
    `;
    roundWinnerMsgDiv.appendChild(winBanner);
    gameDetailMsgDiv.innerHTML = '🎉 AMAZING VICTORY! Press NEW MATCH to play again 🎉';
    resultArea.classList.add('result-highlight');
    setTimeout(() => resultArea.classList.remove('result-highlight'), 500);
    activateWinningGround();
}

function displayComputerWinCelebration() {
    roundWinnerMsgDiv.innerHTML = '';
    const loseBanner = document.createElement('div');
    loseBanner.className = 'winning-banner computer-win';
    loseBanner.innerHTML = `
        <span>💀</span>
        <span>🤖 COMPUTER WINS! 🤖</span>
        <span>💀</span>
        <span style="font-size: 0.85rem; display: block; margin-top: 4px;">🏏 Better luck next time! 🏏</span>
    `;
    roundWinnerMsgDiv.appendChild(loseBanner);
    gameDetailMsgDiv.innerHTML = '😔 Computer wins the match! Click NEW MATCH for revenge';
    resultArea.classList.add('result-highlight');
    setTimeout(() => resultArea.classList.remove('result-highlight'), 500);
    bodyEl.classList.remove('winning-ground');
}

function updateScoresAndMatchStatus() {
    playerScoreSpan.innerText = playerPoints;
    computerScoreSpan.innerText = computerPoints;
    roundCountSpan.innerText = roundCounter;
    
    if (!matchWinnerDeclared && (playerPoints >= 5 || computerPoints >= 5)) {
        matchWinnerDeclared = true;
        setButtonsEnabled(false);
        if (playerPoints >= 5) {
            displayUserWinCelebration();
        } else {
            displayComputerWinCelebration();
        }
        return true;
    }
    return false;
}

function playGame(userChoice) {
    if (matchWinnerDeclared) {
        gameDetailMsgDiv.innerHTML = "🏁 Match finished! Press NEW MATCH";
        return;
    }
    
    const computerChoice = getComputerChoice();
    const winner = getRoundWinner(userChoice, computerChoice);
    
    const userEmoji = userChoice === 'Bat' ? '🏏' : (userChoice === 'Ball' ? '⚾' : '🗿');
    const compEmoji = computerChoice === 'Bat' ? '🏏' : (computerChoice === 'Ball' ? '⚾' : '🗿');
    
    let pointMessage = "";
    if (winner === 'player') {
        playerPoints++;
        pointMessage = `✅ +1 YOU!`;
    } 
    else if (winner === 'computer') {
        computerPoints++;
        pointMessage = `❌ +1 CPU`;
    } 
    else {
        pointMessage = `⚖️ TIE`;
    }
    
    roundCounter++;
    
    const flavorText = getResultFlavor(userChoice, computerChoice, winner);
    const detailDisplay = `${userEmoji} ${userChoice} vs ${compEmoji} ${computerChoice} — ${flavorText}`;
    
    let roundWinnerText = "";
    if (winner === 'player') roundWinnerText = "🏏 YOU WIN ROUND! 🏏";
    else if (winner === 'computer') roundWinnerText = "🤖 COMPUTER WINS ROUND 🤖";
    else roundWinnerText = "🤝 TIE ROUND 🤝";
    
    roundWinnerMsgDiv.innerHTML = `${roundWinnerText}<span style="display:block; font-size:0.7rem; margin-top:4px;">${pointMessage}</span>`;
    gameDetailMsgDiv.innerHTML = detailDisplay;
    
    roundWinnerMsgDiv.classList.add('result-highlight');
    setTimeout(() => roundWinnerMsgDiv.classList.remove('result-highlight'), 300);
    
    const matchFinished = updateScoresAndMatchStatus();
    if (matchFinished) return;
    
    if (playerPoints === 4 && computerPoints < 4) {
        gameDetailMsgDiv.innerHTML = detailDisplay + "<br>🎯 MATCH POINT! One more round and VICTORY! 🎯";
    } else if (computerPoints === 4 && playerPoints < 4) {
        gameDetailMsgDiv.innerHTML = detailDisplay + "<br>⚠️ DANGER! COMPUTER at match point! ⚠️";
    }
}

function resetGame() {
    playerPoints = 0;
    computerPoints = 0;
    roundCounter = 0;
    matchWinnerDeclared = false;
    
    playerScoreSpan.innerText = "0";
    computerScoreSpan.innerText = "0";
    roundCountSpan.innerText = "0";
    
    roundWinnerMsgDiv.innerHTML = "🏏 NEW MATCH! 🏏";
    gameDetailMsgDiv.innerHTML = "✨ First to 5 points wins! Choose BAT, BALL or STUMP ✨";
    setButtonsEnabled(true);
    resetGroundColor();
    
    roundWinnerMsgDiv.classList.add('result-highlight');
    setTimeout(() => roundWinnerMsgDiv.classList.remove('result-highlight'), 300);
}

// Event listeners
batBtn.addEventListener('click', () => playGame('Bat'));
ballBtn.addEventListener('click', () => playGame('Ball'));
stumpBtn.addEventListener('click', () => playGame('Stump'));
resetBtn.addEventListener('click', resetGame);

// Initialize
setButtonsEnabled(true);
gameDetailMsgDiv.innerHTML = "✨ First to 5 wins! Choose BAT, BALL or STUMP ✨";
roundWinnerMsgDiv.innerHTML = "🏏 CRICKET DUEL 🏏";
resetGroundColor();