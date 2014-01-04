/**
 * @author sunilk@mokacreativellc.com (Sunil Kumar)
 * @author herrickr@mir.wustl.edu (Rick Herrick)
 */


/**
 * Google closure indcludes
 */
goog.require('goog.events');
goog.require('goog.string');
goog.require('goog.net.XhrIo');
goog.require('goog.dom.xml');
goog.require('goog.array');


/**
 * utils indcludes
 */
goog.require('utils.dom');
goog.require('utils.array');




/**
 * utils.xnat is the class that handles communication with the XNAT 
 * server.  It uses RESTful calls to acquire JSON objects that are
 * parsed to construct Thumbnails, which contain information regarding
 * image sets that can be loaded into a ViewBox.  utils.xnat makes use of 
 * several Google Closure libraries to communicate with the XNAT server, 
 * especially goog.net.XhrIo and goog.dom.xml.
 *
 * @constructor
 */
goog.provide("utils.xnat");
utils.xnat = function() {}
goog.exportSymbol('utils.xnat', utils.xnat)



/**
 * @constructor
 * @dict
 */
goog.provide("utils.xnat.properties");
utils.xnat.properties = function(){ 
    this['category'] =  'dicom';
    this['files'] = ['testfile.text'];
    this['thumbnailUrl'] = 'image.jpeg';
    this['sessionInfo'] = /**@dict*/ {
        "SessionID": {'label': "Session ID", 'value': ['EMPTY EXPT']},
        "Accession #": {'label':"Accession #", 'value': ['Empty Accession']},
        "Scanner" : {'label':"Scanner", 'value': ["SIEMENS Sonata"]},
        "Format" : {'label':"Format", 'value': ["DICOM"]},
        "Age" : {'label':"Age", 'value': ["--"]},
        "Gender": {'label':"Gender", 'value': ["--"]},
        "Handedness": {'label':"Handedness", 'value': ["--"]},
        "AcqDate" : {'label':"Acq.Date", 'value': ["09-14-2007"]},
        "Scan" : {'label':"Scan", 'value': ['Empty Scan']},
        "type" : {'label':"type", 'value': ["MPRAGE"]}
    }
    
};
goog.exportSymbol('utils.xnat.properties', utils.xnat.properties);




/**
 * @const {string}
 * @public
 */
utils.xnat.JPEG_CONVERT_SUFFIX = '?format=image/jpeg';





/**
 * Enum for tri-state values.
 * @enum {string}
 * @public
 */
utils.xnat.folderAbbrev = {
    projects: 'proj',
    subjects: 'subj',
    experiments: 'expt',
    scans: 'scans'
};



goog.exportSymbol('utils.xnat.folderAbbrev', utils.xnat.folderAbbrev);





/**
 * Queries a server for a JSON formatted object
 * for processing in the 'callback' argument.  Utilizes the
 * Google closure library 'XhrIo' to handle communication with
 * the XNAT server.
 *
 * @param {!string} url
 * @param {!function} callback
 * @public
 */
utils.xnat.jsonGet = function(url, callback){
    //utils.dom.debug("utils.xnat - jsonGet: ", url);



    //------------------
    // Construct the url to give a json formatted object
    // in its response.
    //------------------
    var queryChar = (url.indexOf('?') > -1) ? '&' : '?';
    var queryUrl = url + queryChar + "format=json";



    //------------------
    // Send the URL to server, run callback on the resonse
    // object.
    //------------------
    goog.net.XhrIo.send(queryUrl, function(e) {
	var xhr = e.target;
	var obj = xhr.getResponseJson();
	callback(obj['ResultSet']['Result'])
    });
}




/**
 * Queries a server using a generic 'GET' call. 
 * Sends the response object into the 'callback'
 * argument.
 *
 * @param {!string, !function}
 * @expose
 */
utils.xnat.get = function(url, callback){
    //utils.dom.debug("utils.xnat - get: ", url);
    goog.net.XhrIo.send(url, function(e) {
	var xhr = e.target;
	var obj = xhr;
	callback(obj)
    });
}




/**
 * Splits a url at the 'splitString' argument, then
 * returns an object with the split result.  If it cannot be
 * split, returns the entire url and the string.
 *
 * @param {!string, !string} 
 * @return {Object.<string,string>}
 * @expose
 */
utils.xnat.splitUrl = function(url, splitString){

    //------------------
    // Split the string accordingly.
    //------------------
    var splitInd = url.indexOf(splitString);
    if (splitInd > -1) {
	return {
	    'before': url.substring(0, splitInd), 
	    'splitter': splitString, 
	    'after': url.substring(splitInd + splitString.length, url.length)
	}



    //------------------
    // Otherwise return the entire url and splitString.
    //------------------
    } else {
	return {
	    'before': url, 
	    'splitter': splitString, 
	}    
    }
}




/**
 * Constructs an XNAT Uri stopping at the desired 'level'.
 * Calls on the internal 'getPathObject' method to split
 * the uri into it's various level components.  From then, it builds
 * the return string.
 *
 * @param {!string} url
 * @param {!string} level
 * @return {string}
 * @public
 */
utils.xnat.getXnatPathByLevel = function(url, level){
    
    //------------------
    // Splits the url into its various level components.
    //------------------
    var pathObj = utils.xnat.getPathObject(url)



    //------------------
    // Construct the new URL, stopping at the given 'level'
    //------------------
    if (pathObj[level]) {
	var returnString = pathObj['prefix'];
	
	if (pathObj['projects']){
	    returnString += "projects/" + pathObj['projects'];
	}

	if (pathObj['subjects']){
	    returnString += "/subjects/" + pathObj['subjects'];
	}

	if (pathObj['experiments']){
	    returnString += "/experiments/" + pathObj['experiments'];
	}

	if (pathObj['scans']){
	    returnString += "scans/" + pathObj['scans'];
	}
	else if (pathObj['resources']){
	    returnString += "resources/" + pathObj['resources'];
	}

	if (pathObj['files']){
	    returnString += "/files/" + pathObj['files'];
	}

	return returnString;
    }
    else {
	throw new Error("utils.xnat - getXnatPathByLevel: No folder specified at the '" + level + "' level.")
    }
}






/**
 * Split's the 'url' argument into various XNAT level
 * folders.
 *
 * @param {!string} url
 * @return {string}
 * @expose
 */
utils.xnat.getPathObject = function(url){
    var pathObj =  {
	'prefix': "",
	'projects':undefined,
	'subjects':undefined,
	'experiments':undefined,
	'scans':undefined,
	'resources':undefined,
	'files':undefined,
    }



    //------------------
    // Split the url at the '/' chars.  Loop through
    // the split array..
    //------------------
    var splitter = url.split("/");
    var len = splitter.length;
    for (var i=0; i<len; i++){
	if (pathObj.hasOwnProperty(splitter[i]) && splitter[i+1]) {
	    

	    //
	    // The 'prefix' string -- usually the server name
	    // and the 'data/archive/' or 'xnat/' prefix. 
	    //
	    if (splitter[i] === 'projects' &&  i != 0){
		var j = 0;
		while (j < i){
		    pathObj['prefix'] += splitter[j] + "/";
		    j++;
		}
	    }


	    //
	    // Construct key-value pair.  Key is the XNAT level
	    // value is the folder.
	    //
	    pathObj[splitter[i]] = splitter[i+1];
	    i++;
	}
    }

    return pathObj;
}




/**
 * Acquires the viewables within a given XNAT URL.  The
 * URL must be at least at the 'experiments' level and the
 * 'viewableType' argument specifies whether to retrieve 
 * 'scans' viewables or 'slicer' viewables.  The 'callback' 
 * argument is passed into the specific methods for retrieving
 * the viewables.
 *
 * @param {!string, !string, function=}
 * @expose
 */
utils.xnat.getViewables = function(url, viewableType, callback){

    var that = this;
    var queryUrl = utils.xnat.getXnatPathByLevel(url, 'experiments');

    switch(viewableType.toLowerCase())
    {
    case 'scans':
	utils.xnat.getScans(queryUrl, callback);
	break;
    case 'slicer':
	utils.xnat.getSlicer(queryUrl, callback);
	break;
    }  
}




/**
 * Function for sorting scan objects.
 *
 * @param {!Object.<String, String | Object.<String, String | Object>} a First scan object to compare. 
 * @param {!Object.<String, String | Object.<String, String | Object>} b Second scan object to compare. 
 */
utils.xnat.compareScan = function(a,b) {
    if (a['sessionInfo']['Scan']['value'][0].toLowerCase() < b['sessionInfo']['Scan']['value'][0].toLowerCase())
	return -1;
    if (a['sessionInfo']['Scan']['value'][0].toLowerCase() > b['sessionInfo']['Scan']['value'][0].toLowerCase())
	return 1;
    return 0;
}




/**
 * Function for sorting the slicer objects.
 *
 * @param {!Object.<String, String | Object.<String, String | Object>} a First scan object to compare. 
 * @param {!Object.<String, String | Object.<String, String | Object>} b Second scan object to compare. 
 */
utils.xnat.compareSlicer = function(a,b) {
    if (a['Name'][0].toLowerCase() < b['Name'][0].toLowerCase())
	return -1;
    if (a['Name'][0].toLowerCase() > b['Name'][0].toLowerCase())
	return 1;
    return 0;
}




/**
 * Inventories the 'scans' within a given XNAT URI to 
 * construct an object that can be described as a 'viewable'
 * which is key-value structure pointing to various data and
 * meatadata of a given 'scan' for loading into the 'Displayer'
 * object. 
 *
 * @param {!string} url The XNAT url where to get the scan JSON from.
 * @param {!function} callback The callback to run once the scan JSON is gotten.
 */
utils.xnat.getScans = function (url, callback){

    var that = this;
    var viewableFolder = 'scans';
    var queryFolder = url + "/" + viewableFolder;
    var pathObj = utils.xnat.getPathObject(url);
    var gottenScans = 0;
    var propertiesCollection = [];
    var fileQueryUrl = '';
    var scanFileArr = [];
    var scanProperties;
    var imgInd = 0;
    var thumbImg = '';


    utils.dom.debug('utils.xnat.getScans: Sending simple request for ['+ queryFolder + ']');

    

    //--------------------
    // Loop through all the scans within a given
    // experiment.
    //--------------------
    utils.xnat.jsonGet(queryFolder, function(scanJson){
	goog.array.forEach(scanJson, function(scans){


	    //
	    // Construct a fileQueryUrl for every scan folder.
	    //
	    fileQueryUrl = url + "/" + viewableFolder + "/" + scans['ID'] + "/files";


	    //
	    // Loop through fileList within the 'scans' folder.
	    //
	    utils.xnat.jsonGet(fileQueryUrl, function(fileList){


		//
		// Add file URIs to array.
		//
		scanFileArr = [];
		goog.array.forEach(fileList, function(fileObj){

		    // NOTE: This is critical because the paths
		    // returned in the json may not always be the necessary 
		    // query paths.
		    // This joins the 'experiments' portion of both paths
		    scanFileArr.push((queryFolder.split('experiments/')[0] + 
				      'experiments' + 
				      fileObj['URI'].split('experiments')[1]));
		});
		
		
		//
		// Populate medatadata object pertaining to
		// the scan. See keys below...
		//
		scanProperties = new utils.xnat.properties();
		for (key in pathObj){
		    if (pathObj[key] !== 'undefined'){
			scanProperties['sessionInfo'][key] = pathObj[key]; 
		    }
		}
		scanProperties['files'] = scanFileArr;
		scanProperties['sessionInfo']['SessionID']['value'] = [pathObj['experiments']];
		scanProperties['sessionInfo']['Accession #']['value'] = [pathObj['projects']];
		scanProperties['sessionInfo']['Scan']['value'] =  [scans['ID']];
				

		//
		// Select the image in the middle of the list to 
		// serve as the thumbnail after sorting the fileURIs
		// using natural sort.
		//
		scanFileArr = scanFileArr.sort(utils.array.naturalCompare);
		imgInd = Math.floor((scanFileArr.length) / 2);
		thumbImg = scanFileArr[imgInd];


		//
		// Define the thumbnailImage URI
		//
		scanProperties['thumbnailUrl'] = goog.string.endsWith(thumbImg , 
								utils.xnat.JPEG_CONVERT_SUFFIX) ? 
		    thumbImg : thumbImg + utils.xnat.JPEG_CONVERT_SUFFIX;


		//
		// Add to collection
		//
		propertiesCollection.push(scanProperties);
		gottenScans++;


		//
		// SORT THUMBNAILS BY NAME (NATURAL SORT)
		//
		// Sort all scanPropertiess once they're collected
		// before sending back, then run the callback.
		//
		if (gottenScans === scanJson.length){
		    propertiesCollection = utils.xnat.sortPropertiesCollection(propertiesCollection, ['sessionInfo', 'Scan', 'value', 0]);
		    goog.array.forEach(propertiesCollection, function(scanProperties){
			callback(scanProperties);
		    })
		}
	    })	
	})
    })
}




/**
 * Inventories the 'resources/Slicer/files' folder within a given XNAT URI to 
 * construct an object that can be described as a 'viewable'
 * which is key-value structure pointing to various data and
 * meatadata of a given Slicer file (.mrb) for loading into the 'Displayer'
 * object. 
 *
 * @param {!string}
 * @param {!string, !function}
 */
utils.xnat.getSlicer = function (url, callback){

    var that = this;
    var viewableFolder = 'Slicer';
    var queryFolder = url + "/resources/" + viewableFolder + "/files";
    var pathObj = utils.xnat.getPathObject(url);
    var readableFiles = ['.mrml', '.nrrd']; 
    var propertiesCollection = [];
    var slicerProperties;
    var gottenSlicerFiles = 0;
    var viewableSlicerPackageFiles = [];
    var slicerThumb = ''; 

    var fileQueryStr = '';

    var imageArr = ['jpeg', 'jpg', 'png', 'gif'];
    var imageFound = false;
    var ext = '';

    utils.dom.debug('utils.xnat.getSlicer: Sending simple request for ['+ queryFolder + ']');



    //--------------------
    // Loop through the contents of the 'Slicer' query
    // folder.
    //--------------------
    utils.xnat.jsonGet(queryFolder, function(slicerJson){
	//utils.dom.debug('XNAT IO 480: ' + obj)
	goog.array.forEach(slicerJson, function(viewableFile){
	    viewableSlicerPackageFiles = [];
	    slicerThumb = ""; 
	    fileQueryStr = queryFolder + "/" + viewableFile['Name'];


	    //
	    // Loop through all of the .mrb files.
	    //
	    utils.xnat.jsonGet(fileQueryStr + "?listContents=true", function(response){


		//
		// Get the .mrb contents to determine what of it can 
		// be viewed.  This is done through the 'listContents' suffix
		// when communicating with an XNAT server.
		//
		//utils.dom.debug('XNAT IO 392: ' + fileQueryStr + "?listContents=true");
		goog.array.forEach(response, function(r) {

		    //
		    // Only consider contents files that actually refer to a file,
		    // so that it can be loaded into the viewer (Sometimes these contents
		    // do not refer to a file).
		    //
		    if (r['File Name'][r['File Name'].length-1] != '/') {
			if (r['File Name'].indexOf('__MACOSX') == -1) {
			    viewableSlicerPackageFiles.push(fileQueryStr + "!" + r['File Name']);
			}
		    }   

		})


		//
		// Populate medatadata object.  See keys
		// below for specificity.
		//
		slicerProperties = new utils.xnat.properties();
		for (key in viewableFile){
		    slicerProperties[key] = viewableFile[key];
		}
		for (key in pathObj){
		    if (pathObj[key] !== 'undefined'){
			slicerProperties['sessionInfo'][key] = pathObj[key]; 
		    }
		}
		slicerProperties['files'] = viewableSlicerPackageFiles;
		slicerProperties['category'] = 'Slicer';
		slicerProperties['sessionInfo']['SessionID']['value'] = [pathObj['experiments']];
		slicerProperties['sessionInfo']['Format']['value'] = ['.mrb'];
		slicerProperties['sessionInfo']['Accession #']['value'] = [pathObj['projects']];


		//
		// Get thumbnailImage by looking through files
		// to determine what can be used for the thumbnail representation.
		// (Slicer usually packages a screenshot).
		// Select the first one.
		//
		imageFound = false;
		goog.array.forEach(slicerProperties['files'], function(fileName){
		    ext = utils.string.getFileExtension(fileName);
		    goog.array.forEach(imageArr, function(imageType){
			if (ext === imageType && !imageFound){
			    slicerProperties['thumbnailUrl'] = fileName; 
			    imageFound = true;
			}
		    })
		})
	

		propertiesCollection.push(slicerProperties);
		gottenSlicerFiles++;



		//
		// Sort all viewables once they're collected
		// before sending back, then run the callback.
		//
		if (gottenSlicerFiles === slicerJson.length){
		    propertiesCollection = utils.xnat.sortPropertiesCollection(propertiesCollection, ['Name']);
		    goog.array.forEach(propertiesCollection, function(slicerProperties){
			callback(slicerProperties);
		    })
		}
	    });

	})		
    })
}




/**
 * Sorts the viewable collection, which is an array of XNAT derived JSONS
 * customized (added to) for the purposes of the Image viewer.
 *
 * @param {!Array.<Object>} propertiesCollection the collection to sort. 
 * @param {!Array.<String>} keyDepthArr The key depth array indicating the sorting criteria.
 * @public
 */
utils.xnat.sortPropertiesCollection = function (propertiesCollection, keyDepthArr){

    var sorterKeys = [];
    var sorterObj = {};
    var sortedViewableCollection = [];
    var sorterKey = {};

    //
    // Update sorting data types.
    //
    goog.array.forEach(propertiesCollection, function(viewable){
	sorterKey = viewable;
	goog.array.forEach(keyDepthArr, function(key){
	    sorterKey = sorterKey[key];
	})
	sorterKey = sorterKey.toLowerCase();
	sorterKeys.push(sorterKey);
	sorterObj[sorterKey] = viewable;
    })

    //
    // Natural sort sorterKeys.
    //
    sorterKeys = sorterKeys.sort(utils.array.naturalCompare);
    //goog.array.sort(sorterKeys);


    //
    // Construct and return the sorted collection.
    //
    goog.array.forEach(sorterKeys, function(sorterKey){
	sortedViewableCollection.push(sorterObj[sorterKey]);
    })
    return sortedViewableCollection;
}