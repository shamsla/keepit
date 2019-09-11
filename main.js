var submit = document.querySelector(".btn");
var entry = document.querySelector(".item-name");
var items_container = document.querySelector("#items");
var search = document.querySelector(".search");
var err = document.querySelector(".err");
var pop_up = document.querySelector(".sure-inner");
var pop_main = document.querySelector(".sure");
var p_cancel = document.querySelector(".c-btn");
var p_sure = document.querySelector(".s-btn");

var hold = false;
var rem_li;

entry.addEventListener("keypress", setEnter);
submit.addEventListener("click", setItem);
items_container.addEventListener("click", removeItem);
search.addEventListener("keyup", filter);
search.addEventListener("blur", reset);
document.addEventListener("click", blurError);
p_cancel.addEventListener("click", () => {
  hold = false;
  makeRemove();
});
p_sure.addEventListener("click", () => {
  hold = true;
  makeRemove();
});

function reset(e) {
  items = items_container.getElementsByTagName("li");
  Array.from(items).forEach(item => {
    item.style.display = "block";
  });
  e.target.value = "";
}

function filter(e) {
  let text = e.target.value.toLowerCase();
  items = items_container.getElementsByTagName("li");
  Array.from(items).forEach(item => {
    let item_name = item.querySelector("#main-text").firstChild.textContent;
    if (item_name.toLowerCase().indexOf(text) != -1) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
}

function removeItem(e) {
  if (
    e.target.classList.contains("cross") ||
    e.target.classList.contains("fa-trash")
  ) {
    if (e.target.classList.contains("fa-trash")) {
      rem_li = e.target.parentElement.parentElement;
    } else {
      rem_li = e.target.parentElement;
    }
    popDisplay();
  }
}

function makeRemove() {
  if (hold) {
    items_container.removeChild(rem_li);
    createStorage();
  }
  popHide();
}

function setEnter(e) {
  if (e.which == 13 || e.KeyCode == 13) {
    setItem();
  }
}

function setItem() {
  let val = entry.value.trim();
  if (val) {
    if (!checkExistence(val)) {
      makeItem(entry.value);
      entry.value = "";
    } else {
      setTimeout(() => {
        displayError("Already Exists!");
      }, 10);
    }
  } else {
    setTimeout(() => {
      displayError("Enter Item!");
    }, 10);
  }
}

function checkExistence(name) {
  let data = loadStorage(1);
  if (data != null) {
    if (data.length > 0) {
      if (data.indexOf(name.toLowerCase()) != -1) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
}

function createStorage() {
  items = items_container.getElementsByTagName("li");
  let data = [];
  Array.from(items).forEach(item => {
    data.push(item.querySelector("#main-text").firstChild.textContent);
  });
  localStorage.setItem("list_ITEMS-data", JSON.stringify(data));
}

function loadStorage(n) {
  let data = JSON.parse(localStorage.getItem("list_ITEMS-data"));
  if (n == 1) {
    return data;
  }
  if (data != null) {
    if (data.length > 0) {
      data.forEach(item => {
        makeItem(item);
      });
    }
  }
}

function makeItem(name) {
  let element = createNewElement({
    name: "li",
    class_name: "list-group-item"
  });

  let inside = createNewElement({ name: "span", class_name: "inside" });
  let main_text = createNewElement({
    name: "span",
    id_name: "main-text",
    text: name.toLowerCase()
  });
  let cross = createNewElement({
    name: "button",
    class_name: "cross"
  });

  let icon = createNewElement({
    name: "i",
    class_name: "fa fa-trash",
    attr: ["aria-hidden", "true"]
  });

  inside.appendChild(main_text);
  element.appendChild(inside);
  cross.appendChild(icon);
  element.appendChild(cross);

  let last_item = document.querySelectorAll(".list-group-item:last-child");
  insertAfter(items_container, last_item, element);
}

function insertAfter(parent, child, new_child) {
  parent.insertBefore(new_child, child.nextSibling);
  createStorage();
}

function createNewElement({
  name: name,
  class_name: class_name,
  id_name: id_name,
  attr: attr,
  text: text
}) {
  let new_element = document.createElement(name);
  if (class_name != undefined) {
    new_element.className = class_name;
  }

  if (id_name != undefined) {
    new_element.id = id_name;
  }
  if (attr != undefined) {
    if (typeof attr[0] != "object") {
      new_element.setAttribute(attr[0], attr[1]);
    } else {
      for (let i = 0; i < attr.length; i++) {
        new_element.setAttribute(attr[i][0], attr[i][1]);
      }
    }
  }

  if (text != undefined) {
    new_element.appendChild(document.createTextNode(text));
  }

  return new_element;
}

function displayError(str) {
  err.style.backgroundColor = "#db3236";
  err.innerText = str;
  entry.blur();
}

function blurError() {
  if (err.innerText != "Keep Your Items") {
    err.style.backgroundColor = "#fff";
    err.innerText = "Keep Your Items";
  }
}

function popDisplay() {
  pop_main.style.visibility = "visible";
  pop_up.style.opacity = "1";
  pop_up.style.transition =
    "transform 0.3s cubic-bezier(0.29, 0.29, 0.06, 1.47)";
  setTimeout(() => {
    pop_up.style.transform = "scale(1)";
  }, 10);
}

function popHide() {
  pop_up.style.transition = "all 0.3s ease";
  pop_up.style.opacity = "0";
  setTimeout(() => {
    pop_main.style.visibility = "hidden";
    pop_up.style.transform = "scale(0)";
  }, 30);
}

loadStorage(2);
