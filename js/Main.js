let BaseUrl = "https://tarmeezacademy.com/api/v1";

//When Register A New User
function registerUser() {
  let registerBtn = document.querySelector("#register-btn");
  registerBtn.addEventListener("click", () => {
    let regName = document.querySelector("#reg-name").value,
      regUsername = document.querySelector("#reg-username").value,
      profileImage = document.querySelector("#profile-image").files[0],
      regPassword = document.querySelector("#reg-password").value;

    // Create formData because we sent an image as a parameter
    let formData = new FormData();
    formData.append("name", regName);
    formData.append("username", regUsername);
    formData.append("image", profileImage);
    formData.append("password", regPassword);
    axios
      .post(`${BaseUrl}/register`, formData)
      .then(function (response) {
        let token = response.data.token;
        localStorage.setItem("token", token);
        // Hide the login modal using Bootstrap's modal method
        let registerModal = bootstrap.Modal.getInstance(
          document.querySelector("#register-modal")
        );
        registerModal.hide();
        setupUI();
        showAlert("New User Registered Successfully");
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
}

//When login user
function loginUser() {
  let loginBtn = document.querySelector("#login-btn");
  loginBtn.addEventListener("click", () => {
    let logUsername = document.querySelector("#log-username").value;
    let logPassword = document.querySelector("#log-password").value;
    axios
      .post(`${BaseUrl}/login`, {
        username: logUsername,
        password: logPassword,
      })
      .then(function (response) {
        let token = response.data.token;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        // Hide the login modal using Bootstrap's modal method
        let loginModal = bootstrap.Modal.getInstance(
          document.querySelector("#login-modal")
        );
        loginModal.hide();
        setupUI();
        showAlert("Login Successful!");
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
}

function addProfileAndName() {
  let navLogOutBtn = document.getElementById("nav-logOutBtn");
  let data = localStorage.getItem("user");
  data = JSON.parse(data);
  let img = data.profile_image;
  let name = data.name;
  let div = `<div id="flex-profile" class="d-flex gap-2 align-items-center"><img src= ${
    typeof img === "object" ? "images/profile.jpg" : img
  } alt="" /><div id="username-nav" class="mb-1">@${name}</div></div>`;
  navLogOutBtn.insertAdjacentHTML("beforebegin", div);
}

//when click at logout button
function navLogOutBtnClick() {
  let navLogOutBtn = document.getElementById("nav-logOutBtn");
  navLogOutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setupUI();
    document.querySelector("#flex-profile").remove();
    showAlert("LogOut Successful!");
    getPosts();
    if (document.title == "Profile") {
      getProfileContent();
      getPostsProfile();
    }
  });
}

//when Login Successful , setupUI
function setupUI() {
  let navRegisterBtn = document.getElementById("nav-registerBtn"),
    commentInput = document.getElementById("comment-input"),
    navLogBtn = document.getElementById("nav-logBtn"),
    addPostBtn = document.getElementById("add-btn"),
    navLogOutBtn = document.getElementById("nav-logOutBtn");

  if (localStorage.getItem("token")) {
    navRegisterBtn.style.display = "none";
    navLogBtn.style.display = "none";
    navLogOutBtn.style.display = "block";
    if (addPostBtn != null) {
      addPostBtn.style.display = "block";
    }
    if (commentInput != null) {
      commentInput.classList.remove("none");
    }
    addProfileAndName();
  } else {
    navRegisterBtn.style.display = "block";
    navLogBtn.style.display = "block";
    navLogOutBtn.style.display = "none";
    if (addPostBtn != null) {
      addPostBtn.style.display = "none";
    }
    if (commentInput != null) {
      commentInput.classList.add("none");
    }
  }
}

//Show Alert
function showAlert(mess, type) {
  const alertPlaceholder = document.getElementById("section-alert");
  const appendAlert = (message, type = "success") => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");
    alertPlaceholder.append(wrapper);
  };

  appendAlert(mess, type);

  // Hide the alert after 2 seconds
  setTimeout(() => {
    // Hide the alert using Bootstrap's alert method
    const alertElement = alertPlaceholder.querySelector(".alert");
    const bootstrapAlert = new bootstrap.Alert(alertElement);
    bootstrapAlert.close();
  }, 2000);
}

function getProfile(dataa) {
  let user = JSON.parse(dataa);
  window.location = `profile.html?userid=${user.id}`;
}
document.getElementById("profile-nav").addEventListener("click", () => {
  if (localStorage.getItem("user")) {
    getProfile(localStorage.getItem("user"));
  } else {
    showAlert("You are a Guest.", "danger");
  }
});

function toggleLoader(show = true) {
  if (show) {
    document.querySelector(".undefined").style.display = "block";
  } else {
    document.querySelector(".undefined").style.display = "none";
  }
}
