// const e = require("express");

const DIARY_APP = (function () {
  document.addEventListener("DOMContentLoaded", init);

  gsap.registerPlugin(ScrollTrigger);

  const MONTHS_SHORT = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const MONTHS_LONG = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  var currentDate = new Date();
  const MORNING = new Date().setHours(5, 0, 0);
  const AFTERNOON = new Date().setHours(13, 0, 0);
  const EVENING = new Date().setHours(17, 0, 0);
  var mainGrid = document.querySelector(".l-main");
  var sidebar = document.querySelector(".c-sidebar");
  var dayPart = document.getElementById("day-part");
  var dateText = document.getElementById("date-today");
  var accountButton = document.getElementById("account-show");
  var acctFirstNameEl = document.getElementById("acct-first-name");
  var acctLastNameEl = document.getElementById("acct-last-name");
  var welcomeNameEl = document.getElementById("user-first-name");
  var addButton = document.getElementById("add-button");
  var textAddButton = document.getElementById("text-add-button");
  var accountPopup = document.querySelector(".c-account");
  var imageAddButton = document.getElementById("image-add-button");
  var textEditor = document.getElementById("text-editor");
  var imageUploader = document.getElementById("image-uploader");
  var textEditor = document.getElementById("text-editor");
  var menu = document.getElementById("menu-slide");
  var accountCloseButton = document.querySelector(".js-account-close");
  var editorCloseButtons = document.querySelectorAll(".js-editor-close");
  var menuItems = document.querySelectorAll(".c-nav__button-item");
  var mainList = document.getElementById("main-list");
  var dateEntries = document.querySelectorAll(".c-entries__on-date");
  var scrollPosition = null;

  // var sampleResponse = {
  //   user: {
  //     firstname: "John Paul",
  //     lastname: "Zoleta",
  //   },
  //   entries: [
  //     {
  //       date: 1638550800,
  //       dateEntries: [
  //         {
  //           title: "A New Start",
  //           datetime: 1638640439,
  //           type: "text",
  //           content: `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veritatis, apiente accusamus incidunt quibusdam minus eaque
  //           voluptatem assumenda praesentium. Nemo excepturi, corporis odio quaerat voluptatum iusto necessitatibus aut fuga eveniet quae
  //           obcaecati illo expedita inventore voluptatem animi magnam saepe natus quis.`,
  //         },
  //         {
  //           title: "Remember?",
  //           datetime: 1638622706,
  //           type: "image",
  //           content: [
  //             "https://res.cloudinary.com/dppgyhery/image/upload/w_600,q_auto/v1638639204/sample-response-images/Screenshot_13_h9kqmc.png",
  //             "https://res.cloudinary.com/dppgyhery/image/upload/w_600,q_auto/v1638639204/sample-response-images/Screenshot_1_hhwyor.png",
  //           ],
  //         },
  //         {
  //           title: "Blast To The Past",
  //           datetime: 1638640439,
  //           type: "text",
  //           content: `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veritatis, apiente accusamus incidunt quibusdam minus eaque
  //           voluptatem assumenda praesentium. Nemo excepturi, corporis odio quaerat voluptatum iusto necessitatibus aut fuga eveniet quae
  //           obcaecati illo expedita inventore voluptatem animi magnam saepe natus quis.`,
  //         },
  //       ],
  //     },
  //     {
  //       date: "1638464400",
  //       dateEntries: [
  //         {
  //           title: "A Tough Decision",
  //           datetime: 1638640439,
  //           type: "text",
  //           content: `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veritatis, apiente accusamus incidunt quibusdam minus eaque
  //           voluptatem assumenda praesentium. Nemo excepturi, corporis odio quaerat voluptatum iusto necessitatibus aut fuga eveniet quae
  //           obcaecati illo expedita inventore voluptatem animi magnam saepe natus quis.`,
  //         },
  //         {
  //           title: "A Relaxing Take",
  //           datetime: 1638622706,
  //           type: "image",
  //           content: [
  //             "https://res.cloudinary.com/dppgyhery/image/upload/w_600,q_auto/v1638638191/sample-response-images/2019-10-21_18.31.56_x3io2c.png",
  //             "https://res.cloudinary.com/dppgyhery/image/upload/w_600,q_auto/v1638638191/sample-response-images/2019-12-20_23.50.04_o1djls.png",
  //             "https://res.cloudinary.com/dppgyhery/image/upload/w_600,q_auto/v1638638191/sample-response-images/2019-10-21_14.27.13_vqpj0z.png",
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  // };

  var sampleResponse = null;

  var menuTl = gsap.timeline({
    defaults: {
      duration: 0.25,
    },
    paused: true,
  });

  var indicatorsTl = gsap.timeline({
    scrollTrigger: {},
  });

  function init() {
    fetchJson("/entries/all", "GET", "include").then((data) => {
      welcomeNameEl.innerText = data.user.firstName;
      acctFirstNameEl.innerText = data.user.firstName;
      acctLastNameEl.innerText = data.user.lastName;
      initializeClock();
      setInterval(updateClock, 1000);
      generateEntries(data);
      addListeners();
      createGSAPAnims();
      // console.log(sampleResponse.entries);
    });
  }

  function initializeClock() {
    let date = `${
      MONTHS_LONG[currentDate.getMonth()]
    } ${currentDate.getDate()}, ${currentDate.getFullYear()}`;
    if (currentDate >= EVENING) {
      dayPart.innerText = "evening";
    } else if (currentDate >= AFTERNOON) {
      dayPart.innerText = "afternoon";
    } else if (currentDate >= MORNING) {
      dayPart.innerText = "morning";
    } else {
      dayPart.innerText = "evening";
    }
    dateText.innerText = date;
  }

  function updateClock() {
    let date = `${
      MONTHS_LONG[currentDate.getMonth()]
    } ${currentDate.getDate()}, ${currentDate.getFullYear()}`;
    if (currentDate >= EVENING) {
      dayPart.innerText = "evening";
    } else if (currentDate >= AFTERNOON) {
      dayPart.innerText = "afternoon";
    } else if (currentDate >= MORNING) {
      dayPart.innerText = "morning";
    } else {
      dayPart.innerText = "evening";
    }
    dateText.innerText = date;
  }

  function generateEntries(data) {
    dateWrap = "";
    console.log(data);
    data.entries.forEach((dates) => {
      let date = new Date(dates.date);
      dateWrap += `<li class="c-entries__on-date">
      <div class="c-entries__date-indicator">
        <h2
          class="c-header c-header--fluid-large c-header--neutral-500"
        >
          ${("0" + String(date.getDate())).slice(-2)}
        </h2>
        <div class="c-entries__month-year">
          <p class="c-text c-text--neutral-500">${
            MONTHS_SHORT[date.getMonth()]
          }</p>
          <p class="c-text c-text--neutral-500">${date.getFullYear()}</p>
        </div>
      </div>
      <ul class="c-entries__date-entries">
      ${createDateEntries(dates.dateEntries)}
      </ul>
    </li>`;
    });
    mainList.innerHTML = dateWrap;
  }

  function createDateEntries(data) {
    sampleResponse = data;
    let listItems = "";
    sampleResponse.forEach((entry) => {
      if (entry.type == "text") {
        listItems += `<li data-id="${entry.entryId}" class="c-entries__item">
        <span
          class="
            material-icons
            c-entries__content-icon c-entries__content-icon--blue
          "
        >
          article
        </span>
        <div class="c-entries__title-time">
          <h2 class="c-entries__title">${entry.title}</h2>
          <p class="c-text c-text--small c-text--neutral-500">
            ${new Date(entry.time).toLocaleTimeString("en-us", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}
          </p>
        </div>
        <div
        class="
          c-entries__content-wrap c-entries__content-wrap--text
        "
      >
        ${createContent("text", entry.content)}
      </div>
      </li>`;
      } else {
        listItems += `<li data-id="${entry.entryId}" class="c-entries__item">
        <span
          class="
            material-icons
            c-entries__content-icon c-entries__content-icon--green
          "
        >
          image
        </span>
        <div class="c-entries__title-time">
          <h2 class="c-entries__title">${entry.title}</h2>
          <p class="c-text c-text--small c-text--neutral-500">
          ${new Date(entry.time).toLocaleTimeString("en-us", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })}
          </p>
        </div>
        <div
          class="
            c-entries__content-wrap c-entries__content-wrap--image
          "
        >
          ${createContent("image", entry.content)}
        </div>
      </li>`;
      }
    });
    return listItems;
  }

  function createContent(type, data) {
    let content = "";
    if (type == "text") {
      content += `
      <p class="c-text c-entries__text">
      ${data.content}
      </p>`;
    } else if (type == "image") {
      data.content.forEach((url) => {
        content += `<img
        src="${url}"
        alt="entry image"
        class="c-entries__image"/>`;
      });
    }
    return content;
  }

  function createGSAPAnims() {
    let dateIndicator = document.querySelectorAll(".c-entries__date-indicator");
    let entryItems = gsap.utils.toArray(
      document.querySelectorAll(".c-entries__item")
    );
    gsap.utils.toArray(dateIndicator).forEach((indicator, index) => {
      ScrollTrigger.create({
        trigger: indicator.parentNode,
        start: "top top",
        end: "bottom 10%",
        onEnter: () => {
          indicator.classList.add("c-entries__date-indicator--pin");
        },
        // onLeave: () => {
        //   indicator.classList.remove("c-entries__date-indicator--pin");
        // },
        // pin: indicator,
        // pinSpacing: false,
      });
    });

    // .forEach((item) => {
    //   gsap.from(item, {
    //     scrollTrigger: {
    //       trigger: item,
    //       start: "top 80%",
    //       // end: "bottom 80%",
    //       // markers: true,
    //       toggleActions: "play none none none",
    //     },
    //     yPercent: 10,
    //     duration: 0.5,
    //     ease: "slow",
    //     opacity: 0,
    //   });
    // });

    gsap.utils.toArray(menuItems).forEach((item) => {
      menuTl.from(item, { opacity: 0, y: "10px" }, "-0.25");
    });
  }

  function checkTarget(event) {
    if (event.target.classList.contains("l-main__editor")) {
      let editor = event.target.querySelector(".c-entry-create").id;
      if (editor == "text-editor") {
        hideTextEditor();
      } else if (editor == "image-uploader") {
        hideImageUploader();
      }
    }
  }

  function showMenu() {
    addButton.classList.toggle("c-button--rotate");
    menu.classList.toggle(menu.classList[0] + "--visible");
    if (menu.classList.contains(menu.classList[0] + "--visible")) {
      menuTl.restart(true, false);
      menuTl.play();
    } else {
      // console.log("hiiden");
      menuTl.reverse();
    }
  }

  function showAccountPopup() {
    let parentContainer = accountPopup.parentNode;
    scrollPosition = window.scrollY;
    parentContainer.classList.add("l-main__account--visible");
    accountPopup.classList.add("c-account--visible");
    document.body.classList.toggle("c-body--no-scroll");
    document.body.style.top = -scrollPosition + "px";
  }

  function hideAccountPopup() {
    let parentContainer = accountPopup.parentNode;
    parentContainer.classList.remove("l-main__account--visible");
    accountPopup.classList.remove("c-account--visible");
    document.body.classList.remove("c-body--no-scroll");
    window.scrollTo(0, scrollPosition);
  }

  function showTextEditor() {
    let parentContainer = textEditor.parentNode;
    scrollPosition = window.scrollY;
    parentContainer.classList.add("l-main__editor--visible");
    textEditor.classList.add("c-entry-create--visible");
    document.body.classList.toggle("c-body--no-scroll");
    document.body.style.top = -scrollPosition + "px";
    showMenu();
  }

  function hideTextEditor() {
    let parentContainer = textEditor.parentNode;
    parentContainer.classList.remove("l-main__editor--visible");
    textEditor.classList.remove("c-entry-create--visible");
    document.body.classList.remove("c-body--no-scroll");
    window.scrollTo(0, scrollPosition);
  }

  function showImageUploader() {
    let parentContainer = imageUploader.parentNode;
    scrollPosition = window.scrollY;
    parentContainer.classList.add("l-main__editor--visible");
    imageUploader.classList.add("c-entry-create--visible");
    document.body.classList.toggle("c-body--no-scroll");
    document.body.style.top = -scrollPosition + "px";
    showMenu();
  }

  function hideImageUploader() {
    let parentContainer = imageUploader.parentNode;
    parentContainer.classList.remove("l-main__editor--visible");
    imageUploader.classList.remove("c-entry-create--visible");
    document.body.classList.remove("c-body--no-scroll");
    window.scrollTo(0, scrollPosition);
  }

  function closeEditor() {
    let parentContainer = this.parentNode.parentNode;
    if (parentContainer.id == "image-uploader") {
      hideImageUploader();
    } else {
      hideTextEditor();
    }
  }

  function hideImageUpload() {
    document.body.classList.toggle("c-body--no-scroll");
    let parentContainer = imageUploader.parentNode;
    let editor = imageUploader.querySelector(".c-entry-create__editor");
    parentContainer.classList.toggle("l-main__editor--visible");
    imageUploader.classList.toggle("c-entry-create--visible");
  }

  async function fetchJson(
    link,
    method,
    credentials = null,
    body = null,
    headers = null
  ) {
    let response = null;
    response = await fetch(link, { method, credentials });

    const data = await response.json();
    return data;
  }

  function addListeners() {
    addButton.addEventListener("click", showMenu);
    // document.addEventListener("click", function (event) {
    //   checkTarget(event);
    // });
    editorCloseButtons.forEach((button) => {
      button.addEventListener("click", closeEditor);
    });
    accountCloseButton.addEventListener("click", hideAccountPopup);
    accountButton.addEventListener("click", showAccountPopup);
    imageAddButton.addEventListener("click", showImageUploader);
    textAddButton.addEventListener("click", showTextEditor);
  }
})();
