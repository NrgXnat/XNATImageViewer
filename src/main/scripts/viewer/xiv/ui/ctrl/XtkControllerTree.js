/**
 * @author sunilk@mokacreativellc.com (Sunil Kumar)
 */

// goog
goog.require('goog.object');

// nrg
goog.require('nrg.ui.Component');

// xtk
goog.require('X.volume');
goog.require('X.mesh');
goog.require('X.sphere');


// xiv
goog.require('xiv.ui.ctrl.LevelsController');
goog.require('xiv.ui.ctrl.VolumeController2D');
goog.require('xiv.ui.ctrl.VolumeController3D');
goog.require('xiv.ui.ctrl.MeshController3D');
goog.require('xiv.ui.ctrl.AnnotationsController3D');



/**
 *
 * @constructor
 * @extends {nrg.ui.Component}
 */
goog.provide('xiv.ui.ctrl.XtkControllerTree');
xiv.ui.ctrl.XtkControllerTree = function() {
    goog.base(this);

    var propObj = this.constructor.getEmptyPropertiesObject();
    goog.object.forEach(propObj, function(property, key){
	this[key] = null;
    })
}
goog.inherits(xiv.ui.ctrl.XtkControllerTree, nrg.ui.Component);
goog.exportSymbol('xiv.ui.ctrl.XtkControllerTree', 
		  xiv.ui.ctrl.XtkControllerTree);


/**
 * @param {?Array.<xiv.ui.ctrl.XtkController>} c2d
 * @param {?Array.<xiv.ui.ctrl.XtkController>} c3d
 * @param {?Array.<xiv.ui.ctrl.XtkController>} opt_all
 * @constructor
 * @dict
 */
goog.provide('xiv.ui.ctrl.XtkControllerTree.ControlSet');
xiv.ui.ctrl.XtkControllerTree.ControlSet = function(c2d, c3d, opt_all){
    this['2D']  =  c2d;
    this['3D']  =  c3d;
    this['all'] =  goog.isDefAndNotNull(opt_all) ? opt_all : null;
}
goog.exportSymbol('xiv.ui.ctrl.XtkControllerTree.ControlSet', 
		  xiv.ui.ctrl.XtkControllerTree.ControlSet);



/**
 * @type {!string} 
 * @const
 * @expose
 */
xiv.ui.ctrl.XtkControllerTree.ID_PREFIX =  'xiv.ui.ctrl.XtkControllerTree';



/**
 * @enum {string}
 * @public
 */
xiv.ui.ctrl.XtkControllerTree.CSS_SUFFIX = {};



/**
 * @public
 * @return {Object}
 */
xiv.ui.ctrl.XtkControllerTree.getEmptyPropertiesObject = 
function(){
    return {
	'volumes': null,
	'annotations': null,
	'meshes': null,
	'levels': null
    }
}



/**
 * @type {xiv.ui.ctrl.LevelsController}
 * @private
 */
xiv.ui.ctrl.XtkControllerTree.prototype.LevelsController_;



/**
 * @type {xiv.ui.ctrl.VolumeController2D}
 * @private
 */
xiv.ui.ctrl.XtkControllerTree.prototype.VolumeController2D_;



/**
 * @type {xiv.ui.ctrl.VolumeController3D}
 * @private
 */
xiv.ui.ctrl.XtkControllerTree.prototype.VolumeController3D_;



/**
 * @type {xiv.ui.ctrl.MeshController3D}
 * @private
 */
xiv.ui.ctrl.XtkControllerTree.prototype.MeshController3D_;



/**
 * @type {xiv.ui.ctrl.AnnotationsController3D}
 * @private
 */
xiv.ui.ctrl.XtkControllerTree.prototype.AnnotationsController3D_;




/**
 * @return {Array.<xiv.ui.ctrl.XtkController>}
 * @public
 */
xiv.ui.ctrl.XtkControllerTree.prototype.Levels = 
function(){

}



/**
 * @return {Array.<xiv.ui.ctrl.XtkController>}
 * @public
 */
xiv.ui.ctrl.XtkControllerTree.prototype.Annotations = 
function(){
    return this.getControllers([this.AnnotationsController3D_])
}



/**
 * @return {Array.<xiv.ui.ctrl.XtkController>}
 * @public
 */
xiv.ui.ctrl.XtkControllerTree.prototype.Levels = 
function(){
    return this.getControllers([this.LevelsController_])
}



/**
 * @return {Array.<xiv.ui.ctrl.XtkController>}
 * @public
 */
xiv.ui.ctrl.XtkControllerTree.prototype.Volumes2D = 
function(){
    return this.getControllers([this.VolumeController2D_])
}



/**
 * @return {Array.<xiv.ui.ctrl.XtkController>}
 * @public
 */
xiv.ui.ctrl.XtkControllerTree.prototype.Volumes3D = 
function(){
    return this.getControllers([this.VolumeController3D_])
}



/**
 * @private
 */
xiv.ui.ctrl.XtkControllerTree.prototype.setControllersAsProperties_ = 
function(){

    this['volumes'] =
	new xiv.ui.ctrl.XtkControllerTree.ControlSet(
	    this.getControllers([this.VolumeController2D_]), 
	    this.getControllers([this.VolumeController3D_]));


    this['annotations'] =
	new xiv.ui.ctrl.XtkControllerTree.ControlSet(
	    null, 
	    this.getControllers([this.AnnotationsController3D_]));

    this['meshes'] =
	new xiv.ui.ctrl.XtkControllerTree.ControlSet(
	    null,
	    this.getControllers([this.MeshController3D_]));

    this['levels'] =
	new xiv.ui.ctrl.XtkControllerTree.ControlSet(
	    null, null, 
	    this.getControllers([this.LevelsController_]));

    //this['histogram'] =
	    //new xiv.ui.ctrl.XtkControllerTree.ControlSet(
    //null, null, this.Histogram());

}




/**
 * @param {Array.<xiv.ui.ctrl.MasterController3D> |
 *         xiv.ui.ctrl.MasterController3D |
 *         Array.<xiv.ui.ctrl.MasterController2D> |
 *         xiv.ui.ctrl.MasterController2D} mainControls
 * @return {Array.<xiv.ui.ctrl.XtkController>}
 * @public
 */
xiv.ui.ctrl.XtkControllerTree.prototype.getHistograms = 
function(mainControls) {

}





/**
 * @param {Array.<xiv.ui.ctrl.MasterController3D> |
 *         xiv.ui.ctrl.MasterController3D |
 *         Array.<xiv.ui.ctrl.MasterController2D> |
 *         xiv.ui.ctrl.MasterController2D} mainControls
 * @return {Array.<xiv.ui.ctrl.XtkController>}
 * @public
 */
xiv.ui.ctrl.XtkControllerTree.prototype.getControllers = 
function(mainControls) {
    var controllers = [];
    goog.array.forEach(
	goog.isArray(mainControls) ? mainControls : [mainControls], 
     function(ctrl){
	if (goog.isDefAndNotNull(ctrl)) {
	    controllers = goog.array.concat(controllers, 
					    ctrl.getAllControllers());
	}
    })
    return controllers;
}



/**
 * @return {Array.<xiv.ui.ctrl.XtkController>}
 * @public
 */
xiv.ui.ctrl.XtkControllerTree.prototype.updateControllers = function() {
    var ctrls =  this.getControllers([
	this.LevelsController_,
	this.VolumeController2D_,
	this.VolumeController3D_,
	this.MeshController3D_,
	this.AnnotationsController3D_,
	this.FiberController3D_
    ])
    goog.array.forEach(ctrls, function(ctrl){
	ctrl.update();
    }.bind(this))
}




/**
 * @param {!X.Object} xObj
 * @param {!gxnat.vis.RenderProperties} renderProps
 * @public
 */
xiv.ui.ctrl.XtkControllerTree.prototype.createControllers = 
function(xObj, renderProps) {

    //window.console.log(xObj);
    if (xObj instanceof X.volume) {
	if (!goog.isDefAndNotNull(this.VolumeController2D_)){
	    this.LevelsController_ = new xiv.ui.ctrl.LevelsController();
	    this.VolumeController2D_ = new xiv.ui.ctrl.VolumeController2D();
	    this.VolumeController3D_ = new xiv.ui.ctrl.VolumeController3D();
	}
	this.LevelsController_.add(xObj, renderProps);
	this.VolumeController2D_.add(xObj, renderProps);
	this.VolumeController3D_.add(xObj, renderProps);
    }

    else if (xObj instanceof X.mesh) {
	if (!goog.isDefAndNotNull(this.MeshController3D_)){
	    this.MeshController3D_ = new xiv.ui.ctrl.MeshController3D();
	}
	this.MeshController3D_.add(xObj, renderProps);
    }

    else if (xObj instanceof X.sphere) {
	if (!goog.isDefAndNotNull(this.AnnotationsController3D_)){
	    this.AnnotationsController3D_ = 
		new xiv.ui.ctrl.AnnotationsController3D();
	}
	this.AnnotationsController3D_.add(xObj);
    }


    //
    // Possible TODO, though not necessarily within the domain of
    // XNATSlicer.
    //
    /**
     *
    else if (xObj instanceof X.fibers) {
	if (!goog.isDefAndNotNull(this.FiberController3D_)){
	    this.FiberController3D_ = new xiv.ui.ctrl.FiberController3D();
	}
	this.FiberController3D_.add(xObj, renderProps);
    }
    */

    this.setControllersAsProperties_();
}




/**
 * @param {!string} labelTitle;
 * @public
 */
xiv.ui.ctrl.XtkControllerTree.prototype.disposeInternal = function() {
    goog.base(this, 'disposeInternal');

    if (goog.isDefAndNotNull(this.LevelsController_)){
	this.LevelsController_.dispose();
	delete this.LevelsController_;
    }



    if (goog.isDefAndNotNull(this.VolumeController2D_)){
	this.VolumeController2D_.dispose();
	delete this.VolumeController2D_;
    }


    if (goog.isDefAndNotNull(this.VolumeController3D_)){
	this.VolumeController3D_.dispose();
	delete this.VolumeController3D_;
    }


    if (goog.isDefAndNotNull(this.MeshController3D_)){
	this.MeshController3D_.dispose();
	delete this.MeshController3D_;
    }

    if (goog.isDefAndNotNull(this.AnnotationsController3D_)){
	this.AnnotationsController3D_.dispose();
	delete this.AnnotationsController3D_;
    }

    if (goog.isDefAndNotNull(this.FiberController3D_)){
	this.FiberController3D_.dispose();
	delete this.FiberController3D_;
    }
}



