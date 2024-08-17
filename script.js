document.addEventListener('DOMContentLoaded', () => {
    const jsonInput = document.getElementById('jsonInput');
    const parseButton = document.getElementById('parseButton');
    const errorMessage = document.getElementById('errorMessage');
    const jsonTree = document.getElementById('jsonTree');
    const expandAllButton = document.getElementById('expandAll');
    const collapseAllButton = document.getElementById('collapseAll');

    parseButton.addEventListener('click', parseJSON);
    expandAllButton.addEventListener('click', () => toggleAll(true));
    collapseAllButton.addEventListener('click', () => toggleAll(false));

    function parseJSON() {
        const jsonString = jsonInput.value.trim();
        errorMessage.textContent = '';
        jsonTree.innerHTML = '';

        if (!jsonString) {
            errorMessage.textContent = 'Please enter a JSON string.';
            return;
        }

        try {
            const jsonData = JSON.parse(jsonString);
            const tree = createJsonTree(jsonData);
            jsonTree.appendChild(tree);
            addToggleListeners();
        } catch (error) {
            errorMessage.textContent = 'Invalid JSON: ' + error.message;
        }
    }

    function createJsonTree(data) {
        const ul = document.createElement('ul');

        for (const [key, value] of Object.entries(data)) {
            const li = document.createElement('li');
            const keySpan = document.createElement('span');
            keySpan.textContent = key;
            keySpan.classList.add('key');
            li.appendChild(keySpan);

            if (typeof value === 'object' && value !== null) {
                const caret = document.createElement('span');
                caret.classList.add('caret');
                li.insertBefore(caret, keySpan);

                const typeSpan = document.createElement('span');
                typeSpan.textContent = Array.isArray(value) ? ' [Array]' : ' {Object}';
                typeSpan.classList.add(Array.isArray(value) ? 'type-array' : 'type-object');
                li.appendChild(typeSpan);

                const nested = createJsonTree(value);
                nested.classList.add('nested');
                li.appendChild(nested);
            } else {
                const valueSpan = document.createElement('span');
                valueSpan.textContent = ': ' + JSON.stringify(value);
                valueSpan.classList.add('value');
                li.appendChild(valueSpan);
            }

            ul.appendChild(li);
        }

        return ul;
    }

    function addToggleListeners() {
        const toggler = document.getElementsByClassName("caret");
        for (let i = 0; i < toggler.length; i++) {
            toggler[i].addEventListener("click", function() {
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
