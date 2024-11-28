Msfm.combo.Xtype = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        store: new Ext.data.SimpleStore({
            fields: ['d','v']
            ,data:[
                [_('msfieldsmanager.combo.ft_textfield'),'input'],
                [_('msfieldsmanager.combo.ft_numberfield'),'number'],
                [_('msfieldsmanager.combo.ft_floatfield'),'float'],
                [_('msfieldsmanager.combo.ft_textarea'),'textarea'],
                [_('msfieldsmanager.combo.ft_editor_text'),'editor_text'],
                [_('msfieldsmanager.combo.ft_editor_code'),'editor_code'],
                [_('msfieldsmanager.combo.ft_combo_json'),'combobox_json'],
                // [_('msfieldsmanager.combo.ft_combo_array'),'combobox_array'],
                [_('msfieldsmanager.combo.ft_combo_custom'),'combobox_custom'],
                [_('msfieldsmanager.combo.ft_combo_boolean'),'combobox_boolean'],
                [_('msfieldsmanager.combo.ft_checkbox'),'checkbox'],
                [_('msfieldsmanager.combo.ft_radiogroup'),'radiogroup'],
                [_('msfieldsmanager.combo.ft_checkboxgroup'),'checkboxgroup'],
                [_('msfieldsmanager.combo.ft_browser'),'browser'],
                [_('msfieldsmanager.combo.ft_date'),'date'],
                [_('msfieldsmanager.combo.ft_time'),'time'],
                [_('msfieldsmanager.combo.ft_datetime'),'datetime'],
                [_('msfieldsmanager.combo.ft_timestamp'),'timestamp']
            ]
        })
        ,displayField: 'd'
        ,valueField: 'v'
        ,hiddenName: 'xtype'
        ,mode: 'local'
        ,triggerAction: 'all'
        ,editable: false
        ,preventRender: true
        ,forceSelection: true
        ,enableKeyEvents: true
    });
    Msfm.combo.Xtype.superclass.constructor.call(this,config);
};
Ext.extend(Msfm.combo.Xtype,MODx.combo.ComboBox);
Ext.reg('msfm-combo-xtype',Msfm.combo.Xtype);