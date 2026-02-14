sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (Controller, JSONModel, MessageBox, MessageToast) {
    "use strict";

    return Controller.extend("com.proyecto.controller.Wizard", {
        onInit: function () {
            this._oWizard = this.byId("ShoppingCartWizard");
            this._oNavContainer = this.byId("wizardNavContainer");
            this._oWizardContentPage = this.byId("wizardContentPage");

            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteWizard").attachMatched(this._onRouteMatched, this);

            // Model for wizard data
            this.oWizardModel = new JSONModel({
                firstName: "",
                lastName: "",
                email: "",
                address: "",
                cardNumber: "",
                cardExpiry: "",
                cardCVV: "",
                cardNumberLast4: ""
            });
            this.getView().setModel(this.oWizardModel, "wizard");
        },

        _onRouteMatched: function () {
            // Reset Wizard to step 1
            if (this._oWizard) {
                var oFirstStep = this._oWizard.getSteps()[0];
                this._oWizard.discardProgress(oFirstStep);
                this._oWizard.goToStep(oFirstStep); // Go to first step
            }

            // Clear Validation
            this.byId("PersonalStep").setValidated(false);
            this.byId("PaymentStep").setValidated(false);

            // Reset Data
            this.oWizardModel.setData({
                firstName: "",
                lastName: "",
                email: "",
                address: "",
                cardNumber: "",
                cardExpiry: "",
                cardCVV: "",
                cardNumberLast4: ""
            });
        },

        validatePersonalStep: function () {
            var oData = this.oWizardModel.getData();
            var bValid = false;

            // Simple validation: check if fields are not empty
            if (oData.firstName.length > 0 &&
                oData.lastName.length > 0 &&
                oData.email.length > 0 &&
                oData.email.includes("@") &&
                oData.address.length > 0) {
                bValid = true;
            }

            this.byId("PersonalStep").setValidated(bValid);
        },

        validatePaymentStep: function () {
            var oData = this.oWizardModel.getData();
            var bValid = false;

            if (oData.cardNumber.length === 16 &&
                oData.cardCVV.length === 3 &&
                oData.cardExpiry) {

                // Save last 4 digits for display
                var sLast4 = oData.cardNumber.slice(-4);
                this.oWizardModel.setProperty("/cardNumberLast4", sLast4);

                bValid = true;
            }

            this.byId("PaymentStep").setValidated(bValid);
        },

        onWizardCompleted: function () {
            MessageBox.success("¡Compra realizada con éxito!", {
                actions: [MessageBox.Action.OK],
                onClose: function () {
                    this.onNavBack();
                }.bind(this)
            });
        },

        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("RouteDetail");
        }
    });
});
