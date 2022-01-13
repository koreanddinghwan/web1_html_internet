1. nodejs

html을 직접 코딩해서 웹페이지를 하나하나 만드는 것에 지친 사람드이 만들어낸 기술.

nodejs란?

NODEJS런타임에서 JS로 필요한 기능을 호출해서 NODEJS 어플리케이션을 만들 수 있음.

node를 설치하고, `node helloworld.js`를 실행하면 nodejs런타임에서 해당 파일을 실행해준다.

수업의 묵표는 Nodejs 어플리케이션을 만드는것.  
이를 위해선 nodejs 런타임의 기능을 사용하는 것이고,  
이를 위해선 JS를 알아야한다.

nodejs는 웹서버 기능을 내장하고있다.

2. URL

`http://localhost:3000/main?id=HTML&page=12`의 의미

http : protocol, 통신규칙 사용자가 서버에 접속할때 어떤 방식으로 통신할 것인가에 대한 부분,

http는 hyper text transfer protocol, 웹 브라우저(유저)와 웹 서버가 데이터를 주고받기 위해서 만든 통신 규칙

host(domain) : 인터넷에 접속한 각각의 컴퓨터를 host라고하는데, 인터넷에 연결된 컴퓨터를 가리키는 주소임.

3000 : port번호, 한 대의 컴퓨터에 여러개의 서버가 있을 수 잇는데, 클라이언트가 접속할때 어떤 서버와 통신할지에 대한 결정.

포트번호는 관습적으로 80이 기본값.

main : path, 어떤 파일인지?

?id=HTML&page=12 : 쿼리스트링, URL Query인데, ?로 시작하기로 약속되어있고, 값은 &로 구분, 값의 이름과 값은 =로 구분.

3. query string
