var current_ingestion_rate = document.getElementById("ingestion-rate").value;
var ws = new WebSocket('ws://localhost:3030/');

ws.addEventListener('open', function open() {
  console.log('connected');
  ws.send(Date.now().toString(), {mask: true});
});

ws.addEventListener('close', function close() {
  console.log('disconnected');
});

ws.addEventListener('message', function message(data, flags) {
  console.log('Server response: ' + data.data, flags);
});

document.getElementById("ingestion-rate-update").addEventListener('click', function() {
  if (document.getElementById("ingestion-rate").value != current_ingestion_rate) {
    ws.send(document.getElementById("ingestion-rate").value, {mask: true});
    current_ingestion_rate = document.getElementById("ingestion-rate").value;
  }
});
