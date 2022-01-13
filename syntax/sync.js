var fs = require("fs");

// //readFileSync
// console.log("a");
// var result = fs.readFileSync("syntax/sample.txt", "utf8");
// console.log(result);
// console.log("c");

console.log("a");
fs.readFile("syntax/sample.txt", "utf8", (err, data) => {
  console.log(data);
});
console.log("c");
