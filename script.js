let bluetoothDevice;
let bluetoothServer;
let bluetoothCharacteristic;

async function connectBluetooth() {
  try {
    bluetoothDevice = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: [0x1101] // Serial Port Profile UUID
    });
    bluetoothServer = await bluetoothDevice.gatt.connect();
    bluetoothStatus.textContent = "Connected to: " + bluetoothDevice.name;
  } catch (error) {
    bluetoothStatus.textContent = "Connection Failed";
    console.error(error);
  }
}

function generatePunchInputs() {
  const count = parseInt(document.getElementById("numPunches").value);
  const container = document.getElementById("generatedInputs");
  container.innerHTML = '';

  for (let i = 1; i <= count; i++) {
    const div = document.createElement("div");
    div.className = "input-row";

    const label = document.createElement("label");
    label.textContent = `Punch ${i}:`;

    const input = document.createElement("input");
    input.placeholder = "Enter punch values (e.g. 1,3,5)";
    input.id = `punch-${i}`;

    const repeat = document.createElement("input");
    repeat.placeholder = "Repeat count";
    repeat.type = "number";
    repeat.id = `repeat-${i}`;
    repeat.style.marginTop = "8px";

    div.appendChild(label);
    div.appendChild(input);
    div.appendChild(repeat);

    container.appendChild(div);
  }
}

function sendAllPunchData() {
  const count = parseInt(document.getElementById("numPunches").value);
  let output = '';

  for (let i = 1; i <= count; i++) {
    const punchVal = document.getElementById(`punch-${i}`).value.trim();
    const repeatVal = document.getElementById(`repeat-${i}`).value.trim();
    if (punchVal !== '' && repeatVal !== '') {
      const data = `${punchVal};${repeatVal}\n`;
      output += data;
    }
  }

  console.log("Sending data:\n", output);

  if (bluetoothCharacteristic) {
    const encoder = new TextEncoder();
    bluetoothCharacteristic.writeValue(encoder.encode(output));
  } else {
    alert("Bluetooth not connected.");
  }
}

document.getElementById("connectBluetooth").addEventListener("click", connectBluetooth);
