let url = "https://api.rungrueng.site";

async function submitFormss() {
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

async function submitForm() {
    const syncword = document.getElementById("syncword").value;
    const txPower = document.getElementById("txPower").value;
    const frequency = document.getElementById("frequency").value;
    const transmissionInterval = document.getElementById("transmissionInterval").value;

    const body = {
        syncword: syncword,
        txPower: txPower,
        freq: frequency,
        interval: transmissionInterval,
    };

    const syncwordHex = parseInt(syncword).toString(16).toUpperCase();
    const message = `Submitting Form with the following values:
    Syncword: ${syncword} (${syncwordHex})
    Tx Power: ${txPower} dBm
    Frequency: ${frequency} MHz
    Transmission Interval: ${transmissionInterval} minutes`;

    if (confirm(message)) {
        alert("Form submitted! LoRa Settings have been changed.");
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
        const response = await fetch(url + "/api/sendconfig", options);

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

async function fetchDataAndUpdateForm() {
    try {
        const response = await fetch(url + "/api/showconfig");
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
