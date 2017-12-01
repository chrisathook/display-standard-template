function DynamicBootloader(callback) {
  function loadData() {
    dynamicAd.onready = callback;
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
  } else if (window.previewData) {
    loadData()
  } else {
    callback.call();
    return;
  }
  
}