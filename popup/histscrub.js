const HISTSCRUB_MAX_RESULTS=100000;

let scrubButton = document.getElementById("scrub-button");
let scrubProgress =  document.getElementById("scrub-progress");

scrubButton.addEventListener("click", function (e) {
  console.log("Scrubbing!!");

  var searcher = browser.history.search({
    text: "",
    startTime: 0,
    maxResults: HISTSCRUB_MAX_RESULTS
  });
  searcher.then(onHistoryRetrieved);

  e.preventDefault();
});

function onHistoryRetrieved(historyItems) {
  let oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  oneWeekAgo = oneWeekAgo.getTime();

  let oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  oneMonthAgo = oneMonthAgo.getTime();

  const historySize = historyItems.length;
  console.log("Found: "+historySize+" items");

  //Initialize progress bar
  scrubProgress.setAttribute("value", 1);

  let numScrubbed = 0;
  let scrubPromises = historyItems.map(function (histItem) {
    return new Promise(function (resolve, reject) {
      //Scrub the item if the last time it was accessed was more then one month ago
      // Or if has been visited only once and over a week ago
      if(histItem.lastVisitTime < oneMonthAgo
         || (histItem.lastVisitTime < oneWeekAgo && histItem.visitCount < 2)
      ) {
        scrubItem(histItem).then(resolve, reject);
        numScrubbed += 1;
      } else {
        resolve();
      }
    });
  });

  //TODO: Notify to re-run if historySize == HISTSCRUB_MAX_RESULTS
  Promise.all(scrubPromises).then(function () {
    scrubProgress.setAttribute("value", 0);
    alert("Done scrubbing");
    console.log("Scrubbed "+numScrubbed+" of "+ historySize+" items");
  }).catch(function (reson) {
    scrubProgress.setAttribute("value", 0);
    console.log("Failed to scrub history");
    console.dir(reason);
  })
}

function scrubItem(histItem) {
  console.log("Scrbbing: "+histItem.url);
  return browser.cookies.getAll({url: histItem.url}).then(function (cookies) {
    return Promise.all(cookies.map(function (cookie) {
      return browser.cookies.remove({
        url: histItem.url,
        name: cookie.name
      })
    }));
  }).then(function () {
    return browser.history.deleteUrl({url: histItem.url });
  });
}
