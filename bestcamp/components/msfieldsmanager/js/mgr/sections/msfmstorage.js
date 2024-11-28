Ext.onReady(function() {
    MODx.load({ xtype: 'msfm-page-msfmstorage'});
});

Msfm.page.MsfmStorage = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        components: [{
            xtype: 'msfm-panel-msfmstorage'
            ,renderTo: 'msfm-panel-msfmstorage-div'
        }]
    });
    Msfm.page.MsfmStorage.superclass.constructor.call(this,config);
};
Ext.extend(Msfm.page.MsfmStorage,MODx.Component);
Ext.reg('msfm-page-msfmstorage',Msfm.page.MsfmStorage);

