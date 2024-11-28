Polylang.panel.LexiconEntries = function (config) {
    config = config || {};
    Ext.apply(config, {
        border: false,
        baseCls: 'modx-formpanel',
        cls: 'container',
        items: [{
            html: '<h2>' + _('polylang_lexiconentries_page_title') + '</h2>',
            border: false,
            cls: 'modx-page-header'
        }, {
            xtype: 'modx-tabs',
            id: 'polylang-lexiconentries-tabs',
            defaults: {border: true, autoHeight: true},
            stateEvents: ['tabchange'],
            getState: function () {
                return {activeTab: this.items.indexOf(this.getActiveTab())};
            },
            items: [{
                title: _('polylang_lexiconentries_tab'),
                defaults: {autoHeight: true},
                items: [{
                    html: '<p>'+_('polylang_lexiconentries_intro_msg')+'</p>'
                    ,xtype: 'modx-description'
                },{
                    xtype: 'polylang-grid-lexiconentries',
                    language: config.language,
                    multi_select: true,
                    cls: 'main-wrapper',
                    preventRender: true
                }]
            }]
        }]
    });
    Polylang.panel.LexiconEntries.superclass.constructor.call(this, config);
};
Ext.extend(Polylang.panel.LexiconEntries, MODx.Panel);
Ext.reg('polylang-panel-lexiconentries', Polylang.panel.LexiconEntries);