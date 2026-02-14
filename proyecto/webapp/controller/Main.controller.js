sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("com.proyecto.controller.Main", {
        onInit() {
            var oComponent = this.getOwnerComponent();
            this._router = oComponent.getRouter();
            this._oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);

            this._router.getRoute("RouteMain").attachMatched(this.onRouteMatched, this);
        },


        onRouteMatched: function () {
            this.cargarProductos();

        },

        cargarProductos: function () {
            return new Promise(function (resolve, reject) {

                var oModel = this.getOwnerComponent().getModel();

                oModel.read("/Products", {
                    urlParameters: {
                        "$expand": "Category,Supplier"
                    },
                    success: function (oData) {
                        console.log(oData.results, "todos los productos");



                        var oProductsModel = new sap.ui.model.json.JSONModel({
                            results: oData.results
                        });

                        this.getView().setModel(oProductsModel, "products");

                        resolve(oData.results);

                    }.bind(this),

                    error: function (oError) {
                        reject(oError);
                    }
                });

            }.bind(this));
        },



        onItemPress: function (oEvent) {
            var oItem = oEvent.getSource();
            var oContext = oItem.getBindingContext("products");

            var iProductId = oContext.getProperty("ProductID");

            // Save ID to global model
            this.getOwnerComponent().getModel("global").setProperty("/selectedProductId", iProductId);

            this.getOwnerComponent()
                .getRouter()
                .navTo("RouteDetail");
        },

        onPressCart: function () {
            // this.getOwnerComponent().getRouter().navTo("RouteCart"); // OLD

            var oView = this.getView();

            if (!this._oCartDialog) {
                this._oCartDialog = sap.ui.xmlfragment(oView.getId(), "com.proyecto.view.Cart", this);
                oView.addDependent(this._oCartDialog);
            }

            this._oCartDialog.open();
        },

        onCloseCart: function () {
            if (this._oCartDialog) {
                this._oCartDialog.close();
            }
        },

        onPressProceed: function () {
            var oCartModel = this.getOwnerComponent().getModel("cart");
            var aItems = oCartModel.getProperty("/items");

            if (aItems.length === 0) {
                sap.m.MessageToast.show("El carrito está vacío");
                return;
            }

            this.onCloseCart(); // Close dialog
            this.getOwnerComponent().getRouter().navTo("RouteWizard");
        }


    });
});