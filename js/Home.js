let currentPage = 1,
  lastPage = 1;

//for any reload or refersh
getPosts();
loginUser();
registerUser();

//get posts
function getPosts(reload = true, page = 1) {
  if (reload) {
    document.querySelector("#posts").innerHTML = "";
  }
  if (document.title == "Home") {
    toggleLoader(true);

    axios
      .get(`${BaseUrl}/posts?limit=4&page=${page}`)
      .then((response) => {
        toggleLoader(false);
        let posts = response.data.data;
        lastPage = response.data.meta.last_page;
        posts.forEach((post) => {
          let div = `
          <div id="${post.id}" class="card my-5 shadow">
            <div class="card-header d-flex align-items-center">
            <div id="profIdAndImg" data-userId=${
              post.author.id
            } class="d-flex align-items-center">
              <img src=${
                typeof post.author.profile_image === "object"
                  ? "images/profile.jpg"
                  : post.author.profile_image
              } class="rounded-circle mw-100 border border-3" alt=""/>
              <span class="ms-1 fs-5 fw-bold">@${post.author.username}</span>
              </div>
              ${checkEidtBtn(post)}
            </div>
            <div id="${post.id}" class="card-body cardBodyy">
              <img src="${
                typeof post.image === "object" ? "" : post.image
              }" class="${
            typeof post.image === "object" ? "" : "w-100"
          }" alt="" />
              <h6 class="mt-1 text-body-tertiary">${post.created_at}</h6>
              <h5>${post.title != null ? post.title : ""}</h5>
              <p>${post.body}</p>
              <hr />
              <i class="bi bi-pen"></i>
              <span>(${post.comments_count}) Comments</span>
              <span>
                ${post.tags
                  .map((tag) => {
                    return `<button class="btn btn-sm bg-secondary rounded-5 ms-1 text-white">${tag.name}</button>`;
                  })
                  .join("")}
              </span>
            </div>
          </div>`;

          document.getElementById("posts").innerHTML += div;
        });
      })
      .catch((error) => {
        console.log("Error fetching posts:", error);
      });
  }
}

navLogOutBtnClick();
setupUI();

//create-post
let createPostBtn = document.querySelector("#create-post");
createPostBtn.addEventListener("click", () => {
  let titlePost = document.querySelector("#title-post").value;
  let bodyPost = document.querySelector("#body-post").value;
  let imagePost = document.querySelector("#image-post").files[0];
  let token = localStorage.getItem("token");

  // Create formData because we sent an image as a parameter
  let formData = new FormData();
  if (titlePost != null) {
    formData.append("title", titlePost);
  }
  formData.append("body", bodyPost);
  if (imagePost != null) {
    formData.append("image", imagePost);
  }

  let headers = {
    // "Content-Type": "multipart/form-data",
    authorization: `Bearer ${token}`,
  };
  axios
    .post(`${BaseUrl}/posts`, formData, {
      headers: headers,
    })
    .then(function (response) {
      // Hide the Create Post Modal using Bootstrap's modal method
      let createPostModal = bootstrap.Modal.getInstance(
        document.getElementById("create-post-modal")
      );
      createPostModal.hide();
      showAlert("New Post Has Been Created Successfully");
      // Fetch all posts again after a new post is created
      getPosts();
      if (document.title == "Profile") {
        getProfileContent();
        getPostsProfile();
      }
    })
    .catch(function (error) {
      showAlert(error.response.data.message, "danger");
    });
});

//for pagination api (after reach to end of page)
window.onscroll = function () {
  // Check if the user has reached the end of the page and did not reach to lastpage of data
  if (
    window.scrollY + window.innerHeight >=
      document.documentElement.scrollHeight - 10 &&
    currentPage < lastPage
  ) {
    getPosts(false, currentPage + 1);
    currentPage++;
  }
};

//for open page post
document.addEventListener("click", (e) => {
  let cardBody = e.target.closest(".cardBodyy");
  if (cardBody) {
    e.stopPropagation();
    window.location = `PostDetails.html?PostId=${cardBody.id}`;
  }
});
let postID;

function checkEidtBtn(post) {
  if (localStorage.getItem("user")) {
    let user = localStorage.getItem("user");
    user = JSON.parse(user);
    if (post.author.id === user.id) {
      return `
      <button id="delete-btn" class="btn btn-danger border-0 rounded ms-auto" data-post=${post.id} data-bs-toggle="modal" data-bs-target="#delete-post-modal">Delete</button>
      <button id="edit-btn" class="bg-secondary border-0 text-white rounded ms-3" data-bs-toggle="modal"
      data-bs-target="#edit-post-modal">Edit</button>`;
    }
  }
  return "";
}

//when click at edit-btn
document.addEventListener("click", (e) => {
  if (e.target.id == "edit-btn") {
    let cardDiv = e.target.closest(".card");
    postID = cardDiv.id;
    let post;
    if (cardDiv) {
      axios
        .get(`${BaseUrl}/posts/${Number(cardDiv.id)}`)
        .then((response) => {
          post = response.data.data;
          document.querySelector("#title-post-edit").value = post.title;
          document.querySelector("#body-post-edit").value = post.body;
        })
        .catch((error) => {
          console.log("Error fetching posts:", error);
        });
    }
  }
});

// Define updatePost function outside the click event listener
async function updatePost() {
  try {
    let titlePost = document.querySelector("#title-post-edit").value;
    let bodyPost = document.querySelector("#body-post-edit").value;
    let imagePost = document.querySelector("#image-post-edit").files[0];
    let token = localStorage.getItem("token");

    // Create formData because we sent an image as a parameter
    let formData = new FormData();
    if (titlePost != null) {
      formData.append("title", titlePost);
    }
    formData.append("body", bodyPost);
    if (imagePost != null) {
      formData.append("image", imagePost);
    }
    formData.append("_method", "put");

    let headers = {
      authorization: `Bearer ${token}`,
    };

    // Make the update request and wait for it to complete
    const response = await axios.post(`${BaseUrl}/posts/${postID}`, formData, {
      headers,
    });

    // Update the DOM with the new data for the specific post
    const updatedPost = response.data.data;
    const postElement = document.getElementById(updatedPost.id);

    // Update post content in the DOM
    postElement.querySelector(".card-body img").src = updatedPost.image;
    postElement.querySelector(".card-body h5").textContent = updatedPost.title;
    postElement.querySelector(".card-body p").textContent = updatedPost.body;

    // Hide the Edit Post Modal using Bootstrap's modal method
    let editPostModal = bootstrap.Modal.getInstance(
      document.querySelector("#edit-post-modal")
    );
    editPostModal.hide();

    showAlert("Post Has Been Updated Successfully");
  } catch (error) {
    showAlert(error.response.data.error_message, "danger");
  }
}

// Call the updatePost function when the update button is clicked
document.addEventListener("click", (e) => {
  if (e.target.id == "update-post") {
    updatePost();
  }
});

//when click at delete-btn
document.addEventListener("click", (e) => {
  if (e.target.id == "delete-btn") {
    postID = e.target.dataset.post;
  }
});

// Delete Post (Confirm Delete) function
async function deletePost() {
  try {
    let token = localStorage.getItem("token");
    let headers = {
      authorization: `Bearer ${token}`,
    };
    await axios.delete(`${BaseUrl}/posts/${Number(postID)}`, { headers });
    // Hide the Delete Post Modal using Bootstrap's modal method
    let deletePostModal = bootstrap.Modal.getInstance(
      document.querySelector("#delete-post-modal")
    );
    deletePostModal.hide();
    // Remove the deleted post element from the DOM
    const deletedPostElement = document.getElementById(postID);
    if (deletedPostElement) {
      deletedPostElement.remove();
    }
    showAlert("Post Has Been Deleted Successfully");
    if (document.title == "Profile") {
      getProfileContent();
    }
  } catch (error) {
    showAlert(error.response.data.error_message, "danger");
  }
}

// Call the deletePost function when the delete button is clicked
document.addEventListener("click", async (e) => {
  if (e.target.id == "delete-post") {
    await deletePost();
  }
});

// Redirect to the profile page with the user ID
document.addEventListener("click", (e) => {
  let clickedElement = e.target;
  // Check if the clicked element or any of its ancestors has the "profIdAndImg" id
  while (clickedElement && !clickedElement.id.includes("profIdAndImg")) {
    clickedElement = clickedElement.parentElement;
  }
  if (clickedElement) {
    let userId = clickedElement.dataset.userid;
    window.location = `profile.html?userid=${userId}`;
  }
});
