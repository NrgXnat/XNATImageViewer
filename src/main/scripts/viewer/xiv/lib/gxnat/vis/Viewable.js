/**
 * @author sunilk@mokacreativellc.com (Sunil Kumar)
 */

// goog 
goog.require('goog.Disposable');



/**
 * @extends {goog.Disposable}
 */
goog.provide('gxnat.vis.Viewable');
gxnat.vis.Viewable = function(opt_files, opt_displayProperties) {
    goog.base(this);

    /**
     * @type {!Array.<string>}
     * @private
     */
    this.files_ = opt_files || [];


    /**
     * @type {?gxnat.vis.DisplayProperties}
     * @private
     */
    this.displayProperties_ = opt_displayProperties || null;

}
goog.inherits(gxnat.vis.Viewable, goog.Disposable);
goog.exportSymbol('gxnat.vis.Viewable', gxnat.vis.Viewable);



/**
 * @return {!Array.<string>}
 */
gxnat.vis.Viewable.prototype.getFiles = function() {
    return this.files_;
}



gxnat.vis.Viewable.prototype.addFiles = function(fileName) {
    if (!this.files_){
	this.files_ = [];
    }
    this.files_.push(fileName)
}



/**
 * @return {?gxnat.vis.DisplayProperties}
 */
gxnat.vis.Viewable.getDisplayProperties = function() {
    return this.displayProperites_;
}


/** 
 * @inheritDoc
 */
gxnat.vis.Viewable.prototype.dispose = function() {
    goog.base(this, 'dispose');
    
    goog.array.clear(this.files_);
    delete this.files_;

    goog.object.clear(this.displayProperties_);
    delete this.displayProperties_;
}
