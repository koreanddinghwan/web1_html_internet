var members = ["egoing", "k8805", "hoya"];

var roles = {
  programmer: "egoing",
  designer: "k805",
  manager: "hoya",
};

var i = 0;

while (i < members.length) {
  console.log(members[i]);
  i++;
}

for (var name in roles) {
  console.log(roles[name]);
}
