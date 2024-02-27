var container = document.querySelector(".container-fluid");
var dropdown = document.getElementById("navbarDropdownMenuLink");
var dropdownItems = document.querySelectorAll(".dropdown-item");

let dataLengthOld = 0;
let dataLengthNew = 0;
let url = "http://rung.ddns.net:8050";
let today = false;
let temperatureChart;
let humidityChart;
let r = 20;
let rH = 20;
let currentTime = new Date();
let map;
let filteredData = [];
let node1Data, node2Data, node3Data, node4Data;

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

async function submitForm() {
    var start = document.getElementById("start").value;
    var end = document.getElementById("end").value;

    var formData = {
        start: start,
        end: end,
    };

    window.location.href = `results.html?start=${start}&end=${end}` + "&user=" + username;
}

async function fetchData() {
    let response;
    if (today) {
        response = await fetch(url + "/api/show/today?user=" + username);
    } else {
        response = await fetch(url + "/api/show?user=" + username);
    }

    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
        console.log("fetchData successful: Received valid data.");
    } else {
        console.error("Invalid or empty data received:", data);
    }
    return data;
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

function mapDataValues(data, key) {
    return data.map((item) => (item[key] === 0 ? null : parseFloat(item[key])));
}

function createChart(canvasId, data1, data2, data3, data4, label1, label2, label3, label4, yAxisLabel, type) {
    console.log(`\n\n`);

    function mapTimestamps(data) {
        return data.map((item) => new Date(item.Time).toISOString().replace(".000Z", ""));
    }

    const latestData1 = data1;
    const latestData2 = data2;
    const latestData3 = data3;
    const latestData4 = data4;

    let timestamp1 = mapTimestamps(latestData1);
    let timestamp2 = mapTimestamps(latestData2);
    let timestamp3 = mapTimestamps(latestData3);
    let timestamp4 = mapTimestamps(latestData4);

    if (type === "temp") {
        console.log(`Creating Temperature Chart...`);
        let timestamp1temp = timestamp1.slice(-1 * r);
        let timestamp2temp = timestamp2.slice(-1 * r);
        let timestamp3temp = timestamp3.slice(-1 * r);
        let timestamp4temp = timestamp4.slice(-1 * r);

        let temperatures1 = mapDataValues(latestData1, "Temperature");
        let temperatures2 = mapDataValues(latestData2, "Temperature");
        let temperatures3 = mapDataValues(latestData3, "Temperature");
        let temperatures4 = mapDataValues(latestData4, "Temperature");

        temperatures1 = temperatures1.slice(-r);
        temperatures2 = temperatures2.slice(-r);
        temperatures3 = temperatures3.slice(-r);
        temperatures4 = temperatures4.slice(-r);

        console.log("Temperature 1:", JSON.stringify(temperatures1), "Length:", temperatures1.length);
        console.log("Temperature 2:", JSON.stringify(temperatures2), "Length:", temperatures2.length);
        console.log("Temperature 3:", JSON.stringify(temperatures3), "Length:", temperatures3.length);
        console.log("Temperature 4:", JSON.stringify(temperatures4), "Length:", temperatures4.length);

        let sum = 0;
        for (let i = 0; i < temperatures1.length; i++) {
            sum += temperatures1[i];
        }
        const averagetem = (sum / temperatures1.length).toFixed(2);
        console.log(`Average Temperature: ${averagetem}`);

        const convertedData1 = timestamp1temp.map((timestamp, index) => ({
            x: timestamp,
            y: temperatures1[index],
        }));
        const convertedData2 = timestamp2temp.map((timestamp, index) => ({
            x: timestamp,
            y: temperatures2[index],
        }));
        const convertedData3 = timestamp3temp.map((timestamp, index) => ({
            x: timestamp,
            y: temperatures3[index],
        }));
        const convertedData4 = timestamp4temp.map((timestamp, index) => ({
            x: timestamp,
            y: temperatures4[index],
        }));
        const data = {
            datasets: [
                {
                    label: label1,
                    data: convertedData1.map((item) => ({
                        x: item.x,
                        y: item.y,
                    })),
                    yAxisID: "y1",
                    backgroundColor: "rgba(255, 26, 104, 0.8)",
                    borderColor: "rgba(255, 26, 104, 1)",
                    borderWidth: 2,
                },
                {
                    label: label2,
                    data: convertedData2.map((item) => ({
                        x: item.x,
                        y: item.y,
                    })),
                    yAxisID: "y1",
                    backgroundColor: "rgba(54, 162, 235, 0.8)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 2,
                },
                {
                    label: label3,
                    data: convertedData3.map((item) => ({
                        x: item.x,
                        y: item.y,
                    })),
                    yAxisID: "y1",
                    backgroundColor: "rgba(255, 255, 0, 0.8)",
                    borderColor: "rgba(255, 255, 0, 1)",
                    borderWidth: 2,
                },
                {
                    label: label4,
                    data: convertedData4.map((item) => ({
                        x: item.x,
                        y: item.y,
                    })),
                    yAxisID: "y1",
                    backgroundColor: "rgba(0, 255, 0, 0.8)",
                    borderColor: "rgba(0, 255, 0, 1)",
                    borderWidth: 2,
                },
            ],
        };
        const config = {
            type: "line",
            data,
            options: {
                animation: {
                    duration: false,
                },
                elements: {
                    line: {
                        tension: 0.35,
                    },
                },
                scales: {
                    x: {
                        type: "time",
                        ticks: {
                            major: {
                                enabled: true,
                            },
                        },
                        time: {
                            unit: "minute",
                            displayFormats: {
                                minute: "HH:mm",
                            },
                        },
                        title: {
                            display: true,
                            text: "Time",
                        },
                        grid: {
                            color: "rgba(255, 255, 255, 0.2)",
                        },
                    },
                    y1: {
                        grid: {
                            color: "rgba(255, 255, 255, 0.2",
                        },
                        title: {
                            display: true,
                            text: yAxisLabel,
                        },
                        suggestedMin: parseFloat(averagetem) - 1,
                        suggestedMax: parseFloat(averagetem) + 2,
                    },
                },
                plugins: {
                    legend: {
                        display: true,
                        position: "top",
                    },
                },
            },
        };
        const temperatureChart = new Chart(document.getElementById(canvasId), config);
        temperatureCharts = temperatureChart;
    } else if (type === "humid") {
        console.log(`Creating Humidity Chart...`);
        let timestamp1humi = timestamp1.slice(-1 * rH);
        let timestamp2humi = timestamp2.slice(-1 * rH);
        let timestamp3humi = timestamp3.slice(-1 * rH);
        let timestamp4humi = timestamp4.slice(-1 * rH);

        let humiditys1 = mapDataValues(latestData1, "Humidity");
        let humiditys2 = mapDataValues(latestData2, "Humidity");
        let humiditys3 = mapDataValues(latestData3, "Humidity");
        let humiditys4 = mapDataValues(latestData4, "Humidity");

        humiditys1 = humiditys1.slice(-rH);
        humiditys2 = humiditys2.slice(-rH);
        humiditys3 = humiditys3.slice(-rH);
        humiditys4 = humiditys4.slice(-rH);

        console.log("Humidity 1:", JSON.stringify(humiditys1), "Length:", humiditys1.length);
        console.log("Humidity 2:", JSON.stringify(humiditys2), "Length:", humiditys2.length);
        console.log("Humidity 3:", JSON.stringify(humiditys3), "Length:", humiditys3.length);
        console.log("Humidity 4:", JSON.stringify(humiditys4), "Length:", humiditys4.length);

        sum = 0;
        for (let i = 0; i < humiditys1.length; i++) {
            sum += humiditys1[i];
        }
        const averagehumidity = (sum / humiditys1.length).toFixed(2);
        console.log(`Average Humidity: ${averagehumidity}`);

        const convertedData1 = timestamp1humi.map((timestamp, index) => ({
            x: timestamp,
            y: humiditys1[index],
        }));
        const convertedData2 = timestamp2humi.map((timestamp, index) => ({
            x: timestamp,
            y: humiditys2[index],
        }));
        const convertedData3 = timestamp3humi.map((timestamp, index) => ({
            x: timestamp,
            y: humiditys3[index],
        }));
        const convertedData4 = timestamp4humi.map((timestamp, index) => ({
            x: timestamp,
            y: humiditys4[index],
        }));
        const data = {
            datasets: [
                {
                    label: label1,
                    data: convertedData1.map((item) => ({
                        x: item.x,
                        y: item.y,
                    })),
                    yAxisID: "y1",
                    backgroundColor: "rgba(255, 26, 104, 0.8)",
                    borderColor: "rgba(255, 26, 104, 1)",
                    borderWidth: 2,
                },
                {
                    label: label2,
                    data: convertedData2.map((item) => ({
                        x: item.x,
                        y: item.y,
                    })),
                    yAxisID: "y1",
                    backgroundColor: "rgba(54, 162, 235, 0.8)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 2,
                },
                {
                    label: label3,
                    data: convertedData3.map((item) => ({
                        x: item.x,
                        y: item.y,
                    })),
                    yAxisID: "y1",
                    backgroundColor: "rgba(255, 255, 0, 0.8)",
                    borderColor: "rgba(255, 255, 0, 1)",
                    borderWidth: 2,
                },
                {
                    label: label4,
                    data: convertedData4.map((item) => ({
                        x: item.x,
                        y: item.y,
                    })),
                    yAxisID: "y1",
                    backgroundColor: "rgba(0, 255, 0, 0.8)",
                    borderColor: "rgba(0, 255, 0, 1)",
                    borderWidth: 2,
                },
            ],
        };
        const config = {
            type: "line",
            data,
            options: {
                animation: {
                    duration: false,
                },
                elements: {
                    line: {
                        tension: 0.35,
                    },
                },
                scales: {
                    x: {
                        type: "time",
                        ticks: {
                            major: {
                                enabled: true,
                            },
                        },
                        time: {
                            unit: "minute",
                            displayFormats: {
                                minute: "HH:mm",
                            },
                        },
                        title: {
                            display: true,
                            text: "Time",
                        },
                        grid: {
                            color: "rgba(255, 255, 255, 0.2)",
                        },
                    },
                    y1: {
                        grid: {
                            color: "rgba(255, 255, 255, 0.2",
                        },
                        title: {
                            display: true,
                            text: yAxisLabel,
                        },
                        suggestedMin: parseFloat(averagehumidity) - 1.5,
                        suggestedMax: parseFloat(averagehumidity) + 1,
                    },
                },
                plugins: {
                    legend: {
                        display: true,
                        position: "top",
                    },
                },
            },
        };
        const humidityChart = new Chart(document.getElementById(canvasId), config);
        humidityCharts = humidityChart;
    } else {
        console.log(`Creating ${type} Chart`);
    }
}

function updateCardLayout() {
    var screenWidth = window.innerWidth;
    var screenHeight = window.innerHeight;
    if (screenWidth <= 500) {
        var humidityChartCanvas = document.getElementById("humidityChart");
        var temperatureChartCanvas = document.getElementById("temperatureChart");
        humidityChartCanvas.height = 120;
        temperatureChartCanvas.height = 120;
    }
    if (screenWidth <= 1300 && screenWidth > 992) {
        var tempElements = document.querySelectorAll(".temp");
        tempElements.forEach(function (element) {
            element.textContent = "Temp";
        });
        var humiElements = document.querySelectorAll(".humi");
        humiElements.forEach(function (element) {
            element.textContent = "Humid";
        });
    } else {
        var tempElements = document.querySelectorAll(".temp");
        tempElements.forEach(function (element) {
            element.textContent = "Temperature";
        });
        var humiElements = document.querySelectorAll(".humi");
        humiElements.forEach(function (element) {
            element.textContent = "Humidity";
        });
    }
}
updateCardLayout();

window.addEventListener("resize", function () {
    updateCardLayout();
    console.log("resize");
});

async function fetchDataAndToggle() {
    try {
        const response = await fetch(url + "/api/node?user=" + username);
        const data = await response.json();
        console.log("fetchDataAndToggle - Data received: " + data.nodenames);
        updateCheckbox(data, "Node1", "node1toggle");
        updateCheckbox(data, "Node2", "node2toggle");
        updateCheckbox(data, "Node3", "node3toggle");
        updateCheckbox(data, "Node4", "node4toggle");
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function updateCheckbox(data, nodeName, checkboxId) {
    const nodeExists = data.nodenames.includes(nodeName);
    document.getElementById(checkboxId).checked = nodeExists;
    if (nodeExists) {
        $(`#${checkboxId}`).bootstrapToggle("on");
    } else {
        $(`#${checkboxId}`).bootstrapToggle("off");
    }
}

function toggleChanged(nodeName, checkboxId) {
    console.log(nodeName + " is toggled");
    $(`#${checkboxId}`).bootstrapToggle("toggle");
    fetch(url + "/api/activate?nodename=" + nodeName + "&user=" + username);
}

function filterDataByNode(data, node) {
    return data.filter((item) => item.Nodename === node);
}

function updateAvg(data, idtemp, idhumi) {
    const temperatures = data.map((item) => parseFloat(item.Temperature));
    const humidity = data.map((item) => parseFloat(item.Humidity));

    let sumTem = 0;
    let sumHum = 0;

    for (let i = 0; i < temperatures.length; i++) {
        sumTem += temperatures[i];
    }
    const averageTemp = sumTem / temperatures.length;

    for (let i = 0; i < humidity.length; i++) {
        sumHum += humidity[i];
    }
    const averageHumidity = sumHum / humidity.length;

    console.log(`Average Temperature [${idtemp}]: ${averageTemp.toFixed(2)} °C`);
    console.log(`Average Humidity [${idhumi}]: ${averageHumidity.toFixed(2)} %`);

    const avgTempElement = document.getElementById(idtemp);
    avgTempElement.innerHTML = `: ${averageTemp.toFixed(2)} ํC`;

    const avgHumiElement = document.getElementById(idhumi);
    avgHumiElement.innerHTML = `: ${averageHumidity.toFixed(2)} %`;
}

function updatenodebatt(data, idbatt) {
    if (data.length > 0) {
        const nodeData = data[data.length - 1];
        console.log(nodeData);
        let batteryLevels = nodeData["Node Battery"];
        console.log(`Battery Level [${idbatt}]: ${batteryLevels} %`);
        const avgBattElement = document.getElementById(idbatt);
        if (batteryLevels < 0) {
            avgBattElement.innerHTML = `: Charging`;
        } else {
            avgBattElement.innerHTML = `: ${batteryLevels} %`;
        }
    } else {
        console.error("Data array is empty");
    }
}

function updateLastUpdateTime(data) {
    let updateLastUpdateTime = data.reverse();
    const lastUpdateTimeElement = document.getElementById("lastUpdateTime");
    if (lastUpdateTimeElement) {
        const latestDataPoint = updateLastUpdateTime[updateLastUpdateTime.length - 1];
        if (latestDataPoint && latestDataPoint.Time) {
            const lastUpdateDate = new Date(latestDataPoint.Time);
            const options = {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                timeZone: "UTC",
            };

            const formattedTime = lastUpdateDate.toLocaleString("en-US", options);
            lastUpdateTimeElement.textContent = `(Last updated at ${formattedTime})`;
        }
    }
}

async function updategatewaybat(data) {
    const latestdata = data[data.length - 1];
    const gatewaybatelement = document.getElementById("gatewaybatt");
    var gatewaybat = latestdata["Gateway Battery"];

    if (gatewaybat < 0) {
        gatewaybatelement.innerText = "Charging";
        console.log("Gateway Battery is charging.");
    } else {
        console.log("Gateway Battery percentage:", gatewaybat);
        console.log("\n\n\n\n");
        gatewaybatelement.innerText = gatewaybat + "%";
    }
}

function updatelog(responseData) {
    const options = {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZone: "UTC",
    };

    const filteredData = [];

    responseData.forEach((element) => {
        const elementTimestamp = new Date(element.Time).getTime();
        const currentTimestamp = currentTime.getTime() + 7 * 60 * 60 * 1000;

        if (elementTimestamp > currentTimestamp) {
            filteredData.push(element);
        }
    });

    filteredData.sort((a, b) => new Date(a.Time).getTime() - new Date(b.Time).getTime());
    filteredData.reverse();
    console.log(filteredData);

    const messages = filteredData.map((item) => {
        const formattedTime = new Date(item.Time).toLocaleString("en-US", options);
        return `[${formattedTime}] Received data from ${item.Nodename} temperature is ${item.Temperature} °C and humidity is ${item.Humidity}% <br>`;
    });

    const cardTextElement = document.getElementById("realtimelog");
    cardTextElement.innerHTML = messages.join("");
}

document.getElementById("clearLogBtn").addEventListener("click", function () {
    filteredData = [];
    currentTime = new Date();
    const cardTextElement = document.getElementById("realtimelog");
    cardTextElement.innerHTML = "";
    console.log("Log cleared!");
});

let slider = document.getElementById("myRange");
let sliderHumi = document.getElementById("myRangehumi");
r = slider.value;
rH = sliderHumi.value;
slider.oninput = function () {
    r = this.value;
    var output = document.getElementById("sliderValue");
    console.log(output.innerHTML);
    output.innerText = r;
};

sliderHumi.oninput = function () {
    rH = this.value;
    var output = document.getElementById("sliderValuehumi");
    console.log(output.innerHTML);
    output.innerText = rH;
};

slider.onmouseup = async function () {
    const data = await fetchData();
    const node1Data = filterDataByNode(data, "Node1");
    const node2Data = filterDataByNode(data, "Node2");
    const node3Data = filterDataByNode(data, "Node3");
    const node4Data = filterDataByNode(data, "Node4");
    temperatureCharts.destroy();
    createChart("temperatureChart", node1Data, node2Data, node3Data, node4Data, "Temperature (Node1)", "Temperature (Node2)", "Temperature (Node3)", "Temperature (Node4)", "Temperature (°C)", "temp");
};

sliderHumi.onmouseup = async function () {
    const data = await fetchData();
    const node1Data = filterDataByNode(data, "Node1");
    const node2Data = filterDataByNode(data, "Node2");
    const node3Data = filterDataByNode(data, "Node3");
    const node4Data = filterDataByNode(data, "Node4");
    humidityCharts.destroy();
    createChart("humidityChart", node1Data, node2Data, node3Data, node4Data, "Humidity (Node1)", "Humidity (Node2)", "Humidity (Node3)", "Humidity (Node4)", "Humidity (%)", "humid");
};

toggleUrlButton.addEventListener("click", () => {
    today = !today;

    let dataLengthOld = 0;

    if (temperatureCharts && temperatureCharts.destroy && humidityCharts && humidityCharts.destroy) {
        temperatureCharts.destroy();
        humidityCharts.destroy();
    }

    if (today) {
        toggleUrlButton.classList.add("btn-success");
        toggleUrlButton.classList.remove("btn-danger");
    } else {
        toggleUrlButton.classList.add("btn-danger");
        toggleUrlButton.classList.remove("btn-success");
    }

    main();
});

function drawmap(data) {
    if (map && map.remove) {
        map.eachLayer(function (layer) {
            layer.remove();
        });
        map.off();
        map.remove();
    }
    let number;
    for (let i = 400; i < data.length; i++) {
        let d = data.slice(-i);
        console.log(d);
        if (d[0].Nodename === "Node1") {
            console.log(i);
            number = i;
            break;
        }
    }

    var latestData = data;

    var latitudes = mapDataValues(latestData, "Latitude");
    var longitudes = mapDataValues(latestData, "Longitude");

    if (latitudes.length > 0 && longitudes.length > 0) {
        let sum = 0;

        for (let i = 0; i < latitudes.length; i++) {
            sum += latitudes[i];
        }

        const averagelat = (sum / latitudes.length).toFixed(6);
        sum = 0;

        for (let i = 0; i < longitudes.length; i++) {
            sum += longitudes[i];
        }

        const averagelon = (sum / longitudes.length).toFixed(6);

        map = L.map("map").setView([averagelat, averagelon], 20);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
        var counter = 0;

        for (var i = 0; i < latestData.length; i++) {
            console.log("i = " + i);
            if (latestData[i].Latitude !== null && latestData[i].Longitude !== null) {
                var colorIntensity = 255 * (i / latestData.length);

                var markerColor = `rgb(0, 250, ${255 - colorIntensity})`;

                var nodeBattery = latestData[i]["Node Battery"] < 0 ? 0 : latestData[i]["Node Battery"];

                var popupContent = `Time: ${latestData[i].Time} +7<br>Nodename: ${latestData[i].Nodename}<br>Node Battery: ${nodeBattery} %<br>Temperature: ${latestData[i].Temperature} °C<br>Humidity: ${latestData[i].Humidity} %`;

                for (var j = i + 1; j < latestData.length; j++) {
                    console.log("Namein " + latestData[i].Nodename);
                    if (latestData[i].Latitude === latestData[j].Latitude && latestData[i].Longitude === latestData[j].Longitude && Math.abs(new Date(latestData[i].Time) - new Date(latestData[j].Time)) <= 10000) {
                        console.log("Nameinner " + latestData[i].Nodename);
                        nodeBattery = latestData[j]["Node Battery"] < 0 ? 0 : latestData[j]["Node Battery"];
                        popupContent += `<br><br>Time: ${latestData[j].Time} +7<br>Nodename: ${latestData[j].Nodename}<br>Node Battery: ${nodeBattery} %<br>Temperature: ${latestData[j].Temperature} °C<br>Humidity: ${latestData[j].Humidity} %`;
                        i = j;
                    }
                }

                console.log("counter : " + counter);
                counter++;
                var marker = L.marker([latestData[i].Latitude, latestData[i].Longitude], {
                    icon: L.divIcon({
                        className: "custom-marker",
                        iconSize: [20, 20],
                        iconAnchor: [10, 10],
                        html: `<div style="background-color: ${markerColor}; border: 2px solid black; width: 20px; height: 20px; border-radius: 50%;">${counter}</div>`,
                    }),
                }).addTo(map);

                marker.bindPopup(popupContent).openPopup();
            }
        }
    } else {
        console.error("No valid data for drawing the map.");
    }
}

function createGraph(node1Data, node2Data, node3Data, node4Data) {
    temperatureCharts.destroy();
    createChart("temperatureChart", node1Data, node2Data, node3Data, node4Data, "Temperature (Node1)", "Temperature (Node2)", "Temperature (Node3)", "Temperature (Node4)", "Temperature (°C)", "temp");
    humidityCharts.destroy();
    createChart("humidityChart", node1Data, node2Data, node3Data, node4Data, "Humidity (Node1)", "Humidity (Node2)", "Humidity (Node3)", "Humidity (Node4)", "Humidity (%)", "humid");
}

async function main() {
    const data = await fetchData();
    dataLengthNew = data.length;
    if (dataLengthOld == 0) {
        console.log(`\n\n`);
        console.log(`First run`);
        console.table(data);
        console.log(`Number of data points: ${dataLengthNew}`);
        node1Data = filterDataByNode(data, "Node1");
        node2Data = filterDataByNode(data, "Node2");
        node3Data = filterDataByNode(data, "Node3");
        node4Data = filterDataByNode(data, "Node4");
        updateAvg(node1Data, "node1avgtemp", "node1avghumi");
        updateAvg(node2Data, "node2avgtemp", "node2avghumi");
        updateAvg(node3Data, "node3avgtemp", "node3avghumi");
        updateAvg(node4Data, "node4avgtemp", "node4avghumi");
        updatenodebatt(node1Data.reverse(), "node1batt");
        updatenodebatt(node2Data.reverse(), "node2batt");
        updatenodebatt(node3Data.reverse(), "node3batt");
        updatenodebatt(node4Data.reverse(), "node4batt");
        createChart("temperatureChart", node1Data, node2Data, node3Data, node4Data, "Temperature (Node1)", "Temperature (Node2)", "Temperature (Node3)", "Temperature (Node4)", "Temperature (°C)", "temp");
        createChart("humidityChart", node1Data, node2Data, node3Data, node4Data, "Humidity (Node1)", "Humidity (Node2)", "Humidity (Node3)", "Humidity (Node4)", "Humidity (%)", "humid");
        updateLastUpdateTime(node1Data.reverse());
        updategatewaybat(node1Data);
        drawmap(data.reverse());
        dataLengthOld = dataLengthNew;
    } else if (dataLengthOld !== dataLengthNew) {
        console.log(`\n\n`);
        console.log("Update for new data");
        console.log(`Number of data points: ${dataLengthNew}`);
        node1Data = filterDataByNode(data, "Node1");
        node2Data = filterDataByNode(data, "Node2");
        node3Data = filterDataByNode(data, "Node3");
        node4Data = filterDataByNode(data, "Node4");
        updateAvg(node1Data, "node1avgtemp", "node1avghumi");
        updateAvg(node2Data, "node2avgtemp", "node2avghumi");
        updateAvg(node3Data, "node3avgtemp", "node3avghumi");
        updateAvg(node4Data, "node4avgtemp", "node4avghumi");
        updatenodebatt(node1Data.reverse(), "node1batt");
        updatenodebatt(node2Data.reverse(), "node2batt");
        updatenodebatt(node3Data.reverse(), "node3batt");
        updatenodebatt(node4Data.reverse(), "node4batt");
        createGraph(node1Data, node2Data, node3Data, node4Data);
        updatelog(data);
        updategatewaybat(node1Data.reverse());
        updateLastUpdateTime(node1Data);
        drawmap(data.reverse());
        dataLengthOld = dataLengthNew;
    }
    console.log(`Nothing new`);
}

main();
fetchDataAndToggle();
setInterval(fetchDataAndToggle, 1000);
setInterval(main, 10000);
