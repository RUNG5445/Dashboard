let defaultLatitude,
    defaultLongitude,
    url = "https://api.rungrueng.site",
    map,
    marker,
    markers,
    circle;

function getCookie(name) {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split("=");
        if (cookieName.trim() === name) {
            return cookieValue;
        }
    }

    return null;
}

let username = getCookie("username");

function logout() {
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "table=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.replace("login.html");
}

document.addEventListener("DOMContentLoaded", function () {
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    const navbarBrand = document.getElementById("name");
    if (username) {
        console.log(username);
        navbarBrand.textContent = capitalizeFirstLetter(username);
    }
    if (!username) {
        window.location.replace("login.html");
        return;
    }
});

async function submitForms() {
    var start = document.getElementById("start").value;
    var end = document.getElementById("end").value;

    var formData = {
        start: start,
        end: end,
    };

    window.location.href = `results.html?start=${start}&end=${end}`;
}

document.addEventListener("DOMContentLoaded", function () {
    var randomDelay = Math.floor(Math.random() * 1001);

    var styleElement = document.createElement("style");
    styleElement.textContent = `
    :root {
    --animate-duration: ${randomDelay + 500}ms !important;
    --animate-delay: 1s !important;
    }
`;

    document.head.appendChild(styleElement);

    setTimeout(function () {
        $("#loadingMessage").hide();
    }, randomDelay);
});

async function fetchDataAndUpdateForm() {
    try {
        const response = await fetch(url + "/api/alert/con?user=" + username);
        const data = await response.json();
        const resemail = await fetch(url + "/api/emails?user=" + username);
        const dataemail = await resemail.json();

        const emails = dataemail.Emails;

        const emailContainer = document.getElementById("allemail");

        emails.forEach((email) => {
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
        user: username,
    };

    const message = `Submitting Form with the following values:
    Recipient Email: ${email}
    Delay between Alerts :${delay}`;

    if (confirm(message)) {
        alert("Form submitted! Email Settings have been changed.");
    } else {
        return;
    }

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

async function initializeMap() {
    var defaultLatLng = L.latLng(defaultLatitude, defaultLongitude);
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
    marker.bindPopup("Destination").openPopup();

    var currentPositionData = await latestpos();
    currentPositionData = JSON.parse(currentPositionData);

    var currentLat = parseFloat(currentPositionData.Latitude);
    var currentLng = parseFloat(currentPositionData.Longitude);

    if (!isNaN(currentLat) && !isNaN(currentLng)) {
        var currentLatLng = L.latLng(currentLat, currentLng);
        var currentMarker = new L.marker(currentLatLng).addTo(map);
        currentMarker.bindPopup("Current Location").openPopup();

        var midpoint = L.latLng([(parseFloat(defaultLatitude) + currentLat) / 2, (parseFloat(defaultLongitude) + currentLng) / 2]);

        map.setView(midpoint, 11);
    }

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
    const temperature = document.getElementById("temperature").value;
    const humidity = document.getElementById("humidity").value;
    const speed = document.getElementById("speed").value;
    const latitude = document.getElementById("latitude").value;
    const longitude = document.getElementById("longitude").value;
    const radius = document.getElementById("radius").value;
    const nodeBattery = document.getElementById("nodeBattery").value;
    const gatewayBattery = document.getElementById("gatewayBattery").value;

    const body = {
        Temperature: temperature,
        Humidity: humidity,
        Speed: speed,
        Longitude: longitude,
        Latitude: latitude,
        Radius: radius,
        NBattery: nodeBattery,
        GBattery: gatewayBattery,
        user: username,
    };

    const message = `Submitting Form with the following values:
        Temperature: ${temperature} °C
        Humidity: ${humidity} %
        Speed: ${speed} Km/h
        Latitude: ${latitude}
        Longitude: ${longitude}
        Radius: ${radius} Km
        Node Battery: ${nodeBattery} %
        Gateway Battery: ${gatewayBattery} %`;

    if (confirm(message)) {
        alert("Form submitted! Alert condition have been changed.");
    } else {
        return;
    }

    const options = {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json",
        },
    };

    try {
        const response = await fetch(url + "/api/alert/changecon", options);

        if (response.ok) {
            console.log("Form submitted successfully!");
        } else {
            console.log("Error submitting form.");
        }
    } catch (error) {
        console.error("Error submitting form:", error);
    }
    location.reload();
}

async function deleteEmail(email) {
    try {
        const response = await fetch(url + "/api/deleteemail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: email, user: username }),
        });
        const result = await response.json();
        console.log(result);

        const resemail = await fetch(url + "/api/emails?user=" + username);
        const dataemail = await resemail.json();

        const emails = dataemail.Emails;

        const emailContainer = document.getElementById("allemail");

        while (emailContainer.firstChild) {
            emailContainer.removeChild(emailContainer.firstChild);
        }

        emails.forEach((email) => {
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

function resetForm() {
    document.getElementById("temperature").value = 40;
    document.getElementById("humidity").value = 80;
    document.getElementById("speed").value = 100;
    document.getElementById("latitude").value = 13.783653;
    document.getElementById("longitude").value = 100.634766;
    document.getElementById("radius").value = 2;
    document.getElementById("nodeBattery").value = 50;
    document.getElementById("gatewayBattery").value = 50;
    submitForm();
}

async function latestpos() {
    try {
        const response = await fetch(url + "/api/latest?user=" + username, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const result = await response.json();
        return JSON.stringify(result);
    } catch (error) {
        console.error("Error deleting email:", error);
    }
}

fetchDataAndUpdateForm();
