let bluetoothDevice;
let bluetoothCharacteristic;

async function connectBluetooth() {
  try {
    bluetoothDevice = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: [0x1101] // SPP UUID (some devices support it)
    });

    const server = await bluetoothDevice.gatt.connect();
    const services = await server.getPrimaryServices();

    for (const service of services) {
      const characteristics = await service.getCharacteristics();
      for (const char of characteristics) {
        if (char.properties.write) {
          bluetoothCharacteristic = char;
          alert("Bluetooth connected!");
          return;
        }
      }
    }

    alert("No writable Bluetooth characteristic found.");
  } catch (error) {
    console.error("Bluetooth connection failed:", error);
    alert("Bluetooth connection failed.");
  }
}

function generateRows() {
  const numRows = parseInt(document.getElementById("numRows").value);
  const container = document.getElementById("punchRows");
  container.innerHTML = "";

  for (let i = 0; i < numRows; i++) {
    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML = `
      <strong>Punch ${i + 1}</strong><br>
      Value1: <input type="text" id="val1_${i}" size="5" />
      Value2: <input type="text" id="val2_${i}" size="5" />
      Value3: <input type="text" id="val3_${i}" size="5" />
      Repeat: <input type="number" id="repeat_${i}" size="3" value="1" />
    `;
    container.appendChild(row);
  }
}

async function sendData(data) {
  if (!bluetoothCharacteristic) {
    alert("Bluetooth not connected.");
    return;
  }

  const encoder = new TextEncoder();
  await bluetoothCharacteristic.writeValue(encoder.encode(data + "\n"));
}

async function startPunch() {
  const numRows = parseInt(document.getElementById("numRows").value);
  const simultaneous = document.getElementById("simultaneous").checked;

  for (let i = 0; i < numRows; i++) {
    const val1 = document.getElementById(`val1_${i}`).value.trim();
    const val2 = document.getElementById(`val2_${i}`).value.trim();
    const val3 = document.getElementById(`val3_${i}`).value.trim();
    const repeat = document.getElementById(`repeat_${i}`).value.trim();

    const values = [val1, val2, val3].filter(v => v !== "").join(",");
    const command = `${values};${repeat}`;

    if (simultaneous) {
      sendData(command);
    } else {
      await sendData(command);
      await new Promise(resolve => setTimeout(resolve, 500)); // slight delay between commands
    }
  }

  alert("Data sent!");
}
