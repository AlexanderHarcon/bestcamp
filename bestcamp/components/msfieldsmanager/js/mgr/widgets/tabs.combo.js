Msfm.combo.Tabs = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        displayField: 'key'
        , valueField: 'id'
        , fields: ['key', 'id']
        , hiddenName: config.name || 'tab_id'
        , url: Msfm.config.connectorUrl
        , baseParams: {
            action: 'mgr/msfmtabs/getlist'
            , combo: true
        }
    });
    Msfm.combo.Tabs.superclass.constructor.call(this, config);
};
Ext.extend(Msfm.combo.Tabs, MODx.combo.ComboBox);
Ext.reg('msfm-combo-tabs', Msfm.combo.Tabs);