var http = require("http");
var fs = require("fs");
var url = require("url");
var qs = require("querystring");

function templateHtml(title, list, body, control) {
  return `
    <!doctype html>
  <html>
  
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${control}
    ${body}
    </p>
  </body>
  
  </html>
    `;
}

function templateList(filelist) {
  //리스트html태그선언
  var list = `<ul>`;
  //file의 각각에 대해서 list에 더하기
  var filelist = filelist.forEach((file) => {
    list += `<li><a href="/?id=${file}">${file}</a></li>`;
  });
  list += `</ul>`; //닫는태그
  return list;
}

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;

  //home route
  if (pathname === "/") {
    if (queryData.id === undefined) {
      fs.readdir("./data", function (error, filelist) {
        console.log(filelist);
        var title = "Welcome here";
        var description = "Hello, node.js";
        var list = templateList(filelist);
        var template = templateHtml(
          title,
          list,
          `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`
        );
        response.writeHead(200); //위의 요청검증끝나고 응답으로 200코드 보내줌
        response.end(template);
      });
    } else {
      //나머지루트
      fs.readdir("./data", function (error, filelist) {
        fs.readFile(
          `data/${queryData.id}`,
          "utf8",
          function (err, description) {
            var title = queryData.id;
            var list = templateList(filelist);
            var template = templateHtml(
              title,
              list,
              `<h2>${title}</h2>${description}`,
              `<a href="/create">create</a>
              <a href = "/update?id=${title}">update</a>
              <form action="/delete_process" method="post" onsubmit="really?">
                <input type="hidden" name="id" value=${title}>
                <input type="submit" value="delete">
              </form>
              `
            );
            response.writeHead(200); //위의 요청검증끝나고 응답으로 200코드 보내줌
            response.end(template);
          }
        );
      });
    }
  } else if (pathname === "/create") {
    fs.readdir("./data", function (error, filelist) {
      console.log(filelist);
      var title = "WEB - create";
      var list = templateList(filelist);
      var template = templateHtml(
        title,
        list,
        `<form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p><textarea name="description" placeholder="description"></textarea></p>
          <p><input type="submit"></p>
        </form>`,
        `<a href = "/update">update</a>`
      );
      response.writeHead(200); //위의 요청검증끝나고 응답으로 200코드 보내줌
      response.end(template);
    });
  } else if (pathname === "/create_process") {
    var body = "";
    console.log(request.method);
    request.on("data", function (data) {
      body += data;
    });
    request.on("end", function () {
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
      fs.writeFile(`data/${title}`, description, "utf8", (err) => {
        response.writeHead(302, { Location: `/?id=${title}` }); //위의 요청검증끝나고 응답으로 200코드 보내줌
        response.end();
      });
    });
  } else if (pathname === "/update") {
    fs.readdir("./data", function (error, filelist) {
      fs.readFile(`data/${queryData.id}`, "utf8", function (err, description) {
        var title = queryData.id;
        var list = templateList(filelist);

        var template = templateHtml(
          title,
          list,
          `<form action="/update_process" method="post">
          <input type="hidden" name="id" value=${title}>
          <p><input type="text" name="title" placeholder="title" value=${title}></p>
          <p><textarea name="description" placeholder="description">${description}</textarea></p>
          <p><input type="submit"></p>
        </form>`,
          `<a href="/create">create</a> <a href = "/update?id=${title}">update</a>`
        );
        response.writeHead(200); //위의 요청검증끝나고 응답으로 200코드 보내줌
        response.end(template);
      });
    });
  } else if (pathname === "/update_process") {
    var body = "";
    request.on("data", function (data) {
      body += data;
    });
    request.on("end", function () {
      var post = qs.parse(body);
      var id = post.id;
      var title = post.title;
      var description = post.description;
      console.log(post);
      fs.rename(`data/${id}`, `data/${title}`, function (err) {
        fs.writeFile(`data/${title}`, description, "utf8", (err) => {
          response.writeHead(302, { Location: `/?id=${title}` }); //위의 요청검증끝나고 응답으로 200코드 보내줌
          response.end();
        });
      });
    });
  } else if (pathname === "/delete_process") {
    var body = "";
    request.on("data", function (data) {
      body += data;
    });
    request.on("end", function () {
      var post = qs.parse(body);
      var id = post.id;
      fs.unlink(`data/${id}`, (err) => {
        response.writeHead(302, { Location: `/` });
        response.end();
      });
    });
  } else {
    response.writeHead(404); //404에러
    response.end("Not found");
  }
});

app.listen(3000);
