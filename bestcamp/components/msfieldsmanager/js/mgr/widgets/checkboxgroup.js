Msfm.group.CheckboxGroup = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        items: [{
            boxLabel: 'hidden',
            name: config.hiddenName + '[]',
            inputValue: '',
            itemId: '',
            hidden: true,
            checked: true
        }],
        msgTarget: 'under',
        listeners: {
            afterrender: {fn: this.onAfterRender, scope: this}

        }
    });
    Msfm.group.CheckboxGroup.superclass.constructor.call(this, config);
};
Ext.extend(Msfm.group.CheckboxGroup, Ext.form.CheckboxGroup, {
    onAfterRender: function () {
        if (this.url) {
            this.loadData();
        } else {
            this.setup();
        }
    },
    loadData: function () {
        MODx.Ajax.request({
            url: this.url,
            params: this.baseParams,
            listeners: {
                success: {
                    fn: function (r) {
                        this.setup(r.results);
                    },
                    scope: this
                }
            }
        });
    },
    setup: function (data) {
        if (data) {
            Ext.each(data || [], function (item) {
                this.addItem({
                    boxLabel: item[this.displayField],
                    name: this.hiddenName + '[]',
                    inputValue: item[this.valueField],
                    checked: this.checkValue(item[this.valueField])
                });
            }, this);
        } else {
            Ext.each(this.items.items || [], function (item) {
                if (!item.hidden) {
                    item.setValue(this.checkValue(item.inputValue));
                }
            }, this);
            this.addItem({
                boxLabel: 'hidden',
                name: this.hiddenName + '[]',
                inputValue: '',
                itemId: '',
                hidden: true,
                checked: true
            });
        }
    },
    addItem: function (data) {
        var checkbox = new Ext.form.Checkbox(data),
            col = this.panel.items.get(this.items.getCount() % this.panel.items.getCount());
        this.items.add(checkbox);
        col.add(checkbox);
    },
    checkValue: function (val) {
        var checked = false;
        Ext.each(this.values || [], function (item) {
            if (item.value == val) {
                checked = true;
                return false;
            }
        });
        return checked;
    },
    validateValue: function (b) {
        var valid = false;
        if (this.allowBlank) return true;
        Ext.each(this.items.items || [], function (item) {
            if (!item.hidden && item.getValue()) {
                valid = true;
                return false;
            }
        }, this);
        if (!valid) this.markInvalid(this.blankText);
        return valid;
    }

});
Ext.reg('msfm-checkboxgroup', Msfm.group.CheckboxGroup);