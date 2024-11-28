Msfm.combo.Storage = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        displayField: 'name'
        , valueField: 'id'
        , fields: ['name', 'id']
        , hiddenName: config.name || 'storage_id'
        , editable: true
        , minChars: 2
        , url: Msfm.config.connectorUrl
        , baseParams: {
            action: 'mgr/msfmstorage/getList',
            combo: true
        }
    });
    Msfm.combo.Storage.superclass.constructor.call(this, config);
};
Ext.extend(Msfm.combo.Storage, MODx.combo.ComboBox);
Ext.reg('msfm-combo-storage', Msfm.combo.Storage);
