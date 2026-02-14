sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("com.proyecto.controller.Detail", {
        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteDetail").attachMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            // Retrieve ID from global model
            var sProductId = this.getOwnerComponent().getModel("global").getProperty("/selectedProductId");

            if (sProductId) {
                this._iProductId = parseInt(sProductId, 10);
                this.cargarDetalleProducto(this._iProductId);
            } else {
                // Handle case where no ID is found
                sap.m.MessageToast.show("No product selected");
                this.onNavBack();
            }
        },

        cargarDetalleProducto: function (iProductId) {
            var oModel = this.getOwnerComponent().getModel();
            var that = this;

            console.log("Fetching details for ProductID:", iProductId);

            var aFilters = [
                new sap.ui.model.Filter("ProductID", sap.ui.model.FilterOperator.EQ, iProductId)
            ];

            oModel.read("/Products", {
                filters: aFilters,
                urlParameters: {
                    "$expand": "Category,Supplier"
                },
                success: function (oData) {
                    if (oData.results && oData.results.length > 0) {
                        var oProduct = oData.results[0];
                        console.log("Product Data:", oProduct);
                        var oProductModel = new sap.ui.model.json.JSONModel(oProduct);
                        that.getView().setModel(oProductModel, "product");
                    }
                },
                error: function (oError) {
                    sap.m.MessageToast.show("Error fetching product details");
                }
            });
        },
        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("RouteMain");
        },

        onAddToCart: function () {
            var oProductModel = this.getView().getModel("product");
            if (!oProductModel) {
                return;
            }
            var oProduct = oProductModel.getData();

            var oCartModel = this.getOwnerComponent().getModel("cart");
            var aItems = oCartModel.getProperty("/items");

            // Check if product already exists
            var oExistingItem = aItems.find(function (item) {
                return item.ProductID === oProduct.ProductID;
            });

            if (oExistingItem) {
                oExistingItem.Quantity += 1;
            } else {
                oProduct.Quantity = 1;
                aItems.push(oProduct);
            }

            oCartModel.setProperty("/items", aItems);
            oCartModel.refresh(true); // Force update bindings
            sap.m.MessageToast.show("Producto agregado al carrito");
        }

    });
});