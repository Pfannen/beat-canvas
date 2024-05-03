test("Private method test", () => {});

// import { Coordinate } from "../../../objects/measurement/types";
// import { getYIntersection } from "../../../objects/measurement/note-beam-calculator";

// //Test helper: https://www.calculator.net/slope-calculator.html?x21=0&y21=0&d2=5&m2=-1.33&th2=&type=2&x=Calculate#onepoint

// test("YIntersection - 45deg", () => {
//   const beamPoint: Coordinate = { x: 0, y: 0 };
//   const pointOne: Coordinate = { x: 5, y: 0 };
//   const beamData = { point: beamPoint, angle: 45 };
//   let intersection = getYIntersection(beamData, pointOne);
//   expect(Math.round(intersection)).toBe(5);
// });

// test("YIntersection - 36.87deg", () => {
//   const beamPoint: Coordinate = { x: 0, y: 0 };
//   const pointOne: Coordinate = { x: 5, y: 0 };
//   const beamData = { point: beamPoint, angle: 36.87 };
//   const intersection = getYIntersection(beamData, pointOne);
//   expect(intersection).toBeCloseTo(3.75);
// });

// test("YIntersection - 126.93876273229deg", () => {
//   const beamPoint: Coordinate = { x: 0, y: 0 };
//   const pointOne: Coordinate = { x: 5, y: 0 };
//   const beamData = { point: beamPoint, angle: 126.93876273229 };
//   const intersection = getYIntersection(beamData, pointOne);
//   expect(intersection).toBeCloseTo(-6.65);
// });
