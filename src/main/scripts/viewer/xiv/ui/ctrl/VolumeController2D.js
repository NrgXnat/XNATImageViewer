/**
 * @author sunilk@mokacreativellc.com (Sunil Kumar)
 */

// goog
goog.require('goog.object');

// xiv
goog.require('xiv.ui.ctrl.MasterController2D');
goog.require('xiv.ui.ctrl.RadioButtonController');



/**
 *
 * @constructor
 * @extends {xiv.ui.ctrl.MasterController2D}
 */
goog.provide('xiv.ui.ctrl.VolumeController2D');
xiv.ui.ctrl.VolumeController2D = function() {
    goog.base(this);
}
goog.inherits(xiv.ui.ctrl.VolumeController2D, xiv.ui.ctrl.MasterController2D);
goog.exportSymbol('xiv.ui.ctrl.VolumeController2D', 
		  xiv.ui.ctrl.VolumeController2D);


/**
 * @type {!string} 
 * @const
 * @expose
 */
xiv.ui.ctrl.VolumeController2D.ID_PREFIX =  'xiv.ui.ctrl.VolumeController2D';



/**
 * @enum {string}
 * @public
 */
xiv.ui.ctrl.VolumeController2D.CSS_SUFFIX = {};



/**
 * @inheritDoc
 */
xiv.ui.ctrl.VolumeController2D.prototype.add = function(xObj) {
    // Call superclass add
    goog.base(this, 'add', xObj);

    this.add_visibleRadio(xObj);
    this.add_labelMapToggle(xObj);
    this.add_windowMax(xObj);
}


/**
 * @param {!X.Object} xObj
 * @protected
 */
xiv.ui.ctrl.VolumeController2D.prototype.add_windowMax = function(xObj) {
    // create
    var windowMax = this.createController( 
	xiv.ui.ctrl.SliderController, 'Max', 
	function(e){
	    xObj.windowMax = e.value;
	});
    
    // set folder
    windowMax.setFolders([
	xiv.ui.ctrl.XtkController.getObjectCategory(xObj)]);

    // store
    //window.console.log("***********", windowMax);
    this.masterControllers.push(windowMax);

    // set defaults
    windowMax.getComponent().setMaximum(8000);
    windowMax.getComponent().setValue(xObj.windowMax);
}



/**
 * @private
 */
xiv.ui.ctrl.VolumeController2D.prototype.onMaxChange_ = 
function(e) {
    goog.array.forEach(this.subControllers, function(subC){
	if (subC.getLabel().innerHTML == 'Opacity') {
	    subC.getComponent().setValue(parseFloat(e.value));
	}
    })		   
}





/**
 * @param {!X.Object} xObj
 * @protected
 */
xiv.ui.ctrl.VolumeController2D.prototype.add_visibleRadio = function(xObj) {

    // create
    var visible = this.createController(
	xiv.ui.ctrl.RadioButtonController, 'Visible', 
	function(e){
	    
	});

    // set folder
    xiv.ui.ctrl.XtkController.setControllerFolders(xObj, visible);

    // strore
    this.subControllers.push(visible);

    // set defaults
    visible.getComponent().checked = xObj['isSelectedVolume'] || false;
    
}



/**
 * @param {!X.Object} xObj
 * @protected
 */
xiv.ui.ctrl.VolumeController2D.prototype.add_labelMapToggle = function(xObj) {

    // create
    var labelMapCheckBox = this.createController( 
	xiv.ui.ctrl.CheckboxController, 'Show Label Map', 
	function(e){
	    window.console.log(e);
	    xObj.labelmap.visible = e.checked;
	});

    // set folder
    xiv.ui.ctrl.XtkController.setControllerFolders(xObj, 
						   labelMapCheckBox);

    // store
    this.subControllers.push(labelMapCheckBox);

    // set defaults
    labelMapCheckBox.getComponent().setChecked(false);
}




/**
 * @param {!string} labelTitle;
 * @public
 */
xiv.ui.ctrl.VolumeController2D.prototype.disposeInternal = function() {
    goog.base(this, 'disposeInternal');
    
    window.console.log("need to implement dispose methods" + 
		       " for VolumeController2D");
}



