document.getElementById('search-box').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        let country = document.getElementById("search-box").value;
        let url = `/newCovidData?country=${country}`;
        
        fetch(url).then(function (response) {
            response.json().then(function (data) {

                let totalCases = document.getElementById("total-number");
                totalCases.textContent = data.totalCases;

                let totalDeaths = document.getElementById("death-number");
                totalDeaths.textContent = data.totalDeaths;
            })
        });

        url = `/newCovidNews?country=${country}`;

        fetch(url).then(function (response) {
            response.json().then(function (data) {

                console.log(data);

                let newsHeader = document.getElementById("news-title");
                var list = document.createElement('ul');

                for (let object in data.newsArticles){
                    console.log(data.newsArticles[object].newsArticleTitle);
                    
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
