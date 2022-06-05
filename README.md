# fourhands ✋🖖🤚🖐

## HIP-10 Helper for Domain Listings via TXT records

This helper tool validates and converts any string or array to a [HIP-10](https://github.com/handshake-org/HIPs/blob/master/HIP-0010.md) domain listing object.

## Installation

Via [npm](https://www.npmjs.com/):

```bash
npm install fourhands
```

In [Node.js](https://nodejs.org/):

```js
const fourhands = require("fourhands");
```

## Usage

### Convert String to Listing

```js
fourhands.convertToListing(
  "listing price=>HNS 250.33;url=https://example.com/"
);
```

### Convert Array to Listing

```js
fourhands.convertToListing([
  "listing price=>HNS 250.33",
  "listing url=https://example.com/",
]);
```

### Convert Array with other TXT records to Listing

Last price/url element will be used if more are provided.

```js
fourhands.convertToListing([
  "something else",
  "profile service=com.github 0xstefan",
  "listing price=USD 1000", // <= will be ignored
  "listing price=>HNS 250.33", // <= will be used
  "verification=675rtzfgh-mbnvjhguzio",
  "listing url=https://example.com/",
]);
```

#### Same Output for all Examples above

```json
{
  "price": 250.33,
  "asset": "HNS",
  "condition": ">",
  "url": "https://example.com/"
}
```

### Invalid Inputs (Throws Error)

```js
fourhands.convertToListing("someinput"); // no listing found
fourhands.convertToListing("listing price=100,00"); // wrong price format
fourhands.convertToListing(["listing url=https://example.com"]); // Price missing
fourhands.convertToListing(["listing price=HNS 1;price=USD 1"]); // Multiple prices found
```

## Test

```bash
npm test
```

## License

_fourhands_ is available under the [MIT](https://mths.be/mit) license.
