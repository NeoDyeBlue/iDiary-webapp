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
  var acctProfileThumb = document.getElementById("profile-thumb");
  var acctFirstNameEl = document.getElementById("acct-first-name");
  var acctLastNameEl = document.getElementById("acct-last-name");
  var welcomeNameEl = document.getElementById("user-first-name");
  var addButton = document.getElementById("add-button");
  var textAddButton = document.getElementById("text-add-button");
  var accountPopup = document.getElementById("account-display");
  var imageAddButton = document.getElementById("image-add-button");
  var contentEditables = document.querySelectorAll(".js-editor-editable");
  var menu = document.getElementById("menu-slide");
  var menuItems = document.querySelectorAll(".c-nav__button-item");
  var mainList = document.getElementById("main-list");
  //editor vars
  var textEditorLabel = document.getElementById("text-editor-label");
  var imageUploadeLabel = document.getElementById("image-uploader-label");
  var textTitleInput = document.getElementById("text-title-input");
  var textBodyInput = document.getElementById("text-body-input");
  var textEditor = document.getElementById("text-editor");
  var imageUploader = document.getElementById("image-uploader");
  var albumTitleInput = document.getElementById("album-title-input");
  var imageInput = document.getElementById("image-file");
  var imagePreviewer = document.getElementById("image-previewer");
  var editorCloseButtons = document.querySelectorAll(".js-editor-close");
  var editorDoneButtons = document.querySelectorAll(".js-editor-done");
  var imageSubmitButton = document.getElementById("images-submit");
  var selectedImages = [];
  var toRemoveFromCloud = [];
  var editorOptions = {
    label: "New Entry",
    doneHandler: "new",
    updateId: null,
    toUpdate: null,
  };
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
  //account view
  var accountCloseButton = document.querySelector(".js-account-close");
  var accountImageChange = document.getElementById("profile-image");
  //modal
  var deleteModal = document.getElementById("delete-modal");
  var deleteButton = document.getElementById("delete-confirm");
  var toDeleteEntry = {
    id: null,
    type: null,
    element: null,
  };

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
      acctProfileThumb.src = data.user.image;
      accountImageChange.src = data.user.image;
      acctFirstNameEl.innerText = data.user.firstName;
      acctLastNameEl.innerText = data.user.lastName;
      initializeClock();
      setInterval(updateClock, 1000);
      apiResponse = data;
      mainList.innerHTML = generateEntries(data);
      addListeners();
      createGSAPAnims();
    });
    fetchJson("https://quotes.rest/qod?language=en", "GET")
      .then((data) => {
        // console.log(data.contents.quotes.quote);

        quoteText.innerText = data.contents.quotes[0].quote;
        quoteAuthor.innerText = data.contents.quotes[0].author;
        quoteContainer.style.backgroundImage = ` linear-gradient( 0deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%), url("${data.contents.quotes[0].background}")`;
      })
      .catch((err) => {
        console.log(err);
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
    // outside editor click
    if (target.classList.contains("l-main__editor")) {
      let editor = target.querySelector(".c-entry-create").id;
      if (editor == "text-editor") {
        closeTextEditor();
      } else if (editor == "image-uploader") {
        closeImageUploader();
      }
    }
    //entry click
    else if (target.classList.contains("js-entry-click")) {
      activeEntryMenu = null;
      hideMenu();
      hideEntryDropdowns();
      viewEntry(target);
    }
    //entry menu click
    else if (target.classList.contains("js-entry-menu")) {
      hideMenu();
      hideEntryDropdowns();
      showEntryDropdown(target);
    }
    //entry edit click
    else if (target.classList.contains("js-entry-edit")) {
      activeEntryMenu = null;
      hideMenu();
      hideEntryDropdowns();
      editorOptions.label = "Edit Entry";
      editorOptions.doneHandler = "update";
      editorOptions.toUpdate = target.parentNode.parentNode.parentNode;
      // console.log(editorOptions.toUpdate);
      if (target.parentNode.getAttribute("data-type") == "text") {
        showTextEditor(target.parentNode.getAttribute("data-id"));
      } else {
        showImageUploader(target.parentNode.getAttribute("data-id"));
      }
    }
    //entry delete click
    else if (target.classList.contains("js-entry-delete")) {
      activeEntryMenu = null;
      hideMenu();
      hideEntryDropdowns();
      showDeleteModal();
      toDeleteEntry.id = target.parentNode.getAttribute("data-id");
      toDeleteEntry.type = target.parentNode.getAttribute("data-type");
      toDeleteEntry.element = target.parentNode.parentNode.parentNode;
      // editorOptions.toDelete = target.parentNode.parentNode.parentNode;
      // deleteEntry(target.parentNode.getAttribute("data-id"));
    }
    //outside modal click
    else if (
      target.classList.contains("l-main__modal") ||
      target.classList.contains("js-delete-cancel")
    ) {
      hideDeleteModal();
    }
    //outside viewer click
    else if (target.classList.contains("l-main__viewer")) {
      let viewer = target.querySelector(".c-viewer").id;
      if (viewer == "text-viewer") {
        closeTextViewer();
      } else if (viewer == "image-viewer") {
        closeImageViewer();
      }
    }
    //outside account click
    else if (target.classList.contains("l-main__account")) {
      closeAccountDisplay();
    }
    //add button click
    else if (
      target.parentNode.id == "add-button" ||
      target.id == "add-button"
    ) {
      editorOptions.label = "New Entry";
      editorOptions.doneHandler = "new";
      toggleMenu();
      activeEntryMenu = null;
      hideEntryDropdowns();
    } else if (target.id == "text-add-button") {
      activeEntryMenu = null;
      hideEntryDropdowns();
      hideMenu();
      showTextEditor();
    } else if (target.id == "image-add-button") {
      activeEntryMenu = null;
      hideEntryDropdowns();
      hideMenu();
      showImageUploader();
    }
    //remove preview click
    else if (target.classList.contains("c-editor__remove")) {
      console.log(target.parentNode);
      removeSelectedImage(target.parentNode);
    }
    //else
    else {
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

  function showDeleteModal() {
    bodyScrollSet();
    let parent = deleteModal.parentNode;
    deleteModal.classList.add("c-modal--visible");
    parent.classList.add("l-main__modal--visible");
  }

  function hideDeleteModal() {
    bodyScrollRevert();
    let parent = deleteModal.parentNode;
    deleteModal.classList.remove("c-modal--visible");
    parent.classList.remove("l-main__modal--visible");
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

  function showTextEditor(itemId = null) {
    textEditorLabel.innerText = editorOptions.label;
    let parentContainer = textEditor.parentNode;
    bodyScrollSet();
    parentContainer.classList.add("l-main__editor--visible");
    textEditor.classList.add("c-entry-create--visible");
    hideMenu();

    if (itemId) {
      editorOptions.updateId = itemId;
      textEditor.classList.add("c-loader");
      fetchJson(`/entries/${itemId}`, "GET", "include").then((data) => {
        console.log(data);
        textEditor.classList.remove("c-loader");
        let itemEntry = data.entries[0].dateEntries[0];
        textTitleInput.innerText = itemEntry.title;
        textBodyInput.innerText = itemEntry.content;
      });
    }
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

  function showImageUploader(itemId = null) {
    imageUploadeLabel.innerText = editorOptions.label;
    let parentContainer = imageUploader.parentNode;
    bodyScrollSet();
    parentContainer.classList.add("l-main__editor--visible");
    imageUploader.classList.add("c-entry-create--visible");
    hideMenu();

    if (itemId) {
      editorOptions.updateId = itemId;
      console.log(true, itemId);
      imageUploader.classList.add("c-loader");
      fetchJson(`/entries/${itemId}`, "GET", "include").then((data) => {
        imageUploader.classList.remove("c-loader");
        let itemEntry = data.entries[0].dateEntries[0];
        albumTitleInput.innerText = itemEntry.title;

        itemEntry.content.forEach((img) => {
          let previewWrapper = document.createElement("li");
          previewWrapper.classList.add(
            "c-editor__upload-item",
            "js-image-preview"
          );
          let template = `
          <button class="c-editor__remove">
          <span class="material-icons"> remove </span>
          </button>
          <img
          src="${img.url}"
          alt="test image"
          class="c-editor__image-item"/>
          `;
          previewWrapper.innerHTML = template;
          // cloudImageIds.push(img.id);
          selectedImages.push(img);
          imagePreviewer.appendChild(previewWrapper);
        });
      });

      if (selectedImages) {
        imageSubmitButton.disabled = false;
      }
    }
  }

  function closeImageUploader() {
    let parentContainer = imageUploader.parentNode;
    selectedImages = [];
    imageUploader
      .querySelectorAll(".js-editor-editable")
      .forEach((editable) => {
        editable.textContent = "";
      });
    parentContainer.classList.remove("l-main__editor--visible");
    imageUploader.classList.remove("c-entry-create--visible");
    document.querySelectorAll(".js-image-preview").forEach((preview) => {
      preview.remove();
    });
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
    let itemType = item.getAttribute("data-type");
    let itemDatetime = null;
    let itemEntry = null;

    bodyScrollSet();

    if (itemType == "text") {
      textViewer.classList.add("c-loader");
      showTextViewer();
    } else {
      imageViewer.classList.add("c-loader");
      showImageViewer();
    }

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

        textViewer.classList.remove("c-loader");
      } else {
        imageViewer.classList.add("c-loader");
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

        itemEntry.content.forEach((img) => {
          content += `<li class="c-viewer__gallery-item"><img
          src="${img.url}"
          alt="entry image"
          class="c-viewer__gallery-image"/></li>`;
        });

        entryImageContent.innerHTML = content;
        imageViewer.classList.remove("c-loader");
      }
    });
  }

  function showTextViewer() {
    textViewer.parentNode.classList.add("l-main__viewer--visible");
    textViewer.classList.add("c-viewer--visible");
  }

  function showImageViewer() {
    imageViewer.parentNode.classList.add("l-main__viewer--visible");
    imageViewer.classList.add("c-viewer--visible");
  }

  function closeTextViewer() {
    textViewer.parentNode.classList.remove("l-main__viewer--visible");
    textViewer.classList.remove("c-viewer--visible");
    textViewer.classList.remove("c-loader");
    bodyScrollRevert();
  }

  function closeImageViewer() {
    imageViewer.parentNode.classList.remove("l-main__viewer--visible");
    imageViewer.classList.remove("c-viewer--visible");
    imageViewer.classList.remove("c-loader");
    bodyScrollRevert();
  }

  function previewImages() {
    let images = this.files;
    Array.from(images).forEach((image) => {
      selectedImages.push(image);

      let previewWrapper = document.createElement("li");
      previewWrapper.classList.add("c-editor__upload-item", "js-image-preview");
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

    if (selectedImages) {
      imageSubmitButton.disabled = false;
    }

    console.log(selectedImages);
  }

  function removeSelectedImage(target) {
    let index = Array.from(imagePreviewer.children).indexOf(target) - 1;
    let removed = selectedImages.splice(index, 1);

    if (typeof removed[0] === "object") {
      toRemoveFromCloud.push(removed[0]);
    }

    target.remove();

    if (!selectedImages.length) {
      imageSubmitButton.disabled = true;
    }
  }

  function editorDone() {
    if (editorOptions.doneHandler == "new") {
      submitEntry(this.parentNode.parentNode);
    } else if (editorOptions.doneHandler == "update") {
      updateEntry(this.parentNode.parentNode);
    }
  }

  function submitEntry(editor) {
    let formData = new FormData();
    let headers = null;
    let body = null;
    if (editor.id == "text-editor") {
      let jsonBody = {};
      headers = { "Content-Type": "application/json" };
      // let result = {};
      formData.append("type", "text");
      formData.append(
        "title",
        textTitleInput.textContent.length
          ? textTitleInput.textContent
          : "Untitled"
      );
      formData.append("content", textBodyInput.innerText);
      formData.forEach((value, key) => (jsonBody[key] = value));
      body = JSON.stringify(jsonBody);

      fetchJson("/entries", "POST", "include", body, headers)
        .then((result) => {
          console.log(result);
          if (result.success) {
            createEntryElement(result.entryId);
            closeTextEditor();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      formData.append("type", "image");
      formData.append(
        "title",
        albumTitleInput.textContent.length
          ? albumTitleInput.textContent
          : "Untitled"
      );
      headers = {
        "Content-Type":
          "multipart/form-data; boundary=—-WebKitFormBoundaryfgtsKTYLsT7PNUVD",
      };

      selectedImages.forEach((file) => {
        formData.append("images", file);
        console.log(file);
      });

      body = formData;
      editor.parentNode.classList.add("c-loader");
      // console.log(body);

      fetchJson("/entries/upload", "POST", "include", body).then((result) => {
        console.log(result);
        if (result.success) {
          createEntryElement(result.entryId);
          editor.classList.remove("c-loader");
          closeImageUploader();
        }
      });
    }
  }

  function createEntryElement(entryId) {
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
    });
  }

  function updateEntry(editor) {
    let formData = new FormData();
    let headers = null;
    let body = null;
    if (editor.id == "text-editor") {
      textEditor.parentNode.classList.add("c-loader");
      let jsonBody = {};
      headers = { "Content-Type": "application/json" };
      // let result = {};
      formData.append("type", "text");
      formData.append(
        "title",
        textTitleInput.textContent.length
          ? textTitleInput.textContent
          : "Untitled"
      );
      formData.append("content", textBodyInput.innerText);
      formData.forEach((value, key) => (jsonBody[key] = value));
      body = JSON.stringify(jsonBody);

      fetchJson(
        `/entries/${editorOptions.updateId}`,
        "POST",
        "include",
        body,
        headers
      )
        .then((result) => {
          console.log(result);
          if (result.success) {
            updateEntryElement(result.updatedItemId, editorOptions.toUpdate);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (editor.id == "image-uploader") {
      imageUploader.parentNode.classList.add("c-loader");
      let retained = [];
      formData.append("type", "image");
      formData.append(
        "title",
        albumTitleInput.textContent.length
          ? albumTitleInput.textContent
          : "Untitled"
      );
      headers = {
        "Content-Type":
          "multipart/form-data; boundary=—-WebKitFormBoundaryfgtsKTYLsT7PNUVD",
      };

      selectedImages.forEach((selection) => {
        // console.log(selection);
        if (selection instanceof File) {
          console.log("imafile");
          formData.append("images", selection);
        } else {
          retained.push(selection);
        }
      });
      formData.append("toRetain", JSON.stringify({ content: retained }));
      formData.append(
        "toRemove",
        JSON.stringify({ content: toRemoveFromCloud })
      );

      body = formData;

      fetchJson(
        `/entries/${editorOptions.updateId}`,
        "POST",
        "include",
        body
      ).then((result) => {
        console.log(result);
        if (result.success) {
          // createEntryElement(result.entryId);
          updateEntryElement(result.updatedItemId, editorOptions.toUpdate);
        }
      });
    }
  }

  function updateEntryElement(id, element) {
    fetchJson(`/entries/${id}`, "GET", "include").then((data) => {
      console.log(data);
      let itemEntry = data.entries[0].dateEntries[0];

      if (itemEntry.type == "text") {
        let snippet = itemEntry.content;
        if (snippet.length > 150) {
          snippet = itemEntry.content.substring(
            0,
            itemEntry.content.indexOf(" ", 150)
          );
          snippet += " ...";
        }
        element.querySelector(".js-entry-click").innerText = itemEntry.title;
        element.querySelector(".js-text-content").innerText = snippet;
        textEditor.parentNode.classList.remove("c-loader");
        closeTextEditor();
      } else if (itemEntry.type == "image") {
        element.querySelector(".js-entry-click").innerText = itemEntry.title;
        let content = "";
        let imageContentWrap = document.querySelector(".js-album-preview");
        itemEntry.content.slice(0, 3).forEach((img) => {
          content += `<div data-id="${img.id}" class="c-entries__image-wrap"><img
            src="${img.url}"
            alt="entry image"
            class="c-entries__image"/></div>`;
        });
        if (itemEntry.content.length > 3) {
          let excess = itemEntry.content.length - 3;
          content += `<div class="c-entries__image-wrap">
          <p class="c-text c-text--neutral-300 c-text--large c-text--absolute">+${excess} more</p>
          </div>`;
        }

        imageContentWrap.innerHTML = content;

        imageUploader.parentNode.classList.remove("c-loader");
        closeImageUploader();
      }
    });
  }

  function deleteEntry() {
    deleteModal.parentNode.classList.add("c-loader");
    fetchJson(`entries/${toDeleteEntry.id}`, "DELETE", "include").then(
      (result) => {
        if (result.success) {
          let parentList = toDeleteEntry.element.parentNode;
          toDeleteEntry.element.remove();

          if (!parentList.querySelectorAll("c-entries__item").length) {
            parentList.remove();
          }
        }

        deleteModal.parentNode.classList.remove("c-loader");
        hideDeleteModal();
      }
    );
  }

  async function fetchJson(
    link,
    method,
    credentials = null,
    body = null,
    headers = null
  ) {
    let response = null;

    if (body && credentials && headers) {
      response = await fetch(link, { method, body, credentials, headers });
    } else if (body && credentials) {
      response = await fetch(link, { method, body, credentials });
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
      button.addEventListener("click", editorDone);
    });
    imageInput.addEventListener("change", previewImages);
    contentEditables.forEach((editable) => {
      editable.addEventListener("paste", function (event) {
        pasteCatcher.bind(this)(event);
      });
    });
    // imageUploader.addEventListener("transitionend", removePreviews);
    accountCloseButton.addEventListener("click", closeAccountDisplay);
    viewerCloseButtons.forEach((button) => {
      button.addEventListener("click", closeViewer);
    });
    accountButton.addEventListener("click", showAccountDisplay);
    deleteButton.addEventListener("click", deleteEntry);
    // imageAddButton.addEventListener("click", showImageUploader);
    // textAddButton.addEventListener("click", showTextEditor);
  }
})();
