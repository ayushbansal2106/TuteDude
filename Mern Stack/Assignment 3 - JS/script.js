function showGreeting() {
  var name = document.getElementById("userName").value;
  var headerText = document.getElementById("welcomeMessage");

  if (name !== "") {
    headerText.innerText = "Hello, " + name;
  } else {
    headerText.innerText = "Hello";
  }
}

function applyColor(selectedBox, colorName) {
  selectedBox.style.backgroundColor = colorName;
  selectedBox.style.color = "white";
}
