Msfm.combo.UserGroup = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        displayField: 'name',
        valueField: 'id',
        fields: ['id', 'name', 'description'],
        action: 'security/group/getlist',
        url: MODx.config.connector_url,
    });
    Msfm.combo.UserGroup.superclass.constructor.call(this, config);
};
Ext.extend(Msfm.combo.UserGroup, Msfm.combo.MultiSelect);
Ext.reg('msfm-combo-usergroup', Msfm.combo.UserGroup);