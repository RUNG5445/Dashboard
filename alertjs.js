let defaultLatitude;
let defaultLongitude;
let url = "https://api.rungrueng.site";
let map;
var marker;
var circle;

async function submitForms() {
    var start = document.getElementById("start").value;
    var end = document.getElementById("end").value;

    var formData = {
        start: start,
        end: end,
    };

    window.location.href = `results.html?start=${start}&end=${end}`;
}

async function fetchDataAndUpdateForm() {
    try {
        const response = await fetch(url + "/api/alert/con");
        const data = await response.json();
        const resemail = await fetch(url + "/api/emails");
        const dataemail = await resemail.json();

        // Access the array of emails directly
        const emails = dataemail.Emails;

        const emailContainer = document.getElementById("allemail");

        // Display each email with a delete button
        emails.forEach((email) => {
            // Create the email container div
            const containerDiv = document.createElement("div");
            containerDiv.classList.add("email-container");

            const emailDiv = document.createElement("div");
            emailDiv.textContent = email;

            const deleteButtonDiv = document.createElement("div");
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "X";
            deleteButton.onclick = () => deleteEmail(email);
            deleteButtonDiv.appendChild(deleteButton);

            containerDiv.appendChild(emailDiv);
            containerDiv.appendChild(deleteButtonDiv);
            emailContainer.appendChild(containerDiv);
        });

        console.log(emails);

        document.getElementById("temperature").value = data.Temperature;
        document.getElementById("humidity").value = data.Humidity;
        document.getElementById("speed").value = data.Speed;
        document.getElementById("latitude").value = data.Latitude;
        document.getElementById("longitude").value = data.Longitude;
        defaultLatitude = data.Latitude;
        defaultLongitude = data.Longitude;
        document.getElementById("radius").value = data.Radius;
        document.getElementById("delay").value = dataemail.Delay;
        document.getElementById("nodeBattery").value = data["Node Battery"];
        document.getElementById("gatewayBattery").value = data["Gateway Battery"];

        initializeMap();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function submitFormEmail() {
    const email = document.getElementById("Email").value;
    const delay = document.getElementById("delay").value;

    const body = {
        email: email,
        delay: delay,
    };

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    };

    try {
        const response = await fetch(url + "/api/addemail", options);

        if (response.ok) {
            console.log("Form submitted successfully!");
        } else {
            console.log("Error submitting form.");
        }
    } catch (error) {
        console.error("Error submitting form:", error);
    }
}

function initializeMap() {
    var defaultLatLng = L.latLng(defaultLatitude, defaultLongitude); // Define defaultLatLng here
    map = L.map("map").setView([defaultLatitude, defaultLongitude], 15);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
    }).addTo(map);
    marker = new L.marker(defaultLatLng).addTo(map);
    document.getElementById("latitude").value = defaultLatitude;
    document.getElementById("longitude").value = defaultLongitude;
    var radius = document.getElementById("radius").value;
    circle = L.circle(defaultLatLng, {
        color: "blue",
        fillColor: "blue",
        fillOpacity: 0.1,
        radius: radius * 1000,
    }).addTo(map);

    // Add event listener for map click
    map.on("click", function (e) {
        if (marker) {
            map.removeLayer(marker);
        }
        if (circle) {
            map.removeLayer(circle);
        }
        marker = new L.marker(e.latlng).addTo(map);
        document.getElementById("latitude").value = e.latlng.lat;
        document.getElementById("longitude").value = e.latlng.lng;
        var radius = document.getElementById("radius").value;
        circle = L.circle(e.latlng, {
            color: "blue",
            fillColor: "blue",
            fillOpacity: 0.1,
            radius: radius * 1000,
        }).addTo(map);
    });
}

async function submitForm() {
    try {
        const formData = new FormData(document.getElementById("condition"));
        const bodyData = {};

        for (const [key, value] of formData.entries()) {
            bodyData[key] = value;
        }

        const response = await fetch(url + "/api/alert/changecon", {
            method: "POST",
            body: JSON.stringify(bodyData),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            console.log("Form submitted successfully!");
        } else {
            console.log("Error submitting form.");
        }
    } catch (error) {
        console.log("Error submitting form:", error);
    }
}

async function deleteEmail(email) {
    try {
        const response = await fetch(url + "/api/deleteemail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: email }),
        });
        const result = await response.json();
        console.log(result);
        // Refresh the UI after successful deletion
        const resemail = await fetch(url + "/api/emails");
        const dataemail = await resemail.json();

        // Access the array of emails directly
        const emails = dataemail.Emails;

        const emailContainer = document.getElementById("allemail");

        // Remove all child elements of the emailContainer div
        while (emailContainer.firstChild) {
            emailContainer.removeChild(emailContainer.firstChild);
        }

        // Display each email with a delete button
        emails.forEach((email) => {
            // Create the email container div
            const containerDiv = document.createElement("div");
            containerDiv.classList.add("email-container");

            const emailDiv = document.createElement("div");
            emailDiv.textContent = email;

            const deleteButtonDiv = document.createElement("div");
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "X";
            deleteButton.onclick = () => deleteEmail(email);
            deleteButtonDiv.appendChild(deleteButton);

            containerDiv.appendChild(emailDiv);
            containerDiv.appendChild(deleteButtonDiv);
            emailContainer.appendChild(containerDiv);
        });
    } catch (error) {
        console.error("Error deleting email:", error);
    }
}

// Call the function to fetch data and update the form
fetchDataAndUpdateForm();
