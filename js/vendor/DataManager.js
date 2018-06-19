function DataManager(config) {
	var sheetId;
	var projectId;
	var sheetServerURL = 'https://us-central1-hook-ad-hub.cloudfunctions.net/GetSheetData/';
	var projectServerURL = 'http://adhub.hookfilez.com/projects/';

	var sheetLoadUrl = '';
	var imageLoadUrl = '';

	var adData = null;

	var self = {
		get data(){return adData },
		onready: function(){}
	};

	self.loaded = false;



	self.init = function(sheetId, projectId) {
		console.log('init', sheetId, projectId, sheetId && projectId);
		if(sheetId && projectId){

			imageLoadUrl = projectServerURL + projectId + '/assets';
			sheetLoadUrl = sheetServerURL + '?sheetId=' + sheetId + '&tabName=Sheet1';

			loadJSON(sheetLoadUrl, start);
		}
	}

	function start(results) {
		console.log('results', results);
		self.loaded = true;
		var data = JSON.parse(results);

		var headers = [];

		for(var i in data[0]){
			var headerName = data[0][i];
			if(!headerName) break;
			console.log(headerName);
			headers.push(headerName);
			// for(var r = 1; r < data.length; r++){
				// if(data[r][header] == '') break;
				// cdata[headerName].push(data[r][header]);
			// }
		}

		window.headers = headers;

		adData = [];

		data.splice(0,1);

		for(var row in data) {

			var dataObj = {};
			
			for(var col in data[row]){

				var headerName = headers[col];
				var value = data[row][col];

				if(!headerName) break;

				// if(headerName.indexOf('*') > -1) { // This column has an asterisk, so we should use it for our label.
					// if(!dataObj.label) dataObj.label = row + ' ' + value;
					// else dataObj.label = dataObj.label + ' ' + value;
				// }

				// headerName = headerName.replace('*', ''); // get rid of the asterisk.





				if(value.indexOf('.jpg') > -1 || value.indexOf('.png') > -1 || value.indexOf('.gif') > -1 || value.indexOf('.svg') > -1) {
					if(value[0] != '/') value = '/' + value;
					value = imageLoadUrl + value;
				}

				dataObj[headerName] = value;
			}

			adData.push(dataObj);
		}

		window.adData = adData;

		self.onready();
	}

	function loadJSON(url, callback) {

	    var xobj = new XMLHttpRequest();
	    //xobj.overrideMimeType("application/json");
	    xobj.open('GET', url, true); // Replace 'my_data' with the path to your file
	    xobj.onreadystatechange = function() {
	        if (xobj.readyState == 4 && xobj.status == "200") {
	            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
	            callback(xobj.responseText);
	        } else {
	        	console.log('loadJSON err');
	        }
	    };
	    xobj.send(null);
	}

	function cleanArray(array, deleteValue){
		for (var i = 0; i < array.length; i++) {
			if (array[i] == deleteValue) {         
		  		array.splice(i, 1);
		  		i--;
			}
		}
		return array;
	}

	function checkDataLoaded( dataObject ) {
		if(numSheets-- == 1){
			self.onready();
		}
	}

	self.getSettings = function(){
		return settings;
	}

	self.getPreviewData = function(){
		return previewData;
	}

	self.getCSV = function() {
		var csv = generateCSV(exportData);
		return csv;
	}

	function loadData(dataObject, callback) {
		numSheets++;
		Papa.parse(dataObject.url, {
			download: true,
			complete: function( results ){
				console.log('data?', results);
				window.rawData = results.data;
				dataObject.raw = results;
				dataObject.data = getDataObject(results.data, dataObject.namesMap, dataObject.namesIndex);
				callback(dataObject);
			}
		});
	}

	function loadDataJSON(dataObject, callback) {
		numSheets++;
		loadJSON(dataObject.url, function( results ){
			window.rawData = results.data;
			dataObject.raw = JSON.parse(results);
			dataObject.data = getDataObject(dataObject.raw, dataObject.namesMap, dataObject.namesIndex);
			callback(dataObject);
		});
	}

	function loadCSV(file, callback) {

	    var xobj = new XMLHttpRequest();
	    //xobj.overrideMimeType("application/json");
	    xobj.open('GET', file, true); // Replace 'my_data' with the path to your file
	    xobj.onreadystatechange = function() {
	        if (xobj.readyState == 4 && xobj.status == "200") {
	            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
	            callback(xobj.responseText);
	        }
	    };
	    xobj.send(null);
	}

	function getDataObject( data, columnNamesMap, columnNameIndex ) {
		var columnNames = data[columnNameIndex];

		var newData = [];
		newDataObject = {};
		var columnNames = columnNamesMap;

		settings.ExportedColumns = ['Unique_ID', 'Reporting_Label']; // default columns populated programmatically

		for(var iRow = columnNameIndex; iRow < data.length; iRow++) {

			var rowObject = {};
			var rowData = data[iRow];

			rowObject.Reporting_Label = { value: '', type:'text' };

			for(var iCol in rowData) {
				// get 
			}
			var colNum = 0;
			for(var iCol in rowData) {
				var colData = rowData[iCol];
				var colType = settings.ExportType[iCol];
				var colName = settings.ExportNames[iCol];
				var colLabelNumber = settings.AddToLabel[iCol];
				try {
					var colDoExport = settings.ExportToDC[iCol].length != 0;

					var doExport = colDoExport && colName != '' && colName;
					var hasLabelNumber = colLabelNumber && colName != '' && colName;

					//if(doExport || hasLabelNumber) {
						rowObject[colName] = { 
							value: colData,
							id:colNum,
							type: colType,
							labelNumber: colLabelNumber
						};
					//}

				} catch(e) {
					//console.log(e);
				}
				colNum++;
			}
			newData.push(rowObject);
		}

		for(var i = 0; i < settings.ColumnNames.length ; i++) {
			var colDoExport = settings.ExportToDC[i].length != 0;
			var colName = settings.ExportNames[i];
			if(colDoExport) {
				settings.ExportedColumns.push(colName);
			}
		}

		function getColumnType(columnName) {
			for(var i in settings.ColumnNames) {
				var type = settings.ExportType[i];
				var name = settings.ColumnNames[i];
				if(name == columnName){
					return type;
				}
			}
		}

		previewDataTransform(newData);
		exportDataTransform(newData);
		
	}

	function previewDataTransform( newData ) {
		// get preview data

		previewData = [];

		for(var iRow in newData) {
			var rowObject = newData[iRow];
			var sizes = [];

			for(var iCol in rowObject) {
				// get sizes
				var colData = rowObject[iCol].value;
				var colType = rowObject[iCol].type;

				if(colType.indexOf('sizes') != -1) {
					sizes = colData.split('\n');
				}
			}

			for(var iSize = 0; iSize < sizes.length; iSize++) {
				var rowData = {}
				var sizeName = sizes[iSize];

				rowData['Creative_Dimension'] = sizeName;

				var labelArray = new Array(100);

				for(var columnName in rowObject) {
					
					var colValue = rowObject[columnName].value;
					var colType = rowObject[columnName].type;
					var colLabelNumber = Number(rowObject[columnName].labelNumber)-1;

					labelArray[colLabelNumber] = colValue;

					if(colType.indexOf('perSize') != -1) {
						colValue = colValue.split('\n')[iSize];
					}

					if(colType.indexOf('url') != -1) {
						rowData[columnName] = { Url: colValue };
					}

					if(colType.indexOf('image') != -1) {
						rowData[columnName] = { 
							Type: 'file',
							Url: imageFolderDC+colValue 
						};
					}

					if(colType.indexOf('text') != -1) {
						rowData[columnName] = colValue;
					}

				}

				labelString = cleanArray(labelArray).join('_');

				rowData['Reporting_Label'] = removeTags(labelString);
				
				previewData.push(rowData);
			}
		}
	}

	function exportDataTransform( newData ) {
		// get export data

		exportData = [];
		var rowId = 0;
		allSites = [];

		var duplicatorData = {};

		for(var iRow in newData) {
			var rowObject = newData[iRow];
			var sizes = [];

			for(var iCol in rowObject) {
				// get sizes
				// console.log('site col num', colId);
				var colData = rowObject[iCol].value;
				var colType = rowObject[iCol].type;
				var colId = rowObject[iCol].id;

				if(colType.indexOf('sizes') != -1) {
					sizes = colData.split('\n');
					delete rowObject[iCol];
				}
				if(colType.indexOf('site') != -1) {
					// console.log('site col num', colId);
					allSiteNames.push(colData);
				}
			}

			for(var iSize = 0; iSize < sizes.length; iSize++) {
				var rowData = {};
				var sizeName = sizes[iSize];

				rowData['Creative_Dimension'] = sizeName;
				rowData['Unique_ID'] = rowId++;

				var labelArray = new Array(100);

				var duplicators = [];

				for(var columnName in rowObject) {
					
					var colValue = rowObject[columnName].value;
					var colType = rowObject[columnName].type;
					var colLabelNumber = Number(rowObject[columnName].labelNumber)-1;

					labelArray[colLabelNumber] = colValue;

					if(colType.indexOf('perSize') != -1) {
						colValue = colValue.split('\n')[iSize];
					}

					if(colType.indexOf('image') != -1) {
						colValue = imageFolderDRM + colValue;
					}

					if(colType.indexOf('duplicator') != -1) {
						console.log('duplicator colType', colType);

						var exp = /duplicator\((.*)\)/;
						var args = JSON.parse('['+exp.exec(colType)[1]+']'); // convert function statement with arguements to array of arguments. duplicator(['a','b'],['c','d']) into [['a','b'],['c','d']]
						var mergers = [];
						console.log('    dupe args', args);
						// get merge column values
						for(var a in args){
							var sourceColumnName = args[a];
							
							var value = rowObject[sourceColumnName].value;
							var type = rowObject[sourceColumnName].type;

							var targetColumnName = JSON.parse(/replace\((.*)\)/.exec(type)[1]);

							if(type.indexOf('perSize') != -1) {
								value = value.split('\n')[iSize];
							}

							console.log('\nsourceColumnName',sourceColumnName,'\ntargetColumnName',targetColumnName,'\nvalue',value,'\ntype',type);
							mergers.push({
								target: targetColumnName,
								value: value
							});
						}

						duplicators.push({
							args: args,
							name: colValue,
							mergers: mergers
						});
					}

					rowData[columnName] = colValue;

				}

				labelString = cleanArray(labelArray).filter(function (val) {return val;}).join('_');

				rowData['Reporting_Label'] = removeTags(labelString);
				
				exportData.push(rowData);

				for(var d in duplicators) {

					var dupe = duplicators[d];
					var dupeData = JSON.parse(JSON.stringify(rowData));
					for(var m in dupe.mergers){
						var merger = dupe.mergers[m]
						//console.log('targetColumnName',targetColumnName,'sourceColumnName',sourceColumnName);
						dupeData[merger.target] = merger.value;
						console.log('merging', merger.value, 'into', merger.target);
					}

					dupeData['Reporting_Label'] = dupe.name + '_' + dupeData['Reporting_Label'];

					console.log(dupeData);

					
					if(duplicatorData.hasOwnProperty(dupe.name) == false){
						duplicatorData[dupe.name] = [];
					}
					duplicatorData[dupe.name].push(dupeData);

				}
			}
		}
		for(var dupeName in duplicatorData){
			var dupeData = duplicatorData[dupeName];
			for(var d in dupeData){
				dupeData[d]['Unique_ID'] = rowId++;
				exportData.push(dupeData[d]);
			}
		}
	} 

	function generateSiteRows(data) {
		var newData = [];
		data = JSON.parse(JSON.stringify(data));

		var numDefaultRows = 0;

		for(var row in allSiteNames) { // use this when using SITE COLUMNS
			var site = sitesData.data;
			var siteName = allSiteNames[row];

			for(var i in data) {
				var dataObject = JSON.parse(JSON.stringify(data[i])); // clone data to avoid modifying source data
				var utm = dataObject.meta.siteData[siteName].utm;
				var id = dataObject.meta.siteData[siteName].id;

				if(id.toLowerCase().indexOf('none') > -1) {
					id = '';
				}

				dataObject.Reporting_Label = siteName+'_'+dataObject.Reporting_Label;
				dataObject.Unique_ID = newData.length;
				dataObject.Exit_URL += '?' + utm;
				dataObject.DCM_Ad_ID = id;
				if(id.toLowerCase().indexOf('skip') == -1) { 
					newData.push(dataObject); 
				}

			}

		}

		return newData;

	}

	function checkImages (callback) {

		var convertedData = exportData;
		window.convertedData = convertedData;
		loadJSON( imagesListUrl, function( results ) {

			var driveFileNames = [];
			var data = JSON.parse(results);
			window.images = data;
		
			for(var row in data) {
				var rowObject = data[row];
				driveFileNames.push(rowObject.name);
			}

			driveFileNames = getUniqueArray(driveFileNames);
			
			var dataFileNames = [];

			for(var row in convertedData) {
				var rowObject = convertedData[row];
				for(var col in rowObject){
					var colObject = rowObject[col];
					console.log('colObject', colObject);
					if(colObject) {
					if(colObject.indexOf) {
					if(colObject.indexOf('.png') > -1 || colObject.indexOf('.gif') > -1 || colObject.indexOf('.jpg') > -1) {
						// console.log('url', colObject.Url);
						dataFileNames.push( getFileNameFromPath( colObject ) );	
					}}}
				}
			}

			dataFileNames = getUniqueArray(dataFileNames);

			window.dataFileNames = dataFileNames;
			window.driveFileNames = driveFileNames;

			var matchedFiles = intersectArrays(driveFileNames, dataFileNames);
			var missing = [];

			for(var d in dataFileNames) {
				var dataName = dataFileNames[d]
				var found = false;

				for(var m in matchedFiles) {
					var matchedName = matchedFiles[m];
					if(matchedName == dataName) {
						found = true;
						////console.log('found');
						break;
					}
				}

				if(found == false) missing.push(dataName);	

			}

			callback( {missing: missing, unused: null } );

		} );
	}

	function getFileNameFromPath( path ) {
		var paths = path.split(settings.DRMFolder);

		return paths[paths.length-1];
	}

	self.checkImages = checkImages;

	function generateCSV(data) {
		
		data = exportData;
		var delimiter = '	';
		var columnOrder = settings.ExportedColumns;
		var csvString = '';

		var sites = [];
		
		// generate top header label row
		
		for(var i in columnOrder) {
			csvString += columnOrder[i] + delimiter;
		}

		var sites = [];

		for(var row in data) {
			var rowData = data[row];
			for(var col in rowData) {
				var colData = rowData[col];

			}
		}

		csvString += '\n';

		// generate the rest
		
		for(var row in data) {
			var rowString = '';
			var rowData = data[row];

			for(var k in columnOrder) {

				var key = columnOrder[k];
				rowString += rowData[key] + delimiter;

			}

			csvString += rowString + '\n';
		}

		//fs.writeFileSync(filePath + '.new.csv', csvString);

		return csvString;
	}

	function cleanData(data){

		var newData = [];
		for(var r in data) {
			var rowObject = data[r];

			var image1Missing = rowObject.Product_Image_1.indexOf('undefined') > 0;
			var image2Missing = rowObject.Product_Image_2.indexOf('undefined') > 0;
			var image3Missing = rowObject.Product_Image_3.indexOf('undefined') > 0;
			var image4Missing = rowObject.Product_Image_4.indexOf('undefined') > 0;

			var brokenImages = false;

			if(image1Missing || image2Missing || image3Missing || image4Missing ) {
				brokenImages = true;
			}

			if(brokenImages == false) { 
				newData.push(rowObject); 
			}
		}

		return newData;
	}

	function findKeyInArray(key, array) {
	  // The variable results needs var in this case (without 'var' a global variable is created)
	  var results = [];
	  for (var i = 0; i < array.length; i++) {
	    if (array[i].indexOf(key) == 0) {
	      return(array[i]);
	    }
	  }
	}

	

	function getUniqueArray(a) {
	    var prims = {"boolean":{}, "number":{}, "string":{}}, objs = [];

	    return a.filter(function(item) {
	        var type = typeof item;
	        if(type in prims)
	            return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
	        else
	            return objs.indexOf(item) >= 0 ? false : objs.push(item);
	    });
	}

	function intersectArrays(a, b) {
	    var sorted_a = a.concat().sort();
	    var sorted_b = b.concat().sort();
	    var common = [];
	    var a_i = 0;
	    var b_i = 0;

	    while (a_i < a.length
	           && b_i < b.length)
	    {
	        if (sorted_a[a_i] === sorted_b[b_i]) {
	            common.push(sorted_a[a_i]);
	            a_i++;
	            b_i++;
	        }
	        else if(sorted_a[a_i] < sorted_b[b_i]) {
	            a_i++;
	        }
	        else {
	            b_i++;
	        }
	    }
	    return common;
	}

	function removeTags(string){
		return string.replace(/(<([^>]+)>)/ig, "");
	}

	return self;

}