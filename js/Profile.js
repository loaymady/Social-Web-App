let locationHref = location.href,
  matchResult = locationHref.match(/userid=(\d+)/),
  ProfileId;

if (matchResult && matchResult[1]) {
  ProfileId = Number(matchResult[1]);
}

getProfileContent();
getPostsProfile();

function getProfileContent() {
  if (document.title == "Profile") {
    toggleLoader(true);

    axios
      .get(`${BaseUrl}/users/${ProfileId}`)
      .then((response) => {
        toggleLoader(false);
        let user = response.data.data;
        let div = `
      <div class="card-body">
      <div
        class="flex-column d-lg-flex flex-md-row text-center text-lg-start align-items-lg-center"
      >
        <!-- USER IMAGE COL -->
        <div class="col-12 col-lg-4 text-center">
          <img
            id="main-info-image"
            src=${
              typeof user.profile_image === "object"
                ? "images/profile.jpg"
                : user.profile_image
            }
            alt=""
          />
        </div>
        <!--// USER IMAGE COL //-->

        <!-- USERNAME - EMAIL - NAME -->
        <div
          id="main-info"
          class="col-12 mt-2 mt-lg-0 col-lg-4 d-flex flex-column gap-1 gap-lg-3 justify-content-evenly fs-3 ps-lg-4"
          style="font-weight: 900"
        >
          <div class="user-main-info lh-lg" id="main-info-name">${
            user.name
          }</div>

          <div class="user-main-info lh-lg" id="main-info-username">
          ${user.username}
          </div>
        </div>
        <!--// USERNAME - EMAIL - NAME //-->

        <!-- POSTS & COMMENTS COUNT -->
        <div
          class="col-12 col-lg-4 d-flex flex-column justify-content-evenly"
        >
          <div
            class="number-info d-flex d-lg-block align-items-center flex-column"
          >
            <span id="posts-count">${user.posts_count}</span> Posts
          </div>

          <div
            class="number-info d-flex d-lg-block align-items-center flex-column"
          >
            <span id="comments-count">${user.comments_count}</span> Comments
          </div>
        </div>
        <!--// POSTS & COMMENTS COUNT //-->
      </div>
    </div>
        `;
        document.querySelector("#profile-content").innerHTML = div;
      })
      .catch((error) => {
        console.log("Error fetching posts:", error);
      });
  }
}

//get posts of own user
function getPostsProfile() {
  if (document.title == "Profile") {
    axios
      .get(`${BaseUrl}/users/${ProfileId}/posts`)
      .then((response) => {
        let posts = response.data.data;
        // Reverse the order of posts
        posts.reverse();
        posts.forEach((post) => {
          let div = `
          <div id="${post.id}" class="card my-5 shadow">
            <div class="card-header d-flex align-items-center">
              <img src="${
                typeof post.author.profile_image === "object"
                  ? "images/profile.jpg"
                  : post.author.profile_image
              }" class="rounded-circle mw-100 border border-3" alt=""/>
              <span class="ms-1 fs-5 fw-bold">@${post.author.username}</span>
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
