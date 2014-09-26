// Dropdown Select Widget
dojo.provide('MxwxBarcodeScanner.widget.MxwxBarcodeScanner');
dojo.declare('MxwxBarcodeScanner.widget.MxwxBarcodeScanner', mxui.widget._WidgetBase, {

    // Coding guideline, internal variables start with '_'.
    // internal variables.
    _wxnode : null,
    _mxid : null,
    _mxid_options : null,

    // * 
    _button : null,

    // Externally executed mendix function to create widget.
    postCreate: function() {
        'use strict';

        // Load CSS ... automaticly from ui directory

        // Setup widget
        this.setupWX();

        // Create childnodes
        this.createChildnodes();

        // Setup events
        this.setupEvents();
    },


    // Setup
    setupWX: function() {
        'use strict';

        // MX id.
        this._mxid = this.mxid;
        this._mxid_options = 'wx-mxwxbarcodescanner-options-' + this._mxid;

        // Set class for domNode
        dojo.addClass(this.domNode, 'wx-mxwxbarcodescanner-container');

        // Empty domnode of this and appand new input
        dojo.empty(this.domNode);

        // Make widget node jQuery aware.
        this._wxnode = this.domNode;
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
        this._button = dojo.create("div", { innerHTML: 'barcodescanner' }, this._wxnode);
        dojo.addClass( this._button, 'wx-mxwxbarcodescanner-button btn btn-primary');
    }
});
