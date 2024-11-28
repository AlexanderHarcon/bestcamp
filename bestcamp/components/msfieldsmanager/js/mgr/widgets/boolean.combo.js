Msfm.combo.Boolean = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        store: new Ext.data.SimpleStore({
            fields: ['d', 'v']
            , data: [
                [_('yes'), 1],
                [_('no'), 0],
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
        , enableKeyEvents: true
        , listeners: {
            afterrender: function (combo) {
                var val = this.getValue();
                if (val == 'false' || val == false) {
                    val = 0;
                } else if (val == 'true' || val == true) {
                    val = 1;
                }
                this.setValue(val);
            }
        }
    });
    Msfm.combo.Boolean.superclass.constructor.call(this, config);
};
Ext.extend(Msfm.combo.Boolean, MODx.combo.ComboBox);
Ext.reg('msfm-combo-boolean', Msfm.combo.Boolean);