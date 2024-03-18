const commandArea = document.querySelector('#replayContent');

const postContainer = document.querySelector('.postContainer');
const commandBtn = document.querySelector('button.replayBtn');
const commandImg = document.querySelector('input#replayImages');
const commandImgContainer = document.querySelector('.image-container');
//pic changing
const updateAvatarInput = document.querySelector('#updateAvatarInput');
const updateCoverInput = document.querySelector('#updateCoverInput');
const avatarPreview = document.querySelector('#avatarPreview');
const coverPreview = document.querySelector('#coverPreview');
const uploadCoverImage = document.querySelector('#uploadCoverImage');
const uploadAvatarImage = document.querySelector('#uploadAvatarImage');

let commandImages = [];
let cropper;

//command text area
commandArea.addEventListener('input', function (e) {
  const val = this.value.trim();

  if (val || commandImages.length) {
    commandBtn.removeAttribute('disabled');
    commandBtn.style.background = '#1d9bf0';
  } else {
    commandBtn.setAttribute('disabled', '');
    commandBtn.style.background = '#6cc2fc';
  }
});
// command image area
commandImg.addEventListener('change', function (e) {
  const files = this.files;
  commandImages = [];
  [...files].forEach((file) => {
    if (!['image/jpg', 'image/png', 'image/jpeg'].includes(file.type)) return;

    commandBtn.removeAttribute('disabled');
    commandBtn.style.background = '#1d9bf0';
    commandImages.push(file);

    const fr = new FileReader();
    fr.onload = function () {
      const htmlElement = document.createElement('div');
      htmlElement.classList.add('img');
      htmlElement.dataset.name = file.name;

      htmlElement.innerHTML = `<span id='cross_btn' style:"cursor:pointer">
                                  <i class="fas fa-times"></i>
                                  </span><img>`;

      const img = htmlElement.querySelector('img');

      img.src = fr.result;

      commandImgContainer.appendChild(htmlElement);
    };
    fr.readAsDataURL(file);
  });
});
commandImgContainer.addEventListener('click', function (e) {
  const crossBtn = e.target.id === 'cross_btn' ? e.target : null;
  if (!crossBtn) return;

  const imgEl = crossBtn.parentElement;
  const imgName = imgEl.dataset.name;
  commandImages.forEach((file, i) => {
    if (imgName === file.name) {
      commandImages.splice(i, 1);
      imgEl.remove();
      if (!commandImages.length && !commandArea?.value?.trim()) {
        commandBtn.setAttribute('disabled', '');
        commandBtn.style.background = '#6cc2fc';
      }
    }
  });
});
// likle handler
function likeHandler(event, postId) {
  const likeBtn = event.target;

  const span = likeBtn.querySelector('span');

  const url = `${window.location.origin}/posts/like/${postId}`;

  fetch(url, {
    method: 'PUT',
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.likes.includes(user._id)) {
        likeBtn.classList.add('active');
      } else {
        likeBtn.classList.remove('active');
      }
      span.innerText = data.likes.length ? data.likes.length : '';
    });
}
//retweet handler
function repostHandler(event, postId) {
  const rePostBtn = event.target;

  const span = rePostBtn.querySelector('span');

  const url = `${window.location.origin}/posts/repost/${postId}`;

  fetch(url, {
    method: 'POST',
  })
    .then((res) => res.json())
    .then((data) => {
      if (data._id) {
        location.reload();
      }

      // if (data.repostUsers.includes(user._id)) {
      //   rePostBtn.classList.add('active');
      // } else {
      //   rePostBtn.classList.remove('active');
      // }
      span.innerText = data.repostUsers.length ? data.repostUsers.length : '';
    });
}
// reply handler
function replyBtn(event, postId) {
  const replayButton = event.target;

  const postObj = JSON.parse(replayButton.dataset?.post);
  const modal = document.querySelector('#replayModal');
  const modalBody = modal.querySelector('.modal-body');
  modalBody.innerHTML = '';
  const postEl = createPost(postObj);
  modalBody.appendChild(postEl);

  commandBtn.addEventListener('click', function (e) {
    const content = commandArea.value;

    if (!(commandImages.length || content)) return;

    const formData = new FormData();
    formData.append('content', content);

    commandImages.forEach((file) => {
      formData.append(file.name, file);
    });

    const url = `${window.location.origin}/posts/replay/${postId}`;

    fetch(url, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data._id) {
          window.location.reload();
          return;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
  $('#replayModal').modal('toggle');
}
///clesr comman field
function clearReplayData() {
  commandImgContainer.innerHTML = '';
  commandArea.innerHTML = '';
  commandBtn.setAttribute('disabled', '');
  commandBtn.style.background = '#8ecafc';
}
// open post functon
function openPost(event, postId) {
  const targetEl = event.target;

  if (targetEl.localName === 'button' || targetEl.localName === 'a') return;
  window.location.href = `${window.location.origin}/posts/${postId}`;
}

// for loading post
const loadPosts = async () => {
  try {
    const result = await fetch(`
        ${window.location.origin}/posts?postedBy=${profileUser._id}&replayTo=${
      tab === 'replies'
    }`);
    const posts = await result.json();
    if (!posts.length) {
      return (postContainer.innerHTML = `<h4 style="color:blue;font-size:20px;text-align:center"  class="Nothing">Nothing To show</h4>`);
    }
    posts.forEach((post) => {
      const postEl = createPost(post);
      postContainer.insertAdjacentElement('afterbegin', postEl);
    });
  } catch (error) {
    console.log(error);
  }
};
loadPosts();

// follow function
function followHandler(e, userId) {
  const url = `${window.location.origin}/profile/${userId}/follow`;
  fetch(url, {
    method: 'PUT',
  })
    .then((r) => r.json())
    .then((data) => {
      const followBtn = e.target;

      const isFollowing = data.followers.includes(user._id);

      const following = document.querySelector('a.following span');
      const followers = document.querySelector('a.followers span');

      if (isFollowing) {
        followBtn.classList.add('active');
        followBtn.textContent = 'Following';
        following.textContent = data.following.length;
        followers.textContent = data.followers.length;
      } else {
        followBtn.classList.remove('active');
        followBtn.textContent = 'Follow';
        following.textContent = data.following.length;
        followers.textContent = data.followers.length;
      }
    });
}

// profile and cover changes
updateAvatarInput.addEventListener('change', function (e) {
  const files = this.files;
  if (files && files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      avatarPreview.src = e.target.result;

      cropper = new Cropper(avatarPreview, {
        aspectRatio: 1 / 1,
        background: false,
      });
    };
    reader.readAsDataURL(files[0]);
  } else {
    console.log('Opps!');
  }
});

uploadAvatarImage.addEventListener('click', function (e) {
  const canvas = cropper?.getCroppedCanvas();
  if (canvas) {
    canvas.toBlob((blob) => {
      const fileName = updateAvatarInput?.files[0]?.name;
      const formData = new FormData();
      formData.append('avatar', blob, fileName);
      const url = `${window.location.origin}/profile/avatar`;
      fetch(url, {
        method: 'POST',
        body: formData,
      })
        .then((r) => r.json())
        .then((data) => {
          if (data._id) {
            location.reload();
          }
        });
    });
  } else {
    alert('Please select an image');
  }
});

//cover
updateCoverInput.addEventListener('change', function (e) {
  const files = this.files;
  if (files && files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      coverPreview.src = e.target.result;

      cropper = new Cropper(coverPreview, {
        aspectRatio: 2.496 / 1,
        background: false,
      });
    };
    reader.readAsDataURL(files[0]);
  } else {
    console.log('Opps!');
  }
});
uploadCoverImage.addEventListener('click', function (e) {
  const canvas = cropper?.getCroppedCanvas();
  if (canvas) {
    canvas.toBlob((blob) => {
      const fileName = updateCoverInput?.files[0]?.name;
      const formData = new FormData();
      formData.append('cover', blob, fileName);
      const url = `${window.location.origin}/profile/cover`;
      fetch(url, {
        method: 'POST',
        body: formData,
      })
        .then((r) => r.json())
        .then((data) => {
          if (data._id) {
            location.reload();
          }
        });
    });
  } else {
    alert('Please select an image');
  }
});
