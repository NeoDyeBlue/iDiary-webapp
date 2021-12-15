// const { header } = require("express/lib/request");

const LOGIN = (function () {
  document.addEventListener("DOMContentLoaded", init);

  const LINK = "/login";
  var url = new URL(window.location.href);
  //   const LINK = `http://${url.hostname}/login`;
  var emailErrElement = document.getElementById("email-error");
  var passwordErrElement = document.getElementById("password-error");
  var emailInput = document.getElementById("email");
  var passwordInput = document.getElementById("password");
  var form = document.getElementById("login-form");

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
    formData.forEach((value, key) => (body[key] = value));
    let jsonBody = JSON.stringify(body);

    emailErrElement.classList.remove("c-form__error--visible");
    emailInput.classList.remove("c-form__input--border-red");
    passwordErrElement.classList.remove("c-form__error--visible");
    passwordInput.classList.remove("c-form__input--border-red");

    fetchJson(LINK, method, jsonBody, headers)
      .then((data) => {
        console.log(data);
        if (!data.auth.a1) {
          emailErrElement.classList.add("c-form__error--visible");
          emailInput.classList.add("c-form__input--border-red");
        } else if (!data.auth.a2) {
          passwordErrElement.classList.add("c-form__error--visible");
          passwordInput.classList.add("c-form__input--border-red");
        } else {
          window.location.href = "/entries";
        }
      })
      .catch((err) => {
        console.log(err);
      });
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
