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
            if (this._hasStarted) return;

            this._hasStarted = true;

            dojoClass.add(this.domNode, "wx-barcodescanner-container");

            this._createChildNodes();
            this._setupEvents();
        },

        update: function (obj, callback) {
            this._obj = obj;
            if (callback) callback();
        },

        _setupEvents: function() {
            var barcodeScannerAvailable = (
                typeof(cordova) !== "undefined" &&
                typeof(cordova.plugins.barcodeScanner) !== "undefined"
            );

            if (barcodeScannerAvailable) {
                this.connect(this._button, "click", function() {
                    cordova.plugins.barcodeScanner.scan(
                        this._barcodeSuccess.bind(this),
                        this._barcodeFailure.bind(this)
                    );
                });
            } else {
                this.connect(this._button, "click", function() {
                    mx.ui.error("Unable to detect camera.");
                });
            }
        },

        _barcodeSuccess: function(output) {
            if (!output.cancelled && output.text && output.text.length > 0) {
                this._obj.set(this.attributeName, output.text);
                this._executeMicroflow();
            }
        },

        _barcodeFailure: function(error) {
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

        _createChildNodes: function() {
            this._button = mxuiDom.create("div", {
                "class": "wx-mxwxbarcodescanner-button btn btn-primary"
            });
            if (this.buttonClass) dojoClass.add(this._button, this.buttonClass);

            this._button.textContent = this.buttonLabel || "Scan barcode";

            this.domNode.appendChild(this._button);
        }
    });
});

// Compatibility with older mendix versions.
require([ "BarcodeScannerForPhoneGap/widget/BarcodeScannerForPhoneGap" ], function() {});
