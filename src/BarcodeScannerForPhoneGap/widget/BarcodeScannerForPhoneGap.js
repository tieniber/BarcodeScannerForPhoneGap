/*global mxui, mx, dojo, cordova */
define([ "dojo/_base/declare" ], function(declare) {
    "use strict";

    return declare("BarcodeScannerForPhoneGap.widget.BarcodeScannerForPhoneGap", mxui.widget._WidgetBase, {

        _wxnode : null,

        _hasStarted : false,
        _obj : null,
        _button : null,

        startup: function() {
            if (this._hasStarted)
                return;

            this._hasStarted = true;

            dojo.addClass(this.domNode, "wx-barcodescanner-container");

            this._createChildnodes();
            this._setupEvents();
        },

        update : function (obj, callback) {
            if(typeof obj === "string"){
                mx.data.get({
                    guid    : obj,
                    callback : dojo.hitch(this, function(obj) {
                        this._loadData(obj);
                    })
                });
            } else if(obj === null){
                console.log("Whoops... the BarcodeScanner has no data!");
            } else {
                mx.data.subscribe({
                    guid : obj.getGuid(),
                    callback : dojo.hitch(this, this._refresh)
                });
                this._loadData(obj);
            }

            if(typeof callback !== "undefined") {
                callback();
            }
        },

        _loadData : function(obj) {
            this._obj = obj;
        },

        _refresh : function(obj){
            if(typeof obj === "string"){
                mx.data.get({
                    guid    : obj,
                    callback : dojo.hitch(this, function(obj) {
                        this._loadData(obj);
                    })
                });
            } else if(obj === null){
                console.log("Whoops... the BarcodeScanner has no data!");
            } else {
                this._loadData(obj);
            }
        },

        _setupEvents : function() {
            dojo.connect( this._button, "onclick", dojo.hitch(this, function(evt){
                if( typeof( cordova)){
                    cordova.plugins.barcodeScanner.scan(
                        dojo.hitch(this, this.barcodeSuccess),
                        dojo.hitch(this, this.barcodeFailure)
                    );
                } else {
                    mx.ui.error("Unable to detect camera.");
                }
            }));
        },

        barcodeSuccess : function(output) {
            if (output.cancelled == false && output.text && output.text.length > 0) {
                this._obj.set(this.attributeName, output.text);
                this._executeMicroflow();
            }
        },

        barcodeFailure : function(error) {
            var html = ( "Scanning failed: " + error );
            dojo.create("div", { innerHTML: html }, this._wxnode);
        },

        _executeMicroflow : function () {
            if (this.onchangemf && this._obj) {
                mx.processor.xasAction({
                    error       : function() {},
                    actionname  : this.onchangemf,
                    applyto     : "selection",
                    guids       : [this._obj.getGuid()]
                });
            }
        },

        _createChildnodes: function() {
            this._button = mxui.dom.div();
            dojo.addClass(this._button, "wx-mxwxbarcodescanner-button btn btn-primary");
            if (this.buttonClass)
                dojo.addClass(this._button, this.buttonClass);

            dojo.html.set(this._button, this.buttonLabel || "Scan barcode.");

            this.domNode.appendChild(this._button);
        }
    });
});

// Compatibility with older mendix versions.
require([ "BarcodeScannerForPhoneGap/widget/BarcodeScannerForPhoneGap" ], function() {});
