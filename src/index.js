const API_KEY = "f7ab331c5c3c8364150bab26488ee7d7";
const BASE_URL = "http://api.marketstack.com/v1";
const stockSelect = document.getElementById("stock-select");
const stockDisplay = document.getElementById("stock-display");
const ctx = document.getElementById("stock-chart").getContext("2d");
let stockChart;

async function createSelectionBar() {
  const url = `${BASE_URL}/tickers?access_key=${API_KEY}`;
  try {
    const res = await fetch(url);
    const dataList = await res.json();
    if (dataList && dataList.data) {
      dataList.data.forEach((item) => {
        let option = document.createElement("option");
        option.value = item.symbol;
        option.textContent = `${item.name} (${item.symbol})`;
        stockSelect.appendChild(option);
      });
    } else {
      console.error("Unable to generate selection list");
      stockDisplay.innerHTML = "Unable to load stock options.";
    }
  } catch (error) {
    console.error("Error fetching stock data:", error);
    stockDisplay.innerHTML = "Error loading stock options.";
  }
}

stockSelect.addEventListener("change", () => {
  const selectedStock = stockSelect.value;
  fetchStockData(selectedStock);
});

async function fetchStockData(symbol) {
  const urlSelect = `${BASE_URL}/eod?access_key=${API_KEY}&symbols=${symbol}&limit=30`;
  try {
    const response = await fetch(urlSelect);
    const data = await response.json();

    if (data.data && data.data.length > 0) {
      displayStockData(data.data[0]);
      displayStockGraph(data.data);
    } else {
      console.error("No stock data available.");
      stockDisplay.innerHTML = "No stock data available.";
    }
  } catch (error) {
    console.error("Error fetching stock data:", error);
    stockDisplay.innerHTML = "Error fetching stock data.";
  }
}

function displayStockData(stock) {
  stockDisplay.innerHTML = `
        <h2>Stock Information for ${stock.symbol}</h2>
        <p>Date: ${stock.date}</p>
        <p>Open: $${stock.open}</p>
        <p>Close: $${stock.close}</p>
        <p>High: $${stock.high}</p>
        <p>Low: $${stock.low}</p>
        <p>Volume: ${stock.volume}</p>
    `;
}

function displayStockGraph(stockData) {
  const labels = stockData.map((stock) => stock.date).reverse();
  const prices = stockData.map((stock) => stock.close).reverse();

  if (stockChart) {
    stockChart.destroy();
  }

  stockChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Closing Price",
          data: prices,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderWidth: 2,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Stock Price Over Time",
        },
      },
    },
  });
}
createSelectionBar();

fetchStockData("AAPL");
