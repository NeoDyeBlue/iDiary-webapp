// const { header } = require("express/lib/request");

const SIGNUP = (function () {
  document.addEventListener("DOMContentLoaded", init);

  const LINK = "/users/signup";
  var emailErrElement = document.getElementById("email-error");
  var passwordErrElement = document.getElementById("password-error");
  var emailInput = document.getElementById("email");
  var passwordInput = document.getElementById("password");
  var passwordConfirmInput = document.getElementById("password-re-enter");
  var form = document.getElementById("signup-form");

  function init() {
    addListener();
  }

  function submitCatcher(event) {
    event.preventDefault();
    // console.log("submitted");
    let formData = new FormData(this);
    let method = "POST";
    let headers = { "Content-Type": "application/json" };

    let body = {};
    formData.forEach((value, key) => {
      if (key !== "password-re-enter") {
        body[key] = value;
      }
    });
    let jsonBody = JSON.stringify(body);

    emailErrElement.classList.remove("c-form__error--visible");
    emailInput.classList.remove("c-form__input--border-red");
    passwordErrElement.classList.remove("c-form__error--visible");
    passwordConfirmInput.classList.remove("c-form__input--border-red");
    passwordInput.classList.remove("c-form__input--border-red");

    if (passwordInput.value == passwordConfirmInput.value) {
      fetchJson(LINK, method, jsonBody, headers)
        .then((data) => {
          console.log(data);
          if (data.a0) {
            window.location.href = "/entries";
          } else {
            emailInput.classList.add("c-form__input--border-red");
            emailErrElement.classList.add("c-form__error--visible");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      passwordInput.classList.add("c-form__input--border-red-normal");
      passwordConfirmInput.classList.add("c-form__input--border-red");
      passwordErrElement.classList.add("c-form__error--visible");
    }
    // return false;
  }

  async function fetchJson(link, method, body, headers) {
    let response = null;
    response = await fetch(link, { method, body, headers });

    const data = await response.json();
    return data;
  }

  function addListener() {
    form.addEventListener("submit", function (event) {
      submitCatcher.bind(this)(event);
    });
  }
})();
