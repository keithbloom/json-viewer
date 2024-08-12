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
        } catch (error) {
            errorMessage.textContent = 'Invalid JSON: ' + error.message;
        }
    });

    function createJsonTable(data, path = '') {
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        const headerRow = document.createElement('tr');
        ['Key', 'Value'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        for (const [key, value] of Object.entries(data)) {
            const row = document.createElement('tr');
            const keyCell = document.createElement('td');
            const valueCell = document.createElement('td');

            keyCell.textContent = path ? `${path}.${key}` : key;

            if (typeof value === 'object' && value !== null) {
                const nestedTable = createJsonTable(value, path ? `${path}.${key}` : key);
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
});
