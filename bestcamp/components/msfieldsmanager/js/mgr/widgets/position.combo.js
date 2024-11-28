Msfm.combo.Position = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        store: new Ext.data.SimpleStore({
            fields: ['d', 'v']
            , data: [
                [_('msfieldsmanager.fieldset.combo.position_top'), 1],
                [_('msfieldsmanager.fieldset.combo.position_right'), 2],
                [_('msfieldsmanager.fieldset.combo.position_bottom'), 3],
                [_('msfieldsmanager.fieldset.combo.position_left'), 4]
            ]
        })
        , displayField: 'd'
        , valueField: 'v'
        , hiddenName: config.name || 'position'
        , mode: 'local'
        , triggerAction: 'all'
        , editable: false
        , preventRender: true
        , forceSelection: true
        , enableKeyEvents: true
    });
    Msfm.combo.Position.superclass.constructor.call(this, config);
};
Ext.extend(Msfm.combo.Position, MODx.combo.ComboBox);
Ext.reg('msfm-combo-position', Msfm.combo.Position);