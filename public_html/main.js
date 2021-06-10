document.getElementById('search-box').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        let country = document.getElementById("search-box").value;
        let url = `/newCovidData?country=${country}`;
        
        fetch(url).then(function (response) {
            response.json().then(function (data) {

                let totalCases = document.getElementById("total-number");
                totalCases.textContent = data.totalCases.toLocaleString();

                let totalDeaths = document.getElementById("death-number");
                totalDeaths.textContent = data.totalDeaths.toLocaleString();
            })
        });

        url = `/newCovidNews?country=${country}`;

        fetch(url).then(function (response) {
            response.json().then(function (data) {

                let newsHeader = document.getElementById("news-div-id");

                removeOldArticles();
                var list = document.createElement('ul');
                list.id = 'article-list';

                for (let object in data.newsArticles){
                    
                    var listItem = document.createElement('li');
                    let a = document.createElement('a'); 
                    let link = document.createTextNode(data.newsArticles[object].newsArticleTitle);
                    a.append(link);
                    a.href = data.newsArticles[object].newsArticleUrl;
                    a.style.fontSize = "15px";
                    listItem.appendChild(a);
                    list.appendChild(listItem);
                }

                newsHeader.appendChild(list);
            })
        });

    }
});


function removeOldArticles(){
    let articleList = document.getElementById('article-list');

    if (articleList !== null){
        articleList.remove();
    }
}

let myVar = setInterval(checkForEmailAlert, 10000);

function checkForEmailAlert(){
    url = `/Vaccine`;

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate()+1);
    var dd = String(tomorrow.getDate()).padStart(2, '0');
    var mm = String(tomorrow.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = tomorrow.getFullYear();
    tomorrow = yyyy + '-' + mm + '-' + dd;

    let allObjects = [];

    fetch(url).then(function (response) {
        response.json().then(function (data) {
            for (let doc in data.documents) {
                let emailObject = new Object();

                if (data.documents[doc].DATE === tomorrow){

                    emailObject.FirstName = data.documents[doc].FirstName;
                    emailObject.SecondName = data.documents[doc].SecondName;
                    emailObject.Vaxx = data.documents[doc].Vaxx;
                    emailObject.email = data.documents[doc].email;
                    emailObject.DATE = data.documents[doc].DATE;
                    allObjects.push(emailObject);
                }
              }

        }).then(function(){
            url = `/SendEmail`;

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify({"allObjects":allObjects}),
                redirect: 'follow'
              };
            
            fetch(url, requestOptions)
            .then(response => response.text())
            .then(result => {
              console.log(result);
            })
            .catch(error => {
              console.log('error', error);
            });
        })
    })

}
