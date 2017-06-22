var scrubButton = document.getElementById("scrub-button");

scrubButton.addEventListener("click", function (e) {
  console.log("Scrubbing!!");

  var searcher = browser.history.search({text: "", startTime: 0});
  searcher.then(onHistoryRetrieved);

  e.preventDefault();
});

function onHistoryRetrieved(historyItems) {
  console.log("Found: "+historyItems.length+" items");

}
