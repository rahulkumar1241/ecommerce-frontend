export const API_MESSAGE_TYPE: any =
{
  SUCCESS: "SUCCESS",
  ERROR: "ERROR"
}

export const PRODUCT_ACTIONS = {
  BUY_NOW: "BUY NOW",
  ADD_TO_CART: "ADD TO CART",
  OUT_OF_STOCK: "This product is out of stock",
  RETURN_ORDER: "RETURN ORDER",
  CANCEL_ORDER: "CANCEL ORDER"
}

export const priceAfterDiscount = (price: any, discount_in_per: any) => {
  return parseInt(price) - Math.floor((price / 100) * discount_in_per);
}

export const numberToIndianCurrency = (amount: any) => {
  return '₹' + new Intl.NumberFormat('en-IN').format(amount)
}

export const getOS = () => {
  let userAgent = navigator.userAgent || navigator.vendor;
  if (
    userAgent.match(/iPad/i) ||
    userAgent.match(/iPhone/i) ||
    userAgent.match(/iPod/i)
  ) {
    return "ios";
  } else if (userAgent.match(/Android/i)) {
    return "android";
  } else {
    return "desktop";
  }
};

export const getRandomColor = () => {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

