
let countryCodeLookup = require("iso-countries-lookup");
let axios = require("axios");
const express = require("express");
const app = express();
const VaxxModel = require("./models/schema");
const mongoose = require("mongoose");
// retrieve the api key and base api url from env.json
let apiFile = require("./env.json");
let apiKey = apiFile["api_key"];
let all_covid_data_api_base_url = apiFile["all_covid_data_api_base_url"];
let all_covid_data_api_host = apiFile["all_covid_data_api_host"];
let all_covid_data_6_months_base_url = apiFile["all_covid_data_6_months_base_url"];
let covid_news_api_base_url = apiFile["covid_news_api_base_url"];
let covid_news_api_host = apiFile["covid_news_api_host"];

//Indicate what folder the html static files will be located in
app.use(express.static("public_html"));

//App will run on localhost port 3000
let port = 3000;
let hostname = "localhost";

//Indicate what folder the html static files will be located in
app.use(express.static("public_html"));

app.get("/newCovidData", function (req, res) {
    let country = req.query.country;

    console.log("COUNTRY: " + country);

    let twoLetterCountryCode = countryCodeLookup(country).toLocaleLowerCase();

    console.log("twoLetterCountryCode: " + twoLetterCountryCode);

    var options = {
        method: 'GET',
        url: `${all_covid_data_api_base_url}`,
        headers: {
          'x-rapidapi-key': `${apiKey}`,
          'x-rapidapi-host': `${all_covid_data_api_host}`
        }
      };      
    
    //https://rapidapi.com/vaccovidlive-vaccovidlive-default/api/vaccovid-coronavirus-vaccine-and-treatment-tracker
    axios.request(options).then(function (response) {
        let returnObject = {}
        
        for (let property in response.data){
            if (response.data[property].TwoLetterSymbol == null){
                continue;
            }
            else if (response.data[property].TwoLetterSymbol.toLowerCase() == twoLetterCountryCode){

                threeLetterCountryCode = response.data[property].ThreeLetterSymbol;
                returnObject.totalCases = response.data[property].TotalCases;
                returnObject.totalDeaths = response.data[property].TotalDeaths;
                returnObject.newCases = response.data[property].NewCases;
                returnObject.newDeaths = response.data[property].NewDeaths;
                break;
            }
        }

        res.json(returnObject);

    }).catch(function (error) {
        console.error(error);
    });
    
});

app.get("/newCovidNews", function (req, res) {
    let country = req.query.country;
    let twoLetterCountryCode = countryCodeLookup(country).toLocaleLowerCase();

    var options = {
        method: 'GET',
        url: `${covid_news_api_base_url}${twoLetterCountryCode.toUpperCase()}/`,
        headers: {
            'x-rapidapi-key': `${apiKey}`,
            'x-rapidapi-host': `${covid_news_api_host}`
        }
    };      
    
    //https://rapidapi.com/SmartableAI/api/coronavirus-smartable
    axios.request(options).then(function (response) {

        let newsArticles = []

        for (let i = 0; i < 4; i++){
            let object = {};
            object['newsArticleTitle'] = response.data.news[i].title;
            object['newsArticleUrl'] = response.data.news[i].webUrl;
            newsArticles.push(object);
        }

        res.json({'newsArticles': newsArticles});

    }).catch(function (error) {
        console.error(error);
    });

});


const body_parser = require("body-parser");

// parse JSON (application/json content-type)
app.use(body_parser.json());

//const port = 4000;


mongoose.connect(
    "mongodb+srv://sarthak:sarthak@cluster0.imo2z.mongodb.net/375?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    }
  );

//  get whole doc with the email query
  app.get("/Vaccine", async (request, response) => {
    const mail = request.query.mail;
    if(mail==='test@g.com'){
    console.log("ma", mail)
    }
  
    // VaxxModel.findOne({"email": mail }, function (err, docs) {
    //     if (err){
            
    //         console.log(err)
    //     }
    //     else{
            
    //         response.json(docs)
    //         console.log("Result : ", json(docs));
    //     }
    // });
    const vac = await VaxxModel.findOne({email: mail});

  try {
    response.send(vac);
    console.log("json:", vac)
  } catch (error) {
    response.status(500).send(error);
  }
  });

//   save info on the database. Send json in body from the client side.
  app.post("/sendVacInfo", async (request, response) => {
    const newModel = new VaxxModel(request.body);
  
    try {
      await newModel.save();
      response.send(newModel);
      console.log("model saved")
    } catch (error) {
      response.status(500).send(error);
      console.log(error);
    }
  });


app.listen(port, hostname, () => {
    console.log(`Listening at: http://${hostname}:${port}`);
});
