//selection

const postArea = document.querySelector('#postArea');
const commandArea = document.querySelector('textarea#replayContent');

const tweetBtn = document.querySelector('.create_post_btn');
const postImg = document.querySelector('#postImg');
const imgContainer = document.querySelector('.img_container');
const postContainer = document.querySelector('.postContainer');
const commandBtn = document.querySelector('button.replayBtn');
const commandImg = document.querySelector('input#replayImages');
const commandImgContainer = document.querySelector('.image-container');

let postImages = [];
let commandImages = [];

postArea.addEventListener('input', function (e) {
  const val = this.value.trim();

  if (val) {
    tweetBtn.removeAttribute('disabled');
    tweetBtn.style.background = '#1d9bf0';
  } else {
    tweetBtn.setAttribute('disabled', '');
    tweetBtn.style.background = '#6cc2fc';
  }
});
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

//handle image uploading

postImg.addEventListener('change', function (e) {
  const files = this.files;

  [...files].forEach((file) => {
    if (!['image/jpg', 'image/png', 'image/jpeg'].includes(file.type)) return;

    tweetBtn.removeAttribute('disabled');
    tweetBtn.style.background = '#1d9bf0';
    postImages.push(file);

    const fr = new FileReader();
    fr.onload = function () {
      const htmlElement = document.createElement('div');
      htmlElement.classList.add('img');
      htmlElement.dataset.name = file.name;

      htmlElement.innerHTML = `<span id='cross_btn'>
                                <i class="fas fa-times"></i>
                                </span><img>`;

      const img = htmlElement.querySelector('img');

      img.src = fr.result;

      imgContainer.appendChild(htmlElement);
    };
    fr.readAsDataURL(file);
  });
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

imgContainer.addEventListener('click', function (e) {
  const crossBtn = e.target.id === 'cross_btn' ? e.target : null;
  if (!crossBtn) return;

  const imgEl = crossBtn.parentElement;
  const imgName = imgEl.dataset.name;
  postImages.forEach((file, i) => {
    if (imgName === file.name) {
      postImages.splice(i, 1);
      imgEl.remove();
      if (!postImages.length && !postArea?.value?.trim()) {
        tweetBtn.setAttribute('disabled', '');
        tweetBtn.style.background = '#6cc2fc';
      }
    }
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
// function to load posts
const loadPosts = async () => {
  try {
    const result = await fetch(
      `${window.location.origin}/posts?followingOnly=true`
    );
    const posts = await result.json();
    if (!posts.length) {
      return (postContainer.innerHTML = `<h4 style="color:blue;font-size:20px;text-align:center"  class="Nothing">Nothing To show</h4>`);
    }
    posts.forEach((post) => {
      const postEl = createPost(post);
      postContainer.insertAdjacentElement('afterbegin', postEl);
    });
  } catch (error) {}
};
loadPosts();

// submit the post
tweetBtn.addEventListener('click', function (e) {
  const content = postArea.value;
  if (!(postImages.length || content)) return;

  const formData = new FormData();
  formData.append('content', content);
  postImages.forEach((file) => {
    formData.append(file.name, file);
  });
  const url = `${window.location.origin}/posts`;

  fetch(url, {
    method: 'POST',
    body: formData,
  })
    .then((r) => r.json())
    .then((data) => {
      const postEl = createPost(data);
      postContainer.insertAdjacentElement('afterbegin', postEl);
      imgContainer.innerHTML = '';
      postArea.value = '';
      tweetBtn.setAttribute('disabled', '');
      tweetBtn.style.background = '#6cc2fc';
      postImages = [];
    })
    .catch((err) => console.log(err));
});
