Msfm.combo.Browser = function (config) {
    config = config || {};
    Ext.applyIf(config, {

    });
    Msfm.combo.Browser.superclass.constructor.call(this, config);
};
Ext.extend(Msfm.combo.Browser, MODx.combo.Browser);
Ext.reg('msfm-combo-browser', Msfm.combo.Browser);