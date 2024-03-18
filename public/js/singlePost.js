const postContainer = document.querySelector('.postContainer');

const commandBtn = document.querySelector('button.replayBtn');
const commandImg = document.querySelector('input#replayImages');
const commandImgContainer = document.querySelector('.image-container');
const commandArea = document.querySelector('textarea#replayContent');
const backBtn = document.querySelector('#backBtn');

let commandImages = [];
const loadPosts = async () => {
  try {
    const result = await fetch(
      `${window.location.origin}/posts/single/${postId}`
    );
    const posts = await result.json();

    if (posts === null) return (location.href = '/');

    const postEl = createPost(posts);
    postContainer.appendChild(postEl);

    posts.replayedPosts?.forEach((post) => {
      const postEl = createPost(post);
      postContainer.appendChild(postEl);
    });
  } catch (error) {}
};
loadPosts();

// command area

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

//command images
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

// command images contaioner
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
          return console.log(data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
  $('#replayModal').modal('toggle');
}
