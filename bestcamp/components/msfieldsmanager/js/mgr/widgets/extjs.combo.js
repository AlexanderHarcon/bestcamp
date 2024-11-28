Msfm.combo.ExtJs = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        displayField: 'name'
        ,valueField: 'val'
        ,fields: ['name','val']
        ,url:  Msfm.config.connectorUrl
        ,baseParams:{
            action: 'mgr/extjs/getlist'
            ,xtype: config.xtype || ''
        }
    });
    Msfm.combo.ExtJs.superclass.constructor.call(this,config);
};
Ext.extend(Msfm.combo.ExtJs,MODx.combo.ComboBox,{
    reload:function(val) {
        this.clearValue();
        this.getStore().removeAll();
        this.lastQuery = null;
        this.baseParams.xtype = val;
    }
});
Ext.reg('msfm-combo-extjs',Msfm.combo.ExtJs);