function DynamicBootloader(callback) {
  console.log('DynamicBootloaderTest');
  function loadData() {
    console.log('loadData');
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
  } else if (window.previewData || window.dynamicContent) {
    loadData();
  } else {
    callback.call();
    return;
  }
  
}