const test = require("ava");
const convertToListing = require("./scripts/convertToListing");

const valid1 = "listing price=>HNS 25000;url=https://example.com/somename";
const valid2 = "listing url=https://example.com/somename;price=>HNS 25000";
const valid3 = "listing price=>HNS 25000;url=https://example.com/somename";
const valid4 = "listing price=HNS 25000;url=https://example.com/somename";
const valid5 = "listing price=0";
const valid6 = "listing price=";
const valid7 = "listing price=EUR 99.99";
const valid8 = " listing price=>HNS 25000 ; url=https://example.com/somename ";

const validA1 = [
  "listing price=>HNS 25000",
  "listing url=https://example.com/somename",
];

const validA2 = ["listing price=EUR 999.98"];

const validA3 = [
  "something",
  "listing price=USD 200",
  "listing url=https://example.com/",
  "listing price=>HNS 25000",
  "profile service=com.github 0xstefan",
  "listing url=https://example.com/somename",
];

const expectedFull = {
  price: 25000,
  asset: "HNS",
  condition: ">",
  url: "https://example.com/somename",
};

const withoutCondition = { ...expectedFull };
delete withoutCondition.condition;

test("convertion", (t) => {
  t.deepEqual(convertToListing(valid1), expectedFull);
  t.deepEqual(convertToListing(valid2), expectedFull);
  t.deepEqual(convertToListing(valid3), expectedFull);
  t.deepEqual(convertToListing(valid4), withoutCondition);

  t.deepEqual(convertToListing(valid5), { price: 0 });
  t.deepEqual(convertToListing(valid6), { price: 0 });
  t.deepEqual(convertToListing(valid7), { price: 99.99, asset: "EUR" });
  t.deepEqual(convertToListing(valid8), expectedFull);

  t.deepEqual(convertToListing(validA1), expectedFull);
  t.deepEqual(convertToListing(validA2), { price: 999.98, asset: "EUR" });

  t.deepEqual(convertToListing(validA3), expectedFull);

  t.deepEqual(convertToListing(valid1 + ";invalid=something"), expectedFull);
});

test("throws", (t) => {
  t.throws(() => convertToListing("somestring"));
  t.throws(() => convertToListing("_" + valid1));
  t.throws(() => convertToListing("listing price=100,00"));
  t.throws(() => convertToListing("listing price=>200,300.2"));
  t.throws(() => convertToListing(["listing url=https://example.com"]));
  t.throws(() => convertToListing("listing url=https://example.com"));
  t.throws(() => convertToListing(valid1.toUpperCase()));
  t.throws(() => convertToListing(valid1 + ";price=USD 100"));
  t.throws(() => convertToListing(valid1 + ";url=https://onemore.com"));
  t.throws(() => convertToListing((validA1[2] = "toomuch")));
  t.throws(() => convertToListing(100));
  t.throws(() => convertToListing({ price: 100 }));
  t.throws(() => convertToListing(5.3));
});
