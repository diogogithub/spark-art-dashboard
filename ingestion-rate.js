var current_ingestion_rate_min = document.getElementById("ingestion-rate-min").value;
var current_ingestion_rate_max = document.getElementById("ingestion-rate-max").value;
var current_ingestion_rate_per = document.getElementById("ingestion-rate-per").value;
var ws = new WebSocket('ws://localhost:3030/');

ws.addEventListener('open', function open() {
  console.log('connected');
});

ws.addEventListener('close', function close() {
  console.log('disconnected');
});

ws.addEventListener('message', function message(data, flags) {
  console.log('IR Server response: ' + data.data, flags);
});

document.getElementById("ingestion-rate-update").addEventListener('click', function() {
  if (document.getElementById("ingestion-rate-min").value != current_ingestion_rate_min) {
    ws.send("set-min::" + document.getElementById("ingestion-rate-min").value, {mask: true});
    current_ingestion_rate_min = document.getElementById("ingestion-rate-min").value;
  }
  if (document.getElementById("ingestion-rate-max").value != current_ingestion_rate_max) {
    ws.send("set-max::" + document.getElementById("ingestion-rate-max").value, {mask: true});
    current_ingestion_rate_max = document.getElementById("ingestion-rate-max").value;
  }
  if (document.getElementById("ingestion-rate-per").value != current_ingestion_rate_per) {
    ws.send("set-period::" + document.getElementById("ingestion-rate-per").value, {mask: true});
    current_ingestion_rate_per = document.getElementById("ingestion-rate-per").value;
  }
});
