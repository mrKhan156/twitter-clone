const passwordEl = document.querySelector('#password');
const passwordIcon = document.querySelector('#passwordIcon');
const confirmPasswordEl = document.querySelector('#confirmPassword');
const confirmPasswordIcon = document.querySelector('#confirmPasswordIcon');

const passErros = document.querySelector('#passErrors');

passErros.hidden = true;

//password show hide handler

function passwordShowHide(handler, field) {
  handler.addEventListener('click', function (e) {
    const i = handler.querySelector('i');

    if (i.className === 'fas fa-eye') {
      i.className = 'fa-regular fa-eye-slash';
      field.type = 'text';
    } else {
      i.className = 'fas fa-eye';
      field.type = 'password';
    }
  });
}

//password show hide
passwordShowHide(passwordIcon, passwordEl);
passwordShowHide(confirmPasswordIcon, confirmPasswordEl);

// pass validateion

function validate(p) {
  let errors = [];

  if (p.length < 8) {
    errors.push('8 characters');
  }
  if (p.search(/[a-z]/) < 0) {
    errors.push('1 lowercase letter');
  }
  if (p.search(/[A-Z]/) < 0) {
    errors.push('1 uppercase letter');
  }
  if (p.search(/[0-9]/) < 0) {
    errors.push('1 digit');
  }
  if (p.search(/[\!\@\#\$\^\*\(\)\_\\+\.\,\;\:\-]/) < 0) {
    errors.push('1 spcial character');
  }
  return errors;
}

//check password
const checkPassword = (password) => {
  let validationResult = [];
  if (password) {
    validationResult = validate(password);
  } else {
    return;
  }
  if (validationResult.length > 0) {
    const errorMsg =
      'Your Password must contain at least ' + validationResult.join(',');

    if (password) {
      passErros.hidden = false;
      passErros.textContent = errorMsg;
    } else {
      return;
    }
  } else {
    checkConfirmPassword();
  }
};
//check confirm password
function checkConfirmPassword() {
  if (!(passwordEl.value === confirmPasswordEl.value)) {
    passErros.hidden = false;
    passErros.textContent = 'password does not match';
  } else {
    checkPassword(confirmPasswordEl.value);
  }
}
let typingTimer;
const doneTypingInterval = 500;

passwordEl.addEventListener('keyup', function (e) {
  clearTimeout(typingTimer);
  passErros.hidden = false;

  const passInp = passwordEl.value;
  if (passInp) {
    typingTimer = setTimeout(() => {
      checkPassword(passwordEl.value);
      doneTypingInterval;
    });
  } else {
    passErros.hidden = true;
  }
});

//on key down
passwordEl.addEventListener('keydown', function () {
  clearTimeout(typingTimer);
});
//key down
confirmPasswordEl.addEventListener('keydown', function () {
  clearTimeout(typingTimer);
});
//key up
confirmPasswordEl.addEventListener('keyup', function () {
  clearTimeout(typingTimer);
  //reset;
  passErros.hidden = true;
  if (confirmPasswordEl.value) {
    typingTimer = setTimeout(() => {
      checkConfirmPassword(confirmPasswordEl.value);
      doneTypingInterval;
    });
  } else {
    return;
  }
});
