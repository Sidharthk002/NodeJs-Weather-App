const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", Math.floor(orgVal.main.temp - 273.15));
    temperature = temperature.replace("{%tempmin%}", Math.floor(orgVal.main.temp_min - 273.15));
    temperature = temperature.replace("{%tempmax%}", Math.floor(orgVal.main.temp_max-273.15));
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    return temperature;
}

const server = http.createServer((req,res)=>{
    if(req.url == "/"){
        requests(
            "http://api.openweathermap.org/data/2.5/weather?q=Pune&appid=c17c102dea09c69a998955df70745991"
        )
        .on("data",(chunk)=> {
            const objData = JSON.parse(chunk);
            const arrData = [objData]
            const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join("");
            res.write(realTimeData);
        })
        .on("end", (err) => {
            if (err) return console.log("connection closed due to errors",err);
            res.end();
            // console.log("end");
        })
    }
    else{
        res.end("File not found");
    }
})

server.listen("8080","127.0.0.1")