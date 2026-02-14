sap.ui.define([
    "sap/ui/core/UIComponent",
    "com/proyecto/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("com.proyecto.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // set the global model
            var oGlobalModel = new sap.ui.model.json.JSONModel({
                selectedProductId: null
            });
            this.setModel(oGlobalModel, "global");

            // set the cart model
            var oCartModel = new sap.ui.model.json.JSONModel({
                items: []
            });
            this.setModel(oCartModel, "cart");

            // enable routing
            this.getRouter().initialize();
        }
    });
});