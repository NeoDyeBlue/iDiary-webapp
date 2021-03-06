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
  //account accountForms
  var accountImageDefault = null;
  var accountImageInput = document.getElementById("acct-image-upload");
  var accountForms = document.querySelectorAll(".c-form");
  var accountFirstNameInput = document.getElementById("first-name");
  var accountLastNameInput = document.getElementById("last-name");
  var accountEmailInput = document.getElementById("email");
  var accountEmailErr = document.getElementById("email-error");
  var accountPasswordInput = document.getElementById("password");
  var accountPasswordConfirmInput = document.getElementById("password-confirm");
  var accountPasswordErr = document.getElementById("password-error");
  var accountSubmitButtons = document.querySelectorAll(".js-acct-update");
  var nameSubmitButton = document.getElementById("name-submit");
  var emailSubmitButton = document.getElementById("email-submit");
  var passwordSubmitButton = document.getElementById("password-submit");
  var successIcons = document.querySelectorAll(".c-form__submit-success");

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
      accountImageDefault = data.user.image;
      acctProfileThumb.src = data.user.image;
      accountImageChange.src = data.user.image;
      acctFirstNameEl.innerText = data.user.firstName;
      accountFirstNameInput.defaultValue = data.user.firstName;
      accountLastNameInput.defaultValue = data.user.lastName;
      accountEmailInput.defaultValue = data.user.email;
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

  //generals funcs
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
    // gsap.utils.toArray(dateIndicator).forEach((indicator, index) => {
    //   ScrollTrigger.create({
    //     trigger: indicator.parentNode,
    //     start: "top top",
    //     end: "bottom 10%",
    //     onEnter: () => {
    //       indicator.classList.add("c-entries__date-indicator--pin");
    //     },
    //   });
    // });
    gsap.utils.toArray(dateIndicator).forEach((indicator) => {
      ScrollTrigger.create({
        trigger: indicator,
        scroller: ".l-main",
        start: "top top",
        endTrigger: indicator.parentNode,
        end: "bottom 20%",
        // markers: true,
        pinSpacing: false,
        pinType: "fixed",
        pin: true,
      });
    });
  }

  function gsapDatePinSingle(indicator) {
    // gsap.utils.toArray(dateIndicator).forEach((indicator, index) => {
    //   ScrollTrigger.create({
    //     trigger: indicator.parentNode,
    //     start: "top top",
    //     end: "bottom 10%",
    //     onEnter: () => {
    //       indicator.classList.add("c-entries__date-indicator--pin");
    //     },
    //   });
    // });
    ScrollTrigger.create({
      trigger: indicator,
      scroller: ".l-main",
      start: "top top",
      endTrigger: indicator.parentNode,
      end: "bottom 20%",
      // markers: true,
      pinSpacing: false,
      pinType: "fixed",
      pin: true,
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
    }
    //text add
    else if (target.id == "text-add-button") {
      activeEntryMenu = null;
      hideEntryDropdowns();
      hideMenu();
      showTextEditor();
    }
    //image add
    else if (target.id == "image-add-button") {
      activeEntryMenu = null;
      hideEntryDropdowns();
      hideMenu();
      showImageUploader();
    }
    //remove preview click
    else if (target.classList.contains("c-editor__remove")) {
      removeSelectedImage(target.parentNode);
    }
    //else
    else {
      activeEntryMenu = null;
      hideEntryDropdowns();
      hideMenu();
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
    // bodyScrollSet();
    let parent = deleteModal.parentNode;
    deleteModal.classList.add("c-modal--visible");
    parent.classList.add("l-main__modal--visible");
  }

  function hideDeleteModal() {
    // bodyScrollRevert();
    let parent = deleteModal.parentNode;
    deleteModal.classList.remove("c-modal--visible");
    parent.classList.remove("l-main__modal--visible");
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

  function deleteEntry() {
    deleteModal.parentNode.classList.add("c-loader");
    fetchJson(`entries/${toDeleteEntry.id}`, "DELETE", "include").then(
      (result) => {
        if (result.success) {
          let parentList = toDeleteEntry.element.parentNode;
          toDeleteEntry.element.remove();

          if (parentList.children.length == 0) {
            parentList.parentNode.remove();
          }

          ScrollTrigger.refresh();
        }

        deleteModal.parentNode.classList.remove("c-loader");
        hideDeleteModal();
      }
    );
  }

  //editor funcs
  function showTextEditor(itemId = null) {
    textEditorLabel.innerText = editorOptions.label;
    let parentContainer = textEditor.parentNode;
    // bodyScrollSet();
    parentContainer.classList.add("l-main__editor--visible");
    textEditor.classList.add("c-entry-create--visible");
    hideMenu();

    if (itemId) {
      editorOptions.updateId = itemId;
      // textEditor.classList.add("c-loader");
      textEditor.parentNode.classList.add("c-loader");
      fetchJson(`/entries/${itemId}`, "GET", "include").then((data) => {
        // textEditor.classList.remove("c-loader");
        textEditor.parentNode.classList.remove("c-loader");
        let itemEntry = data.entries[0].dateEntries[0];
        textTitleInput.innerText = itemEntry.title;
        textBodyInput.innerText = itemEntry.content;
      });
    }
  }

  function showImageUploader(itemId = null) {
    imageUploadeLabel.innerText = editorOptions.label;
    let parentContainer = imageUploader.parentNode;
    // bodyScrollSet();
    parentContainer.classList.add("l-main__editor--visible");
    imageUploader.classList.add("c-entry-create--visible");
    hideMenu();

    if (itemId) {
      editorOptions.updateId = itemId;
      // imageUploader.classList.add("c-loader");
      imageUploader.parentNode.classList.add("c-loader");
      fetchJson(`/entries/${itemId}`, "GET", "include").then((data) => {
        console.log("called");
        // imageUploader.classList.remove("c-loader");
        imageUploader.parentNode.classList.remove("c-loader");
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

  function editorDone() {
    if (editorOptions.doneHandler == "new") {
      submitEntry(this.parentNode.parentNode);
    } else if (editorOptions.doneHandler == "update") {
      updateEntry(this.parentNode.parentNode);
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

  function closeTextEditor() {
    let parentContainer = textEditor.parentNode;
    textEditor.querySelectorAll(".js-editor-editable").forEach((editable) => {
      editable.textContent = "";
    });
    parentContainer.classList.remove("l-main__editor--visible");
    textEditor.classList.remove("c-entry-create--visible");
    // bodyScrollRevert();
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
    // bodyScrollRevert();
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
      editor.parentNode.classList.add("c-loader");
      fetchJson("/entries", "POST", "include", body, headers)
        .then((result) => {
          if (result.success) {
            editor.parentNode.classList.remove("c-loader");
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
          "multipart/form-data; boundary=???-WebKitFormBoundaryfgtsKTYLsT7PNUVD",
      };

      selectedImages.forEach((file) => {
        formData.append("images", file);
      });

      body = formData;
      editor.parentNode.classList.add("c-loader");
      // console.log(body);

      fetchJson("/entries/upload", "POST", "include", body).then((result) => {
        console.log(result);
        if (result.success) {
          createEntryElement(result.entryId);
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

          ScrollTrigger.refresh();
        } else {
          newItem = new DOMParser()
            .parseFromString(generateEntries(data), "text/html")
            .body.querySelector(".c-entries__on-date");

          mainList.prepend(newItem);
          gsapDatePinSingle(
            newItem.querySelector(".c-entries__date-indicator")
          );
          ScrollTrigger.refresh();
        }
      } else {
        newItem = new DOMParser()
          .parseFromString(generateEntries(data), "text/html")
          .body.querySelector(".c-entries__on-date");

        mainList.prepend(newItem);
        gsapDatePin(newItem.querySelector(".c-entries__date-indicator"));
        ScrollTrigger.refresh();
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
          "multipart/form-data; boundary=???-WebKitFormBoundaryfgtsKTYLsT7PNUVD",
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
          console.log(editorOptions.toUpdate);
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
        ScrollTrigger.refresh();
        closeTextEditor();
      } else if (itemEntry.type == "image") {
        element.querySelector(".js-entry-click").innerText = itemEntry.title;
        let content = "";
        let imageContentWrap = element.querySelector(".js-album-preview");
        if (itemEntry.content.length > 4) {
          let excess = itemEntry.content.length - 4;
          itemEntry.content.slice(0, 3).forEach((img) => {
            content += `<div data-id="${img.id}" class="c-entries__image-wrap"><img
              src="${img.url}"
              alt="entry image"
              loading="lazy"
              class="c-entries__image"/></div>`;
          });
          content += `
          <div class="c-entries__image-wrap">
          <img
            src="${itemEntry.content[3].url}"
            alt="entry image"
            loading="lazy"
            class="c-entries__image"/>
          <p class="c-text c-text--neutral-300 c-text--large c-text--absolute c-text--white c-text--center">+${excess} more</p>
          </div>`;
        } else {
          itemEntry.content.slice(0, 4).forEach((img) => {
            content += `<div data-id="${img.id}" class="c-entries__image-wrap"><img
            src="${img.url}"
            alt="entry image"
            loading="lazy"
            class="c-entries__image"/></div>`;
          });
        }

        imageContentWrap.innerHTML = content;

        imageUploader.parentNode.classList.remove("c-loader");
        ScrollTrigger.refresh();
        closeImageUploader();
      }
    });
  }

  //viewer funcs
  function viewEntry(item) {
    // let item = item;
    let itemId = item.getAttribute("data-id");
    let itemType = item.getAttribute("data-type");
    let itemDatetime = null;
    let itemEntry = null;

    // bodyScrollSet();

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
          loading="lazy"
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

  function closeTextViewer() {
    textViewer.parentNode.classList.remove("l-main__viewer--visible");
    textViewer.classList.remove("c-viewer--visible");
    textViewer.classList.remove("c-loader");
    // bodyScrollRevert();
  }

  function closeImageViewer() {
    imageViewer.parentNode.classList.remove("l-main__viewer--visible");
    imageViewer.classList.remove("c-viewer--visible");
    imageViewer.classList.remove("c-loader");
    // bodyScrollRevert();
  }

  //account
  function showAccountDisplay() {
    let parentContainer = accountPopup.parentNode;
    // bodyScrollSet();
    parentContainer.classList.add("l-main__account--visible");
    accountPopup.classList.add("c-account--visible");
  }

  function closeAccountDisplay() {
    let parentContainer = accountPopup.parentNode;
    parentContainer.classList.remove("l-main__account--visible");
    accountPopup.classList.remove("c-account--visible");
    // bodyScrollRevert();

    if (accountImageDefault == acctProfileThumb.src) {
      accountImageChange.src = accountImageDefault;
    } else {
      accountImageDefault = acctProfileThumb.src;
    }

    accountForms.forEach((form) => {
      form.reset();
    });

    successIcons.forEach((icons) => {
      icons.classList.remove("c-form__submit-success--visible");
    });

    accountSubmitButtons.forEach((button) => {
      button.disabled = true;
    });
  }

  function changeAccountImage() {
    let image = this.files[0];

    if (image) {
      let formData = new FormData();
      accountImageChange.src = URL.createObjectURL(image);
      accountImageChange.parentNode.classList.add("c-loader");

      formData.append("image", image);

      fetchJson("/users/photo", "POST", "include", formData)
        .then((result) => {
          if (result.success) {
            accountImageChange.src = result.imageUrl;
            acctProfileThumb.src = result.imageUrl;
            accountImageChange.parentNode.classList.remove("c-loader");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  function accountFormSubmit(event) {
    event.preventDefault();

    let formName = this.id;
    console.log(this.id);

    let formData = new FormData(this);
    let method = "POST";
    let headers = { "Content-Type": "application/json" };

    let jsonBody = {};
    formData.forEach((value, key) => {
      if (key !== "passwordConfirm") {
        jsonBody[key] = value;
      }
    });
    let body = JSON.stringify(jsonBody);

    console.log(body);
    let submitButton = this.querySelector(".c-button");
    let indicator = this.querySelector(".c-form__indicator");
    let successMarker = this.querySelector(".c-form__submit-success");

    successMarker.classList.remove("c-form__submit-success--visible");

    submitButton.disabled = true;
    indicator.classList.add("c-loader-plain");

    if (formName == "name-form") {
      fetchJson("/users/name", method, "include", body, headers)
        .then((result) => {
          if (result.success) {
            indicator.classList.remove("c-loader-plain");
            successMarker.classList.add("c-form__submit-success--visible");
            accountFirstNameInput.defaultValue = jsonBody.firstName;
            accountLastNameInput.defaultValue = jsonBody.lastName;
            welcomeNameEl.innerText = jsonBody.firstName;
            acctFirstNameEl.innerText = jsonBody.firstName;
            acctLastNameEl.innerText = jsonBody.lastName;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (formName == "email-form") {
      accountEmailErr.classList.remove("c-form__error--visible");
      accountEmailInput.classList.remove("c-form__input--border-red");
      fetchJson("/users/email", method, "include", body, headers).then(
        (result) => {
          if (result.success) {
            accountEmailInput.defaultValue = jsonBody.email;
            indicator.classList.remove("c-loader-plain");
            successMarker.classList.add("c-form__submit-success--visible");
          } else {
            indicator.classList.remove("c-loader-plain");
            accountEmailInput.classList.add("c-form__input--border-red");
            accountEmailErr.classList.add("c-form__error--visible");
          }
        }
      );
    } else if (formName == "password-form") {
      accountPasswordInput.classList.remove("c-form__input--border-red-normal");
      accountPasswordConfirmInput.classList.remove("c-form__input--border-red");
      accountPasswordErr.classList.remove("c-form__error--visible");
      if (accountPasswordInput.value == accountPasswordConfirmInput.value) {
        fetchJson("/users/password", method, "include", body, headers)
          .then((result) => {
            indicator.classList.remove("c-loader-plain");
            successMarker.classList.add("c-form__submit-success--visible");
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        indicator.classList.remove("c-loader-plain");
        accountPasswordInput.classList.add("c-form__input--border-red-normal");
        accountPasswordConfirmInput.classList.add("c-form__input--border-red");
        accountPasswordErr.classList.add("c-form__error--visible");
      }
    }
  }

  function addListeners() {
    accountForms.forEach((form) => {
      form.addEventListener("submit", function (event) {
        accountFormSubmit.bind(this)(event);
      });
    });
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
    accountFirstNameInput.addEventListener("input", () => {
      nameSubmitButton.disabled = false;
    });
    accountImageInput.addEventListener("change", changeAccountImage);
    accountLastNameInput.addEventListener("input", () => {
      nameSubmitButton.disabled = false;
    });
    accountEmailInput.addEventListener("input", () => {
      emailSubmitButton.disabled = false;
    });
    accountPasswordInput.addEventListener("input", () => {
      passwordSubmitButton.disabled = false;
    });
    accountPasswordConfirmInput.addEventListener("input", () => {
      passwordSubmitButton.disabled = false;
    });
  }
})();
