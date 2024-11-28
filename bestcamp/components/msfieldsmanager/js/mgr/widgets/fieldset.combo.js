Msfm.combo.FieldSet = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        displayField: 'key'
        , valueField: 'id'
        , fields: ['key', 'id']
        , hiddenName: config.name || 'fieldset_id'
        , url: Msfm.config.connectorUrl
        , baseParams: {
            action: 'mgr/msfmfieldset/getlist'
            ,combo: true
        }
    });
    Msfm.combo.FieldSet.superclass.constructor.call(this, config);
};
Ext.extend(Msfm.combo.FieldSet, MODx.combo.ComboBox);
Ext.reg('msfm-combo-fieldset', Msfm.combo.FieldSet);