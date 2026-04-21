let seconds = 5;
const countdown = document.getElementById('countdown');

setInterval(() => {
    seconds--;
    countdown.textContent = seconds;
    if (seconds <= 0) {
        window.location.href = '../inscription.html';
    }
}, 1000);