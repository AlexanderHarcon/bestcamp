Msfm.combo.Index = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        store: new Ext.data.SimpleStore({
            fields: ['d', 'v']
            , data: [
                [_('msfieldsmanager.combo.index_no'), 'no'],
                [_('msfieldsmanager.combo.index_simple'), 'INDEX'],
                [_('msfieldsmanager.combo.index_unique'), 'UNIQUE'],
                [_('msfieldsmanager.combo.index_fulltext'), 'FULLTEXT'],
            ]
        })
        , displayField: 'd'
        , valueField: 'v'
        , hiddenName: config.name || ''
        , mode: 'local'
        , triggerAction: 'all'
        , editable: false
        , preventRender: true
        , forceSelection: true
    });
    Msfm.combo.Index.superclass.constructor.call(this, config);
};
Ext.extend(Msfm.combo.Index, MODx.combo.ComboBox);
Ext.reg('msfm-combo-index', Msfm.combo.Index);