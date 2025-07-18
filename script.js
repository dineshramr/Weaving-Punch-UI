let bluetoothDevice;
let bluetoothCharacteristic;

function generateRows() {
  const num = parseInt(document.getElementById("numRows").value);
  const container = document.getElementById("punchRows");
  container.innerHTML = "";

  for (let i = 1; i <= num; i++) {
    const div = document.createElement("div");
    div.className = "row";
    div.innerHTML = `
      <strong>Punch ${i}</strong><br>
      Value 1: <input type="text" id="v1-${i}" />
      Value 2: <input type="text" id="v2-${i}" />
      Value 3: <input type="text" id="v3-${i}" />
      Repeat: <input type="number" id="repeat-${i}" min="1" value="1" />
    `;
    container.appendChild(div);
  }
}

async function connectBluetooth() {
  try {
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: [0x1101] // Serial Port Profile UUID
    });

    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(0x1101);
    const characteristic = await service.getCharacteristic(0x1101);

    bluetoothDevice = device;
    bluetoothCharacteristic = characteristic;

    document.getElementById("status").textContent = "✅ Bluetooth Connected";
  } catch (error) {
    document.getElementById("status").textContent = "❌ Bluetooth connection failed";
    console.error(error);
  }
}

async function sendData(data) {
  if (!bluetoothCharacteristic) {
    alert("Bluetooth not connected!");
    return;
  }

  const encoder = new TextEncoder();
  const encoded = encoder.encode(data + "\n");

  try {
    await bluetoothCharacteristic.writeValue(encoded);
    console.log("Sent:", data);
  } catch (e) {
    console.error("Send error:", e);
  }
}

function startPunch() {
  const num = parseInt(document.getElementById("numRows").value);
  const simultaneous = document.getElementById("simultaneous").checked;

  const punches = [];

  for (let i = 1; i <= num; i++) {
    const v1 = document.getElementById(`v1-${i}`).value;
    const v2 = document.getElementById(`v2-${i}`).value;
    const v3 = document.getElementById(`v3-${i}`).value;
    const repeat = document.getElementById(`repeat-${i}`).value;

    const combined = `${v1},${v2},${v3};${repeat}`;
    punches.push(combined);
  }

  if (simultaneous) {
    const all = punches.join("|"); // Example format: 1,2,3;2|4,5,6;1
    sendData(all);
  } else {
    (async () => {
      for (let punch of punches) {
        await sendData(punch);
        await new Promise(r => setTimeout(r, 500)); // slight delay
      }
    })();
  }
}


