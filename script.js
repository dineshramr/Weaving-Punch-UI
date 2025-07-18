let bluetoothDevice;
let bluetoothCharacteristic;

async function connectBluetooth() {
  try {
    bluetoothDevice = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: [0x1101]
    });
    const server = await bluetoothDevice.gatt.connect();
    const services = await server.getPrimaryServices();

    // Try to find writable characteristic
    for (const service of services) {
      const characteristics = await service.getCharacteristics();
      for (const char of characteristics) {
        if (char.properties.write) {
          bluetoothCharacteristic = char;
          document.getElementById('status').innerText = "✅ Connected";
          return;
        }
      }
    }
    document.getElementById('status').innerText = "❌ No writable characteristic found";
  } catch (error) {
    console.error(error);
    document.getElementById('status').innerText = "❌ Failed to connect";
  }
}

function generateRows() {
  const count = parseInt(document.getElementById("rowCount").value);
  const inputSection = document.getElementById("inputSection");
  inputSection.innerHTML = '';

  for (let i = 0; i < count; i++) {
    const div = document.createElement("div");
    div.className = "punch-row";
    div.innerHTML = `
      <label>Punch ${i + 1}</label><br>
      <input type="text" placeholder="Enter values (e.g. 1,2,3)" class="values">
      <input type="number" placeholder="Repeat count" class="repeat">
    `;
    inputSection.appendChild(div);
  }
}

async function sendData() {
  if (!bluetoothCharacteristic) {
    alert("Bluetooth not connected!");
    return;
  }

  const rows = document.querySelectorAll(".punch-row");
  for (let row of rows) {
    const values = row.querySelector(".values").value.trim();
    const repeat = row.querySelector(".repeat").value.trim();
    const data = `${values};${repeat}`;

    const encoder = new TextEncoder();
    await bluetoothCharacteristic.writeValue(encoder.encode(data));
    await new Promise(resolve => setTimeout(resolve, 300)); // small delay
  }

  alert("✅ Data sent to HC-05 device!");
}






