"use strict";

const VALID_PREFIX = "listing";
const VALID_KEYS = ["price", "url"];
const DELIMITER = ";";
const PRICE_CON = ">";

/**
 * @desc Convert an array or string to a listing Object
 * @param {string|array} input
 * @return listing object
 */
function convertToListing(input) {
  let listing = null;

  if (typeof input === "string") {
    if (!input.includes(VALID_KEYS[0]))
      throw new Error("Price attribute missing");

    return stringToListing(input);
  }

  if (Array.isArray(input)) {
    let priceFound;
    let urlFound;
    let priceIndex;
    let urlIndex;

    input.forEach((el, index) => {
      if (el.startsWith(VALID_PREFIX + " " + VALID_KEYS[0])) {
        priceFound = true;
        priceIndex = index;
      }
      if (el.startsWith(VALID_PREFIX + " " + VALID_KEYS[1])) {
        urlFound = true;
        urlIndex = index;
      }
    });

    if (!priceFound) throw new Error("Price attribute missing");

    return (listing = {
      ...stringToListing(input[priceIndex]),
      ...(urlFound ? stringToListing(input[urlIndex]) : undefined),
    });
  }

  throw new Error("Unable to convert listing");
}

/**
 * @desc Convert a string to a listing Object
 * @param {string} input
 * @return object
 */
function stringToListing(input) {
  const listing = {};
  let keycount = 0;

  // Cleanup
  input = input.trim().toLowerCase();

  if (!input.startsWith(VALID_PREFIX))
    throw new Error("String must start with listing");

  input = input.substring(VALID_PREFIX.length + 1);

  input.split(DELIMITER).forEach((val) => {
    VALID_KEYS.forEach((key) => {
      if (val.trim().startsWith(key)) {
        listing[key] = val.trim().substring(key.length + 1);
        keycount++;
      }
    });
  });

  if (keycount > VALID_KEYS.length) throw new Error("Duplicate keys");

  if (listing.price?.startsWith(PRICE_CON)) {
    listing["condition"] = PRICE_CON;
    listing[VALID_KEYS[0]] = listing.price.substring(1);
  }

  if (listing.price?.includes(" ")) {
    const p = listing[VALID_KEYS[0]].split(" ");
    listing[VALID_KEYS[0]] = p[1];
    listing["asset"] = p[0].toUpperCase();
  }

  if (listing.price === "0" || listing.price === "") {
    listing[VALID_KEYS[0]] = 0;
  }

  if (listing.price) {
    listing.price = Number(listing.price);
    if (isNaN(listing.price)) throw new Error("Invalid price value");
  }

  return listing;
}

module.exports = convertToListing;
