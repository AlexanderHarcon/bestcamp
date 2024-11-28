Msfm.combo.MultiSelect = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        xtype: 'superboxselect',
        allowBlank: true,
        msgTarget: 'under',
        allowAddNewData: false,
        addNewDataOnBlur: false,
        pinList: false,
        resizable: true,
        anchor: '100%',
        store: new Ext.data.JsonStore({
            root: 'results',
            autoLoad: true,
            autoSave: false,
            totalProperty: 'total',
            fields: config.fields || ['id', 'name'],
            url: config.url || Msfm.config.connectorUrl,
            baseParams: {
                combo: true,
                action: config.action,
            }
        }),
        mode: 'remote',
        displayField: 'name',
        valueField: 'id',
        triggerAction: 'all',
        extraItemCls: 'x-tag',
        expandBtnCls: 'x-form-trigger',
        clearBtnCls: 'x-form-trigger',
        displayFieldTpl: config.displayFieldTpl || '{name}',
    });
     config.name += '[]';

    Ext.apply(config, {
        listeners: {
            newitem: {
                fn: this.newitem,
                scope: this
            },
        }
    });

    Msfm.combo.MultiSelect.superclass.constructor.call(this, config);
    this.store.on('load', function () {
        if (this.remoteLookup.length) {
            this.addValue(this.remoteLookup);
        }
    }, this);
};
Ext.extend(Msfm.combo.MultiSelect, Ext.ux.form.SuperBoxSelect, {
    addValue: function (value) {
        if (Ext.isEmpty(value)) {
            return;
        }
        var values = value;
        if (!Ext.isArray(value)) {
            value = '' + value;
            values = value.split(this.valueDelimiter);
        }
        Ext.each(values, function (val) {
            var record = this.findRecord(this.valueField, val);
            if (record) {
                this.addRecord(record);
                return true;
            }
            this.remoteLookup.push(val);
        }, this);
    },
    newitem: function (comp, v) {
        var obj = {};
        obj[this.valueField] = v;
        obj[this.displayField] = v;
        comp.addItem(obj);
    },
});
Ext.reg('msfm-multi-select', Msfm.combo.MultiSelect);