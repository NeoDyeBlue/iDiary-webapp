// const e = require("express");

// import e from "express";
import {
  generateEntries,
  createDateEntries,
} from "../../assets/scripts/modules/generator.js";

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
  var quoteContainer = document.getElementById("quote-container");
  var quoteText = document.getElementById("quote-text");
  var quoteAuthor = document.getElementById("quote-author");
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
  var imageInput = document.getElementById("image-file");
  var imagePreviewer = document.getElementById("image-previewer");
  var editorCloseButtons = document.querySelectorAll(".js-editor-close");
  var editorDoneButtons = document.querySelectorAll(".js-editor-done");
  var selectedFiles = [];
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

  var activeEntryMenu = null;
  var scrollPosition = null;
  var apiResponse = null;
  //#endregion

  var menuTl = gsap.timeline({
    defaults: {
      duration: 0.25,
    },
    paused: true,
  });

  function init() {
    fetchJson("/entries/all", "GET", "include").then((data) => {
      welcomeNameEl.innerText = data.user.firstName;
      acctFirstNameEl.innerText = data.user.firstName;
      acctLastNameEl.innerText = data.user.lastName;
      initializeClock();
      setInterval(updateClock, 1000);
      apiResponse = data;
      mainList.innerHTML = generateEntries(data);
      addListeners();
      createGSAPAnims();
      console.log(apiResponse);
    });
    fetchJson("https://quotes.rest/qod?language=en", "GET").then((data) => {
      // console.log(data.contents.quotes.quote);

      quoteText.innerText = data.contents.quotes[0].quote;
      quoteAuthor.innerText = data.contents.quotes[0].author;
      quoteContainer.style.backgroundImage = ` linear-gradient( 0deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.3) 100%), url("${data.contents.quotes[0].background}")`;
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

  function createGSAPAnims() {
    gsapDatePins();

    gsap.utils.toArray(menuItems).forEach((item) => {
      menuTl.from(item, { opacity: 0, y: "10px" }, "-0.25");
    });
  }

  function gsapDatePins() {
    let dateIndicator = document.querySelectorAll(".c-entries__date-indicator");
    gsap.utils.toArray(dateIndicator).forEach((indicator, index) => {
      ScrollTrigger.create({
        trigger: indicator.parentNode,
        start: "top top",
        end: "bottom 10%",
        onEnter: () => {
          indicator.classList.add("c-entries__date-indicator--pin");
        },
      });
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
    } else if (target.classList.contains("js-entry-click")) {
      activeEntryMenu = null;
      hideMenu();
      hideEntryDropdowns();
      viewEntry(target);
    } else if (target.classList.contains("js-entry-menu")) {
      hideMenu();
      hideEntryDropdowns();
      showEntryDropdown(target);
    } else if (target.classList.contains("l-main__viewer")) {
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

  function showEntryDropdown(target) {
    // console.log(target);
    hideMenu();
    let dropdown = target.parentNode.querySelector(".c-entries__dropdown");
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

  function viewEntry(item) {
    // let item = item;
    let itemId = item.getAttribute("data-id");
    let itemDatetime = null;
    let itemEntry = null;

    bodyScrollSet();

    fetchJson(`/entries/${itemId}`, "GET", "include").then((data) => {
      itemEntry = data.entries[0].dateEntries[0];
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
    });

    // apiResponse.entries.forEach((date) => {
    //   date.dateEntries.forEach((entry) => {
    //     if (entry.entryId == itemId) {
    //       itemEntry = entry;
    //     }
    //   });
    // });

    // console.log(itemEntry);
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

  function previewImages() {
    let images = this.files;
    Array.from(images).forEach((image) => {
      selectedFiles.push(image);

      let previewWrapper = document.createElement("li");
      previewWrapper.classList.add("c-editor__upload-item");
      let template = `
      <button class="c-editor__remove">
      <span class="material-icons"> remove </span>
      </button>
      <img
      src="${URL.createObjectURL(image)}"
      alt="test image"
      class="c-editor__image-item"/>
      `;
      previewWrapper.innerHTML = template;

      imagePreviewer.appendChild(previewWrapper);
    });
    console.log(images);
    console.log("called");
    console.log(selectedFiles);
  }

  function submitEntry() {
    let editor = this.parentNode.parentNode;
    let formData = new FormData();
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
        if (result.success) {
          createEntry(result.entryId);
        }
      });
    }
  }

  function createEntry(entryId) {
    fetchJson(`/entries/${entryId}`, "GET", "include").then((data) => {
      let firstListItem = mainList.querySelector(".c-entries__on-date");
      let newItem = null;

      if (firstListItem) {
        let dateAttr = new Date(
          Number(firstListItem.getAttribute("data-date"))
        );

        if (
          dateAttr.toLocaleDateString() ==
          new Date(data.entries[0].date).toLocaleDateString()
        ) {
          newItem = new DOMParser()
            .parseFromString(
              createDateEntries(data.entries[0].dateEntries),
              "text/html"
            )
            .body.querySelector(".c-entries__item");

          firstListItem
            .querySelector(".c-entries__date-entries")
            .prepend(newItem);
        } else {
          newItem = new DOMParser()
            .parseFromString(generateEntries(data), "text/html")
            .body.querySelector(".c-entries__on-date");

          mainList.prepend(newItem);
          gsapDatePins();
        }
      } else {
        newItem = new DOMParser()
          .parseFromString(generateEntries(data), "text/html")
          .body.querySelector(".c-entries__on-date");

        console.log(newItem);

        mainList.prepend(newItem);
        gsapDatePins();
      }
      closeTextEditor();
    });
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
    } else if (credentials) {
      response = await fetch(link, { method, credentials });
    } else {
      response = await fetch(link, { method });
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
    // document.querySelectorAll(".c-entries__item").forEach((item) => {
    //   item.addEventListener("click", viewEntry);
    // });
    // document.querySelectorAll(".js-entry-menu").forEach((menu) => {
    //   menu.addEventListener("click", function (event) {
    //     event.stopPropagation();
    //     showEntryDropdown.bind(this)(event);
    //   });
    // });
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
    imageInput.addEventListener("change", previewImages);
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
