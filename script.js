document.addEventListener('DOMContentLoaded', () => {
    const jsonInput = document.getElementById('jsonInput');
    const parseButton = document.getElementById('parseButton');
    const errorMessage = document.getElementById('errorMessage');
    const jsonTable = document.getElementById('jsonTable');

    parseButton.addEventListener('click', () => {
        const jsonString = jsonInput.value.trim();
        errorMessage.textContent = '';
        jsonTable.innerHTML = '';

        if (!jsonString) {
            errorMessage.textContent = 'Please enter a JSON string.';
            return;
        }

        try {
            const jsonData = JSON.parse(jsonString);
            const table = createJsonTable(jsonData);
            jsonTable.appendChild(table);
            addCollapsibleFunctionality();
        } catch (error) {
            errorMessage.textContent = 'Invalid JSON: ' + error.message;
        }
    });

    function createJsonTable(data, path = '') {
        const table = document.createElement('table');
        const tbody = document.createElement('tbody');

        for (const [key, value] of Object.entries(data)) {
            const row = document.createElement('tr');
            const keyCell = document.createElement('td');
            const valueCell = document.createElement('td');

            keyCell.textContent = path ? `${path}.${key}` : key;

            if (typeof value === 'object' && value !== null) {
                keyCell.classList.add('collapsible');
                const nestedTable = createJsonTable(value, path ? `${path}.${key}` : key);
                nestedTable.classList.add('nested');
                valueCell.appendChild(nestedTable);
            } else {
                valueCell.textContent = JSON.stringify(value);
            }

            row.appendChild(keyCell);
            row.appendChild(valueCell);
            tbody.appendChild(row);
        }

        table.appendChild(tbody);
        return table;
    }

    function addCollapsibleFunctionality() {
        const collapsibles = document.querySelectorAll('.collapsible');
        collapsibles.forEach(item => {
            item.addEventListener('click', function() {
                this.classList.toggle('active');
                const content = this.nextElementSibling.querySelector('.nested');
                if (content.style.display === 'table-row-group') {
                    content.style.display = 'none';
                } else {
                    content.style.display = 'table-row-group';
                }
            });
        });
    }
});
