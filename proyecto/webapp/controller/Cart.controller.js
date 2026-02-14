sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("com.proyecto.controller.Cart", {
        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("RouteMain");
        },

        onPressProceed: function () {
            var oCartModel = this.getOwnerComponent().getModel("cart");
            var aItems = oCartModel.getProperty("/items");

            if (aItems.length === 0) {
                MessageToast.show("El carrito está vacío");
                return;
            }

            this.getOwnerComponent().getRouter().navTo("RouteWizard");
        }
    });
});
