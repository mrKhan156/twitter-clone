const countDown = document.getElementById('countDown');
const countTImer = document.querySelector('#countDown span');

let minutes = 1;
let seconds = 59;

const timer = setInterval(() => {
  if (!(minutes === 0 && seconds === 0)) {
    seconds--;
  } else {
    clearInterval(timer);
    countDown.innerHTML = 'Otp Expired';
    countDown.style.setProperty('color', '#f33838', 'important');
  }
  if (seconds === 0) {
    if (!(minutes === 0 && seconds === 0)) {
      seconds = 59;
      minutes = 0;
    }
  }
  if (!(minutes === 0 && seconds === 0)) {
    countTImer.textContent =
      '0' +
      minutes +
      ':' +
      (seconds.toString().length === 1 ? '0' + seconds : seconds);
  }
}, 1000);
