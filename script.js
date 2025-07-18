function generateRows() {
  const count = parseInt(document.getElementById("rowCountInput").value);
  const container = document.getElementById("punchContainer");
  container.innerHTML = "";

  for (let i = 0; i < count; i++) {
    const rowDiv = document.createElement("div");
    rowDiv.className = "punchRow";

    const label = document.createElement("label");
    label.textContent = `Punch ${i + 1}:`;

    const valueInput = document.createElement("input");
    valueInput.type = "text";
    valueInput.placeholder = "Enter values (e.g. 1,3,5)";
    valueInput.className = "valueInput";

    const repeatInput = document.createElement("input");
    repeatInput.type = "number";
    repeatInput.placeholder = "Repeat";
    repeatInput.className = "repeatInput";

    rowDiv.appendChild(label);
    rowDiv.appendChild(valueInput);
    rowDiv.appendChild(repeatInput);
    container.appendChild(rowDiv);
  }
}

function sendData() {
  const simultaneous = document.getElementById("simultaneous").checked;
  const valueInputs = document.querySelectorAll(".valueInput");
  const repeatInputs = document.querySelectorAll(".repeatInput");

  const combinedData = [];

  for (let i = 0; i < valueInputs.length; i++) {
    const values = valueInputs[i].value.trim();
    const repeat = repeatInputs[i].value.trim();
    combinedData.push(`${values};${repeat}`);
  }

  if (simultaneous) {
    // Send all at once
    const data = combinedData.join("|");
    console.log("Sending simultaneously:", data);
    // Replace with Bluetooth send here
  } else {
    // Send one by one
    for (let i = 0; i < combinedData.length; i++) {
      console.log("Sending:", combinedData[i]);
      // Replace with Bluetooth send here
    }
  }
}





