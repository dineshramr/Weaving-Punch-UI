let bluetoothDevice;
let bluetoothServer;
let bluetoothCharacteristic;

function generateRows() {
  const numRows = parseInt(document.getElementById("numRows").value);
  const container = document.getElementById("punchRows");
  container.innerHTML = "";

  for (let i = 0; i < numRows; i++) {
    const row = document.createElement("div");
    row.className = "row";

    const label = document.createElement("label");
    label.textContent = `Punch ${i + 1}:`;

    const input1 = document.createElement("input");
    input1.placeholder = "Value 1";

    const input2 = document.createElement("input");
    input2.placeholder = "Value 2";

    const input3 = document.createElement("input");
    input3.placeholder = "Value 3";

    const repeat = document.createElement("input");
    repeat.placeholder = "Repeat Count";
    repeat.type = "number";
    repeat.min = "1";

    row.appendChild(label);
    row.appendChild(input1);
    row.appendChild(input2);
    row.appendChild(input3);
    row.appendChild(repeat);

    container.appendChild(row);
  }
}

async function connectBluetooth() {
  try {
    bluetoothDevice = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: [0x1101], // SPP UUID (optional)
    });

    const server = await bluetoothDevice.gatt.connect();
    bluetoothServer = server;
    console.log("Bluetooth connected");
    alert("Bluetooth connected!");
  } catch (error) {
    console.error("Bluetooth connection failed", error);
    alert("Bluetooth connection failed: " + error);
  }
}

function startPunch() {
  const simultaneous = document.getElementById("simultaneous").checked;
  const container = document.getElementById("punchRows");
  const rows = container.getElementsByClassName("row");

  const allCommands = [];

  for (let row of rows) {
    const inputs = row.getElementsByTagName("input");
    const val1 = inputs[0].value.trim();
    const val2 = inputs[1].value.trim();
    const val3 = inputs[2].value.trim();
    const repeat = inputs[3].value.trim();

    if (val1 || val2 || val3) {
      const data = `${val1},${val2},${val3};${repeat}`;
      allCommands.push(data);
    }
  }

  if (simultaneous) {
    sendBluetooth(allCommands.join("|")); // all at once
  } else {
    // Send one by one with delay
    let index = 0;
    const interval = setInterval(() => {
      if (index < allCommands.length) {
        sendBluetooth(allCommands[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 1000); // 1 second gap
  }
}

function sendBluetooth(message) {
  if (bluetoothDevice && bluetoothDevice.gatt.connected) {
    // Normally here you would write to a characteristic.
    // For HC-05 via Web Bluetooth, direct serial may not be supported on all browsers.
    console.log("Sending via Bluetooth:", message);
    alert("Pretend sending: " + message);
  } else {
    alert("Please connect Bluetooth first.");
  }
}


