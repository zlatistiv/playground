document.addEventListener("DOMContentLoaded", function() {
	const params = new URLSearchParams(window.location.search);
	const datapath = "/data/" + params.get("data") + "/";

	fetch(datapath + "header.json")
	.then(response => {
		if (!response.ok) {
			throw new Error("Failed to fetch data!");
		}
		return response.json();
	})
	.then(fields => {
		window.header = fields;
		populateTableHeader(fields);
		fetch(datapath + "data.json")
		.then(response => {
			if (!response.ok) {
				throw new Error("Failed to fetch data!");
			}
			return response.json();
		})
		.then(data => {
			window.data = data;
			populateTable(data, fields, null);
		})
		.catch(error => {
			console.log("Failed to populate table:", error);
		});
	});
});

function getNestedValue(obj, path) {
	return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

function populateTableHeader(fields) {
	const tableHeader = document.getElementById("data-table-header");
	const tableSearch = document.getElementById("data-table-search");

	fields.forEach(field => {
		const colHeader = document.createElement("th");
		colHeader.innerHTML = `<th>${field}</th>`
		tableHeader.appendChild(colHeader);

		const colSearchTd = document.createElement("td");
		const colSearchInput = document.createElement("input");
		colSearchInput.id = field;

		colSearchInput.addEventListener("input", function() {populateTable(data, header, [event.target.id, event.target.value])});

		colSearchTd.appendChild(colSearchInput);
		tableSearch.appendChild(colSearchTd);
	});
}

function populateTable(data, fields, filter) {
	const tableBody = document.getElementById("data-table").tBodies[0];
	tableBody.innerHTML = "";

	data.forEach(item => {
		if (filter == null || String(getNestedValue(item, filter[0])).match(filter[1])) {
			const row = document.createElement("tr");
			fields.forEach(field => {
				const value = getNestedValue(item, field);
				//if (!String(value).includes(filter)) filtered = true;
				row.innerHTML += `<td>${value}</td>`;
			});
			tableBody.appendChild(row);
		}
	});
}

