Ext.onReady(function() {
    MODx.load({ xtype: 'msfm-page-msfmfields'});
});

Msfm.page.MsfmFields = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        components: [{
            xtype: 'msfm-panel-msfmfields'
            ,renderTo: 'msfm-panel-msfmfields-div'
        }]
    });
    Msfm.page.MsfmFields.superclass.constructor.call(this,config);
};
Ext.extend(Msfm.page.MsfmFields,MODx.Component);
Ext.reg('msfm-page-msfmfields',Msfm.page.MsfmFields);

