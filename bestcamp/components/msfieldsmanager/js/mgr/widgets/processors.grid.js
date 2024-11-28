Msfm.grid.Processors = function (config) {
    config = config || {};
    if (!config.id) {
        config.id = 'msfm-grid-processors';
    }
    Ext.applyIf(config, {
        url: Msfm.config.connectorUrl
        , baseParams: {
            action: 'mgr/processors/getList'
            , sort: 'name'
            , dir: 'ASC'
        }
        , autoExpandColumn: 'name'
        , save_action: 'mgr/processors/updateFromGrid'
    });
    Msfm.grid.Processors.superclass.constructor.call(this, config)
};
Ext.extend(Msfm.grid.Processors, Msfm.grid.Default, {
    getFields: function () {
        return ['id', 'name', 'display_field', 'value_field', 'sort_field', 'table_name', 'processor', 'actions'];
    }
    , getColumns: function () {
        return [{
            header: _('id')
            , dataIndex: 'id'
            , sortable: true
            , hidden: true
        }, {
            header: _('msfieldsmanager.processor.header_name')
            , dataIndex: 'name'
            , sortable: true
        }, {
            header: _('msfieldsmanager.processor.header_display_field')
            , dataIndex: 'display_field'
            , sortable: true
        }, {
            header: _('msfieldsmanager.processor.header_value_field')
            , dataIndex: 'value_field'
            , sortable: true
        }, {
            header: _('msfieldsmanager.processor.header_sort_field')
            , dataIndex: 'sort_field'
            , sortable: true
        }, {
            header: _('msfieldsmanager.processor.header_actions')
            , dataIndex: 'actions'
            , renderer: Msfm.utils.renderActions
            , width: 60

        }];
    }
    , getTopBar: function (config) {
        var tbar = [];
        tbar.push({
            text: '<i class="icon icon-plus"></i> ' + _('msfieldsmanager.processor.btn_create'),
            handler: this.addItem,
            cls: 'primary-button',
            scope: this
        });

        tbar.push('->', this.getSearchField());

        return tbar;
    }
    , actionItem: function (method) {
        var ids = this._getSelectedIds();
        if (!ids.length) {
            return false;
        }
        MODx.Ajax.request({
            url: Msfm.config.connectorUrl,
            params: {
                action: 'mgr/processors/multiple',
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
    }
    , addItem: function (btn, e, row) {
        var record = {
            processor: ''
        };
        var w = Ext.getCmp('msfieldsmanager-window-processors-create');
        if (w) {
            w.close();
        }
        w = MODx.load({
            xtype: 'msfieldsmanager-window-processors-create'
            , id: 'msfieldsmanager-window-processors-create'
            , record: record
            , listeners: {
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
    }
    , updateItem: function (btn, e, row) {
        if (typeof(row) != 'undefined') {
            this.menu.record = row.data;
        }
        var id = this.menu.record.id;
        MODx.Ajax.request({
            url: Msfm.config.connectorUrl,
            params: {
                action: 'mgr/processors/get',
                id: id
            },
            listeners: {
                success: {
                    fn: function (r) {
                        var w = Ext.getCmp('msfm-window-processors-edit');
                        if (w) {
                            w.close();
                        }
                        w = MODx.load({
                            xtype: 'msfm-window-processors-edit',
                            id: 'msfm-window-processors-edit',
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
    }
    , removeItem: function () {
        var ids = this._getSelectedIds();
        Ext.MessageBox.confirm(
            _('msfieldsmanager.processor.title.win_remove'),
            ids.length > 1
                ? _('msfieldsmanager.processor.confirm.multiple_remove')
                : _('msfieldsmanager.processor.confirm.remove'),
            function (val) {
                if (val == 'yes') {
                    this.actionItem('remove');
                }
            }, this
        );
    }
});
Ext.reg('msfm-grid-processors', Msfm.grid.Processors);

Msfm.window.CreateProcessors = function (config) {
    config = config || {};
    var r = config.record;
    this.ident = config.ident || Ext.id();
    Ext.applyIf(config, {
        title: _('msfieldsmanager.processor.title.win_create')
        , url: Msfm.config.connectorUrl
        , autoHeight: true
        , width: 600
        , modal: true
        , keys: []
        , baseParams: {
            action: 'mgr/processors/create'
        }
        , fields: [{
            xtype: 'hidden'
            , name: 'id'
            , value: r.id || ''
        }, {
            xtype: 'textfield'
            , fieldLabel: _('msfieldsmanager.processor.label_name')
            , description: _('msfieldsmanager.processor.label_name_help')
            , name: 'name'
            , allowBlank: false
            , anchor: '100%'
            , disabled: r.id ? true : false
            , validator: function (v) {
                return /^[a-zA-Z\_0-9]*$/.test(v) ? true : _('msfieldsmanager.err_valid_name');
            }
        }, {
            xtype: 'textfield'
            , fieldLabel: _('msfieldsmanager.processor.label_url')
            , description: _('msfieldsmanager.processor.label_url_help')
            , name: 'processor_url'
            , allowBlank: true
            , anchor: '100%'
            , readOnly: true
            , hidden: r.id ? false : true
        }, {
            xtype: 'textfield'
            , fieldLabel: _('msfieldsmanager.processor.label_action')
            , description: _('msfieldsmanager.processor.label_action_help')
            , name: 'processor_action'
            , allowBlank: true
            , anchor: '100%'
            , readOnly: true
            , hidden: r.id ? false : true
        }, {
            xtype: 'msfm-combo-table'
            , fieldLabel: _('msfieldsmanager.processor.label_table')
            , description: _('msfieldsmanager.processor.label_table_help')
            , name: 'table_name'
            , allowBlank: false
            , anchor: '100%'
            , disabled: r.id ? true : false
            , listeners: {
                select: {fn: this.onSelectTable, scope: this}
            }
        }, {
            xtype: 'msfm-combo-field'
            , fieldLabel: _('msfieldsmanager.processor.label_sort_field')
            , description: _('msfieldsmanager.processor.label_sort_field_help')
            , name: 'sort_field'
            , allowBlank: false
            , anchor: '100%'
            , table: r.table_name || ''
        }, {
            xtype: 'msfm-combo-field'
            , fieldLabel: _('msfieldsmanager.processor.label_display_field')
            , description: _('msfieldsmanager.processor.label_display_field_help')
            , name: 'display_field'
            , allowBlank: false
            , anchor: '100%'
            , table: r.table_name || ''
        }, {
            xtype: 'msfm-combo-field'
            , fieldLabel: _('msfieldsmanager.processor.label_value_field')
            , description: _('msfieldsmanager.processor.label_value_field_help')
            , name: 'value_field'
            , allowBlank: false
            , anchor: '100%'
            , table: r.table_name || ''
        }, {
            xtype: 'button'
            , text: _('msfieldsmanager.processor.btn_generate')
            , scope: this
            , cls: 'primary-button'
            , style: 'margin-top: 15px;'
            , anchor: '100%'
            , handler: this.processorGenerate
        }, {
            xtype: Ext.ComponentMgr.types['modx-texteditor'] ? 'modx-texteditor' : 'textarea'
            , mimeType: 'application/x-php'
            , height: 300
            , fieldLabel: _('msfieldsmanager.processor.label_code')
            , description: _('msfieldsmanager.processor.label_code_help')
            , name: 'processor'
            , allowBlank: false
            , anchor: '100%'
        }]
    });
    Msfm.window.CreateProcessors.superclass.constructor.call(this, config);
};
Ext.extend(Msfm.window.CreateProcessors, MODx.Window, {
    onSelectTable: function (ele, rec, idx) {
        var f = this.fp.getForm();
        f.findField('display_field').reload(rec.json.name);
        f.findField('value_field').reload(rec.json.name);
        f.findField('sort_field').reload(rec.json.name);
    }
    , processorGenerate: function () {
        var f = this.fp.getForm();
        if (!this.mask) this.mask = new Ext.LoadMask(this.getEl());
        this.mask.show();
        MODx.Ajax.request({
            url: Msfm.config.connectorUrl
            , params: {
                action: 'mgr/processors/generate'
                , name: f.findField('name').getValue()
                , classKey: f.findField('table_name').getValue()
                , sort: f.findField('sort_field').getValue()
            }
            , listeners: {
                'success': {
                    fn: function (r) {
                        this.mask.hide();
                        f.findField('processor').setValue(r.object.code);
                    }, scope: this
                }
                , 'failure': {
                    fn: function (r) {
                        this.mask.hide();
                    }, scope: this
                }
            }
        });
    }
});
Ext.reg('msfieldsmanager-window-processors-create', Msfm.window.CreateProcessors);


Msfm.window.EditProcessors = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        title: _('msfieldsmanager.processor.title.win_edit')
        , url: Msfm.config.connectorUrl
        , baseParams: {
            action: 'mgr/processors/update'
        }
    });
    Msfm.window.EditProcessors.superclass.constructor.call(this, config);
};
Ext.extend(Msfm.window.EditProcessors, Msfm.window.CreateProcessors, {});
Ext.reg('msfm-window-processors-edit', Msfm.window.EditProcessors);
