const container = document.querySelector(".table__body");
const btnNextPage = document.querySelector(".next-btn");
const btnPrevPage = document.querySelector(".prev-btn");
const pageNumber = document.querySelector(".pagination__number");
const typeOfMarket = document.querySelector(".item-link__circle");
const loader = document.querySelector(".lds-roller");
const notification = document.querySelector(".noti");
const notificationTitle = document.querySelector(".noti p");
let page = 1;
let newArr = null;

// check number if negetive return negetive class else return plus class
const checkTypeOfNumber = function (nums) {
  if (`${nums}`.includes("-", 0)) {
    return "negetive";
  } else {
    return "plus";
  }
};

// split id from image and show chart
const splitIdFromUrl = function (url) {
  const arr = url.split("/");
  return arr[5];
};
// format currency
const formatCurrency = function (num) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
  }).format(Number(num));
};
// show informatin in dom
const renderData = function (arr) {
  container.innerHTML = ``;
  arr.forEach((value) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
    
          
     
      <td class="body__item body__item--row">
        <img
          src='${value.image}'
          alt="currency"
          class="body__item-img"
        />
        <span class="body__item-currency-name">${value.symbol}</span>
      </td>
      <td class="body__item">
        <p class="body__item-currency-price">${formatCurrency(
          value.current_price
        )}</p>
      </td>
      <td class="body__item">
        <p class="body__item-currency-change currency-change--${checkTypeOfNumber(
          value.price_change_percentage_24h
        )}">${value.price_change_percentage_24h.toFixed(2)}%</p>
      </td>
      <td class="body__item">
        <p class="body__item-currency-price">${formatCurrency(
          value.market_cap
        )}</p>
      </td>
      <td class="body__item">
        <img src='https://www.coingecko.com/coins/${splitIdFromUrl(
          value?.image
        )}/sparkline' alt="sparkline" class="body__item-sparkline">
      </td>



      `;
    container.append(tr);
  });
  newArr = arr;
  checkUptrends_Downtrends(newArr);
};
// check Uptrends and downtrends market
const checkUptrends_Downtrends = function (arr) {
  const negetiveArr = arr.filter(
    (value) => value.price_change_percentage_24h < 0
  );
  const plusArr = arr.filter((value) => value.price_change_percentage_24h > 0);

  negetiveArr.length > plusArr.length
    ? typeOfMarket.classList.add("negetive")
    : typeOfMarket.classList.add("plus");
};
// check network notification
const checkNetworkNotification = function (state, txt) {
  notification.classList.add(`${state}`);
  notificationTitle.textContent = `${txt}`;
  setTimeout(() => {
    notification.style.display = "none";
  }, 2000);
};

// get currency data
const api = async function (page = 1) {
  try {
    // fetch  api
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=${page}&sparkline=true
        `
    );
    // convert data to json format
    const data = await res.json();
    console.log(data);

    // check data if empty paginaition buton disable
    if (data.length == 0 || page == 3)
      // remove event
      btnNextPage.removeEventListener("click", next);

    // hidden loader
    loader.classList.add("lds-roller--hidden");

    // show data
    renderData(data);

    // show page number
    console.log(page);
    pageNumber.innerHTML = `${page}`;
  } catch {
    console.error(err);
  }
};
api();

// next page
const next = function () {
  page++;
  loader.classList.remove("lds-roller--hidden");
  api(page);
};
// prev page
const prev = function () {
  if (page > 1) {
    page--;
    loader.classList.remove("lds-roller--hidden");
    api(page);
  }
};

btnNextPage.addEventListener("click", next);
btnPrevPage.addEventListener("click", prev);

//  check online or offline user
window.addEventListener("load", (e) => {
  if (navigator.onLine) {
    checkNetworkNotification("online", "✅ connection succesfull");
  } else {
    checkNetworkNotification(
      "offline",
      "🚫 please check network. no connection"
    );
  }
});
