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
  scrubProgress.setAttribute("max", historySize);
  scrubProgress.setAttribute("value", 0);

  let numScrubbed = 0;
  historyItems.forEach(function (histItem, index) {
    //Assuming forEach executes items sequentially and in orderer
    scrubProgress.setAttribute("value", index);
    
    //Scrub the item if the last time it was accessed was more then one month ago
    // Or if has been visited only once and over a week ago
    if(histItem.lastVisitTime < oneMonthAgo
       || (histItem.lastVisitTime < oneWeekAgo && histItem.visitCount < 2)
    ) {
      scrubItem(histItem);
      numScrubbed += 1;
    }
  });

  //TODO: Notify to re-run if historySize == HISTSCRUB_MAX_RESULTS

  scrubProgress.setAttribute("value", 0);
  console.log("Done scrubbing");
  console.log("Scrubbed "+numScrubbed+" of "+ historySize+" items");
}

function scrubItem(histItem) {
  console.log("Scrbbing: "+histItem.url);
}
