//create tweet
function createPost(data) {
  let newData = data;
  let rePostedHtml = '';
  let replayTo = '';
  let deleteBtn = '';
  if (data.postData) {
    if (data?.postedBy?._id === user._id) {
      deleteBtn = `
        <button onclick="deletePost('${data._id}')" class='deleteBtn'>
          <i class="fas fa-times"></i>
        </button>
        `;
    }

    newData = data.postData;
    rePostedHtml =
      data.postedBy.username === user.username
        ? `
      <p class="rePost_display">
      <i class="fas fa-retweet"></i> You Reposted
      </p>
      `
        : `<p class="rePost_display">
      <i class="fas fa-retweet"> </i> Reposted by @<a href='/profile/${data.postedBy.username}'>${data.postedBy.username}</a>
      </p>`;
  }
  if (data.replayTo?.postedBy?.username) {
    replayTo = `<div class="replayFLag">
      <p>Replaying To @<a href="/profile/${data.replayTo.postedBy.username}">${data.replayTo.postedBy.username}</a></p>
      </div>`;
  }
  const {
    likes,
    content,
    replayedPosts,
    _id: postId,
    images: postImages,
    repostUsers,
    postedBy: { _id, username, firstName, lastName, profileAvatar },
    createdAt,
  } = newData;

  if (newData?.postedBy?._id === user._id) {
    deleteBtn = `
      <button onclick="deletePost('${data._id}')" class='deleteBtn'>
        <i class="fas fa-times"></i>
      </button>
      `;
  }

  function timeSince(date) {
    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + ' years ago';
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + ' months ago';
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + ' days ago';
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + ' hours ago';
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + ' minutes ago';
    }
    return 'Just Now';
  }
  const time = timeSince(new Date(createdAt).getTime());

  const div = document.createElement('div');
  const avatarURL = user.profileAvatar
    ? `/uploads/${user._id}/profile/${user.profileAvatar}`
    : `/uploads/profile/profile.png`;

  div.innerHTML = `
    ${rePostedHtml}
    <div onclick='openPost(event,"${postId}")' class="post" >
    <div class="avatar_area">
                      <div class="img">
                      <img src="${avatarURL} " alt="avatar" class="avatar">
                      </div>
                      
                        </div>
                        <div class="post_body"> 
                        <div class="header">
                        <a href= "/profile/${username}" class="displayName" style="font-size:18px">${
    firstName + '' + lastName
  }</a>
                        <span class="username">@${username}</span> .
                        <div style='flex:1' class="date">${time}</div>
                        ${deleteBtn}
                        </div>
                        ${replayTo}
                        <div class="content" style="font-family:'Open Sans',sans-serif;">${content}</div>
                        <div class="images"></div>
                        <div class="footer">
                        <button data-post='${JSON.stringify(
                          data
                        )}' onclick="replyBtn(event,'${postId}')" class="replay">
                        <i class="fas fa-comment"></i>
                        <span>${replayedPosts.length || ' '}</span>
                        </button>
                        <button onClick="repostHandler(event, '${postId}')" class="repost ${
    repostUsers.includes(user._id) ? 'active' : ''
  }">
                        <i class="fas fa-retweet"></i>
                        <span>${repostUsers.length || ''}</span>
                        </button>
                        <button  onClick="likeHandler(event,'${postId}')" class="like ${
    user.likes.includes(postId) ? 'active' : ''
  }">
                        <i class="fas fa-heart"></i>
                        <span>${likes.length ? likes.length : ''}</span>
                        </button>
                        </div>
                        </div>
    </div>`;

  const imageContainer = div.querySelector('div.images');

  postImages?.forEach((img) => {
    const imgDiv = document.createElement('div');
    imgDiv.classList.add('img');
    imgDiv.innerHTML = `<img src="${window.location.origin}/uploads/${_id}/posts/${img}" alt="">`;
    imageContainer.appendChild(imgDiv);
  });
  return div;
}

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

// delete post function

function deletePost(postId) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: 'Deleted!',
        text: 'Your file has been deleted.',
        icon: 'success',
      });
      const url = `${window.location.origin}/posts/${postId}`;
      fetch(url, {
        method: 'DELETE',
      })
        .then((r) => r.json())
        .then((data) => {
          if (data?._id) {
            location.reload();
          } else {
            location.href = '/';
          }
        });
    }
  });
}
