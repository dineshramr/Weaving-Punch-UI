let bluetoothDevice;
let bluetoothCharacteristic;

function generateRows() {
  const container = document.getElementById("inputRowsContainer");
  container.innerHTML = "";

  const count = parseInt(document.getElementById("rowCountInput").value);
  if (isNaN(count) || count <= 0) return;

  for (let i = 0; i < count; i++) {
    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML = `
      <label>Punch ${i + 1}</label><br/>
      <input type="text" placeholder="Enter values like 1,2,3" id="values${i}" /><br/>
      <input type="number" placeholder="Repeat Count" id="repeat${i}" min="1" />
    `;
    container.appendChild(row);
  }
}

async function connectBluetooth() {
  try {
    bluetoothDevice = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ['0000ffe0-0000-1000-8000-00805f9b34fb']
    });

    const server = await bluetoothDevice.gatt.connect();
    const service = await server.getPrimaryService('0000ffe0-0000-1000-8000-00805f9b34fb');
    bluetoothCharacteristic = await service.getCharacteristic('0000ffe1-0000-1000-8000-00805f9b34fb');

    document.getElementById("statusText").textContent = "✅ Connected to " + bluetoothDevice.name;
  } catch (error) {
    document.getElementById("statusText").textContent = "❌ Connection failed";
    console.error(error);
  }
}

function sendData() {
  if (!bluetoothCharacteristic) {
    alert("Please connect to Bluetooth device first.");
    return;
  }

  const count = parseInt(document.getElementById("rowCountInput").value);
  for (let i = 0; i < count; i++) {
    const values = document.getElementById(`values${i}`).value.trim();
    const repeat = document.getElementById(`repeat${i}`).value.trim();

    if (values && repeat) {
      const msg = `${values};${repeat}\n`;
      const encoder = new TextEncoder();
      bluetoothCharacteristic.writeValue(encoder.encode(msg)).catch(err => console.error(err));
    }
  }
}
