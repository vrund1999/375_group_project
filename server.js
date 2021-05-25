
let countryCodeLookup = require("iso-countries-lookup");
let axios = require("axios");
let express = require("express");
let app = express();

// retrieve the api key and base api url from env.json
let apiFile = require("./env.json");
let apiKey = apiFile["api_key"];
let baseUrl = apiFile["base_api_url"];
let apiHost = apiFile["api_host"];

//App will run on localhost port 3000
let port = 3000;
let hostname = "localhost";

//Indicate what folder the html static files will be located in
app.use(express.static("public_html"));

app.get("/covidData", function (req, res) {
    let country = req.query.country;
    let returnObject = {}

    let twoLetterCountryCode = countryCodeLookup(country).toLocaleLowerCase();
    let threeLetterCountryCode;

    var options = {
        method: 'GET',
        url: 'https://vaccovid-coronavirus-vaccine-and-treatment-tracker.p.rapidapi.com/api/npm-covid-data/',
        headers: {
          'x-rapidapi-key': `${apiKey}`,
          'x-rapidapi-host': `${apiHost}`
        }
      };      

    //https://rapidapi.com/vaccovidlive-vaccovidlive-default/api/vaccovid-coronavirus-vaccine-and-treatment-tracker
    axios.request(options).then(function (response) {
        for (let data in response.data){
            if (response.data[data].TwoLetterSymbol == twoLetterCountryCode){

                threeLetterCountryCode = response.data[data].ThreeLetterSymbol;
                returnObject["totalCases"] = response.data[data].TotalCases;
                returnObject["totalDeaths"] = response.data[data].TotalDeaths;
                returnObject["newCases"] = response.data[data].NewCases;
                returnObject["newDeaths"] = response.data[data].NewDeaths;
            }
        }
    }).catch(function (error) {
        console.error(error);
    });

    var options = {
        method: 'GET',
        url: `https://vaccovid-coronavirus-vaccine-and-treatment-tracker.p.rapidapi.com/api/covid-ovid-data/sixmonth/${threeLetterCountryCode}}`,
        headers: {
            'x-rapidapi-key': `${apiKey}`,
            'x-rapidapi-host': `${apiHost}`
          }
      };
      
      //https://rapidapi.com/vaccovidlive-vaccovidlive-default/api/vaccovid-coronavirus-vaccine-and-treatment-tracker
      axios.request(options).then(function (response) {
        for (let data in response.data){
            if (response.data[data].symbol == threeLetterCountryCode){
                let prevNewCases = response.data[data].new_cases;
                let prevNewDeaths = response.data[data].new_deaths;

                if ((returnObject["newCases"] - prevNewCases)  > 0){
                    returnObject["casesWentUp"] = true;
                }
                else{
                    returnObject["casesWentUp"] = false;
                }

                if ((returnObject["newDeaths"] - prevNewDeaths) > 0){
                    returnObject["deathsWentUp"] = true;
                }
                else{
                    returnObject["deathsWentUp"] = false;
                }
            }
        }
      }).catch(function (error) {
          console.error(error);
      });

      var options = {
        method: 'GET',
        url: `https://coronavirus-smartable.p.rapidapi.com/news/v1/${twoLetterCountryCode}/`,
        headers: {
            'x-rapidapi-key': `${apiKey}`,
            'x-rapidapi-host': 'coronavirus-smartable.p.rapidapi.com'
        }
      };
      
      //https://rapidapi.com/SmartableAI/api/coronavirus-smartable
      axios.request(options).then(function (response) {
          console.log(response.data);
      }).catch(function (error) {
          console.error(error);
      });
      
    
});

var options = {
    method: 'GET',
    url: 'https://vaccovid-coronavirus-vaccine-and-treatment-tracker.p.rapidapi.com/api/npm-covid-data/',
    headers: {
      'x-rapidapi-key': `${apiKey}`,
      'x-rapidapi-host': `${apiHost}`
    }
  };      

let twoLetterCountryCode = countryCodeLookup("china").toLocaleLowerCase();
let threeLetterCountryCode;
axios.request(options).then(function (response) {
    for (let data in response.data){
        if (response.data[data].TwoLetterSymbol == twoLetterCountryCode){
            threeLetterCountryCode = response.data[data].ThreeLetterSymbol;
        }
    }
    }).catch(function (error) {
        console.error(error);
    });
    
var options = {
    method: 'GET',
    url: `https://vaccovid-coronavirus-vaccine-and-treatment-tracker.p.rapidapi.com/api/covid-ovid-data/sixmonth/${threeLetterCountryCode}`,
    headers: {
        'x-rapidapi-key': `${apiKey}`,
        'x-rapidapi-host': `${apiHost}`
      }
  };
  
  axios.request(options).then(function (response) {
      console.log(response.data);
  }).catch(function (error) {
      console.error(error);
  });

app.listen(port, hostname, () => {
    console.log(`Listening at: http://${hostname}:${port}`);
});

const express = require("express");
const app = express();
const MongoClient = require('mongodb').MongoClient;
const body_parser = require("body-parser");

// parse JSON (application/json content-type)
app.use(body_parser.json());

const port = 4000;


const uri = "mongodb+srv://sarthak:sarthak@cluster0.g7wkj.mongodb.net/375?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("375").collection("Doc1");
  console.log(`database connected`)
  client.close();
});

app.listen(port, () => {
    console.log(`server listening at ${port}`);
});
