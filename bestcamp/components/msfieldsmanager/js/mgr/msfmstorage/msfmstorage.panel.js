Msfm.panel.MsfmStorage = function(config) {
    config = config || {};
    Ext.apply(config,{
        border: false,
        baseCls: 'modx-formpanel',
        cls: 'container',
        items: [{
            html: '<h2>'+_('msfieldsmanager_msfmstorage_title')+'</h2>',
            border: false,
            cls: 'modx-page-header'
        }, {
            xtype: 'modx-tabs',
            id: 'msfm-msfmstorage-tabs',
            defaults: { border: true ,autoHeight: true },
            stateEvents: ['tabchange'],
            getState: function () {
                return {activeTab: this.items.indexOf(this.getActiveTab())};
            },
            items: [{
                title: _('msfieldsmanager_tab_msfmstorage'),
                defaults: { autoHeight: true },
                items: [{
                 xtype: 'msfm-grid-msfmstorage',
                 cls: 'main-wrapper',
                 preventRender: true
                 }]
            }]
        }]
    });
    Msfm.panel.MsfmStorage.superclass.constructor.call(this,config);
};
Ext.extend(Msfm.panel.MsfmStorage,MODx.Panel);
Ext.reg('msfm-panel-msfmstorage',Msfm.panel.MsfmStorage);