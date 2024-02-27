let url = "https://api.rungrueng.site";

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

async function submitFormss() {
    var start = document.getElementById("start").value;
    var end = document.getElementById("end").value;

    var formData = {
        start: start,
        end: end,
    };

    window.location.href = `results.html?start=${start}&end=${end}`;
}

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

async function submitForm() {
    const url = "https://api.rungrueng.site"; // Update with your API URL

    const syncword = document.getElementById("syncword").value;
    const txPower = document.getElementById("txPower").value;
    const frequency = document.getElementById("frequency").value;
    const transmissionInterval = document.getElementById("transmissionInterval").value;

    const body = {
        syncword: syncword,
        txPower: txPower,
        freq: frequency,
        interval: transmissionInterval,
        user: username,
    };

    const syncwordHex = parseInt(syncword).toString(16).toUpperCase();
    const message = `Submitting Form with the following values:
    Syncword: ${syncword} (${syncwordHex})
    Tx Power: ${txPower} dBm
    Frequency: ${frequency} MHz
    Transmission Interval: ${transmissionInterval} minutes`;

    if (!confirm(message)) {
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
        const response = await fetch(url + "/api/sendconfig", options);

        if (response.ok) {
            alert("Form submitted! LoRa Settings have been changed.");
            console.log("Form submitted successfully!");
        } else {
            alert("Error submitting form. Please try again later.");
            console.log("Error submitting form.");
        }
    } catch (error) {
        alert("Error submitting form. Please try again later.");
        console.error("Error submitting form:", error);
    }

    location.reload();
}

async function fetchDataAndUpdateForm() {
    try {
        const response = await fetch(url + "/api/showconfig?user=" + username);
        const data = await response.json();

        document.getElementById("syncword").value = data.Syncword;
        document.getElementById("txPower").value = data.Tx_power;
        document.getElementById("frequency").value = data.Frequency;
        document.getElementById("transmissionInterval").value = data.Tx_interval;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}
function resetForm() {
    document.getElementById("syncword").value = "242";
    document.getElementById("txPower").value = "20";
    document.getElementById("frequency").value = "923";
    document.getElementById("transmissionInterval").value = "3";
    submitForm();
}

fetchDataAndUpdateForm();
