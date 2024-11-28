Msfm.panel.MsfmStorage = function (config) {
    config = config || {};
    Ext.apply(config, {
        border: false
        , baseCls: 'modx-formpanel'
        , cls: 'container'
        , items: [{
            html: Msfm.config.showTitle ? '<h2>' + _('msfieldsmanager.storage.title') + '</h2>' : ''
            , border: false
            , cls: 'modx-page-header'
        }, {
            xtype: 'modx-tabs'
            , id: 'msfm-msfmstorage-tabs'
            , defaults: {border: true, autoHeight: true}
            , stateEvents: ['tabchange']
            , getState: function () {
                return {activeTab: this.items.indexOf(this.getActiveTab())};
            }
            , items: this.getTabs(config)
        }]
    });
    Msfm.panel.MsfmStorage.superclass.constructor.call(this, config);
};
Ext.extend(Msfm.panel.MsfmStorage, MODx.Panel, {
    getTabs: function (config) {
        var tabs = [{
            title: _('msfieldsmanager.storage_member.tab.msfmstoragemember')
            , defaults: {autoHeight: true}
            , items: [{
                xtype: 'msfm-grid-msfmstoragemember'
                , preventRender: true
            }]
        }];

        if (typeof(Msfm.config.hideTabStorage) == 'undefined' || Msfm.config.hideTabStorage == 0) {
            tabs.push({
                title: _('msfieldsmanager.storage.tab.msfmstorage')
                , defaults: {autoHeight: true}
                , items: [{
                    xtype: 'msfm-grid-msfmstorage'
                    , preventRender: true
                }]
            });
        }

        return tabs;
    }

});
Ext.reg('msfm-panel-msfmstorage', Msfm.panel.MsfmStorage);