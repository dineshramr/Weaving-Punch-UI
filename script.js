let bluetoothDevice;
let bluetoothCharacteristic;

function connectBluetooth() {
  navigator.bluetooth.requestDevice({
    acceptAllDevices: true,
    optionalServices: ['0000ffe0-0000-1000-8000-00805f9b34fb'] // HC-05 uses custom services
  })
  .then(device => {
    bluetoothDevice = device;
    return device.gatt.connect();
  })
  .then(server => server.getPrimaryService('0000ffe0-0000-1000-8000-00805f9b34fb'))
  .then(service => service.getCharacteristic('0000ffe1-0000-1000-8000-00805f9b34fb'))
  .then(characteristic => {
    bluetoothCharacteristic = characteristic;
    alert("🔗 Bluetooth Connected!");
  })
  .catch(error => alert("❌ Bluetooth Error: " + error));
}

function generateRows() {
  const numRows = parseInt(document.getElementById("numRows").value);
  const punchRowsDiv = document.getElementById("punchRows");
  punchRowsDiv.innerHTML = ""; // clear previous

  for (let i = 1; i <= numRows; i++) {
    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML = `
      <label>Punch ${i}:</label>
      <input type="text" id="values${i}" placeholder="e.g., 1,3,5" />
      <input type="number" id="repeat${i}" placeholder="Repeat" min="1" />
    `;
    punchRowsDiv.appendChild(row);
  }
}

function startPunch() {
  const numRows = parseInt(document.getElementById("numRows").value);
  const simultaneous = document.getElementById("simultaneous").checked;

  const punchData = [];

  for (let i = 1; i <= numRows; i++) {
    const values = document.getElementById(`values${i}`).value;
    const repeat = document.getElementById(`repeat${i}`).value || 1;
    if (values) {
      punchData.push(`${values};${repeat}`);
    }
  }

  if (simultaneous) {
    punchData.forEach(data => sendData(data));
  } else {
    let index = 0;
    function sendSequentially() {
      if (index < punchData.length) {
        sendData(punchData[index]);
        index++;
        setTimeout(sendSequentially, 1000); // 1 second delay
      }
    }
    sendSequentially();
  }
}

function sendData(data) {
  if (bluetoothCharacteristic) {
    const encoder = new TextEncoder();
    bluetoothCharacteristic.writeValue(encoder.encode(data + "\n"));
  } else {
    alert("Bluetooth not connected!");
  }
}
