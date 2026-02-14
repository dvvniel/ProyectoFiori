sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast"
], (BaseController, MessageToast) => {
  "use strict";

  return BaseController.extend("com.proyecto.controller.App", {
    onInit: function () {
      this.getOwnerComponent().getRouter().attachRouteMatched(this.onRouteMatched, this);
      
      // Load saved theme
      var sTheme = localStorage.getItem("userTheme");
      if (sTheme) {
        sap.ui.getCore().applyTheme(sTheme);
      }
    },

    onRouteMatched: function (oEvent) {
      var sRouteName = oEvent.getParameter("name");
      var oToolPage = this.byId("toolPage");
      var oSideNavigation = oToolPage.getSideContent();

      // Map route names to side navigation keys
      if (sRouteName === "RouteMain" || sRouteName === "RouteDetail") {
        oSideNavigation.setSelectedKey("home");
      } else if (sRouteName === "RouteProfile") {
        oSideNavigation.setSelectedKey("profile");
      }
    },
    onSideNavButtonPress: function () {
      var oToolPage = this.byId("toolPage");
      var bSideExpanded = oToolPage.getSideExpanded();

      this._setToggleButtonTooltip(bSideExpanded);
      oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
    },

    _setToggleButtonTooltip: function (bLarge) {
      var oToggleButton = this.byId("sideNavigationToggleButton");
      if (oToggleButton) {
        if (bLarge) {
          oToggleButton.setTooltip("Large Size Navigation");
        } else {
          oToggleButton.setTooltip("Small Size Navigation");
        }
      }
    },

    onItemSelect: function (oEvent) {
      var oItem = oEvent.getParameter("item");
      var sKey = oItem.getKey();
      var oRouter = this.getOwnerComponent().getRouter();

      if (sKey === "home") {
        oRouter.navTo("RouteMain");
      } else if (sKey === "profile") {
        oRouter.navTo("RouteProfile");
      }
    },

    onPressProfile: function () {
      this.getOwnerComponent().getRouter().navTo("RouteProfile");
    },

    onToggleTheme: function () {
      var sCurrentTheme = sap.ui.getCore().getConfiguration().getTheme();
      var sNewTheme = (sCurrentTheme === "sap_horizon_dark") ? "sap_horizon" : "sap_horizon_dark";
      
      sap.ui.getCore().applyTheme(sNewTheme);
      localStorage.setItem("userTheme", sNewTheme);
    },

    // --- Global Cart Logic ---

    onPressCart: function () {
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