var container=document.querySelector(".container-fluid"),dropdown=document.getElementById("navbarDropdownMenuLink"),dropdownItems=document.querySelectorAll(".dropdown-item");let dataLengthOld=0,dataLengthNew=0,url="https://api.rungrueng.site",today=!0,temperatureChart,humidityChart,r=20,rH=20,currentTime=new Date,map,filteredData=[],node1Data,node2Data,node3Data,node4Data;async function submitForm(){var e=document.getElementById("start").value,t=document.getElementById("end").value;window.location.href=`results.html?start=${e}&end=${t}`}async function fetchData(){let e;e=today?await fetch(url+"/api/show/today"):await fetch(url+"/api/show");let t=await e.json();return Array.isArray(t)&&t.length>0?console.log("fetchData successful: Received valid data."):console.error("Invalid or empty data received:",t),t}function mapDataValues(e,t){return e.map(e=>0===e[t]?null:e[t])}function createChart(e,t,a,o,n,d,i,l,m,u,g){function p(e){return e.map(e=>new Date(e.Time).toISOString().replace(".000Z",""))}console.log(`

`);let y=t,s=a,c=o,h=n,b=p(y),f=p(s),D=p(c),N=p(h);if("temp"===g){console.log("Creating Temperature Chart...");let _=b.slice(-1*r),T=f.slice(-1*r),v=D.slice(-1*r),x=N.slice(-1*r),C=mapDataValues(y,"Temperature"),H=mapDataValues(s,"Temperature"),w=mapDataValues(c,"Temperature"),B=mapDataValues(h,"Temperature");C=C.slice(-r),H=H.slice(-r),w=w.slice(-r),B=B.slice(-r),console.log("Temperature 1:",JSON.stringify(C),"Length:",C.length),console.log("Temperature 2:",JSON.stringify(H),"Length:",H.length),console.log("Temperature 3:",JSON.stringify(w),"Length:",w.length),console.log("Temperature 4:",JSON.stringify(B),"Length:",B.length);let A=0;for(let I=0;I<C.length;I++)A+=C[I];let E=(A/C.length).toFixed(2);console.log(`Average Temperature: ${E}`);let k=_.map((e,t)=>({x:e,y:C[t]})),M=T.map((e,t)=>({x:e,y:H[t]})),V=v.map((e,t)=>({x:e,y:w[t]})),S=x.map((e,t)=>({x:e,y:B[t]})),F={datasets:[{label:d,data:k.map(e=>({x:e.x,y:e.y})),yAxisID:"y1",backgroundColor:"rgba(255, 26, 104, 0.8)",borderColor:"rgba(255, 26, 104, 1)",borderWidth:2},{label:i,data:M.map(e=>({x:e.x,y:e.y})),yAxisID:"y1",backgroundColor:"rgba(54, 162, 235, 0.8)",borderColor:"rgba(54, 162, 235, 1)",borderWidth:2},{label:l,data:V.map(e=>({x:e.x,y:e.y})),yAxisID:"y1",backgroundColor:"rgba(255, 255, 0, 0.8)",borderColor:"rgba(255, 255, 0, 1)",borderWidth:2},{label:m,data:S.map(e=>({x:e.x,y:e.y})),yAxisID:"y1",backgroundColor:"rgba(0, 255, 0, 0.8)",borderColor:"rgba(0, 255, 0, 1)",borderWidth:2},]},U={type:"line",data:F,options:{animation:{duration:!1},elements:{line:{tension:.35}},scales:{x:{type:"time",ticks:{major:{enabled:!0},font(e){let t=e.tick&&e.tick.major?"900":"";return{weight:t}}},time:{unit:"minute",displayFormats:{minute:"HH:mm"}},title:{display:!0,text:"Time"},grid:{color:"rgba(255, 255, 255, 0.2)"},min:_[0],max:_[-r]},y1:{grid:{color:"rgba(255, 255, 255, 0.2"},title:{display:!0,text:u},suggestedMin:parseFloat(E)-1,suggestedMax:parseFloat(E)+2}},plugins:{legend:{display:!0,position:"top"}}}},W=new Chart(document.getElementById(e),U);temperatureCharts=W}else if("humid"===g){console.log("Creating Humidity Chart...");let O=b.slice(-1*rH),j=f.slice(-1*rH),q=D.slice(-1*rH),G=N.slice(-1*rH),z=mapDataValues(y,"Humidity"),R=mapDataValues(s,"Humidity"),Z=mapDataValues(c,"Humidity"),P=mapDataValues(h,"Humidity");z=z.slice(-rH),R=R.slice(-rH),Z=Z.slice(-rH),P=P.slice(-rH),console.log("Humidity 1:",JSON.stringify(z),"Length:",z.length),console.log("Humidity 2:",JSON.stringify(R),"Length:",R.length),console.log("Humidity 3:",JSON.stringify(Z),"Length:",Z.length),console.log("Humidity 4:",JSON.stringify(P),"Length:",P.length),sum=0;for(let J=0;J<z.length;J++)sum+=z[J];let K=(sum/z.length).toFixed(2);console.log(`Average Humidity: ${K}`);let Q=O.map((e,t)=>({x:e,y:z[t]})),X=j.map((e,t)=>({x:e,y:R[t]})),Y=q.map((e,t)=>({x:e,y:Z[t]})),ee=G.map((e,t)=>({x:e,y:P[t]})),et={datasets:[{label:d,data:Q.map(e=>({x:e.x,y:e.y})),yAxisID:"y1",backgroundColor:"rgba(255, 26, 104, 0.8)",borderColor:"rgba(255, 26, 104, 1)",borderWidth:2},{label:i,data:X.map(e=>({x:e.x,y:e.y})),yAxisID:"y1",backgroundColor:"rgba(54, 162, 235, 0.8)",borderColor:"rgba(54, 162, 235, 1)",borderWidth:2},{label:l,data:Y.map(e=>({x:e.x,y:e.y})),yAxisID:"y1",backgroundColor:"rgba(255, 255, 0, 0.8)",borderColor:"rgba(255, 255, 0, 1)",borderWidth:2},{label:m,data:ee.map(e=>({x:e.x,y:e.y})),yAxisID:"y1",backgroundColor:"rgba(0, 255, 0, 0.8)",borderColor:"rgba(0, 255, 0, 1)",borderWidth:2},]},ea={type:"line",data:et,options:{animation:{duration:!1},elements:{line:{tension:.35}},scales:{x:{type:"time",ticks:{major:{enabled:!0}},time:{unit:"minute",displayFormats:{minute:"HH:mm"}},title:{display:!0,text:"Time"},grid:{color:"rgba(255, 255, 255, 0.2)"}},y1:{grid:{color:"rgba(255, 255, 255, 0.2"},title:{display:!0,text:u},suggestedMin:parseFloat(K)-1.5,suggestedMax:parseFloat(K)+1}},plugins:{legend:{display:!0,position:"top"}}}},eo=new Chart(document.getElementById(e),ea);humidityCharts=eo}else console.log(`Creating ${g} Chart`)}function updateCardLayout(){var e=window.innerWidth;if(window.innerHeight,e<=500){var t=document.getElementById("humidityChart"),a=document.getElementById("temperatureChart");t.height=120,a.height=120}if(e<=1300&&e>992){var o=document.querySelectorAll(".temp");o.forEach(function(e){e.textContent="Temp"});var n=document.querySelectorAll(".humi");n.forEach(function(e){e.textContent="Humid"})}else{var o=document.querySelectorAll(".temp");o.forEach(function(e){e.textContent="Temperature"});var n=document.querySelectorAll(".humi");n.forEach(function(e){e.textContent="Humidity"})}}async function fetchDataAndToggle(){try{let e=await fetch(url+"/api/node"),t=await e.json();console.log("fetchDataAndToggle - Data received: "+t.nodenames),updateCheckbox(t,"Node1","node1toggle"),updateCheckbox(t,"Node2","node2toggle"),updateCheckbox(t,"Node3","node3toggle"),updateCheckbox(t,"Node4","node4toggle")}catch(a){console.error("Error fetching data:",a)}}function updateCheckbox(e,t,a){let o=e.nodenames.includes(t);document.getElementById(a).checked=o,o?$(`#${a}`).bootstrapToggle("on"):$(`#${a}`).bootstrapToggle("off")}function toggleChanged(e,t){console.log(e+" is toggled"),$(`#${t}`).bootstrapToggle("toggle"),fetch(url+"/api/activate?nodename="+e)}function filterDataByNode(e,t){return e.filter(e=>e.Nodename===t)}function updateAvg(e,t,a){let o=e.map(e=>e.Temperature),n=e.map(e=>e.Humidity),d=0,i=0;for(let l=0;l<o.length;l++)d+=o[l];let m=d/o.length;for(let u=0;u<n.length;u++)i+=n[u];let g=i/n.length;console.log(`Average Temperature [${t}]: ${m.toFixed(2)} \xb0C`),console.log(`Average Humidity [${a}]: ${g.toFixed(2)} %`);let p=document.getElementById(t);p.innerHTML=`: ${m.toFixed(2)} ํC`;let y=document.getElementById(a);y.innerHTML=`: ${g.toFixed(2)} %`}function updatenodebatt(e,t){if(e.length>0){let a=e[e.length-1];console.log(a);let o=a["Node Battery"];console.log(`Battery Level [${t}]: ${o} %`);let n=document.getElementById(t);o<0?n.innerHTML=": Charging":n.innerHTML=`: ${o} %`}else console.error("Data array is empty")}function updateLastUpdateTime(e){let t=document.getElementById("lastUpdateTime");if(t){let a=e[e.length-1];if(a&&a.Time){let o=new Date(a.Time),n=o.toLocaleString("en-US",{weekday:"short",year:"numeric",month:"short",day:"numeric",hour:"numeric",minute:"numeric",second:"numeric",timeZone:"UTC"});t.textContent=`(Last updated at ${n})`}}}async function updategatewaybat(e){let t=e[e.length-1],a=document.getElementById("gatewaybatt");var o=t["Gateway Battery"];o<0?(a.innerText="Charging",console.log("Gateway Battery is charging.")):(console.log("Gateway Battery percentage:",o),console.log("\n\n\n\n"),a.innerText=o+"%")}function updatelog(e){let t={hour:"numeric",minute:"numeric",second:"numeric",timeZone:"UTC"},a=[];e.forEach(e=>{let t=new Date(e.Time).getTime(),o=currentTime.getTime()+252e5;t>o&&a.push(e)}),a.sort((e,t)=>new Date(e.Time).getTime()-new Date(t.Time).getTime()),a.reverse(),console.log(a);let o=a.map(e=>{let a=new Date(e.Time).toLocaleString("en-US",t);return`[${a}] Received data from ${e.Nodename} temperature is ${e.Temperature} \xb0C and humidity is ${e.Humidity}% <br>`}),n=document.getElementById("realtimelog");n.innerHTML=o.join("")}document.addEventListener("DOMContentLoaded",function(){var e=Math.floor(1001*Math.random()),t=document.createElement("style");t.textContent=`
  :root {
    --animate-duration: ${e+500}ms !important;
    --animate-delay: 1s !important;
  }
`,document.head.appendChild(t),setTimeout(function(){$("#loadingMessage").hide()},e)}),updateCardLayout(),window.addEventListener("resize",function(){updateCardLayout(),console.log("resize")}),document.getElementById("clearLogBtn").addEventListener("click",function(){filteredData=[],currentTime=new Date;let e=document.getElementById("realtimelog");e.innerHTML="",console.log("Log cleared!")});let slider=document.getElementById("myRange"),sliderHumi=document.getElementById("myRangehumi");function drawmap(e){map&&map.remove&&(map.eachLayer(function(e){e.remove()}),map.off(),map.remove());let t;for(let a=400;a<e.length;a++){let o=e.slice(-a);if(console.log(o),"Node1"===o[0].Nodename){console.log(a),t=a;break}}var n=e,d=mapDataValues(n,"Latitude"),i=mapDataValues(n,"Longitude");if(d.length>0&&i.length>0){let l=0;for(let m=0;m<d.length;m++)l+=d[m];let u=(l/d.length).toFixed(6);l=0;for(let g=0;g<i.length;g++)l+=i[g];let p=(l/i.length).toFixed(6);map=L.map("map").setView([u,p],20),L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);for(var y=0,s=0;s<n.length;s++)if(console.log("i = "+s),null!==n[s].Latitude&&null!==n[s].Longitude){for(var c=`rgb(0, 250, ${255-255*(s/n.length)})`,h=n[s]["Node Battery"]<0?0:n[s]["Node Battery"],b=`Time: ${n[s].Time} +7<br>Nodename: ${n[s].Nodename}<br>Node Battery: ${h} %<br>Temperature: ${n[s].Temperature} \xb0C<br>Humidity: ${n[s].Humidity} %`,f=s+1;f<n.length;f++)console.log("Namein "+n[s].Nodename),n[s].Latitude===n[f].Latitude&&n[s].Longitude===n[f].Longitude&&1e4>=Math.abs(new Date(n[s].Time)-new Date(n[f].Time))&&(console.log("Nameinner "+n[s].Nodename),b+=`<br><br>Time: ${n[f].Time} +7<br>Nodename: ${n[f].Nodename}<br>Node Battery: ${h=n[f]["Node Battery"]<0?0:n[f]["Node Battery"]} %<br>Temperature: ${n[f].Temperature} \xb0C<br>Humidity: ${n[f].Humidity} %`,s=f);console.log("counter : "+y),y++,L.marker([n[s].Latitude,n[s].Longitude],{icon:L.divIcon({className:"custom-marker",iconSize:[20,20],iconAnchor:[10,10],html:`<div style="background-color: ${c}; border: 2px solid black; width: 20px; height: 20px; border-radius: 50%;">${y}</div>`})}).addTo(map).bindPopup(b).openPopup()}}else console.error("No valid data for drawing the map.")}function createGraph(e,t,a,o){temperatureCharts.destroy(),createChart("temperatureChart",e,t,a,o,"Temperature (Node1)","Temperature (Node2)","Temperature (Node3)","Temperature (Node4)","Temperature (\xb0C)","temp"),humidityCharts.destroy(),createChart("humidityChart",e,t,a,o,"Humidity (Node1)","Humidity (Node2)","Humidity (Node3)","Humidity (Node4)","Humidity (%)","humid")}async function main(){let e=await fetchData();dataLengthNew=e.length,0==dataLengthOld?(console.log(`

`),console.log("First run"),console.table(e),console.log(`Number of data points: ${dataLengthNew}`),node1Data=filterDataByNode(e,"Node1"),node2Data=filterDataByNode(e,"Node2"),node3Data=filterDataByNode(e,"Node3"),node4Data=filterDataByNode(e,"Node4"),updateAvg(node1Data,"node1avgtemp","node1avghumi"),updateAvg(node2Data,"node2avgtemp","node2avghumi"),updateAvg(node3Data,"node3avgtemp","node3avghumi"),updateAvg(node4Data,"node4avgtemp","node4avghumi"),updatenodebatt(node1Data,"node1batt"),updatenodebatt(node2Data,"node2batt"),updatenodebatt(node3Data,"node3batt"),updatenodebatt(node4Data,"node4batt"),createChart("temperatureChart",node1Data,node2Data,node3Data,node4Data,"Temperature (Node1)","Temperature (Node2)","Temperature (Node3)","Temperature (Node4)","Temperature (\xb0C)","temp"),createChart("humidityChart",node1Data,node2Data,node3Data,node4Data,"Humidity (Node1)","Humidity (Node2)","Humidity (Node3)","Humidity (Node4)","Humidity (%)","humid"),updateLastUpdateTime(node1Data),updategatewaybat(node1Data),drawmap(e),dataLengthOld=dataLengthNew):dataLengthOld!==dataLengthNew&&(console.log(`

`),console.log("Update for new data"),console.log(`Number of data points: ${dataLengthNew}`),node1Data=filterDataByNode(e,"Node1"),node2Data=filterDataByNode(e,"Node2"),node3Data=filterDataByNode(e,"Node3"),node4Data=filterDataByNode(e,"Node4"),updateAvg(node1Data,"node1avgtemp","node1avghumi"),updateAvg(node2Data,"node2avgtemp","node2avghumi"),updateAvg(node3Data,"node3avgtemp","node3avghumi"),updateAvg(node4Data,"node4avgtemp","node4avghumi"),updatenodebatt(node1Data,"node1batt"),updatenodebatt(node2Data,"node2batt"),updatenodebatt(node3Data,"node3batt"),updatenodebatt(node4Data,"node4batt"),createGraph(node1Data,node2Data,node3Data,node4Data),updatelog(e),updategatewaybat(node1Data),updateLastUpdateTime(node1Data),drawmap(e),dataLengthOld=dataLengthNew),console.log("Nothing new")}r=slider.value,rH=sliderHumi.value,slider.oninput=function(){r=this.value;var e=document.getElementById("sliderValue");console.log(e.innerHTML),e.innerText=r},sliderHumi.oninput=function(){rH=this.value;var e=document.getElementById("sliderValuehumi");console.log(e.innerHTML),e.innerText=rH},slider.onmouseup=async function(){let e=await fetchData(),t=filterDataByNode(e,"Node1"),a=filterDataByNode(e,"Node2"),o=filterDataByNode(e,"Node3"),n=filterDataByNode(e,"Node4");temperatureCharts.destroy(),createChart("temperatureChart",t,a,o,n,"Temperature (Node1)","Temperature (Node2)","Temperature (Node3)","Temperature (Node4)","Temperature (\xb0C)","temp")},sliderHumi.onmouseup=async function(){let e=await fetchData(),t=filterDataByNode(e,"Node1"),a=filterDataByNode(e,"Node2"),o=filterDataByNode(e,"Node3"),n=filterDataByNode(e,"Node4");humidityCharts.destroy(),createChart("humidityChart",t,a,o,n,"Humidity (Node1)","Humidity (Node2)","Humidity (Node3)","Humidity (Node4)","Humidity (%)","humid")},toggleUrlButton.addEventListener("click",()=>{today=!today,temperatureCharts&&temperatureCharts.destroy&&humidityCharts&&humidityCharts.destroy&&(temperatureCharts.destroy(),humidityCharts.destroy()),today?(toggleUrlButton.classList.add("btn-success"),toggleUrlButton.classList.remove("btn-danger")):(toggleUrlButton.classList.add("btn-danger"),toggleUrlButton.classList.remove("btn-success")),main()}),main(),fetchDataAndToggle(),setInterval(fetchDataAndToggle,1e3),setInterval(main,1e4);
