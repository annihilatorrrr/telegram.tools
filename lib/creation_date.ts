import { PolynomialRegression } from "ml-regression-polynomial";

const entries = [
  [1247_000_000, 1587375629],
  [1111_000_000, 1582941722],
  [1097_000_000, 1582423322],
  [1000_000_000, 1571097600],
  [989_000_000, 1579917722],
  [915_000_000, 1582596122],
  [909_000_000, 1568858522],
  [850_000_000, 1557878400],
  [755_000_000, 1548028800],
  [782_000_000, 1546300800],
  [728_000_000, 1543708800],
  [617_000_000, 1529625600],
  [539_000_000, 1515179434],
  [495_000_000, 1512846634],
  [400_000_000, 1499904000],
  [392_000_000, 1509926400],
  [370_000_000, 1492214400],
  [257_000_000, 1481767322],
  [234_000_000, 1464825600],
  [200_000_000, 1451606400],
  [150_000_000, 1434326400],
  [100_000_000, 1429125034],
  [55_000_000, 1408129834],
  [10_000_000, 1413331200],
  [7_679_610, 1389744000],
  [2_768_409, 1383264000],
  [1_000_000, 1380326400],
  [100_000, 1375729834],
  [1_000, 1373051434],
  [1, 1373051434],
] as [number, number][];

const x = entries.map((v) => v[0]);
const y = entries.map((v) => v[1]);
const regression = new PolynomialRegression(x, y, 5);

export function predictCreationDate(id: number) {
  const r = regression.predict(id);
  if (r <= 0) return now();
  const d = new Date(r * 1_000);
  if (isNaN(d.getHours())) return now();
  if (d.getFullYear() < 2013) return now();
  if (d.getFullYear() == 2013 && id >= 1_000_000_000) return now();
  return d;
}
function now() {
  const d = new Date();
  d.setHours(0);
  d.setMinutes(0);
  d.setSeconds(0);
  d.setMilliseconds(0);
  return d;
}

console.log(predictCreationDate(1739206386))
