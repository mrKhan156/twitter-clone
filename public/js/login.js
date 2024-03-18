const passwordEl = document.querySelector('#password');
const passwordIcon = document.querySelector('#passwordIcon');

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
