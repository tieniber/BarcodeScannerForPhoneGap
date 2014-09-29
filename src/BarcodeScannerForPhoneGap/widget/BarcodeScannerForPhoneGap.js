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

		// Setup widget
		this._setupWX();

		// Create childnodes
		this._createChildnodes();

		// Setup events
		this._setupEvents();

	},

	update : function (obj, callback) {
		'use strict';

		if(typeof obj === 'string'){
			this._contextGuid = obj;
			mx.data.get({
				guids    : [this._contextGuid],
				callback : dojo.hitch(this, function(objs) {
					this._contextObj = objs;
				})
			});
		} else {
			this._contextObj = obj;
		}

		if(obj === null){
			// Sorry no data no show!
			console.log('Whoops... the BarcodeScanner has no data!');
		} else {
			// Attach to data refresh.
			mx.data.subscribe({
				guid : obj.getGuid(),
				callback : dojo.hitch(this, this._refresh)
			});
			// Load data
			this._loadData();
		}


		if(typeof callback !== 'undefined') {
			callback();
		}
	},

	_refresh : function(){
		//TODO??
	},


	// Setup
	setupWX: function() {
		'use strict';

		// Set class for domNode

	},

	// Internal event setup.
	setupEvents : function() {
		'use strict';

		// Attach only one event to dropdown list.
		dojo.connect( this._button, "onclick", dojo.hitch(this, function(evt){

			// The camera function has a success, failure and a reference to this.
			cordova.plugins.barcodeScanner.scan(
				dojo.hitch(this, function (result) {
					var html = ( 'We got a barcode\n' +
						'Result: ' + result.text + '\n' +
						'Format: ' + result.format + '\n' +
						'Cancelled: ' + result.cancelled );
					dojo.create("div", { innerHTML: html }, this._wxnode);
				}),
				dojo.hitch(this, function (error) {
					var html = ( 'Scanning failed: ' + error );
					dojo.create("div", { innerHTML: html }, this._wxnode);
				})
			);

		}));

	},

	cameraFailure : function(e, ref){
		'use strict';

		console.log('Camera failure!');
		console.log(e);
	},

	createChildnodes: function() {
		'use strict';

		// Placeholder container
        this._button = mxui.dom.div();
        dojo.addClass(this._button, 'wx-mxwxbarcodescanner-button btn btn-primary');
        dojo.html.set(this._button, this.buttonLabel || 'Scan barcode.');

        // Add to wxnode
        this.domNode.appendChild(this._button);
	}
});
