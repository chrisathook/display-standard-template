function DynamicBootloader(callback) {
  function loadData() {
    dynamicAd.onready = callback.call();
    dynamicAd.init();
  }
  
  function loadPreview(rowNumber, callback) {
    console.log("loadPreview");
    dataManager.onready = function () {
      console.log("loadPreview data loaded");
      window.previewData = dataManager.data[rowNumber - 1];
      loadData();
    };
    dataManager.init(sheetId, projectId);
  }
  
  if (sheetId === '' || projectId === '') {
    callback.call();
    return
  }
  if (downloadPreview) {
    loadPreview(previewNumber, loadData);
  } else if (window.previewData) {
    loadData()
  } else {
    callback.call()
  }
}