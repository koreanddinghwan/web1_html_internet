var http = require("http");
var fs = require("fs");
var url = require("url");
var qs = require("querystring");
var path = require("path");
var template = require("./lib/template");
var sanitizeHtml = require("sanitize-html");

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
        var sanitizedTitle = sanitizeHtml(title);
        var sanitizedDescription = sanitizeHtml(description);

        var list = template.list(filelist);
        var html = template.html(
          title,
          list,
          `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
          `<a href="/create">create</a>`
        );

        response.writeHead(200); //위의 요청검증끝나고 응답으로 200코드 보내줌
        response.end(html);
      });
    } else {
      //나머지루트
      fs.readdir("./data", function (error, filelist) {
        var filteredId = path.parse(queryData.id).base;
        fs.readFile(`data/${filteredId}`, "utf8", function (err, description) {
          var title = filteredId;
          var sanitizedTitle = sanitizeHtml(title);
          var sanitizedDescription = sanitizeHtml(description);
          var list = template.list(filelist);
          var html = template.html(
            sanitizedTitle,
            list,
            `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
            `<a href="/create">create</a>
              <a href = "/update?id=${sanitizedTitle}">update</a>
              <form action="/delete_process" method="post" onsubmit="really?">
                <input type="hidden" name="id" value=${sanitizedTitle}>
                <input type="submit" value="delete">
              </form>
              `
          );
          response.writeHead(200); //위의 요청검증끝나고 응답으로 200코드 보내줌
          response.end(html);
        });
      });
    }
  } else if (pathname === "/create") {
    fs.readdir("./data", function (error, filelist) {
      console.log(filelist);
      var title = "WEB - create";
      var sanitizedTitle = sanitizeHtml(title);
      var list = template.list(filelist);
      var html = template.html(
        sanitizedTitle,
        list,
        `<form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p><textarea name="description" placeholder="description"></textarea></p>
          <p><input type="submit"></p>
        </form>`,
        `<a href = "/update">update</a>`
      );
      response.writeHead(200); //위의 요청검증끝나고 응답으로 200코드 보내줌
      response.end(html);
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
      var sanitizedTitle = sanitizeHtml(title);
      var sanitizedDescription = sanitizeHtml(description);
      fs.writeFile(
        `data/${sanitizedTitle}`,
        sanitizedDescription,
        "utf8",
        (err) => {
          response.writeHead(302, { Location: `/?id=${title}` }); //위의 요청검증끝나고 응답으로 200코드 보내줌
          response.end();
        }
      );
    });
  } else if (pathname === "/update") {
    fs.readdir("./data", function (error, filelist) {
      var filteredId = path.parse(queryData.id).base;
      fs.readFile(`data/${filteredId}`, "utf8", function (err, description) {
        var title = filteredId;
        var list = template.list(filelist);

        var html = template.html(
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
        response.end(html);
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

      var sanitizedTitle = sanitizeHtml(title);
      var sanitizedDescription = sanitizeHtml(description);
      console.log(post);
      fs.rename(`data/${id}`, `data/${sanitizedTitle}`, function (err) {
        fs.writeFile(
          `data/${sanitizedTitle}`,
          sanitizedDescription,
          "utf8",
          (err) => {
            response.writeHead(302, { Location: `/?id=${title}` }); //위의 요청검증끝나고 응답으로 200코드 보내줌
            response.end();
          }
        );
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
      var filteredId = path.parse(id).base;
      fs.unlink(`data/${filteredId}`, (err) => {
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
