Msfm.panel.MsfmTabs = function(config) {
    config = config || {};
    Ext.apply(config,{
        border: false
        ,baseCls: 'modx-formpanel'
        ,cls: 'container'
        ,items: [{
            html: '<h2>'+_('msfieldsmanager.msfmtabs_title')+'</h2>'
            ,border: false
            ,cls: 'modx-page-header'
        },{
            xtype: 'modx-tabs'
            ,defaults: { border: false ,autoHeight: true }
            ,border: true
            ,items: [{
                title: _('msfieldsmanager.tab.msfmtabs')
                ,defaults: { autoHeight: true }
                ,items: [{
                    html: '<p>'+_('msfieldsmanager.msfmtabs_intro_msg')+'</p>'
                    ,border: false
                    ,bodyCssClass: 'panel-desc'
                },{
                 xtype: 'msfm-grid-msfmtabs'
                 ,cls: 'main-wrapper'
                 ,preventRender: true
                 }]
            }]
        }]
    });
    Msfm.panel.MsfmTabs.superclass.constructor.call(this,config);
};
Ext.extend(Msfm.panel.MsfmTabs,MODx.Panel);
Ext.reg('msfm-panel-msfmtabs',Msfm.panel.MsfmTabs);