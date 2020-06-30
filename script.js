// Portfolio Management App

// 1. Calculate market value based on market price and shares owned
var updateMarketValue = function (el) {
  var sharesOwned = parseFloat($(el).find(".shares input").val());
  var marketPrice = parseFloat($(el).find(".marketPrice input").val());

  var marketValue = sharesOwned * marketPrice;
  $(el).children(".marketValue").html(marketValue);

  return marketValue;
};

// 2. Calculate unrealized gain/loss based on market value, cost per share, and shares owned

var updateUnrealizedProfit = function (el, marketValue) {
  var sharesOwned = parseFloat($(el).find(".shares input").val());
  var costPerShare = parseFloat($(el).find(".cost input").val());
  var costOfPurchase = sharesOwned * costPerShare;

  // Unrealized profit = market value - purchase cost
  var unrealizedProfit = marketValue - costOfPurchase;
  $(el).children(".profit").html(unrealizedProfit);

  return unrealizedProfit;
};

// 3. Calculate the portfolio total market value, and unrealized gain/loss
var updatePortfolioValueAndProfit = function () {
  // Sum function to loop through array and generate a total
  var sum = function (acc, x) {
    return acc + x;
  };

  // Store the values of each stock
  var stocksMarketValues = [];
  var stocksUnrealizedProfits = [];

  // Push the contents of each element into stock arrays
  $("tbody tr").each(function (i, el) {
    var marketValue = updateMarketValue(el);
    stocksMarketValues.push(marketValue);
    var unrealizedProfit = updateUnrealizedProfit(el, marketValue);
    stocksUnrealizedProfits.push(unrealizedProfit);
    console.log(stocksUnrealizedProfits);
  });

  // Sum up the market values and profits using the reduce method
  var portfolioMarketValue = stocksMarketValues.reduce(sum);
  var portfolioUnrealizedProfit = stocksUnrealizedProfits.reduce(sum);

  // Display these values in the portfolio summary section
  $("#portfolioValue").html(portfolioMarketValue);
  $("#portfolioProfit").html(portfolioUnrealizedProfit);
};
// On DOM content loaded
$(document).ready(function () {
  $("tbody tr").each(function (i, el) {
    var marketValue = updateMarketValue(el);
    updateUnrealizedProfit(el, marketValue);
    updatePortfolioValueAndProfit();
  });

  // 4. Add JavaScript to the remove button to delete a stock from the list
  $(document).on("click", ".btn.remove", function (e) {
    // Target the tr to delete the entire row
    $(this).parent().parent().remove();
    updatePortfolioValueAndProfit();
  });

  // 5. Make shares owned, cost per share, and market price editable
  // 6. Update market value, and unrealized gain/loss when shares owned, cost per share, or market price is edited
  var timeout;
  $(document).on("input", "tr input", function () {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      updatePortfolioValueAndProfit();
    }, 1000);
  });

  // 7. Allow user to add a new stock to the portfolio
  $("#addStock").on("submit", function (event) {
    event.preventDefault();
    var name = $(this).children("[name=name]").val();
    var shares = $(this).children("[name=shares]").val();
    var cost = $(this).children("[name=cost]").val();
    var marketPrice = $(this).children("[name=marketPrice]").val();

    // Insert data into table as a new row
    $("tbody").append(
      "<tr>" +
        '<td class="name">' +
        name +
        "</td>" +
        '<td class="shares"><input type="number" value="' +
        shares +
        '" /></td>' +
        '<td class="cost"><input type="number" value="' +
        cost +
        '" /></td>' +
        '<td class="marketPrice"><input type="number" value="' +
        marketPrice +
        '" /></td>' +
        '<td class="marketValue"></td>' +
        '<td class="profit"></td>' +
        '<td><button class="btn btn-danger btn-sm remove">remove</button></td>' +
        "</tr>"
    );

    // Update value and profit totals for newly added row
    updatePortfolioValueAndProfit();

    // Clear input fields
    $(this).children("[name=name]").val("");
    $(this).children("[name=shares]").val("");
    $(this).children("[name=cost]").val("");
    $(this).children("[name=marketPrice]").val("");
  });
});
