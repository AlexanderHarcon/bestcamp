Polylang.grid.LexiconEntries = function (config) {
    config = config || {};
    if (!config.id) {
        config.id = 'polylang-grid-lexiconentries';
    }
    Ext.applyIf(config, {
        baseParams: {
            action: 'mgr/lexiconentries/getList',
            language: config.language || '',
            sort: 'name',
            dir: 'ASC',
        },
        autoExpandColumn: 'id',
        save_action: 'mgr/lexiconentries/updateFromGrid',
    });

    Polylang.grid.LexiconEntries.superclass.constructor.call(this, config)
};
Ext.extend(Polylang.grid.LexiconEntries, Polylang.grid.Default, {
    getFields: function () {
        return ['id', 'name', 'value', 'topic', 'namespace', 'language', 'overridden', 'createdon', 'editedon', 'actions'];
    },
    getColumns: function (config) {
        return [config.sm, {
            header: _('id'),
            dataIndex: 'id',
            sortable: true,
            hidden: true,
        }, {
            header: _('polylang_lexiconentries_header_language'),
            dataIndex: 'language',
            sortable: true,
            hidden: true,
        }, {
            header: _('polylang_lexiconentries_header_name'),
            dataIndex: 'name',
            sortable: true,
            renderer: this.renderStatus
        }, {
            header: _('polylang_lexiconentries_header_value'),
            dataIndex: 'value',
            sortable: true,
            editor: {
                xtype: 'textarea'
            },
            renderer: this.renderStatus
        }, {
            header: _('polylang_lexiconentries_header_editedon'),
            dataIndex: 'editedon',
            sortable: true,
            width: 125,
            renderer: this.renderLastModDate
        }, {
            header: _('polylang_lexiconentries_header_actions'),
            dataIndex: 'actions',
            renderer: Polylang.utils.renderActions,
            width: 60
        }];
    },
    getTopBar: function (config) {
        var tbar = [];
        tbar.push({
            text: '<i class="icon icon-plus"></i> ' + _('polylang_lexiconentries_btn_create'),
            handler: this.addItem,
            cls: 'primary-button',
            scope: this
        });
        tbar.push({
            text: '<i class="fa fa-cogs"></i> ',
            menu: [{
                text: '<i class="fa fa-language gray"></i> ' + _('polylang_lexiconentries_tbar_btn_translate'),
                cls: 'polylang-cogs',
                handler: this.translateAllItems,
                scope: this
            }, {
                text: '<i class="fa fa-clone blue"></i> ' + _('polylang_lexiconentries_tbar_btn_clone'),
                cls: 'polylang-cogs',
                handler: this.cloneAllItems,
                scope: this
            }, '-', {
                text: '<i class="fa fa-upload green"></i> ' + _('polylang_lexiconentries_tbar_btn_import'),
                cls: 'polylang-cogs',
                handler: this.importItems,
                scope: this
            }, {
                text: '<i class="fa fa-download purple"></i> ' + _('polylang_lexiconentries_tbar_btn_export'),
                cls: 'polylang-cogs',
                handler: this.exportItems,
                scope: this
            }]
        });
        tbar.push('->', {
            xtype: 'tbtext',
            text: _('language') + ':'
        }, this.getLanguagesField(config), this.getSearchField(300));
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
                action: 'mgr/lexiconentries/multiple',
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
        var record = {
            isNew: 1,
            value: '',
            name: 'polylang_site_',
            language: Ext.getCmp('polylang-filter-language').getValue()
        };
        var w = Ext.getCmp('polylang-window-lexiconentries-create');
        if (w) {
            w.close();
        }
        w = MODx.load({
            xtype: 'polylang-window-lexiconentries-create',
            id: 'polylang-window-lexiconentries-create',
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
        var w = Ext.getCmp('polylang-window-lexiconentries-update');
        if (w) {
            w.close();
        }
        w = MODx.load({
            xtype: 'polylang-window-lexiconentries-update',
            id: 'polylang-window-lexiconentries-update',
            record: this.menu.record,
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
    },
    cloneItem: function (btn, e, row) {
        var lexicons = this._getSelectedIds('name');
        if (!lexicons.length) {
            return false;
        }
        this.cloneLexicons({
            all: 0,
            lexicons: Ext.util.JSON.encode(lexicons),
        });
    },
    cloneAllItems: function () {
        this.cloneLexicons({
            all: 1,
        });
    },
    translateItem: function (btn, e, row) {
        var lexicons = this._getSelectedIds('name');
        if (!lexicons.length) {
            return false;
        }
        this.translateLexicons({
            all: 0,
            lexicons: Ext.util.JSON.encode(lexicons),
        });
    },
    translateAllItems: function () {
        this.translateLexicons({
            all: 1,
        });
    },
    removeItem: function () {
        var ids = this._getSelectedIds();
        Ext.MessageBox.confirm(
            _('polylang_lexiconentries_title_win_remove'),
            ids.length > 1
                ? _('polylang_lexiconentries_confirm_multiple_remove')
                : _('polylang_lexiconentries_confirm_remove'),
            function (val) {
                if (val == 'yes') {
                    this.actionItem('remove');
                }
            }, this
        );
    },
    cloneLexicons: function (record) {
        record = record || {};
        var w = Ext.getCmp('polylang-window-lexiconentries-clone');
        if (w) {
            w.close();
        }
        w = MODx.load({
            xtype: 'polylang-window-lexiconentries-clone',
            id: 'polylang-window-lexiconentries-clone',
            record: record,
            language: Ext.getCmp('polylang-filter-language'),
            listeners: {
                success: {
                    fn: function () {
                        this.refresh();
                    }, scope: this
                },
            }
        });
        w.fp.getForm().setValues(record);
        w.show();
    },
    translateLexicons: function (record) {
        record = record || {};
        var w = Ext.getCmp('polylang-window-lexiconentries-translate');
        if (w) {
            w.close();
        }
        w = MODx.load({
            xtype: 'polylang-window-lexiconentries-translate',
            id: 'polylang-window-lexiconentries-translate',
            record: record,
            language: Ext.getCmp('polylang-filter-language'),
            listeners: {
                success: {
                    fn: function () {
                        this.refresh();
                    }, scope: this
                },
            }
        });
        w.fp.getForm().setValues(record);
        w.show();
    },
    importItems: function () {
        var w = Ext.getCmp('polylang-window-lexiconentries-import');
        if (w) {
            w.close();
        }
        w = MODx.load({
            xtype: 'polylang-window-lexiconentries-import',
            id: 'polylang-window-lexiconentries-import',
            listeners: {
                success: {
                    fn: function () {
                        this.refresh();
                    }, scope: this
                },
            }
        });
        w.show();
    },
    exportItems: function () {
        var w = Ext.getCmp('polylang-window-lexiconentries-export');
        if (w) {
            w.close();
        }
        w = MODx.load({
            xtype: 'polylang-window-lexiconentries-export',
            id: 'polylang-window-lexiconentries-export',
            language: Ext.getCmp('polylang-filter-language'),
            listeners: {
                success: {
                    fn: function (r) {
                        location.href = Polylang.config.connector_url + '?action=mgr/lexiconentries/export&download=1&file=' + r.a.result.message + '&HTTP_MODAUTH=' + MODx.siteId;
                    }, scope: this
                },
            }
        });
        w.show();
    },
    renderStatus: function (v, md, rec, ri) {
        switch (rec.data.overridden) {
            case 1:
                return '<span style="color: green;">' + v + '</span>';
                break;
            case 2:
                return '<span style="color: purple;">' + v + '</span>';
            default:
                return '<span>' + v + '</span>';
        }
    },
    renderLastModDate: function (value) {
        if (Ext.isEmpty(value)) {
            return '—';
        }
        return new Date(value * 1000).format(MODx.config.manager_date_format + ' ' + MODx.config.manager_time_format);
    },
    getLanguagesField: function (config) {
        return {
            xtype: 'polylang-combo-language',
            id: 'polylang-filter-language',
            onlyActive: 0,
            excludeDefaultLanguage: 0,
            value: config.language || 'en',
            listeners: {
                select: {
                    fn: function (combo) {
                        this.getStore().baseParams.language = combo.getValue();
                        this.getBottomToolbar().changePage(1);
                    }, scope: this
                },
                clear: {
                    fn: function (combo) {
                        combo.setValue(this.language);
                        this.getStore().baseParams.language = this.language;
                        this.getBottomToolbar().changePage(1);
                    }, scope: this
                }
            }
        };
    }

});
Ext.reg('polylang-grid-lexiconentries', Polylang.grid.LexiconEntries);

Polylang.window.CreateLexiconEntries = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        title: config.record.isNew ? _('polylang_lexiconentries_title_win_create') : _('polylang_lexiconentries_title_win_update'),
        baseParams: {
            action: config.record.isNew ? 'mgr/lexiconentries/create' : 'mgr/lexiconentries/update'
        }
    });
    Polylang.window.CreateLexiconEntries.superclass.constructor.call(this, config);
};
Ext.extend(Polylang.window.CreateLexiconEntries, Polylang.window.Default, {
    getFields: function (config) {
        return [{
            xtype: 'hidden',
            name: 'id',
        }, {
            xtype: 'hidden',
            name: 'language',
        }, {
            xtype: config.record.isNew ? 'textfield' : 'hidden',
            fieldLabel: _('polylang_lexiconentries_label_name'),
            name: 'name',
            allowBlank: false,
            anchor: '100%',
        }, {
            xtype: config.record.isNew ? 'label' : 'hidden',
            html: _('polylang_lexiconentries_label_name_help'),
            cls: 'desc-under'
        }, {
            xtype: Ext.ComponentMgr.types['modx-texteditor'] ? 'modx-texteditor' : 'textarea',
            mimeType: 'text/html',
            fieldLabel: _('polylang_lexiconentries_label_value'),
            name: 'value',
            height: 300,
            allowBlank: true,
            anchor: '100%',
        }, {
            xtype: 'label',
            html: _('polylang_lexiconentries_label_value_help'),
            cls: 'desc-under'
        }];
    },
});
Ext.reg('polylang-window-lexiconentries-create', Polylang.window.CreateLexiconEntries);

Polylang.window.UpdateLexiconEntries = function (config) {
    config = config || {};
    Ext.applyIf(config, {});
    Polylang.window.UpdateLexiconEntries.superclass.constructor.call(this, config);
};
Ext.extend(Polylang.window.UpdateLexiconEntries, Polylang.window.CreateLexiconEntries);
Ext.reg('polylang-window-lexiconentries-update', Polylang.window.UpdateLexiconEntries);

Polylang.window.LexiconEntriesClone = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        title: _('polylang_lexiconentries_title_win_clone'),
        width: 600,
        height: 400,
        autoHeight: false,
        autoScroll: true,
        buttonAlign: 'left',
        saveBtnIcon: 'clone',
        saveBtnText: _('polylang_lexiconentries_btn_clone'),
        baseParams: {
            action: 'mgr/lexiconentries/clone'
        }
    });
    Polylang.window.LexiconEntriesClone.superclass.constructor.call(this, config);
};
Ext.extend(Polylang.window.LexiconEntriesClone, Polylang.window.Default, {
    getFields: function (config) {
        var keys = {},
            fields = [{
                xtype: 'hidden',
                name: 'all',
            }, {
                xtype: 'hidden',
                name: 'lexicons',
            }, {
                xtype: 'hidden',
                name: 'language',
                value: config.language.getValue()
            }, {
                xtype: 'modx-description',
                html: _('polylang_lexiconentries_clone_lexicon_help'),
                style: 'margin-top:15px',
            }];
        Ext.each(config.language.getStore().getRange() || [], function (record) {
            var key = record.data.culture_key;
            if (keys[key] == undefined && key != config.language.getValue()) {
                keys[key] = 1;
                fields.push({
                    xtype: 'xcheckbox',
                    hideLabel: true,
                    name: 'languages[' + key + ']',
                    inputValue: 1,
                    checked: false,
                    parent: record.data.parent || 0,
                    value: 1,
                    boxLabel: record.data.name + ' (' + key + ')',
                });
            }
        }, this);
        return fields;
    },
    getButtons: function (config) {
        var buttons = Polylang.window.LexiconEntriesClone.superclass.getButtons.call(this, config);
        // buttons.unshift({xtype: 'splitbutton'});
        buttons.unshift('->');
        buttons.unshift({
            xtype: 'xcheckbox',
            inputValue: 1,
            hideLabel: true,
            checked: false,
            value: 1,
            boxLabel: _('polylang_lexiconentries_only_dependent_languages'),
            listeners: {
                check: {fn: this.filterLanguages, scope: this}
            }
        });
        return buttons;
    },
    filterLanguages: function (cb, checked) {
        var items = this.fp.getForm().items,
            id = this.language.getSelectedRecord().get('id');
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
Ext.reg('polylang-window-lexiconentries-clone', Polylang.window.LexiconEntriesClone);

Polylang.window.LexiconEntriesTranslate = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        title: _('polylang_lexiconentries_title_win_translate'),
        width: 600,
        height: 400,
        autoHeight: false,
        autoScroll: true,
        buttonAlign: 'left',
        saveBtnIcon: 'language',
        saveBtnText: _('polylang_lexiconentries_btn_translate'),
        baseParams: {
            action: 'mgr/lexiconentries/translate'
        }
    });
    Polylang.window.LexiconEntriesTranslate.superclass.constructor.call(this, config);
};
Ext.extend(Polylang.window.LexiconEntriesTranslate, Polylang.window.Default, {
    getFields: function (config) {
        var keys = {},
            fields = [{
                xtype: 'hidden',
                name: 'all',
            }, {
                xtype: 'hidden',
                name: 'lexicons',
            }, {
                xtype: 'hidden',
                name: 'language',
                value: config.language.getValue()
            }, {
                xtype: 'modx-description',
                html: _('polylang_lexiconentries_translate_lexicon_help'),
                style: 'margin-top:15px',
            }];
        Ext.each(config.language.getStore().getRange() || [], function (record) {
            var key = record.data.culture_key;
            if (keys[key] == undefined && key != config.language.getValue()) {
                keys[key] = 1;
                fields.push({
                    xtype: 'xcheckbox',
                    hideLabel: true,
                    name: 'languages[' + key + ']',
                    inputValue: 1,
                    checked: false,
                    parent: record.data.parent || 0,
                    value: 1,
                    boxLabel: record.data.name + ' (' + key + ')',
                });
            }
        }, this);
        return fields;
    },
    getButtons: function (config) {
        var buttons = Polylang.window.LexiconEntriesClone.superclass.getButtons.call(this, config);
        // buttons.unshift({xtype: 'splitbutton'});
        buttons.unshift('->');
        buttons.unshift({
            xtype: 'xcheckbox',
            inputValue: 1,
            hideLabel: true,
            checked: false,
            value: 1,
            boxLabel: _('polylang_lexiconentries_only_independent_languages'),
            listeners: {
                check: {fn: this.filterLanguages, scope: this}
            }
        });
        return buttons;
    },
    filterLanguages: function (cb, checked) {
        var items = this.fp.getForm().items,
            id = this.language.getSelectedRecord().get('id');
        for (var i = 0; i < items.getCount(); i++) {
            var field = items.itemAt(i);
            if (field.isXType('xcheckbox')) {
                if (checked && field.parent == id) {
                    field.setDisabled(true).hide();
                } else {
                    field.setDisabled(false).show();
                }
            }
        }
    }
});
Ext.reg('polylang-window-lexiconentries-translate', Polylang.window.LexiconEntriesTranslate);

Polylang.window.LexiconEntriesExport = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        title: _('polylang_lexiconentries_title_win_export'),
        width: 600,
        height: 400,
        autoHeight: false,
        autoScroll: true,
        saveBtnIcon: 'download',
        saveBtnText: _('polylang_lexiconentries_btn_export'),
        baseParams: {
            action: 'mgr/lexiconentries/export'
        }
    });
    Polylang.window.LexiconEntriesExport.superclass.constructor.call(this, config);
};
Ext.extend(Polylang.window.LexiconEntriesExport, Polylang.window.Default, {
    getFields: function (config) {
        var fields = [{
            xtype: 'modx-description',
            html: _('polylang_lexiconentries_export_lexicon_help'),
            style: 'margin-top:15px',
        }];
        Ext.each(config.language.getStore().getRange() || [], function (record) {
            var key = record.data.culture_key;
            fields.push({
                xtype: 'xcheckbox',
                hideLabel: true,
                name: 'languages[' + key + ']',
                inputValue: 1,
                checked: true,
                parent: record.data.parent || 0,
                value: 1,
                boxLabel: record.data.name + ' (' + key + ')',
            });
        }, this);
        return fields;
    }
});
Ext.reg('polylang-window-lexiconentries-export', Polylang.window.LexiconEntriesExport);


Polylang.window.LexiconEntriesImport = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        title: _('polylang_lexiconentries_title_win_import'),
        width: 600,
        autoHeight: true,
        fileUpload: true,
        saveBtnIcon: 'upload',
        saveBtnText: _('polylang_lexiconentries_btn_import'),
        baseParams: {
            action: 'mgr/lexiconentries/import'
        }
    });
    Polylang.window.LexiconEntriesImport.superclass.constructor.call(this, config);
};
Ext.extend(Polylang.window.LexiconEntriesImport, Polylang.window.Default, {
    getFields: function (config) {
        return [{
            xtype: 'modx-description',
            html: _('polylang_lexiconentries_import_lexicon_help'),
            style: 'margin-top:15px;margin-bottom: 10px;',
        }, {
            xtype: 'fileuploadfield',
            fieldLabel: _('file'),
            buttonText: _('upload.buttons.upload'),
            name: 'file',
            anchor: '100%',
        }, {
            xtype: 'xcheckbox',
            name: 'only_missing',
            inputValue: 1,
            hideLabel: true,
            checked: false,
            value: 1,
            boxLabel: _('polylang_lexiconentries_import_only_missing'),
        }];
    }
});
Ext.reg('polylang-window-lexiconentries-import', Polylang.window.LexiconEntriesImport);
