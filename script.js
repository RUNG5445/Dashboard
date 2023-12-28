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
let dropdownmargin = "135px";

$(document).ready(function () {
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

dropdown.addEventListener("click", function () {
  var screenWidth = window.innerWidth;
  var screenHeight = window.innerHeight;
  if (screenWidth >= 991) {
    var container = document.querySelector(".container-fluid");

    if (container.style.marginTop === dropdownmargin) {
      container.style.marginTop = "0px";
    } else {
      container.style.marginTop = dropdownmargin;
    }
  }
});

for (var i = 0; i < dropdownItems.length; i++) {
  dropdownItems[i].addEventListener("click", function (event) {
    event.preventDefault();
    var screenHeight = window.innerHeight;
    var container = document.querySelector(".container-fluid");

    if (container.style.marginTop === dropdownmargin) {
      var targetId = this.getAttribute("href").substring(1);
      var offsets = document.getElementById(targetId).getBoundingClientRect();
      var top = offsets.top;
      var targetElement = document.getElementById(targetId);

      if (targetElement) {
        var offsetPosition = top - 130;

        console.log("Target ID:", targetId);
        console.log("Target Offset Top:", top);
        console.log("Offset Position:", offsetPosition);

        window.scrollTo(0, offsetPosition);
      }
      container.style.marginTop = "0px";
    } else {
      var targetId = this.getAttribute("href").substring(1);
      var offsets = document.getElementById(targetId).getBoundingClientRect();
      var top = offsets.top;
      var targetElement = document.getElementById(targetId);

      if (targetElement) {
        var offsetPosition = top + screenHeight * 0.5;

        console.log("Target ID:", targetId);
        console.log("Target Offset Top:", top);
        console.log("Offset Position:", offsetPosition);

        window.scrollTo(0, offsetPosition);
      }
      container.style.marginTop = "0px";
    }
  });
}
function mapDataValues(data, key) {
  return data.map((item) => (item[key] === 0 ? null : item[key]));
}

function createChart(
  canvasId,
  data1,
  data2,
  data3,
  data4,
  label1,
  label2,
  label3,
  label4,
  label5,
  yAxisLabel,
  type
) {
  console.log(`\n\n\n\n`);
  if (type === "temp") {
    console.log(`Creating Temperature Chart...`);
  } else if (type === "humid") {
    console.log(`Creating Humidity Chart...`);
  } else {
    console.log(`Creating ${type} Chart`);
  }
  const latestData1 = data1;
  const latestData2 = data2;
  const latestData3 = data3;
  const latestData4 = data4;

  function mapTimestamps(data) {
    return data.map((item) =>
      new Date(item.Time).toISOString().replace(".000Z", "")
    );
  }
  let timestamp1 = mapTimestamps(latestData1);
  let timestamp2 = mapTimestamps(latestData2);
  let timestamp3 = mapTimestamps(latestData3);
  let timestamp4 = mapTimestamps(latestData4);

  let timestamp1humi = timestamp1.slice(-1 * rH);
  let timestamp2humi = timestamp2.slice(-1 * rH);
  let timestamp3humi = timestamp3.slice(-1 * rH);
  let timestamp4humi = timestamp4.slice(-1 * rH);
  let timestamp1temp = timestamp1.slice(-1 * r);
  let timestamp2temp = timestamp2.slice(-1 * r);
  let timestamp3temp = timestamp3.slice(-1 * r);
  let timestamp4temp = timestamp4.slice(-1 * r);

  console.log(
    "Timestamp 1:",
    JSON.stringify(timestamp1humi),
    "Length:",
    timestamp1.length
  );
  console.log(
    "Timestamp 2:",
    JSON.stringify(timestamp2),
    "Length:",
    timestamp2.length
  );
  console.log(
    "Timestamp 3:",
    JSON.stringify(timestamp3),
    "Length:",
    timestamp3.length
  );
  console.log(
    "Timestamp 4:",
    JSON.stringify(timestamp4),
    "Length:",
    timestamp4.length
  );

  let temperatures1 = mapDataValues(latestData1, "Temperature");
  let temperatures2 = mapDataValues(latestData2, "Temperature");
  let temperatures3 = mapDataValues(latestData3, "Temperature");
  let temperatures4 = mapDataValues(latestData4, "Temperature");

  temperatures1 = temperatures1.slice(-r);
  temperatures2 = temperatures2.slice(-r);
  temperatures3 = temperatures3.slice(-r);
  temperatures4 = temperatures4.slice(-r);

  let humiditys1 = mapDataValues(latestData1, "Humidity");
  let humiditys2 = mapDataValues(latestData2, "Humidity");
  let humiditys3 = mapDataValues(latestData3, "Humidity");
  let humiditys4 = mapDataValues(latestData4, "Humidity");

  humiditys1 = humiditys1.slice(-rH);
  humiditys2 = humiditys2.slice(-rH);
  humiditys3 = humiditys3.slice(-rH);
  humiditys4 = humiditys4.slice(-rH);

  console.log(
    "Temperature 1:",
    JSON.stringify(temperatures1),
    "Length:",
    temperatures1.length
  );
  console.log(
    "Temperature 2:",
    JSON.stringify(temperatures2),
    "Length:",
    temperatures2.length
  );
  console.log(
    "Temperature 3:",
    JSON.stringify(temperatures3),
    "Length:",
    temperatures3.length
  );
  console.log(
    "Temperature 4:",
    JSON.stringify(temperatures4),
    "Length:",
    temperatures4.length
  );
  console.log(
    "Humidity 1:",
    JSON.stringify(humiditys1),
    "Length:",
    humiditys1.length
  );
  console.log(
    "Humidity 2:",
    JSON.stringify(humiditys2),
    "Length:",
    humiditys2.length
  );
  console.log(
    "Humidity 3:",
    JSON.stringify(humiditys3),
    "Length:",
    humiditys3.length
  );
  console.log(
    "Humidity 4:",
    JSON.stringify(humiditys4),
    "Length:",
    humiditys4.length
  );

  let sum = 0;
  for (let i = 0; i < temperatures1.length; i++) {
    sum += temperatures1[i];
  }
  const averagetem = (sum / temperatures1.length).toFixed(2);
  sum = 0;
  for (let i = 0; i < humiditys1.length; i++) {
    sum += humiditys1[i];
  }
  const averagehumidity = (sum / humiditys1.length).toFixed(2);
  console.log(`Average Temperature: ${averagetem}`);
  console.log(`Average Humidity: ${averagehumidity}`);
  if (type === "humid") {
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
              font: (context) => {
                const boldedTicks =
                  context.tick && context.tick.major ? "900" : "";
                return {
                  weight: boldedTicks,
                };
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
            // suggestedMin: timestamp1humi[0],
            // suggestedMax: timestamp1humi[rH],
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
  }
  if (type === "temp") {
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
              font: (context) => {
                const boldedTicks =
                  context.tick && context.tick.major ? "900" : "";
                return {
                  weight: boldedTicks,
                };
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
            min: timestamp1temp[0],
            max: timestamp1temp[-r],
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
    const temperatureChart = new Chart(
      document.getElementById(canvasId),
      config
    );
    temperatureCharts = temperatureChart;
  }
}

function updateCardLayout() {
  var screenWidth = window.innerWidth;
  var screenHeight = window.innerHeight;
  if (screenWidth <= 500) {
    var humidityChartCanvas = document.getElementById("humidityChart");
    var temperatureChartCanvas = document.getElementById("temperatureChart");
    humidityChartCanvas.height = 100;
    temperatureChartCanvas.height = 100;
    main();
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
    const response = await fetch(url + "/api/node");
    const data = await response.json();
    console.log("Response:", data);
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
fetchDataAndToggle();

function toggleChanged(nodeName, checkboxId) {
  console.log(nodeName + " is toggled");
  $(`#${checkboxId}`).bootstrapToggle("toggle");
  fetch(url + "/api/activate?nodename=" + nodeName);
}
// Function to fetch data from the API
async function fetchData() {
  let response;
  if (today) {
    response = await fetch(url + "/api/show/today");
  } else {
    response = await fetch(url + "/api/show");
  }
  const data = await response.json();
  return data;
}

function filterDataByNode(data, node) {
  return data.filter((item) => item.Nodename === node);
}

function updateAvg(data, idtemp, idhumi) {
  const temperatures = data.map((item) => item.Temperature);
  const humidity = data.map((item) => item.Humidity);
  let sumTem = 0;
  for (let i = 0; i < temperatures.length; i++) {
    sumTem += temperatures[i];
  }
  const averageTemp = sumTem / temperatures.length;
  let sumHum = 0;
  for (let i = 0; i < humidity.length; i++) {
    sumHum += humidity[i];
  }
  const averageHumidity = sumHum / humidity.length;
  console.log(`Average Temperature: ${averageTemp}`);
  console.log(`Average Humidity: ${averageHumidity}`);
  const avgTempElement = document.getElementById(idtemp);
  if (avgTempElement) {
    avgTempElement.innerHTML = `: ${averageTemp.toFixed(2)} ํC`;
  }
  const avgHumiElement = document.getElementById(idhumi);
  if (avgHumiElement) {
    avgHumiElement.innerHTML = `: ${averageHumidity.toFixed(2)} %`;
  }
}

function updateLastUpdateTime(data) {
  const lastUpdateTimeElement = document.getElementById("lastUpdateTime");
  if (lastUpdateTimeElement) {
    const latestDataPoint = data[data.length - 1];
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
        timeZone: "UTC", // Specify the desired time zone here
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
  } else {
    console.log(data);
    console.log(gatewaybatelement);
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
  responseData.forEach((element) => {
    const elementTimestamp = new Date(element.Time).getTime();
    const currentTimestamp = currentTime.getTime() + 7 * 60 * 60 * 1000;
    console.log(`elementTimestamp: ${elementTimestamp}`);
    console.log(`currentTimestamp: ${currentTimestamp}`);
    if (elementTimestamp > currentTimestamp) {
      filteredData.push(element);
      filteredData.reverse();
    }
  });
  console.log(filteredData);
  const messages = filteredData.map((item) => {
    const formattedTime = new Date(item.Time).toLocaleString("en-US", options);
    return `[${formattedTime}] Received data from ${item.Nodename} temperature is ${item.Temperature} °C and humidity is ${item.Humidity}% <br>`;
  });
  const cardTextElement = document.getElementById("realtimelog");
  cardTextElement.innerHTML = messages.join("");
  console.log(messages.join(""));
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
  createChart(
    "temperatureChart",
    node1Data,
    node2Data,
    node3Data,
    node4Data,
    "Temperature (Node1)",
    "Temperature (Node2)",
    "Temperature (Node3)",
    "Temperature (Node4)",
    "Temperature (Node5)",
    "Temperature (°C)",
    "temp"
  );
};

sliderHumi.onmouseup = async function () {
  const data = await fetchData();
  const node1Data = filterDataByNode(data, "Node1");
  const node2Data = filterDataByNode(data, "Node2");
  const node3Data = filterDataByNode(data, "Node3");
  const node4Data = filterDataByNode(data, "Node4");
  humidityCharts.destroy();
  createChart(
    "humidityChart",
    node1Data,
    node2Data,
    node3Data,
    node4Data,
    "Humidity (Node1)",
    "Humidity (Node2)",
    "Humidity (Node3)",
    "Humidity (Node4)",
    "Humidity (Node5)",
    "Humidity (%)",
    "humid"
  );
};

document.getElementById("toggleUrlButton").addEventListener("click", () => {
  let today = true;
  main();
});

function drawmap(data) {
  if (map) map.remove();
  var latitudes = mapDataValues(data, "Latitude").slice(-20);
  var longitudes = mapDataValues(data, "Longitude").slice(-20);
  let sum = 0;
  for (let i = 0; i < latitudes.length; i++) {
    sum += latitudes[i];
  }
  const averagelat = (sum / latitudes.length).toFixed(2);
  sum = 0;
  for (let i = 0; i < longitudes.length; i++) {
    sum += longitudes[i];
  }
  const averagelon = (sum / longitudes.length).toFixed(2);

  map = L.map("map").setView([averagelat, averagelon], 20);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
  for (var i = 0; i < latitudes.length; i++) {
    if (latitudes[i] !== null && longitudes[i] !== null) {
      var marker = L.marker([latitudes[i], longitudes[i]]).addTo(map);
      marker.bindPopup(`Location ${i + 1}`).openPopup();
    }
  }
}

function createGraph(node1Data, node2Data, node3Data, node4Data) {
  temperatureCharts.destroy();
  createChart(
    "temperatureChart",
    node1Data,
    node2Data,
    node3Data,
    node4Data,
    "Temperature (Node1)",
    "Temperature (Node2)",
    "Temperature (Node3)",
    "Temperature (Node4)",
    "Temperature (Node5)",
    "Temperature (°C)",
    "temp"
  );
  humidityCharts.destroy();
  createChart(
    "humidityChart",
    node1Data,
    node2Data,
    node3Data,
    node4Data,
    "Humidity (Node1)",
    "Humidity (Node2)",
    "Humidity (Node3)",
    "Humidity (Node4)",
    "Humidity (Node5)",
    "Humidity (%)",
    "humid"
  );
}

async function main() {
  const data = await fetchData();
  dataLengthNew = data.length;
  if (dataLengthOld == 0) {
    console.log(`Number of data points: ${dataLengthNew}`);
    const node1Data = filterDataByNode(data, "Node1");
    const node2Data = filterDataByNode(data, "Node2");
    const node3Data = filterDataByNode(data, "Node3");
    const node4Data = filterDataByNode(data, "Node4");
    console.log(node1Data);
    updateAvg(node1Data, "node1avgtemp", "node1avghumi");
    updateAvg(node2Data, "node2avgtemp", "node2avghumi");
    updateAvg(node3Data, "node3avgtemp", "node3avghumi");
    updateAvg(node4Data, "node4avgtemp", "node4avghumi");
    createChart(
      "temperatureChart",
      node1Data,
      node2Data,
      node3Data,
      node4Data,
      "Temperature (Node1)",
      "Temperature (Node2)",
      "Temperature (Node3)",
      "Temperature (Node4)",
      "Temperature (Node5)",
      "Temperature (°C)",
      "temp"
    );
    createChart(
      "humidityChart",
      node1Data,
      node2Data,
      node3Data,
      node4Data,
      "Humidity (Node1)",
      "Humidity (Node2)",
      "Humidity (Node3)",
      "Humidity (Node4)",
      "Humidity (Node5)",
      "Humidity (%)",
      "humid"
    );
    updateLastUpdateTime(node1Data);
    updategatewaybat(node1Data);
    drawmap(node1Data);
    dataLengthOld = dataLengthNew;
  } else if (dataLengthOld !== dataLengthNew) {
    console.log(`Number of data points: ${dataLengthNew}`);
    const node1Data = filterDataByNode(data, "Node1");
    const node2Data = filterDataByNode(data, "Node2");
    const node3Data = filterDataByNode(data, "Node3");
    const node4Data = filterDataByNode(data, "Node4");
    updateAvg(node1Data, "node1avgtemp", "node1avghumi");
    updateAvg(node2Data, "node2avgtemp", "node2avghumi");
    updateAvg(node3Data, "node3avgtemp", "node3avghumi");
    updateAvg(node4Data, "node4avgtemp", "node4avghumi");
    createGraph(node1Data, node2Data, node3Data, node4Data);
    updatelog(data);
    updategatewaybat(node1Data);
    updateLastUpdateTime(node1Data);
    drawmap(node1Data);
    dataLengthOld = dataLengthNew;
  }
  console.log("maiin");
}

main();
fetchDataAndToggle();
setInterval(fetchDataAndToggle, 1000);
setInterval(main, 10000);
