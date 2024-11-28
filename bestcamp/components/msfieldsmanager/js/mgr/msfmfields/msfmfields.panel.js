Msfm.panel.MsfmFields = function(config) {
    config = config || {};
    Ext.apply(config,{
        border: false,
        baseCls: 'modx-formpanel',
        cls: 'container',
        items: [{
            html: '<h2>'+_('msfieldsmanager_msfmfields_title')+'</h2>',
            border: false,
            cls: 'modx-page-header'
        }, {
            xtype: 'modx-tabs',
            id: 'msfm-msfmfields-tabs',
            defaults: { border: true ,autoHeight: true },
            stateEvents: ['tabchange'],
            getState: function () {
                return {activeTab: this.items.indexOf(this.getActiveTab())};
            },
            items: [{
                title: _('msfieldsmanager_tab_msfmfields'),
                defaults: { autoHeight: true },
                items: [{
                 xtype: 'msfm-grid-msfmfields',
                 cls: 'main-wrapper',
                 preventRender: true
                 }]
            }]
        }]
    });
    Msfm.panel.MsfmFields.superclass.constructor.call(this,config);
};
Ext.extend(Msfm.panel.MsfmFields,MODx.Panel);
Ext.reg('msfm-panel-msfmfields',Msfm.panel.MsfmFields);