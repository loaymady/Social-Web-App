let locationHref = location.href,
  matchResult = locationHref.match(/PostId=(\d+)/),
  postId;

loginUser();
registerUser();
setupUI();
navLogOutBtnClick();

if (matchResult && matchResult[1]) {
  postId = matchResult[1];
}
getPost();

function getPost() {
  axios
    .get(`${BaseUrl}/posts/${postId}`)
    .then((response) => {
      document.querySelector("#postt").innerHTML = "";
      let post = response.data.data;
      let comments = response.data.data.comments;
      let div = `
      <h1 class=m-0>${post.author.username} Post</h1>
      <div class="card mt-5 border-bottom-0 rounded-0 rounded-top">
        <div class="card-header d-flex align-items-center">
        <div id="profIdAndImg" data-userId=${
          post.author.id
        } class="d-flex align-items-center">
        <img src="${
          typeof post.author.profile_image === "object"
            ? "images/profile.jpg"
            : post.author.profile_image
        }" class="rounded-circle mw-100 border border-3" alt=""/>
          <span class="ms-1  fs-5 fw-bold">@${post.author.username}</span>
        </div>
          </div>
        <div id=${post.id} class="card-body post">
        <img src="${typeof post.image === "object" ? "" : post.image}" class="${
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
         <div id="comments">
         ${comments
           .map((comment) => {
             return ` 
             <!-- Dyncamic Comment -->
             <div class="p-3 mx-3 my-4 mt-2">
              <div class="d-flex align-items-center">
                <img class="rounded-circle" src="${comment.author.profile_image}" alt="" />
                <span class="ms-1 fs-5 fw-bold">@${comment.author.username}</span>
              </div>
              <p class="pt-2 fs-3 ms-2">
              ${comment.body}
              </p>

            </div>
            <!--// Dyncamic Comment //-->
            `;
           })
           .join("")}
         </div>
        </div>
        `;
      document.querySelector("#postt").innerHTML = div;
    })
    .catch((error) => {
      console.log("Error fetching posts:", error);
    });
}

document.addEventListener("click", (e) => {
  if (e.target.id === "comment-btn") {
    let commentBody = document.querySelector("#comment-body").value;
    const token = localStorage.getItem("token");
    axios
      .post(
        `${BaseUrl}/posts/${postId}/comments`,
        {
          body: commentBody,
        },
        { headers: { authorization: `Bearer ${token}` } }
      )
      .then(function (response) {
        getPost();
        showAlert("New Comment Created");
        document.querySelector("#comment-body").value = "";
      })
      .catch(function (error) {
        showAlert(error.response.data.message, "danger");
      });
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
