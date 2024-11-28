Msfm.panel.MsfmFieldset = function(config) {
    config = config || {};
    Ext.apply(config,{
        border: false
        ,baseCls: 'modx-formpanel'
        ,cls: 'container'
        ,items: [{
            html: '<h2>'+_('msfieldsmanager.msfmfieldset_title')+'</h2>'
            ,border: false
            ,cls: 'modx-page-header'
        },{
            xtype: 'modx-tabs'
            ,defaults: { border: false ,autoHeight: true }
            ,border: true
            ,items: [{
                title: _('msfieldsmanager.tab.msfmfieldset')
                ,defaults: { autoHeight: true }
                ,items: [{
                    html: '<p>'+_('msfieldsmanager.msfmfieldset_intro_msg')+'</p>'
                    ,border: false
                    ,bodyCssClass: 'panel-desc'
                },{
                 xtype: 'msfm-grid-msfmfieldset'
                 ,cls: 'main-wrapper'
                 ,preventRender: true
                 }]
            }]
        }]
    });
    Msfm.panel.MsfmFieldset.superclass.constructor.call(this,config);
};
Ext.extend(Msfm.panel.MsfmFieldset,MODx.Panel);
Ext.reg('msfm-panel-msfmfieldset',Msfm.panel.MsfmFieldset);