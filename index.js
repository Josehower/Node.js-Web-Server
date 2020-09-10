const http = require("http");
const fs = require('fs');

const host = 'localhost';
const port = 3000;

function serverInit (response){
  const requestListener = function (req, res) {   
    if(req.url === "/all-in"){
    res.writeHead(200);
    res.end(response);
    }else{
      
      function print (fileName, contentType){
      res.setHeader('Content-Type', `${contentType}`);
      res.writeHead(200);
      fs.readFile(`./public/${fileName}`, (err, data) => {
          if (err) throw err;
          res.end(data);
        })
      }

      switch(req.url) {
        case "/descriptive":
          print("Descriptive-Text", "text/plain")
          break;
        case "/image":
          print("Z-image.jpeg", "image/jpeg")
          break;
          case "/javascript":
            print("Javascript.js", "text/javascript")
            break;
        default:
          print("index.html", "text/html")
      }

    }
  };

  const server = http.createServer(requestListener);

  server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
  });
}


function readArr(arr){
  let info=[];
  arr.forEach((file, index) => {
    info.push(new Promise(function(res,rej){
      fs.readFile(`./public/${file}`, "utf8", (err,data)=>{
        if(err)throw err;
        res(`
===============================================================================
FILE # ${index+1}                     FILE NAME: ${file}
-------------------------------------------------------------------------------
${data}
===============================================================================




        `);
      })}))
  });

  Promise.all(info).then(res=>serverInit(res.join('')))
  
}



fs.readdir('./public', (err, data) => {
  if (err) throw err;
  readArr(data);
});

