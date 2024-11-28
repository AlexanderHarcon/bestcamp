Ext.onReady(function() {
    MODx.load({ xtype: 'msfm-page-msfmtabs'});
});

Msfm.page.MsfmTabs = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        components: [{
            xtype: 'msfm-panel-msfmtabs'
            ,renderTo: 'msfm-panel-msfmtabs-div'
        }]
    });
    Msfm.page.MsfmTabs.superclass.constructor.call(this,config);
};
Ext.extend(Msfm.page.MsfmTabs,MODx.Component);
Ext.reg('msfm-page-msfmtabs',Msfm.page.MsfmTabs);

