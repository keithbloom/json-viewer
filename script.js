document.addEventListener("DOMContentLoaded", () => {
  const jsonInput = document.getElementById("jsonInput");
  const parseButton = document.getElementById("parseButton");
  const errorMessage = document.getElementById("errorMessage");
  const jsonTree = document.getElementById("jsonTree");
  const expandAllButton = document.getElementById("expandAll");
  const collapseAllButton = document.getElementById("collapseAll");

  parseButton.addEventListener("click", parseJSON);
  expandAllButton.addEventListener("click", () => toggleAll(true));
  collapseAllButton.addEventListener("click", () => toggleAll(false));

  function parseJSON() {
    const input = jsonInput.value.trim();
    let parsedData;

    try {
      // First, try to parse as JSON
      parsedData = JSON.parse(input);
    } catch (e) {
      // If JSON parsing fails, check if it's a valid JavaScript object or array
      try {
        parsedData = eval("(" + input + ")");
      } catch (e) {
        // If eval fails, treat it as a string
        parsedData = input;
      }
    }

    // Clear previous error messages and tree
    errorMessage.textContent = "";
    jsonTree.innerHTML = "";

    // Render the parsed data
    const tree = createTree(parsedData);
    jsonTree.appendChild(tree);
  }

  function createTree(data) {
    const ul = document.createElement("ul");

    if (typeof data === "object" && data !== null) {
      for (const [key, value] of Object.entries(data)) {
        const li = document.createElement("li");
        const span = document.createElement("span");
        span.textContent = key + ": ";
        span.classList.add("key");

        if (typeof value === "object" && value !== null) {
          span.classList.add("caret");
          span.addEventListener("click", function () {
            this.parentElement
              .querySelector(".nested")
              .classList.toggle("active");
            this.classList.toggle("caret-down");
          });

          const nestedUl = createTree(value);
          nestedUl.classList.add("nested");
          li.appendChild(span);
          li.appendChild(nestedUl);
        } else {
          span.textContent += JSON.stringify(value);
          li.appendChild(span);
        }

        ul.appendChild(li);
      }
    } else {
      const li = document.createElement("li");
      li.textContent = JSON.stringify(data);
      ul.appendChild(li);
    }

    return ul;
  }

  function addToggleListeners() {
    const toggler = document.getElementsByClassName("caret");
    for (let i = 0; i < toggler.length; i++) {
      toggler[i].addEventListener("click", function () {
        this.parentElement.querySelector(".nested").classList.toggle("active");
        this.classList.toggle("caret-down");
      });
    }
  }

  function toggleAll(expand) {
    const carets = document.getElementsByClassName("caret");
    const nesteds = document.getElementsByClassName("nested");

    for (let caret of carets) {
      if (expand) {
        caret.classList.add("caret-down");
      } else {
        caret.classList.remove("caret-down");
      }
    }

    for (let nested of nesteds) {
      if (expand) {
        nested.classList.add("active");
      } else {
        nested.classList.remove("active");
      }
    }
  }
});
