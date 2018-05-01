const rp = require('request-promise');
const cheerio = require('cheerio');

// Request HTML body to The URL (http://shirts4mike.com/shirts.php)
  // Used npm module request-promise for requesting
  // cheerio makes jQuery available in Node.js

const shirtsLink = [];
const shirtsInfo = [];

// scrapeShirtsLink() scrapes html from 'http://shirts4mike.com/shirts.php' and get links to each shirt item.
const scrapeShirtsLink = async () => {
  await rp('http://shirts4mike.com/shirts.php')
    .then((html) => {
      let $ = cheerio.load(html);
      $('ul.products a').each((i, link) => {
        shirtsLink[i] = `http://shirts4mike.com/${$(link).attr("href")}`;
      });
      console.log(shirtsLink);
    })
}

// scrapeShirtsInfo() scrapes html from each shirt item link and get each shirt info: Title, Price, ImageURL.
  // Also, it saves shirt-URL and the current time into shirtsInfo-array with scraped shirt-infos.
const scrapeShirtsInfo = async () => {
  let shirtsHtml = await Promise.all(shirtsLink.map(link => rp(link)));
  let date = new Date().toISOString().slice(0,10);
  let time = new Date().toString().slice(16);
  shirtsHtml.forEach((shirtHtml, i) => {
    let $ = cheerio.load(shirtHtml);
    let shirtInfo = {
      title: $('.shirt-details h1').text().substr(4),
      price: $('.price').text(),
      imageUrl: `http://shirts4mike.com/${$('img').attr('src')}`,
      url: shirtsLink[i],
      date: `${date} ${time}`
    }
    shirtsInfo.push(shirtInfo);
  });
  console.log(shirtsInfo);
}

// Because of ES2017 async and await features, it is possible to use .then() method.
scrapeShirtsLink()
  .then(scrapeShirtsInfo)
  .catch((err) => {
    console.log(err);
  });


// Save the Data into a CSV file
  // The CSV file must be named for the date it was created, e.g. 2016-11-21.csv.
  // The Order of CSV file column headers are Title, Price, ImageURL, URL, and Time.
  // The CSV file should be saved inside the ‘data’ folder.
