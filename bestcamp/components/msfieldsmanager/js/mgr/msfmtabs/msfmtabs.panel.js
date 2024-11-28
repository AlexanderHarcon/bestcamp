Msfm.panel.MsfmTabs = function(config) {
    config = config || {};
    Ext.apply(config,{
        border: false,
        baseCls: 'modx-formpanel',
        cls: 'container',
        items: [{
            html: '<h2>'+_('msfieldsmanager_msfmtabs_title')+'</h2>',
            border: false,
            cls: 'modx-page-header'
        }, {
            xtype: 'modx-tabs',
            id: 'msfm-msfmtabs-tabs',
            defaults: { border: true ,autoHeight: true },
            stateEvents: ['tabchange'],
            getState: function () {
                return {activeTab: this.items.indexOf(this.getActiveTab())};
            },
            items: [{
                title: _('msfieldsmanager_tab_msfmtabs'),
                defaults: { autoHeight: true },
                items: [{
                 xtype: 'msfm-grid-msfmtabs',
                 cls: 'main-wrapper',
                 preventRender: true
                 }]
            }]
        }]
    });
    Msfm.panel.MsfmTabs.superclass.constructor.call(this,config);
};
Ext.extend(Msfm.panel.MsfmTabs,MODx.Panel);
Ext.reg('msfm-panel-msfmtabs',Msfm.panel.MsfmTabs);