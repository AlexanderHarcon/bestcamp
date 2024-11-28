Msfm.combo.Field = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        displayField: 'name'
        ,valueField: 'val'
        ,fields: ['name','val']
        ,url:  Msfm.config.connectorUrl
        ,baseParams:{
            action: 'mgr/db/field/getlist'
            ,table:  config.table || ''
        }
    });
    Msfm.combo.Field.superclass.constructor.call(this,config);
};
Ext.extend(Msfm.combo.Field,MODx.combo.ComboBox,{
    reload:function(val) {
        this.clearValue();
        this.getStore().removeAll();
        this.lastQuery = null;
        this.baseParams.table = val;
    }
});
Ext.reg('msfm-combo-field',Msfm.combo.Field);