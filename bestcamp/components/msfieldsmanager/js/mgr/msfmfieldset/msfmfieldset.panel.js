Msfm.panel.MsfmFieldset = function(config) {
    config = config || {};
    Ext.apply(config,{
        border: false,
        baseCls: 'modx-formpanel',
        cls: 'container',
        items: [{
            html: '<h2>'+_('msfieldsmanager_msfmfieldset_title')+'</h2>',
            border: false,
            cls: 'modx-page-header'
        }, {
            xtype: 'modx-tabs',
            id: 'msfm-msfmfieldset-tabs',
            defaults: { border: true ,autoHeight: true },
            stateEvents: ['tabchange'],
            getState: function () {
                return {activeTab: this.items.indexOf(this.getActiveTab())};
            },
            items: [{
                title: _('msfieldsmanager_tab_msfmfieldset'),
                defaults: { autoHeight: true },
                items: [{
                 xtype: 'msfm-grid-msfmfieldset',
                 cls: 'main-wrapper',
                 preventRender: true
                 }]
            }]
        }]
    });
    Msfm.panel.MsfmFieldset.superclass.constructor.call(this,config);
};
Ext.extend(Msfm.panel.MsfmFieldset,MODx.Panel);
Ext.reg('msfm-panel-msfmfieldset',Msfm.panel.MsfmFieldset);