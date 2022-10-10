const http = require("http");
const fs = require("fs");
const requests = require('requests');

const replaceVal = (tempVal,orgVal)=>{
    let temperature = tempVal.replace("{%tempval%}",orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}",orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}",orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}",orgVal.name);
    temperature = temperature.replace("{%country%}",orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}",orgVal.weather[0].main);
    return temperature;
}

const homefile = fs.readFileSync(__dirname+"/home.html",'utf-8');
const server = http.createServer((req,res)=>{
    if(req.url=="/"){
        requests("https://api.openweathermap.org/data/2.5/weather?q=new york&units=metric&appid=3e615ea091e54dc970b31d4a85e339f7")
        .on("data",(chunkdata)=>{
            const objData = JSON.parse(chunkdata);
            const arrData = [objData];
            const realTimeData = arrData.map((val)=>replaceVal(homefile,val)).join("");
            res.write(realTimeData);
        })
        .on("end",(err)=>{
            if(err){
                console.log("connection closed due to errors",err);
            }
            res.end();
        });
    }
});

server.listen(3000,"127.0.0.1",()=>{
    console.log("Listening");
});