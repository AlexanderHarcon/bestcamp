Ext.onReady(function() {
    MODx.load({ xtype: 'msfm-page-msfmfieldset'});
});

Msfm.page.MsfmFieldset = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        components: [{
            xtype: 'msfm-panel-msfmfieldset'
            ,renderTo: 'msfm-panel-msfmfieldset-div'
        }]
    });
    Msfm.page.MsfmFieldset.superclass.constructor.call(this,config);
};
Ext.extend(Msfm.page.MsfmFieldset,MODx.Component);
Ext.reg('msfm-page-msfmfieldset',Msfm.page.MsfmFieldset);

