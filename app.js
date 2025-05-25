const input = {
  orderPrice: parseInt(document.getElementById("orderPrice").value) || 0,
  time: parseInt(document.getElementById("time").value),
  orderSize: parseInt(document.getElementById("orderSize").value),
  costPerItem: parseInt(document.getElementById("costPerItem").value),
  costPerLaunch: parseInt(document.getElementById("costPerLaunch").value),
  winPossibility:
    parseInt(document.getElementById("winPossibility").value) / 100,
  hardcore: document.getElementById("hardcore").checked ? true : false,
};
let optCost = [0];
let data = [];

for (const [key, value] of Object.entries(input)) {
  document.getElementById(key).addEventListener("change", () => {
    if (key == "winPossibility") {
      input[key] = parseInt(document.getElementById(key).value) / 100;
    } else if (key == "hardcore") {
      input[key] = document.getElementById("hardcore").checked ? true : false;
    } else {
      input[key] = parseInt(document.getElementById(key).value);
    }
    console.log(key, input[key]);
  });
}

const submit = document.getElementById("submit");

function factorial(num) {
  if (num <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= num; i++) {
    result *= i;
  }
  return result;
}

function Combination(k, n) {
  if (k > n) return 0;
  return factorial(n) / (factorial(k) * factorial(n - k));
}

function Binomial(k, n, p) {
  return Combination(k, n) * p ** k * (1 - p) ** (n - k);
}

function cost(x, s) {
  let c = 0;
  for (let i = 0; i <= s; i++) {
    c += optCost[i] * Binomial(s - i, x, input.winPossibility);
  }
  if (x == 0) {
    return c + input.costPerItem * x;
  } else {
    return input.costPerLaunch + c + input.costPerItem * x;
  }
}

function minimumCost(s) {
  if (s == 0) {
    return [0, 0];
  }
  let x = 0;
  let temp = [];
  let next = 0;
  do {
    x++;
    temp.push(cost(x, s));
    next = cost(x + 1, s);
  } while (next <= Math.min(...temp));
  const minF = Math.min(...temp) < cost(0, s) ? Math.min(...temp) : cost(0, s);
  const minX = Math.min(...temp) < cost(0, s) ? temp.indexOf(minF) + 1 : 0;
  return [minF, minX];
}

function setData() {
  for (let j = input.time - 1; j >= 0; j--) {
    for (let i = 0; i <= input.orderSize; i++) {
      const [minCost, bestX] = minimumCost(i);
      data[j][i][0] = minCost;
      data[j][i][1] = bestX;
    }
    for (let k = 0; k <= input.orderSize; k++) {
      optCost[k] = data[j][k][0];
    }
  }
}

function createRows(r, i) {
  for (let j = 0; j <= input.time; j++) {
    if (i == 0) {
      if (j == 0) {
        let para = document.createElement("th");
        para.innerHTML = "Remaining / Day";
        r.appendChild(para);
      } else {
        let para = document.createElement("th");
        para.innerHTML = `Day ${j}`;
        r.appendChild(para);
      }
    } else {
      if (j == 0) {
        let para = document.createElement("th");
        para.innerHTML = `${i} units`;
        r.appendChild(para);
      } else {
        let para = document.createElement("th");
        if (j == 1 && i != input.orderSize) {
          para.innerHTML = "-";
        } else {
          para.innerHTML = data[j - 1][i][1];
        }
        r.appendChild(para);
      }
    }
  }
}

function createTable() {
  for (let i = 0; i <= input.orderSize; i++) {
    let row = document.createElement("tr");
    document.getElementById("table").appendChild(row);
    createRows(row, i);
  }
}
submit.addEventListener("click", () => {
  optCost = [0];
  data = [];
  if (input.hardcore) {
    for (let i = 1; i <= input.orderSize; i++) {
      optCost.push(input.orderPrice);
    }
  } else {
    for (let i = 1; i <= input.orderSize; i++) {
      optCost.push((input.orderPrice * i) / input.orderSize);
    }
  }
  for (let i = 0; i < input.time; i++) {
    data.push([]);
    for (let j = input.orderSize; j >= 0; j--) {
      data[i].push([0, 0]);
    }
  }
  document.getElementById("table").innerHTML = "";
  console.log(optCost);
  console.log(data);
  setData();
  createTable();
});
