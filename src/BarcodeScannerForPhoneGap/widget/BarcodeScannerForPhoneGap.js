// Dropdown Select Widget
dojo.provide('BarcodeScannerForPhoneGap.widget.BarcodeScannerForPhoneGap');
dojo.declare('BarcodeScannerForPhoneGap.widget.BarcodeScannerForPhoneGap', mxui.widget._WidgetBase, {

	// Coding guideline, internal variables start with '_'.
	// internal variables.
	_wxnode : null,

	// * 
	_button : null,

	_hasStarted : false,
	_obj : null,
	_button : null,

	// Externally executed mendix function to create widget.
	startup: function() {
		'use strict';

		if (this._hasStarted)
			return;

		this._hasStarted = true;

		dojo.addClass(this.domNode, 'wx-mxwxbarcodescanner-container');

		// Create childnodes
		this._createChildnodes();

		// Setup events
		this._setupEvents();

	},

	update : function (obj, callback) {
		'use strict';

		if(typeof obj === 'string'){
			mx.data.get({
				guids    : [this._contextGuid],
				callback : dojo.hitch(this, function(obj) {
					this._loadData(obj);
				})
			});
		} else if(obj === null){
			// Sorry no data no show!
			console.log('Whoops... the BarcodeScanner has no data!');
		} else {
			// Attach to data refresh.
			mx.data.subscribe({
				guid : obj.getGuid(),
				callback : dojo.hitch(this, this._refresh)
			});
			// Load data
			this._loadData(obj);
		}

		if(typeof callback !== 'undefined') {
			callback();
		}
	},

	_loadData : function(obj) {
		'use strict';

		this._obj = obj;
	},

	_refresh : function(obj){
		'use strict';

		this._loadData(obj);
	},

	// Internal event setup.
	_setupEvents : function() {
		'use strict';

		// Attach only one event to dropdown list.
		dojo.connect( this._button, "onclick", dojo.hitch(this, function(evt){

			// The barcode function has a success, failure and a reference to this.
			cordova.plugins.barcodeScanner.scan(
				dojo.hitch(this, this.barcodeSuccess),
				dojo.hitch(this, this.barcodeFailure)
			);

		}));

	},

	barcodeSuccess : function(output) {
		'use strict';

		if (output.cancelled == false && output.text && output.text.length > 0) { 
			this._obj.set(this.attributeName, output.text);
			this._executeMicroflow();
		}
	},

	barcodeFailure : function(error) {
		'use strict';

		var html = ( 'Scanning failed: ' + error );
		dojo.create("div", { innerHTML: html }, this._wxnode);
	},

	_executeMicroflow : function () {
		'use strict';

		if (this.onchangemf && this._obj) {
			mx.processor.xasAction({
				error       : function() {},
				actionname  : this.onchangemf,
				applyto     : 'selection',
				guids       : [this._obj.getGuid()]
			});
		}
	},

	_createChildnodes: function() {
		'use strict';

		// Placeholder container
		this._button = mxui.dom.div();
		dojo.addClass(this._button, 'wx-mxwxbarcodescanner-button btn btn-primary');
		dojo.html.set(this._button, this.buttonLabel || 'Scan barcode.');

		// Add to wxnode
		this.domNode.appendChild(this._button);
	}
});
