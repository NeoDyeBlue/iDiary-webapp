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

function generateEntries(data) {
  let dateWrap = "";
  data.entries.forEach((dates) => {
    let date = new Date(dates.date);
    dateWrap += `<li data-date='${dates.date}' class="c-entries__on-date">
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
  return dateWrap;
}

function createDateEntries(data) {
  // sampleResponse = data;
  let listItems = "";
  data.forEach((entry) => {
    if (entry.type == "text") {
      listItems += `<li class="c-entries__item">
        <div class="c-entries__top">
        <span
          class="
            material-icons
            c-entries__content-icon c-entries__content-icon--blue
          "
        >
          article
        </span>
        </div>
        <div class="c-entries__menu">
        <button
          class="
            c-button c-button--circle-small c-button--text-only c-button--text-black
            js-entry-menu
          "
        >
          <span class="material-icons"> more_vert </span>
        </button>
        <ul class="c-entries__dropdown" data-id="${entry.entryId}" data-type="${
        entry.type
      }">
      <li class="c-entries__menu-item js-entry-edit">
          <span class="material-icons c-entries__menu-icon">edit</span>
          <p class="c-entries__menu-text">Edit</p>
        </li>
        <li class="c-entries__menu-item js-entry-delete">
          <span class="material-icons c-entries__menu-icon c-entries__menu-icon--red">delete</span>
          <p class="c-entries__menu-text c-entries__menu-text--red">Delete</p>
        </li>
        </ul>
      </div>
        <div class="c-entries__title-time">
          <h2 data-id="${entry.entryId}" data-type="${
        entry.type
      }" class="c-header c-header--x-large c-header--break-word c-header--margin-bottom-30 c-header--hoverable js-entry-click">
          ${entry.title}</h2>
          <p class="c-text c-text--small c-text--neutral-600 c-text--bold">
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
      listItems += `<li class="c-entries__item">
        <div class="c-entries__top">
        <span
          class="
            material-icons
            c-entries__content-icon c-entries__content-icon--green
          "
        >
          image
        </span>
        </div>
        <div class="c-entries__menu">
        <button
          class="
            c-button c-button--circle-small c-button--text-only c-button--text-black
            js-entry-menu
          "
        >
          <span class="material-icons"> more_vert </span>
        </button>
        <ul class="c-entries__dropdown" data-id="${entry.entryId}" data-type="${
        entry.type
      }">
          <li class="c-entries__menu-item js-entry-edit">
            <span class="material-icons c-entries__menu-icon">edit</span>
            <p class="c-entries__menu-text">Edit</p>
          </li>
          <li class="c-entries__menu-item js-entry-delete">
            <span class="material-icons c-entries__menu-icon c-entries__menu-icon--red">delete</span>
            <p class="c-entries__menu-text c-entries__menu-text--red">Delete</p>
          </li>
        </ul>
      </div>
        <div class="c-entries__title-time">
          <h2 data-id="${entry.entryId}" data-type="${
        entry.type
      }" class="c-header c-header--x-large c-header--break-word c-header--margin-bottom-30 c-header--hoverable js-entry-click">${
        entry.title
      }</h2>
          <p class="c-text c-text--small c-text--neutral-600 c-text--bold">
          ${new Date(entry.time).toLocaleTimeString("en-us", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })}
          </p>
        </div>
        <div
          class="
            c-entries__content-wrap c-entries__content-wrap--image js-album-preview
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
    let snippet = data;
    if (snippet.length > 150) {
      snippet = data.substring(0, data.indexOf(" ", 150));
      // var rx = new RegExp("^.{" + 50 + "}[^ ]*");
      // snippet = rx.exec(snippet)[0];
      snippet += " ...";
    }
    content += `
      <p class="c-text c-text--neutral-300 c-entries__text js-text-content">
      ${snippet}
      </p>`;
  } else if (type == "image") {
    data.slice(0, 3).forEach((img) => {
      content += `<div data-id="${img.id}" class="c-entries__image-wrap"><img
        src="${img.url}"
        alt="entry image"
        loading="lazy"
        class="c-entries__image"/></div>`;
    });
    if (data.length > 3) {
      let excess = data.length - 3;
      content += `<div class="c-entries__image-wrap">
      <p class="c-text c-text--neutral-300 c-text--large c-text--absolute">+${excess} more</p>
      </div>`;
    }
  }
  return content;
}

export { generateEntries, createDateEntries };
