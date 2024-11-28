Polylang.grid.PolylangSeoPattern = function (config) {
    config = config || {};
    if (!config.id) {
        config.id = 'polylang-grid-polylangseopattern';
    }
    Ext.applyIf(config, {
        baseParams: {
            action: 'mgr/polylangseopattern/getList',
            sort: 'id',
            dir: 'DESC',
        },
        autoExpandColumn: 'id',
        save_action: 'mgr/polylangseopattern/updateFromGrid',
        multi_select: true,
    });

    Polylang.grid.PolylangSeoPattern.superclass.constructor.call(this, config)
};
Ext.extend(Polylang.grid.PolylangSeoPattern, Polylang.grid.Default, {
    getFields: function () {
        return ['id', 'field_id', 'language_id', 'field_name', 'language_name', 'language_culture_key', 'template', 'value', 'active', 'actions'];
    },
    getColumns: function (config) {
        return [config.sm, {
            header: _('id'),
            dataIndex: 'id',
            width: 30,
            sortable: true,
        }, {
            header: _('polylang_polylangseopattern_header_field_id'),
            dataIndex: 'field_name',
            sortable: true,
        }, {
            header: _('polylang_polylangseopattern_header_language_id'),
            dataIndex: 'language_name',
            sortable: true,
            renderer: function (value, props, row) {
                return value + ' (' + row.data.language_culture_key + ')';
            }
        }, {
            header: _('polylang_polylangseopattern_header_template'),
            dataIndex: 'template',
            sortable: false,
        }, {
            header: _('polylang_polylangseopattern_header_value'),
            dataIndex: 'value',
            sortable: true,
            editor: {
                xtype: 'textfield'
            },
        }, {
            header: _('polylang_polylangseopattern_header_active'),
            dataIndex: 'active',
            sortable: true,
            width: 40,
            editor: {
                xtype: 'combo-boolean',
                renderer: 'boolean'
            },
        }, {
            header: _('polylang_polylangseopattern_header_actions'),
            dataIndex: 'actions',
            renderer: Polylang.utils.renderActions,
            width: 60
        }];
    },
    getTopBar: function (config) {
        var tbar = [];
        tbar.push({
            text: '<i class="icon icon-plus"></i> ' + _('polylang_polylangseopattern_btn_create'),
            handler: this.addItem,
            cls: 'primary-button',
            scope: this
        });
        /*tbar.push({
            text: '<i class="fa fa-cogs"></i> ',
            menu: [{
                text: '<i class="fa fa-plus"></i> ' + _('polylang_polylangseopattern_btn_create'),
                cls: 'polylang-cogs',
                handler: this.addItem,
                scope: this
            }, '-', {
                text: '<i class="fa fa-refresh"></i> ' + _('polylang_polylangseopattern_btn_update'),
                cls: 'polylang-cogs',
                handler: this.updateItem,
                scope: this
            }]
        });*/
        tbar.push('->', {
            xtype: 'tbtext',
            text: _('polylang_polylangseopattern_filter_language')
        }, this.getLanguageField(), this.getSearchField());

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
                action: 'mgr/polylangseopattern/multiple',
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
            value: '',
            template: '',
            active: 1,
        };
        var w = Ext.getCmp('polylang-window-polylangseopattern-create');
        if (w) {
            w.close();
        }
        w = MODx.load({
            xtype: 'polylang-window-polylangseopattern-create',
            id: 'polylang-window-polylangseopattern-create',
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
                action: 'mgr/polylangseopattern/get',
                id: id
            },
            listeners: {
                success: {
                    fn: function (r) {
                        var w = Ext.getCmp('polylang-window-polylangseopattern-update');
                        if (w) {
                            w.close();
                        }
                        w = MODx.load({
                            xtype: 'polylang-window-polylangseopattern-update',
                            id: 'polylang-window-polylangseopattern-update',
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
    cloneItem: function (btn, e, row) {
        if (typeof (row) != 'undefined') {
            this.menu.record = row.data;
        }
        MODx.Ajax.request({
            url: Polylang.config.connector_url,
            params: {
                action: 'mgr/polylanglanguage/getlist',
                onlyActive: 1,
                limit: 0,
                exclude: this.menu.record.language_culture_key,
                excludeDefaultLanguage: 0,
            },
            listeners: {
                success: {
                    fn: function (r) {
                        var w = Ext.getCmp('polylang-window-polylangseopattern-clone');
                        if (w) {
                            w.close();
                        }
                        w = MODx.load({
                            xtype: 'polylang-window-polylangseopattern-clone',
                            id: 'polylang-window-polylangseopattern-clone',
                            record: this.menu.record,
                            languages: r.results,
                            listeners: {
                                success: {
                                    fn: function () {
                                        this.refresh();
                                    }, scope: this
                                },
                            }
                        });
                        w.fp.getForm().reset();
                        w.fp.getForm().setValues(this.menu.record);
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
            _('polylang_polylangseopattern_title_win_remove'),
            ids.length > 1
                ? _('polylang_polylangseopattern_confirm_multiple_remove')
                : _('polylang_polylangseopattern_confirm_remove'),
            function (val) {
                if (val == 'yes') {
                    this.actionItem('remove');
                }
            }, this
        );
    },
    getLanguageField: function () {
        return {
            xtype: 'polylang-combo-seo-language',
            id: 'polylang-filter-seo-language',
            excludeDefaultLanguage: 0,
            width: 250,
            listeners: {
                select: {
                    fn: function (combo) {
                        this.getStore().baseParams.language = combo.getValue();
                        this.getBottomToolbar().changePage(1);
                    }, scope: this
                },
                clear: {
                    fn: function (combo) {
                        this.getStore().baseParams.language = '';
                        this.getBottomToolbar().changePage(1);
                    }, scope: this
                }
            }
        };
    }

});
Ext.reg('polylang-grid-polylangseopattern', Polylang.grid.PolylangSeoPattern);


Polylang.window.CreatePolylangSeoPattern = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        title: config.record.id ? _('polylang_polylangseopattern_title_win_update') : _('polylang_polylangseopattern_title_win_create'),
        baseParams: {
            action: config.record.id ? 'mgr/polylangseopattern/update' : 'mgr/polylangseopattern/create'
        }
    });
    Polylang.window.CreatePolylangSeoPattern.superclass.constructor.call(this, config);
};
Ext.extend(Polylang.window.CreatePolylangSeoPattern, Polylang.window.Default, {
    getFields: function (config) {
        return [{
            xtype: 'hidden',
            name: 'id',
        }, {
            xtype: 'polylang-combo-seo-field',
            fieldLabel: _('polylang_polylangseopattern_label_field_id'),
            name: 'field_id',
            allowBlank: false,
            anchor: '100%',
        }, {
            xtype: 'label',
            html: _('polylang_polylangseopattern_label_field_id_help'),
            cls: 'desc-under'
        }, {
            xtype: 'polylang-combo-seo-language',
            fieldLabel: _('polylang_polylangseopattern_label_language_id'),
            name: 'language_id',
            excludeDefaultLanguage: 0,
            allowBlank: false,
            anchor: '100%',
        }, {
            xtype: 'label',
            html: _('polylang_polylangseopattern_label_language_id_help'),
            cls: 'desc-under'
        }, {
            xtype: 'polylang-combo-seo-template',
            fieldLabel: _('polylang_polylangseopattern_label_template'),
            name: 'template',
            allowBlank: false,
            anchor: '100%',
        }, {
            xtype: 'label',
            html: _('polylang_polylangseopattern_label_template_help'),
            cls: 'desc-under'
        }, {
            xtype: Ext.ComponentMgr.types['modx-texteditor'] ? 'modx-texteditor' : 'textarea',
            mimeType: 'text/plain',
            height: 80,
            fieldLabel: _('polylang_polylangseopattern_label_value'),
            name: 'value',
            allowBlank: true,
            anchor: '100%',
        }, {
            xtype: 'label',
            html: _('polylang_polylangseopattern_label_value_help'),
            cls: 'desc-under'
        }, {
            xtype: 'polylang-combo-boolean',
            fieldLabel: _('polylang_polylangseopattern_label_active'),
            name: 'active',
            allowBlank: false,
            anchor: '100%',
        }, {
            xtype: 'label',
            html: _('polylang_polylangseopattern_label_active_help'),
            cls: 'desc-under'
        }];
    },
});
Ext.reg('polylang-window-polylangseopattern-create', Polylang.window.CreatePolylangSeoPattern);

Polylang.window.UpdatePolylangSeoPattern = function (config) {
    config = config || {};
    Ext.applyIf(config, {});
    Polylang.window.UpdatePolylangSeoPattern.superclass.constructor.call(this, config);
};
Ext.extend(Polylang.window.UpdatePolylangSeoPattern, Polylang.window.CreatePolylangSeoPattern);
Ext.reg('polylang-window-polylangseopattern-update', Polylang.window.UpdatePolylangSeoPattern);


Polylang.window.ClonePolylangSeoPattern = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        title: _('polylang_polylangseopattern_title_win_clone'),
        width: 600,
        height: 400,
        autoHeight: false,
        autoScroll: true,
        buttonAlign: 'left',
        saveBtnIcon: 'clone',
        saveBtnText: _('polylang_polylangseopattern_btn_clone'),
        baseParams: {
            action: 'mgr/polylangseopattern/clone'
        }
    });
    Polylang.window.ClonePolylangSeoPattern.superclass.constructor.call(this, config);
};
Ext.extend(Polylang.window.ClonePolylangSeoPattern, Polylang.window.Default, {
    getFields: function (config) {
        var fields = [{
            xtype: 'hidden',
            name: 'id',
        }, {
            xtype: 'modx-description',
            html: _('polylang_polylangseopattern_clone_help'),
            style: 'margin-top:15px',
        }];
        Ext.each(config.languages || [], function (record) {
            fields.push({
                xtype: 'xcheckbox',
                hideLabel: true,
                name: 'languages[' + record.id + ']',
                inputValue: 1,
                checked: false,
                parent: record.parent || 0,
                value: 1,
                boxLabel: record.name + ' (' + record.culture_key + ')',
            });
        }, this);
        return fields;
    },
    getButtons: function (config) {
        var buttons = Polylang.window.ClonePolylangSeoPattern.superclass.getButtons.call(this, config);
        // buttons.unshift({xtype: 'splitbutton'});
        buttons.unshift('->');
        buttons.unshift({
            xtype: 'xcheckbox',
            inputValue: 1,
            hideLabel: true,
            checked: false,
            value: 1,
            boxLabel: _('polylang_polylangseopattern_only_dependent_languages'),
            listeners: {
                check: {fn: this.filterLanguages, scope: this}
            }
        });
        return buttons;
    },
    filterLanguages: function (cb, checked) {
        var items = this.fp.getForm().items,
            id = this.record.language_id;
        for (var i = 0; i < items.getCount(); i++) {
            var field = items.itemAt(i);
            if (field.isXType('xcheckbox')) {
                if (field.parent != id) {
                    if (checked) {
                        field.setDisabled(checked).hide();
                    } else {
                        field.setDisabled(checked).show();
                    }
                }
            }
        }
    }

});
Ext.reg('polylang-window-polylangseopattern-clone', Polylang.window.ClonePolylangSeoPattern);