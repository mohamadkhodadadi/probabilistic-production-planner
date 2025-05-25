const winValue = document.getElementById("winValue");
const getWinValue = document.getElementById("winPossibility");
const destroy = document.getElementById("destroy");

getWinValue.addEventListener("change", () => {
  winValue.innerHTML = `%${document.getElementById("winPossibility").value}`;
});
window.addEventListener("load", () => {
  winValue.innerHTML = `%${document.getElementById("winPossibility").value}`;
});
