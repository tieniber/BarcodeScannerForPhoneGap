/*global mxui, mx, dojo, cordova */
define([
    "mxui/widget/_WidgetBase", "mxui/dom", "dojo/dom-class", "dojo/_base/declare"
], function(_WidgetBase, mxuiDom, dojoClass, declare) {
    "use strict";

    return declare("BarcodeScannerForPhoneGap.widget.BarcodeScannerForPhoneGap", _WidgetBase, {

        attributeName: "",
        buttonLabel: "",
        buttonClass: "",
        onchangemf: "",

        _hasStarted: false,
        _obj: null,
        _button: null,

        startup: function() {
            if (this._hasStarted)
                return;

            this._hasStarted = true;

            dojoClass.add(this.domNode, "wx-barcodescanner-container");

            this._createChildnodes();
            this._setupEvents();
        },

        update: function (obj, callback) {
            if (typeof obj === "string") {
                mx.data.get({
                    guid: obj,
                    callback: this._loadData.bind(this)
                });
            } else if (obj === null) {
                console.log("Whoops... the BarcodeScanner has no data!");
            } else {
                mx.data.subscribe({
                    guid: obj.getGuid(),
                    callback: this._refresh.bind(this)
                });
                this._loadData(obj);
            }

            if (typeof callback !== "undefined") {
                callback();
            }
        },

        _loadData: function(obj) {
            this._obj = obj;
        },

        _refresh: function(obj){
            if (typeof obj === "string") {
                mx.data.get({
                    guid: obj,
                    callback: this._loadData.bind(this)
                });
            } else if (obj === null) {
                console.log("Whoops... the BarcodeScanner has no data!");
            } else {
                this._loadData(obj);
            }
        },

        _setupEvents: function() {
            this.connect(this._button, "click", function(evt) {
                if (typeof(cordova)) {
                    cordova.plugins.barcodeScanner.scan(
                        this.barcodeSuccess.bind(this),
                        this.barcodeFailure.bind(this)
                    );
                } else {
                    mx.ui.error("Unable to detect camera.");
                }
            });
        },

        barcodeSuccess: function(output) {
            if (output.cancelled == false && output.text && output.text.length > 0) {
                this._obj.set(this.attributeName, output.text);
                this._executeMicroflow();
            }
        },

        barcodeFailure: function(error) {
            mx.ui.error("Scanning failed: " + error.message);
        },

        _executeMicroflow: function() {
            if (this.onchangemf && this._obj) {
                mx.data.action({
                    params: {
                        actionname: this.onchangemf,
                        applyto: "selection",
                        guids: [ this._obj.getGuid() ]
                    }
                });
            }
        },

        _createChildnodes: function() {
            this._button = mxuiDom.create("div");
            dojoClass.add(this._button, "wx-mxwxbarcodescanner-button btn btn-primary");
            if (this.buttonClass)
                dojoClass.add(this._button, this.buttonClass);

            this._button.textContent = this.buttonLabel || "Scan barcode";

            this.domNode.appendChild(this._button);
        }
    });
});

// Compatibility with older mendix versions.
require([ "BarcodeScannerForPhoneGap/widget/BarcodeScannerForPhoneGap" ], function() {});
