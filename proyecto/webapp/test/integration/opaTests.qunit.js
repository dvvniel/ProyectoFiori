/* global QUnit */
QUnit.config.autostart = false;

sap.ui.require(["com/proyecto/test/integration/AllJourneys"
], function () {
	QUnit.start();
});
