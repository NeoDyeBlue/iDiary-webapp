// const e = require("express");

const DIARY_APP = (function () {
  document.addEventListener("DOMContentLoaded", init);

  gsap.registerPlugin(ScrollTrigger);

  //#region
  //datetime vars
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
  var dayPart = document.getElementById("day-part");
  var dateText = document.getElementById("date-today");
  //dom vars
  var accountButton = document.getElementById("account-show");
  var acctFirstNameEl = document.getElementById("acct-first-name");
  var acctLastNameEl = document.getElementById("acct-last-name");
  var welcomeNameEl = document.getElementById("user-first-name");
  var addButton = document.getElementById("add-button");
  var textAddButton = document.getElementById("text-add-button");
  var accountPopup = document.getElementById("account-display");
  var imageAddButton = document.getElementById("image-add-button");
  var contentEditables = document.querySelectorAll(".js-editor-editable");
  var menu = document.getElementById("menu-slide");
  var accountCloseButton = document.querySelector(".js-account-close");
  var menuItems = document.querySelectorAll(".c-nav__button-item");
  var mainList = document.getElementById("main-list");
  //editor vars
  var textTitleInput = document.getElementById("text-title-input");
  var textBodyInput = document.getElementById("text-body-input");
  var textEditor = document.getElementById("text-editor");
  var imageUploader = document.getElementById("image-uploader");
  var editorCloseButtons = document.querySelectorAll(".js-editor-close");
  var editorDoneButtons = document.querySelectorAll(".js-editor-done");
  //viewer vars
  var viewerCloseButtons = document.querySelectorAll(".js-viewer-close");
  var textViewer = document.getElementById("text-viewer");
  var entryTextTitle = document.getElementById("text-entry-title");
  var entryTextContent = document.getElementById("text-entry-content");
  var entryTextDatetime = document.getElementById("text-entry-datetime");
  var imageViewer = document.getElementById("image-viewer");
  var entryImageTitle = document.getElementById("image-entry-title");
  var entryImageContent = document.getElementById("image-entry-content");
  var entryImageDatetime = document.getElementById("image-entry-datetime");

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
  var activeEntryMenu = null;
  var scrollPosition = null;
  var response = null;
  //#endregion

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
    response = data;
    // console.log(data);
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
    // sampleResponse = data;
    let listItems = "";
    data.forEach((entry) => {
      if (entry.type == "text") {
        listItems += `<li data-id="${entry.entryId}" class="c-entries__item">
        <div class="c-entries__top">
        <span
          class="
            material-icons
            c-entries__content-icon c-entries__content-icon--blue
          "
        >
          article
        </span>
        <div class="c-entries__menu">
        <button
          class="
            c-button c-button--circle-small c-button--text-only c-button--text-black
            js-entry-menu
          "
        >
          <span class="material-icons"> more_vert </span>
        </button>
        <ul class="c-entries__dropdown">
          <li class="c-entries__menu-item js-entry-edit">
            <span class="material-icons c-entries__menu-item-icon">edit</span>
            <p class="c-text">Edit</p>
          </li>
          <li class="c-entries__menu-item js-entry-delete">
            <span class="material-icons c-entries__menu-item-icon">delete</span>
            <p class="c-text">Delete</p>
          </li>
        </ul>
      </div>
        </div>
        <div class="c-entries__title-time">
          <h2 class="c-header c-header--x-large c-header--break-word c-header--margin-bottom">${
            entry.title
          }</h2>
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
        <div class="c-entries__top">
        <span
          class="
            material-icons
            c-entries__content-icon c-entries__content-icon--green
          "
        >
          image
        </span>
        <div class="c-entries__menu">
        <button
          class="
            c-button c-button--circle-small c-button--text-only c-button--text-black
            js-entry-menu
          "
        >
          <span class="material-icons"> more_vert </span>
        </button>
        <ul class="c-entries__dropdown">
          <li class="c-entries__menu-item js-entry-edit">
            <span class="material-icons c-entries__menu-item-icon">edit</span>
            <p class="c-text">Edit</p>
          </li>
          <li class="c-entries__menu-item js-entry-delete">
            <span class="material-icons c-entries__menu-item-icon">delete</span>
            <p class="c-text">Delete</p>
          </li>
        </ul>
      </div>
        </div>
        <div class="c-entries__title-time">
          <h2 class="c-header c-header--x-large c-header--break-word c-header--margin-bottom">${
            entry.title
          }</h2>
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
      ${data}
      </p>`;
    } else if (type == "image") {
      data.slice(0, 3).forEach((url) => {
        content += `<div class="c-entries__image-wrap"><img
        src="${url}"
        alt="entry image"
        class="c-entries__image"/></div>`;
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
    let target = event.target;
    // console.log(target);
    if (target.classList.contains("l-main__editor")) {
      let editor = target.querySelector(".c-entry-create").id;
      if (editor == "text-editor") {
        closeTextEditor();
      } else if (editor == "image-uploader") {
        closeImageUploader();
      }
    }
    // } else if (
    //   target.parentNode.classList.contains("js-entry-menu") ||
    //   target.classList.contains("js-entry-menu")
    // ) {
    //   hideMenu();
    //   // hideEntryDropdowns();
    //   // showEntryDropdown(target);
    // }
    else if (target.classList.contains("l-main__viewer")) {
      let viewer = target.querySelector(".c-viewer").id;
      if (viewer == "text-viewer") {
        closeTextViewer();
      } else if (viewer == "image-viewer") {
        closeImageViewer();
      }
    } else if (target.classList.contains("l-main__account")) {
      closeAccountDisplay();
    } else if (
      target.parentNode.id == "add-button" ||
      target.id == "add-button"
    ) {
      toggleMenu();
      activeEntryMenu = null;
      hideEntryDropdowns();
    } else {
      activeEntryMenu = null;
      hideEntryDropdowns();
      hideMenu();
    }
  }

  function closeEditor() {
    let parentContainer = this.parentNode.parentNode;
    // console.log(parentContainer);
    switch (parentContainer.id) {
      case "image-uploader":
        closeImageUploader();
        break;
      case "text-editor":
        closeTextEditor();
        break;
      default:
        break;
    }
  }

  function closeViewer() {
    let parentContainer = this.parentNode.parentNode;
    // console.log(parentContainer);
    switch (parentContainer.id) {
      case "image-viewer":
        closeImageViewer();
        break;
      case "text-viewer":
        closeTextViewer();
        break;
      default:
        break;
    }
  }

  function showEntryDropdown(event) {
    // console.log(target);
    hideMenu();
    let dropdown = event.target.parentNode.querySelector(
      ".c-entries__dropdown"
    );
    activeEntryMenu = dropdown;
    hideEntryDropdowns();
    dropdown.classList.toggle("c-entries__dropdown--visible");
  }

  function hideEntryDropdowns() {
    document.querySelectorAll(".c-entries__dropdown").forEach((dropdown) => {
      if (!(dropdown === activeEntryMenu)) {
        dropdown.classList.remove("c-entries__dropdown--visible");
      }
    });
  }

  function toggleMenu() {
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

  function hideMenu() {
    addButton.classList.remove("c-button--rotate");
    menu.classList.remove(menu.classList[0] + "--visible");
    menuTl.reverse();
  }

  function showAccountDisplay() {
    let parentContainer = accountPopup.parentNode;
    bodyScrollSet();
    parentContainer.classList.add("l-main__account--visible");
    accountPopup.classList.add("c-account--visible");
  }

  function closeAccountDisplay() {
    let parentContainer = accountPopup.parentNode;
    parentContainer.classList.remove("l-main__account--visible");
    accountPopup.classList.remove("c-account--visible");
    bodyScrollRevert();
  }

  function showTextEditor() {
    let parentContainer = textEditor.parentNode;
    bodyScrollSet();
    parentContainer.classList.add("l-main__editor--visible");
    textEditor.classList.add("c-entry-create--visible");
    toggleMenu();
  }

  function closeTextEditor() {
    let parentContainer = textEditor.parentNode;
    textEditor.querySelectorAll(".js-editor-editable").forEach((editable) => {
      editable.textContent = "";
    });
    parentContainer.classList.remove("l-main__editor--visible");
    textEditor.classList.remove("c-entry-create--visible");
    bodyScrollRevert();
  }

  function showImageUploader() {
    let parentContainer = imageUploader.parentNode;
    bodyScrollSet();
    parentContainer.classList.add("l-main__editor--visible");
    imageUploader.classList.add("c-entry-create--visible");
    toggleMenu();
  }

  function closeImageUploader() {
    let parentContainer = imageUploader.parentNode;
    imageUploader
      .querySelectorAll(".js-editor-editable")
      .forEach((editable) => {
        editable.textContent = "";
      });
    parentContainer.classList.remove("l-main__editor--visible");
    imageUploader.classList.remove("c-entry-create--visible");
    bodyScrollRevert();
  }

  function pasteCatcher(event) {
    event.preventDefault();
    let text = event.clipboardData.getData("text/plain");
    let selection = window.getSelection();
    let range = selection.getRangeAt(0);
    range.deleteContents();
    let node = document.createTextNode(text);
    range.insertNode(node);

    selection.collapseToEnd();

    // for(let position = 0; position != text.length; position++)
    // {
    //     selection.modify("move", "right", "character");
    // };
  }

  function viewEntry() {
    let item = this;
    let itemId = item.getAttribute("data-id");
    let itemDatetime = null;
    let itemEntry = null;

    bodyScrollSet();

    response.entries.forEach((date) => {
      date.dateEntries.forEach((entry) => {
        if (entry.entryId == itemId) {
          itemEntry = entry;
        }
      });
    });
    // console.log(itemEntry);
    if (itemEntry.type == "text") {
      itemDatetime = new Date(itemEntry.time);
      entryTextTitle.innerText = itemEntry.title;
      entryTextContent.innerText = itemEntry.content;
      entryTextDatetime.innerText = `${
        MONTHS_LONG[itemDatetime.getMonth()]
      } ${itemDatetime.getDate()}, ${itemDatetime.getFullYear()} at ${itemDatetime.toLocaleTimeString(
        "en-us",
        {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }
      )}`;

      textViewer.parentNode.classList.add("l-main__viewer--visible");
      textViewer.classList.add("c-viewer--visible");
    } else {
      let content = "";
      itemDatetime = new Date(itemEntry.time);
      entryImageTitle.innerText = itemEntry.title;
      // entryImageContent.innerText = itemEntry.content.content;
      entryImageDatetime.innerText = `${
        MONTHS_LONG[itemDatetime.getMonth()]
      } ${itemDatetime.getDate()}, ${itemDatetime.getFullYear()} at ${itemDatetime.toLocaleTimeString(
        "en-us",
        {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }
      )}`;

      itemEntry.content.forEach((url) => {
        content += `<li class="c-viewer__gallery-item"><img
        src="${url}"
        alt="entry image"
        class="c-viewer__gallery-image"/></li>`;
      });

      entryImageContent.innerHTML = content;

      imageViewer.parentNode.classList.add("l-main__viewer--visible");
      imageViewer.classList.add("c-viewer--visible");
    }
  }

  function closeTextViewer() {
    textViewer.parentNode.classList.remove("l-main__viewer--visible");
    textViewer.classList.remove("c-viewer--visible");
    bodyScrollRevert();
  }

  function closeImageViewer() {
    imageViewer.parentNode.classList.remove("l-main__viewer--visible");
    imageViewer.classList.remove("c-viewer--visible");
    bodyScrollRevert();
  }

  function submitEntry() {
    let editor = this.parentNode.parentNode;
    let formData = new FormData();
    let method = "POST";
    let credentials = "include";
    let headers = { "Content-Type": "application/json" };
    let body = null;
    if (editor.id == "text-editor") {
      let jsonBody = {};
      // let result = {};
      formData.append("type", "text");
      formData.append("title", textTitleInput.textContent);
      formData.append("content", textBodyInput.innerText);
      formData.forEach((value, key) => (jsonBody[key] = value));
      body = JSON.stringify(jsonBody);

      fetchJson("/entries", "POST", "include", body, headers).then((result) => {
        console.log(result);
        if (result.success) {
          fetchJson(`/entries/${result.entryId}`, "GET", "include").then(
            (data) => {}
          );
        }
      });
    }
  }

  async function fetchJson(
    link,
    method,
    credentials = null,
    body = null,
    headers = null
  ) {
    let response = null;

    if (body) {
      response = await fetch(link, { method, body, credentials, headers });
    } else {
      response = await fetch(link, { method, credentials });
    }

    const data = await response.json();
    return data;
  }

  function bodyScrollSet() {
    scrollPosition = window.scrollY;
    document.body.classList.toggle("c-body--no-scroll");
    document.body.style.top = -scrollPosition + "px";
  }

  function bodyScrollRevert() {
    document.body.classList.remove("c-body--no-scroll");
    window.scrollTo(0, scrollPosition);
  }

  function addListeners() {
    document.querySelectorAll(".c-entries__item").forEach((item) => {
      item.addEventListener("click", viewEntry);
    });
    document.querySelectorAll(".js-entry-menu").forEach((menu) => {
      menu.addEventListener("click", function (event) {
        event.stopPropagation();
        showEntryDropdown.bind(this)(event);
      });
    });
    // addButton.addEventListener("click", toggleMenu);
    document.addEventListener("click", function (event) {
      checkTarget(event);
    });
    editorCloseButtons.forEach((button) => {
      button.addEventListener("click", closeEditor);
    });
    editorDoneButtons.forEach((button) => {
      button.addEventListener("click", submitEntry);
    });
    contentEditables.forEach((editable) => {
      editable.addEventListener("paste", function (event) {
        pasteCatcher.bind(this)(event);
      });
    });
    accountCloseButton.addEventListener("click", closeAccountDisplay);
    viewerCloseButtons.forEach((button) => {
      button.addEventListener("click", closeViewer);
    });
    accountButton.addEventListener("click", showAccountDisplay);
    imageAddButton.addEventListener("click", showImageUploader);
    textAddButton.addEventListener("click", showTextEditor);
  }
})();
