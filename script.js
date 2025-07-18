
let bluetoothDevice;
let bluetoothCharacteristic;

function generateRows() {
  const count = parseInt(document.getElementById('numRows').value);
  const container = document.getElementById('punchRows');
  container.innerHTML = "";
  for (let i = 1; i <= count; i++) {
    const div = document.createElement('div');
    div.className = "row";
    div.innerHTML = `
      <h3>Punch ${i}</h3>
      <input type="text" placeholder="Value1,Value2,Value3" class="values" />
      <input type="number" placeholder="Repeat Count" class="repeat" />
    `;
    container.appendChild(div);
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
    alert("Bluetooth connected!");
  } catch (error) {
    alert("Bluetooth connection failed: " + error);
  }
}

function startPunch() {
  const values = document.querySelectorAll('.values');
  const repeats = document.querySelectorAll('.repeat');
  const simultaneous = document.getElementById('simultaneous').checked;
  const allData = [];

  for (let i = 0; i < values.length; i++) {
    const nums = values[i].value;
    const repeat = repeats[i].value || "1";
    allData.push(nums + ";" + repeat);
  }

  if (!bluetoothCharacteristic) {
    alert("Please connect to Bluetooth first.");
    return;
  }

  if (simultaneous) {
    sendBluetooth(allData.join(" | "));
  } else {
    allData.forEach((data, index) => {
      setTimeout(() => {
        sendBluetooth(data);
      }, index * 1000);
    });
  }
}

function sendBluetooth(data) {
  const encoder = new TextEncoder();
  bluetoothCharacteristic.writeValue(encoder.encode(data + "\n"));
}
