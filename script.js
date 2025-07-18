let bluetoothDevice;
let bluetoothCharacteristic;

async function connectBluetooth() {
  try {
    bluetoothDevice = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: [0xFFE0]
    });
    const server = await bluetoothDevice.gatt.connect();
    const service = await server.getPrimaryService(0xFFE0);
    bluetoothCharacteristic = await service.getCharacteristic(0xFFE1);
    alert("✅ Bluetooth Connected");
  } catch (error) {
    alert("❌ Bluetooth Connection Failed: " + error);
  }
}

function generateRows() {
  const numRows = parseInt(document.getElementById("numRows").value);
  const container = document.getElementById("punchRows");
  container.innerHTML = "";

  for (let i = 1; i <= numRows; i++) {
    const row = document.createElement("div");
    row.className = "punch-input-group";

    const label = document.createElement("label");
    label.textContent = `Punch ${i}:`;

    const val1 = document.createElement("input");
    val1.placeholder = "Value 1";

    const val2 = document.createElement("input");
    val2.placeholder = "Value 2";

    const val3 = document.createElement("input");
    val3.placeholder = "Value 3";

    const repeat = document.createElement("input");
    repeat.placeholder = "Repeat";
    repeat.type = "number";

    row.append(label, val1, val2, val3, repeat);
    container.appendChild(row);
  }
}

async function startPunch() {
  if (!bluetoothCharacteristic) {
    alert("Please connect Bluetooth first!");
    return;
  }

  const simultaneous = document.getElementById("simultaneous").checked;
  const rows = document.getElementById("punchRows").children;

  if (simultaneous) {
    for (const row of rows) {
      const inputs = row.querySelectorAll("input");
      const values = Array.from(inputs).map(input => input.value).join(",");
      await bluetoothCharacteristic.writeValue(new TextEncoder().encode(values + "\n"));
    }
  } else {
    for (const row of rows) {
      const inputs = row.querySelectorAll("input");
      const values = Array.from(inputs).map(input => input.value).join(",");
      await bluetoothCharacteristic.writeValue(new TextEncoder().encode(values + "\n"));
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}



