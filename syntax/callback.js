// function a() {
//   console.log("A");
// }

var a = function () {
  console.log("A");
};

function slowfunc(callback) {
  callback();
}

slowfunc(a); //slowfunc 실행한 다음에 매개변수로 들어온 함수를 실행해라.
