var template = {
  html: function (title, list, body, control) {
    return `
        <!doctype html>
      <html>
      
      <head>
        <title>WEB2 - ${title}</title>
        <meta charset="utf-8">
      </head>
      
      <body>
        <h1><a href="/">WEB2</a></h1>
        ${list}
        ${control}
        ${body}
        </p>
      </body>
      
      </html>
        `;
  },
  list: function (filelist) {
    //리스트html태그선언
    var list = `<ul>`;
    //file의 각각에 대해서 list에 더하기
    var filelist = filelist.forEach((file) => {
      list += `<li><a href="/?id=${file}">${file}</a></li>`;
    });
    list += `</ul>`; //닫는태그
    return list;
  },
};

module.exports = template;
