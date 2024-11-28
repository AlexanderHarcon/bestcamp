Polylang.grid.PolylangLanguageGroup = function (config) {
    config = config || {};
    if (!config.id) {
        config.id = 'polylang-grid-polylanglanguagegroup';
    }
    Ext.applyIf(config, {
        baseParams: {
            action: 'mgr/polylanglanguagegroup/getList',
            sort: 'rank',
            dir: 'ASC',
        },
        autoExpandColumn: 'id',
        save_action: 'mgr/polylanglanguagegroup/updateFromGrid',
        enableDragDrop: true,
        multi_select: true,
        ddGroup: 'dd',
        ddAction: 'mgr/polylanglanguagegroup/sort'
    });

    Polylang.grid.PolylangLanguageGroup.superclass.constructor.call(this, config)
};
Ext.extend(Polylang.grid.PolylangLanguageGroup, Polylang.grid.Default, {
    getFields: function () {
        return ['id', 'name', 'icon', 'rank', 'description', 'actions'];
    },
    getColumns: function () {
        return [{
            header: _('id'),
            dataIndex: 'id',
            sortable: true,
            width: 30
        }, {
            header: _('polylang_polylanglanguagegroup_header_icon'),
            dataIndex: 'icon',
            sortable: true,
            width: 60,
            editor: {
                xtype: 'textfield'
            },
        }, {
            header: _('polylang_polylanglanguagegroup_header_name'),
            dataIndex: 'name',
            sortable: true,
            editor: {
                xtype: 'textfield'
            },
        }, {
            header: _('polylang_polylanglanguagegroup_header_description'),
            dataIndex: 'description',
            sortable: true,
            editor: {
                xtype: 'textfield'
            },
        }, {
            header: _('polylang_polylanglanguagegroup_header_rank'),
            dataIndex: 'rank',
            sortable: true,
            editor: {
                xtype: 'numberfield'
            },
        }, {
            header: _('polylang_polylanglanguagegroup_header_actions'),
            dataIndex: 'actions',
            renderer: Polylang.utils.renderActions,
            width: 60
        }];
    },
    getTopBar: function (config) {
        var tbar = [];
        tbar.push({
            text: '<i class="icon icon-plus"></i> ' + _('polylang_polylanglanguagegroup_btn_create'),
            handler: this.addItem,
            cls: 'primary-button',
            scope: this
        });
        /*tbar.push({
            text: '<i class="fa fa-cogs"></i> ',
            menu: [{
                text: '<i class="fa fa-plus"></i> ' + _('polylang_polylanglanguagegroup_btn_create'),
                cls: 'polylang-cogs',
                handler: this.addItem,
                scope: this
            }, '-', {
                text: '<i class="fa fa-refresh"></i> ' + _('polylang_polylanglanguagegroup_btn_update'),
                cls: 'polylang-cogs',
                handler: this.updateItem,
                scope: this
            }]
        });*/
        tbar.push('->', this.getSearchField());

        return tbar;
    }
    , actionItem: function (method) {
        var ids = this._getSelectedIds();
        if (!ids.length) {
            return false;
        }
        MODx.Ajax.request({
            url: Polylang.config.connector_url,
            params: {
                action: 'mgr/polylanglanguagegroup/multiple',
                method: method,
                ids: Ext.util.JSON.encode(ids),
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
        var record = {};
        var w = Ext.getCmp('polylang-window-polylanglanguagegroup-create');
        if (w) {
            w.close();
        }
        w = MODx.load({
            xtype: 'polylang-window-polylanglanguagegroup-create',
            id: 'polylang-window-polylanglanguagegroup-create',
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
                action: 'mgr/polylanglanguagegroup/get',
                id: id
            },
            listeners: {
                success: {
                    fn: function (r) {
                        var w = Ext.getCmp('polylang-window-polylanglanguagegroup-update');
                        if (w) {
                            w.close();
                        }
                        w = MODx.load({
                            xtype: 'polylang-window-polylanglanguagegroup-update',
                            id: 'polylang-window-polylanglanguagegroup-update',
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
    removeItem: function () {
        var ids = this._getSelectedIds();
        Ext.MessageBox.confirm(
            _('polylang_polylanglanguagegroup_title_win_remove'),
            ids.length > 1
                ? _('polylang_polylanglanguagegroup_confirm.multiple_remove')
                : _('polylang_polylanglanguagegroup_confirm_remove'),
            function (val) {
                if (val == 'yes') {
                    this.actionItem('remove');
                }
            }, this
        );
    }

});
Ext.reg('polylang-grid-polylanglanguagegroup', Polylang.grid.PolylangLanguageGroup);


Polylang.window.CreatePolylangLanguageGroup = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        title: config.record.id ? _('polylang_polylanglanguagegroup_title_win_update') : _('polylang_polylanglanguagegroup_title_win_create'),
        baseParams: {
            action: config.record.id ? 'mgr/polylanglanguagegroup/update' : 'mgr/polylanglanguagegroup/create'
        }
    });
    Polylang.window.CreatePolylangLanguageGroup.superclass.constructor.call(this, config);
};
Ext.extend(Polylang.window.CreatePolylangLanguageGroup, Polylang.window.Default, {
    getFields: function (config) {
        return [{
            xtype: 'hidden',
            name: 'id',
        }, {
            xtype: 'textfield',
            fieldLabel: _('polylang_polylanglanguagegroup_label_name'),
            name: 'name',
            allowBlank: false,
            anchor: '100%',
        }, {
            xtype: 'label',
            html: _('polylang_polylanglanguagegroup_label_name_help'),
            cls: 'desc-under'
        }, {
            xtype: 'textarea',
            fieldLabel: _('polylang_polylanglanguagegroup_label_description'),
            name: 'description',
            allowBlank: true,
            anchor: '100%',
        }, {
            xtype: 'label',
            html: _('polylang_polylanglanguagegroup_label_description_help'),
            cls: 'desc-under'
        }, {
            xtype: 'textfield',
            fieldLabel: _('polylang_polylanglanguagegroup_label_icon'),
            name: 'icon',
            allowBlank: true,
            anchor: '100%',
        }, {
            xtype: 'label',
            html: _('polylang_polylanglanguagegroup_label_icon_help'),
            cls: 'desc-under'
        }];
    },
});
Ext.reg('polylang-window-polylanglanguagegroup-create', Polylang.window.CreatePolylangLanguageGroup);

Polylang.window.UpdatePolylangLanguageGroup = function (config) {
    config = config || {};
    Ext.applyIf(config, {});
    Polylang.window.UpdatePolylangLanguageGroup.superclass.constructor.call(this, config);
};

Ext.extend(Polylang.window.UpdatePolylangLanguageGroup, Polylang.window.CreatePolylangLanguageGroup);
Ext.reg('polylang-window-polylanglanguagegroup-update', Polylang.window.UpdatePolylangLanguageGroup);