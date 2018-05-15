function DynamicBootloader(callback) {
  console.log('DynamicBootloader');
  function loadData() {
    console.log('loadData');
    dynamicAd.onready = function() { callback(true) };
    dynamicAd.init();
  }
  
  function loadPreview(rowNumber) {
    console.log("loadPreview");
    dataManager.onready = function () {
      console.log("loadPreview data loaded");
      window.previewData = dataManager.data[rowNumber - 1];
      loadData();
    };
    dataManager.init(sheetId, projectId);
  }
  
  if (downloadPreview) {
    loadPreview(previewNumber, loadData);
  } else if (window.previewData || window.dynamicContent) {
    loadData();
  } else {
    // throw 'Dynamics Engine Not Included, Proceed as standard';
    callback(false);
  }
  
}