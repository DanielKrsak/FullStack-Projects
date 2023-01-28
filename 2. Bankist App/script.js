"use strict";

// DATA
const account1 = {
  owner: "Daniel Krsak",
  movements: [200, 455.23, -306.5, 2500, -642.21, -133.9, 1300, -124],
  interestRate: 1.2, // %
  password: 1111,
  id: 1,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2020-08-01T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "en-EN", // de-DE
};

const account2 = {
  owner: "Kristina Kaiserova",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  password: 2222,
  id: 2,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];
let currentAccount;
let timer;
let isSorted = false;

////////////////////////////////////////////////////

// ELEMENT SELECTION

const username = document.querySelector(".login__input--username");
const password = document.querySelector(".login__input--password");
const btnLogin = document.querySelector(".btn--login");
const app = document.querySelector(".app");
const currentBalance = document.querySelector(".balance__value");
const balanceIn = document.querySelector(".summary__value--in");
const balanceOut = document.querySelector(".summary__value--out");
const balanceInterest = document.querySelector(".summary__value--interest");
const welcomeMessage = document.querySelector(".welcome--message");
const welcomeDate = document.querySelector(".balance__date");
const movementsContainer = document.querySelector(".movements");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnSort = document.querySelector(".sort");
const closeUser = document.querySelector(".form__input--user");
const closePassword = document.querySelector(".form__input--password");
const btnCloseAccount = document.querySelector(".form__btn--close");
const transferTo = document.querySelector(".form__input--to");
const transferAmount = document.querySelector(".form__input--amount");
const loanAmount = document.querySelector(".form__input--loan");
const labelLogoutTimer = document.querySelector(".logout__timer");

///////////////////////////////////////////////////

// LOCALISE CURRENCY

const localiseCurrency = (account, amount) => {
  return new Intl.NumberFormat(account?.locale, {
    style: "currency",
    currency: `${account?.currency}`,
  }).format(amount);
};

// LOCALISE DATES

const localiseDate = (account, date) => {
  const options = {
    hour: "numeric",
    hour12: true,
    minute: "numeric",
    day: "numeric",
    month: "numeric",
    year: "numeric",
    // weekday: 'long',
  };
  return new Intl.DateTimeFormat(account.locale, options).format(date);
};

// CLEAR LOGIN FIELDS
const clearLoginFields = () => {
  username.value = password.value = "";
  password.blur();
};

// CLEAR TRANSFER MONEY FIELDS
const clearTransferMoneyFields = () => {
  transferTo.value = transferAmount.value = "";
  transferAmount.blur();
};

//CLEAR LOAN FIELD
const clearLoanField = () => {
  loanAmount.value = "";
  loanAmount.blur();
};

// CLEAR CLOSE ACCOUNT FIELDS

const clearCloseAccountFields = () => {
  closeUser.value = closePassword.value = "";
  closePassword.blur();
};

// CHANGE TEXT CONTENT UPON LOGGING IN

const adjustWelcomeInfo = (account) => {
  welcomeMessage.textContent = `Welcome back, ${account.owner.split(" ")[0]}`;
  welcomeDate.textContent = `As of ${localiseDate(account.locale, new Date())}`;
};

const renderCurrentData = (account, isSorted = false) => {
  renderTotalBalance(account);
  renderInOutInterest(account);
  renderMovements(account, isSorted);
};

/////////////////////////////////////////////////

// CREATE USERNAME

const createUsername = (accounts) => {
  accounts.forEach((acc) => {
    const username = (
      acc.owner.split(" ")[0][0] + acc.owner.split(" ")[1][0]
    ).toLowerCase();

    return (acc.username = username);
  });
};

createUsername(accounts);

// START LOGOUT TIMER

const logoutTimer = () => {
  let time = 300;

  const tick = () => {
    let minutes = time / 60;
    let seconds = time % 60;

    labelLogoutTimer.textContent =
      "You will be logged out in " +
      `${Math.floor(minutes)}`.padStart(2, "0") +
      ":" +
      `${Math.floor(seconds)}`.padStart(2, "0");

    if (time === 0) {
      clearInterval(tick);
      app.style.opacity = 0;
    }
    time--;
  };

  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

// LOG IN THE USER

const userLogin = (accounts) => {
  currentAccount = accounts.find((acc) => acc.username === username.value);

  if (!currentAccount) return;

  if (
    currentAccount.username === username.value &&
    currentAccount.password === Number(password.value)
  ) {
    app.style.opacity = 1;
    clearLoginFields();
    adjustWelcomeInfo(currentAccount);
    renderCurrentData(currentAccount);
    if (timer) {
      clearInterval(timer);
      timer = logoutTimer();
    } else timer = logoutTimer();
  }
};

// RENDER TOTAL BALANCE

const renderTotalBalance = (account) => {
  const totalBalance = account?.movements.reduce((acc, val) => acc + val);
  currentBalance.textContent = localiseCurrency(account, totalBalance);
};

// RENDER IN's and OUT's

const renderInOutInterest = (account) => {
  const accountIn = account.movements
    .filter((val) => val > 0)
    .reduce((acc, val) => acc + val);
  balanceIn.textContent = localiseCurrency(account, accountIn);

  const accountOut = account.movements
    .filter((val) => val < 0)
    .reduce((acc, val) => acc + val);
  balanceOut.textContent = localiseCurrency(account, accountOut);

  const accountInterest = account.movements
    .filter((mov) => mov > 1)
    .map((mov) => (mov * account.interestRate) / 100)
    .reduce((acc, val) => acc + val);
  balanceInterest.textContent = localiseCurrency(account, accountInterest);
};

// RENDER ACCOUNT MOVEMENTS

const renderMovements = (account, isSorted) => {
  movementsContainer.textContent = "";

  if (isSorted) {
    const movementsCopy = [...account.movements];

    sortMovements(movementsCopy);

    movementsCopy.forEach((mov, i) => {
      const type = mov < 0 ? "withdrawal" : "deposit";

      const html = `<div class="movements__row">
  <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
  <div class="movements__date">${localiseDate(
    account,
    new Date(account.movementsDates[i])
  )}</div>
  <div class="movements__value">${mov}€</div>
</div>`;

      movementsContainer.insertAdjacentHTML("afterbegin", html);
    });
  } else {
    account.movements.forEach((mov, i) => {
      const type = mov < 0 ? "withdrawal" : "deposit";

      const html = `<div class="movements__row">
  <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
  <div class="movements__date">${localiseDate(
    account,
    new Date(account.movementsDates[i])
  )}</div>
  <div class="movements__value">${mov}€</div>
</div>`;

      movementsContainer.insertAdjacentHTML("afterbegin", html);
    });
  }
};

// TRANSFER MONEY

const transferMoney = (currentUser, accounts) => {
  const receiverAccount = accounts.find(
    (acc) => acc.username === transferTo.value
  );

  if (!receiverAccount) return;

  if (
    transferAmount.value > 1 &&
    !isNaN(transferAmount.value) &&
    currentUser !== receiverAccount
  ) {
    currentUser.movements.push(-Number(transferAmount.value));
    currentUser.movementsDates.push(
      localiseDate(currentUser.locale, new Date())
    );
    receiverAccount.movements.push(+transferAmount.value);
    receiverAccount.movementsDates.push(
      localiseDate(currentUser.locale, new Date())
    );
  } else return;

  clearInterval(timer);
  timer = logoutTimer();
  renderCurrentData(currentAccount);
  clearTransferMoneyFields();
};

// REQUEST LOAN

const requestLoan = (account) => {
  const requestAmount = +loanAmount.value;
  if (!isNaN(requestAmount) && requestAmount > 100) {
    setTimeout(() => {
      account.movements.push(requestAmount);
      account.movementsDates.push(localiseDate(account.locale, new Date()));
      renderCurrentData(currentAccount);
    }, 3000);
  }
  clearInterval(timer);
  timer = logoutTimer();
  clearLoanField();
};

// CLOSE ACCOUNT

const closeAccount = (account) => {
  if (
    account?.username === closeUser.value &&
    account?.password === +closePassword.value
  ) {
    app.style.opacity = 0;
    accounts.splice(
      accounts.findIndex((a) => a.id === account.id),
      1
    );
  }
  clearCloseAccountFields();
  welcomeMessage.textContent = "Log in to get started";
};

const sortMovements = (movements) => {
  movements.sort(function (a, b) {
    return a - b;
  });
};

// EVENT LISTENERS

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  userLogin(accounts);
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  transferMoney(currentAccount, accounts);
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  requestLoan(currentAccount);
});

btnCloseAccount.addEventListener("click", function (e) {
  e.preventDefault();
  closeAccount(currentAccount);
});

btnSort.addEventListener("click", function () {
  isSorted = !isSorted;
  renderCurrentData(currentAccount, isSorted);
});
