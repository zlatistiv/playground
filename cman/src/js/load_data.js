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
			populateTable(data, fields);
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

		colSearchInput.addEventListener("input", function() {populateTable(data, header)});

		colSearchTd.appendChild(colSearchInput);
		tableSearch.appendChild(colSearchTd);
	});
}


function populateTable(data, fields) {
	const tableBody = document.getElementById("data-table").tBodies[0];
	tableBody.innerHTML = "";

	

	data.forEach(item => {
		if ((() => {
			for (let i = 0; i < fields.length; i++) {
				const string = String(getNestedValue(item, fields[i]));
				const regex = String(document.getElementById(fields[i]).value);
				if (string.match(regex) == null) return false;
			}
			return true;
		})()) {
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

