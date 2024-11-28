Polylang.grid.PolylangSeoFields = function (config) {
    config = config || {};
    if (!config.id) {
        config.id = 'polylang-grid-polylangseofields';
    }
    Ext.applyIf(config, {
        baseParams: {
            action: 'mgr/polylangseofields/getList',
            sort: 'id',
            dir: 'DESC',
        },
        autoExpandColumn: 'id',
        save_action: 'mgr/polylangseofields/updateFromGrid',
        multi_select: true,
        ddGroup: 'dd',

    });

    Polylang.grid.PolylangSeoFields.superclass.constructor.call(this, config)
};
Ext.extend(Polylang.grid.PolylangSeoFields, Polylang.grid.Default, {
    getFields: function () {
        return ['id', 'name', 'description', 'active', 'actions'];
    },
    getColumns: function (config) {
        return [config.sm, {
            header: _('id'),
            dataIndex: 'id',
            sortable: true,
            width: 30,
        }, {
            header: _('polylang_polylangseofields_header_name'),
            dataIndex: 'name',
            sortable: true,
        }, {
            header: _('polylang_polylangseofields_header_'),
            dataIndex: 'description',
            sortable: true,
            editor: {
                xtype: 'textfield'
            },
        }, {
            header: _('polylang_polylangseofields_header_active'),
            dataIndex: 'active',
            sortable: true,
            width: 40,
            editor: {
                xtype: 'combo-boolean',
                renderer: 'boolean'
            },
        }, {
            header: _('polylang_polylangseofields_header_actions'),
            dataIndex: 'actions',
            renderer: Polylang.utils.renderActions,
            width: 40
        }];
    },
    getTopBar: function (config) {
        var tbar = [];
        tbar.push({
            text: '<i class="icon icon-plus"></i> ' + _('polylang_polylangseofields_btn_create'),
            handler: this.addItem,
            cls: 'primary-button',
            scope: this
        });
        /*tbar.push({
            text: '<i class="fa fa-cogs"></i> ',
            menu: [{
                text: '<i class="fa fa-plus"></i> ' + _('polylang_polylangseofields_btn_create'),
                cls: 'polylang-cogs',
                handler: this.addItem,
                scope: this
            }, '-', {
                text: '<i class="fa fa-refresh"></i> ' + _('polylang_polylangseofields_btn_update'),
                cls: 'polylang-cogs',
                handler: this.updateItem,
                scope: this
            }]
        });*/
        tbar.push('->', this.getSearchField());

        return tbar;
    },
    actionItem: function (method) {
        var ids = this._getSelectedIds();
        if (!ids.length) {
            return false;
        }
        MODx.Ajax.request({
            url: Polylang.config.connector_url,
            params: {
                action: 'mgr/polylangseofields/multiple',
                method: method,
                values: Ext.util.JSON.encode(ids),
            },
            listeners: {
                success: {
                    fn: function (response) {
                        this.refresh();
                    }, scope: this
                },
                failure: {
                    fn: function (response) {
                        MODx.msg.alert(_('error'), response.message);
                    }, scope: this
                },
            }
        })
    },
    addItem: function (btn, e, row) {
        var record = {
            active: 1
        };
        var w = Ext.getCmp('polylang-window-polylangseofields-create');
        if (w) {
            w.close();
        }
        w = MODx.load({
            xtype: 'polylang-window-polylangseofields-create',
            id: 'polylang-window-polylangseofields-create',
            record: record,
            listeners: {
                success: {
                    fn: function () {
                        this.refresh();
                    }, scope: this
                }
            }
        });
        w.fp.getForm().reset();
        w.fp.getForm().setValues(record);
        w.show(e.target);
    },
    updateItem: function (btn, e, row) {
        if (typeof (row) != 'undefined') {
            this.menu.record = row.data;
        }
        var id = this.menu.record.id;
        MODx.Ajax.request({
            url: Polylang.config.connector_url,
            params: {
                action: 'mgr/polylangseofields/get',
                id: id
            },
            listeners: {
                success: {
                    fn: function (r) {
                        var w = Ext.getCmp('polylang-window-polylangseofields-update');
                        if (w) {
                            w.close();
                        }
                        w = MODx.load({
                            xtype: 'polylang-window-polylangseofields-update',
                            id: 'polylang-window-polylangseofields-update',
                            record: r.object,
                            listeners: {
                                success: {
                                    fn: function () {
                                        this.refresh();
                                    }, scope: this
                                },
                            }
                        });
                        w.fp.getForm().reset();
                        w.fp.getForm().setValues(r.object);
                        w.show(e.target);
                    }, scope: this
                }
            }
        });
    },
    enableItem: function () {
        this.actionItem('enable');
    },
    disableItem: function () {
        this.actionItem('disable');
    },
    removeItem: function () {
        var ids = this._getSelectedIds();
        Ext.MessageBox.confirm(
            _('polylang_polylangseofields_title_win_remove'),
            ids.length > 1
                ? _('polylang_polylangseofields_confirm_multiple_remove')
                : _('polylang_polylangseofields_confirm_remove'),
            function (val) {
                if (val == 'yes') {
                    this.actionItem('remove');
                }
            }, this
        );
    }

});
Ext.reg('polylang-grid-polylangseofields', Polylang.grid.PolylangSeoFields);


Polylang.window.CreatePolylangSeoFields = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        title: config.record.id ? _('polylang_polylangseofields_title_win_update') : _('polylang_polylangseofields_title_win_create'),
        baseParams: {
            action: config.record.id ? 'mgr/polylangseofields/update' : 'mgr/polylangseofields/create'
        }
    });
    Polylang.window.CreatePolylangSeoFields.superclass.constructor.call(this, config);
};
Ext.extend(Polylang.window.CreatePolylangSeoFields, Polylang.window.Default, {
    getFields: function (config) {
        return [{
            xtype: 'hidden',
            name: 'id',
        }, {
            xtype: 'polylang-field',
            fieldLabel: _('polylang_polylangseofields_label_name'),
            name: 'name',
            allowBlank: false,
            validator: function (v) {
                return /^[a-zA-Z\_0-9]*$/.test(v) ? true : _('polylang_polylangseofields_err_valid_name');
            },
            anchor: '100%',
        }, {
            xtype: 'label',
            html: _('polylang_polylangseofields_label_name_help'),
            cls: 'desc-under'
        }, {
            xtype: 'textarea',
            fieldLabel: _('polylang_polylangseofields_label_description'),
            name: 'description',
            allowBlank: true,
            anchor: '100%',
        }, {
            xtype: 'label',
            html: _('polylang_polylangseofields_label_description_help'),
            cls: 'desc-under'
        }, {
            xtype: 'polylang-combo-boolean',
            hiddenName: 'active',
            fieldLabel: _('polylang_polylangseofields_label_active'),
            name: 'active',
            allowBlank: false,
            anchor: '100%',
        }, {
            xtype: 'label',
            html: _('polylang_polylangseofields_label_active_help'),
            cls: 'desc-under'
        }];
    },
});
Ext.reg('polylang-window-polylangseofields-create', Polylang.window.CreatePolylangSeoFields);

Polylang.window.UpdatePolylangSeoFields = function (config) {
    config = config || {};
    Ext.applyIf(config, {});
    Polylang.window.UpdatePolylangSeoFields.superclass.constructor.call(this, config);
};

Ext.extend(Polylang.window.UpdatePolylangSeoFields, Polylang.window.CreatePolylangSeoFields);
Ext.reg('polylang-window-polylangseofields-update', Polylang.window.UpdatePolylangSeoFields);