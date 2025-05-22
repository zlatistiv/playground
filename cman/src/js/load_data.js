document.addEventListener("DOMContentLoaded", function() {
	fetch("/data/directories.json")
	.then(response => {
		if (!response.ok) {
			throw new Error("Failed to load data directory list");
		}
		return response.json();
	})
	.then(directories => {
		populateNavbar(directories);
	})
	.catch(error => {
		console.log("Failed to fetch data:", error);
	});

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
			console.log("Failed to fetch data:", error);
		});
	});
});

function getNestedValue(obj, path) {
	value = path.split('.').reduce((acc, key) => acc?.[key], obj);
	if (value) return value;
	else return "";
}

function searchString(string, search) {
	return string.toLowerCase().match(search.toLowerCase());
}

function populateNavbar(directories) {
	const navbarUl = document.getElementById("nav-links");

	directories.forEach(directory => {
		const li = document.createElement("li");
		const a = document.createElement("a")
		a.innerHTML = directory;
		a.href = `?data=${directory}`
		li.appendChild(a);
		navbarUl.appendChild(li);
	});
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

	

	for (const key in data) {
		item = data[key];
		item["id"] = key;
		if ((() => {
			for (let i = 0; i < fields.length; i++) {
				const string = String(getNestedValue(item, fields[i]));
				const regex = String(document.getElementById(fields[i]).value);
				if (!searchString(string, regex)) return false;
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
	}
}

