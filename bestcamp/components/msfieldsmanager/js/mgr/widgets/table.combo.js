Msfm.combo.Table = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        displayField: 'name'
        ,valueField: 'val'
        ,fields: ['name','val']
        ,url:  Msfm.config.connectorUrl
        ,baseParams:{
            action: 'mgr/db/table/getlist'
        }
    });
    Msfm.combo.Table.superclass.constructor.call(this,config);
};
Ext.extend(Msfm.combo.Table,MODx.combo.ComboBox);
Ext.reg('msfm-combo-table',Msfm.combo.Table);