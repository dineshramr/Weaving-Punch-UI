let bluetoothDevice;
let bluetoothCharacteristic;

async function connectBluetooth() {
  try {
    bluetoothDevice = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: [0x1101] // RFCOMM (Bluetooth Serial Port Profile)
    });

    const server = await bluetoothDevice.gatt.connect();
    const service = await server.getPrimaryService(0x1101);
    bluetoothCharacteristic = await service.getCharacteristic(0x2A00);

    document.getElementById('status').innerText = "✅ Connected to " + bluetoothDevice.name;
  } catch (error) {
    document.getElementById('status').innerText = "❌ Bluetooth connection failed.";
    console.error(error);
  }
}

function generateRows() {
  const numRows = parseInt(document.getElementById('numRows').value);
  const container = document.getElementById('punchRows');
  container.innerHTML = ''; // Clear previous rows

  for (let i = 1; i <= numRows; i++) {
    const row = document.createElement('div');
    row.className = 'row';
    row.innerHTML = `
      <label>Punch ${i}: </label>
      <input type="text" placeholder="e.g. 1,2,3" class="numbers" />
      <input type="number" placeholder="Repeat" class="repeat" min="1" />
    `;
    container.appendChild(row);
  }
}

async function sendData(data) {
  if (!bluetoothCharacteristic) {
    alert("Bluetooth not connected.");
    return;
  }

  try {
    const encoder = new TextEncoder();
    await bluetoothCharacteristic.writeValue(encoder.encode(data));
    console.log("Sent:", data);
  } catch (err) {
    console.error("Send failed:", err);
  }
}

function startPunch() {
  const rows = document.querySelectorAll('#punchRows .row');
  const simultaneous = document.getElementById('simultaneous').checked;

  if (simultaneous) {
    // Send all at once
    rows.forEach(row => {
      const numbers = row.querySelector('.numbers').value;
      const repeat = row.querySelector('.repeat').value;
      if (numbers && repeat) {
        sendData(`${numbers};${repeat}`);
      }
    });
  } else {
    // Send sequentially with delay
    let delay = 0;
    rows.forEach(row => {
      const numbers = row.querySelector('.numbers').value;
      const repeat = row.querySelector('.repeat').value;
      if (numbers && repeat) {
        setTimeout(() => {
          sendData(`${numbers};${repeat}`);
        }, delay);
        delay += 1000; // 1 second delay between sends
      }
    });
  }
}

