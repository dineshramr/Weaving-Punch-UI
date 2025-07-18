let bluetoothDevice;
let bluetoothCharacteristic;

function generatePunchRows() {
  const count = parseInt(document.getElementById('rowCount').value);
  const container = document.getElementById('punchRowsContainer');
  container.innerHTML = '';

  for (let i = 1; i <= count; i++) {
    const row = document.createElement('div');
    row.className = 'row';
    row.innerHTML = `
      <label>Punch ${i}:</label>
      <input type="text" placeholder="e.g. 1,2,3" id="values-${i}"/>
      <input type="number" placeholder="Repeat" min="1" id="repeat-${i}"/>
    `;
    container.appendChild(row);
  }
}

async function connectBluetooth() {
  try {
    bluetoothDevice = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: [0x1101]
    });

    const server = await bluetoothDevice.gatt.connect();
    const services = await server.getPrimaryServices();
    const service = services[0];
    const characteristics = await service.getCharacteristics();
    bluetoothCharacteristic = characteristics[0];

    document.getElementById('status').textContent = 'Status: Connected';
  } catch (error) {
    alert('Bluetooth connect failed: ' + error);
  }
}

function sendAll() {
  const simultaneous = document.getElementById('simultaneousCheckbox').checked;
  const count = parseInt(document.getElementById('rowCount').value);

  if (!bluetoothCharacteristic) {
    alert('Please connect to HC-05 first.');
    return;
  }

  const sendData = async () => {
    for (let i = 1; i <= count; i++) {
      const values = document.getElementById(`values-${i}`).value.trim();
      const repeat = document.getElementById(`repeat-${i}`).value.trim() || '1';

      const formatted = `${values};${repeat}\n`;

      try {
        await bluetoothCharacteristic.writeValue(new TextEncoder().encode(formatted));
        console.log('Sent:', formatted);
        await new Promise(r => setTimeout(r, 500)); // Delay for safety
      } catch (err) {
        console.error('Send error:', err);
        alert('Failed to send data');
        return;
      }

      if (simultaneous) break; // Send only first if simultaneous
    }

    alert('Data sent successfully');
  };

  sendData();
}

