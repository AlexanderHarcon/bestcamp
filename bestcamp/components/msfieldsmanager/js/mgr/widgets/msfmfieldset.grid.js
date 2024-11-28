Msfm.grid.MsfmFieldset = function (config) {
    config = config || {};
    if (!config.id) {
        config.id = 'msfm-grid-msfmfieldset';
    }
    Ext.applyIf(config, {
        url: Msfm.config.connectorUrl
        , baseParams: {
            action: 'mgr/msfmfieldset/getList'
            , sort: '`rank`,tab_id'
            , dir: 'ASC'
        }
        , autoExpandColumn: 'name'
        , save_action: 'mgr/msfmfieldset/updateFromGrid'
        , enableDragDrop: true
        , multi_select: true
        , ddGroup: 'dd'
        , ddAction: 'mgr/msfmfieldset/sort'

    });
    Msfm.grid.MsfmFieldset.superclass.constructor.call(this, config)
};
Ext.extend(Msfm.grid.MsfmFieldset, Msfm.grid.Default, {
    getFields: function () {
        return ['id', 'tab_id', 'key', 'title', 'collapsible', 'position', 'enable', 'rank', 'actions'];
    }
    , getColumns: function () {
        return [{
            header: _('msfieldsmanager.fieldset.header_id')
            , dataIndex: 'id'
            , sortable: true
            , hidden: true
        }, {
            header: _('msfieldsmanager.fieldset.header_key')
            , dataIndex: 'key'
            , sortable: true
        }, {
            header: _('msfieldsmanager.fieldset.header_title')
            , dataIndex: 'title'
            , sortable: true
            , editor: {
                xtype: 'textfield'
            }
        }, {
            header: _('msfieldsmanager.fieldset.header_tab_id')
            , dataIndex: 'tab_id'
            , sortable: true
            , editor: {
                xtype: 'msfm-combo-tabs'
                , renderer: true
            }
        }, {
            header: _('msfieldsmanager.fieldset.header_collapsible')
            , dataIndex: 'collapsible'
            , sortable: true
            , width: 60
            , editor: {
                xtype: 'combo-boolean',
                renderer: 'boolean'
            }
        }, {
            header: _('msfieldsmanager.fieldset.header_position')
            , dataIndex: 'position'
            , sortable: true
            , editor: {
                xtype: 'msfm-combo-position'
                , renderer: true
            }
        }, {
            header: _('msfieldsmanager.fieldset.header_enable')
            , dataIndex: 'enable'
            , sortable: true
            , width: 60
            , editor: {
                xtype: 'combo-boolean',
                renderer: 'boolean'
            }
        }, {
            header: _('msfieldsmanager.header_actions')
            , dataIndex: 'actions'
            , renderer: Msfm.utils.renderActions
            , width: 60

        }];
    }
    , getSearchField: function (width) {
        return {
            xtype: 'msfm-field-search',
            width: width || 250,
            listeners: {
                search: {
                    fn: function (field) {
                        this._doSearch(field);
                    }, scope: this
                },
                clear: {
                    fn: function (field) {
                        field.setValue('');
                        this._resetFilter();
                        this._clearSearch();
                    }, scope: this
                },
            }
        };
    }
    , getTopBar: function (config) {
        var tbar = [];
        tbar.push({
            text: '<i class="icon icon-plus"></i> ' + _('msfieldsmanager.fieldset.btn_create'),
            handler: this.addItem,
            cls: 'primary-button',
            scope: this
        });
        tbar.push(
            '->',
            {
                xtype: 'msfm-combo-tabs'
                , id: 'msfm-filter-tab'
                , emptyText: _('msfieldsmanager.tabs.filter')
                , width: 200
                , listeners: {
                    select: {
                        fn: this._filter, scope: this
                    }
                }
            },
            this.getSearchField());

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
                action: 'mgr/msfmfieldset/multiple',
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
        var tab = Ext.getCmp('msfm-filter-tab').getValue(),
            record = {
                collapsible: 0,
                position: 1,
                enable: 1,
            };
        if (tab) {
            record.tab_id = tab;
        }
        var w = Ext.getCmp('msfm-window-msfmfieldset-create');
        if (w) {
            w.close();
        }
        w = MODx.load({
            xtype: 'msfm-window-msfmfieldset-create'
            , id: 'msfm-window-msfmfieldset-create'
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
                action: 'mgr/msfmfieldset/get',
                id: id
            },
            listeners: {
                success: {
                    fn: function (r) {
                        var w = Ext.getCmp('msfm-window-msfmfieldset-edit');
                        if (w) {
                            w.close();
                        }
                        w = MODx.load({
                            xtype: 'msfm-window-msfmfieldset-edit',
                            id: 'msfm-window-msfmfieldset-edit',
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
            _('msfieldsmanager.fieldset.title.win_remove'),
            ids.length > 1
                ? _('msfieldsmanager.fieldset.confirm.multiple_remove')
                : _('msfieldsmanager.fieldset.confirm.remove'),
            function (val) {
                if (val == 'yes') {
                    this.actionItem('remove');
                }
            }, this
        );
    }
    , _filter: function (ele, rec, idx) {
        this.getStore().baseParams.tab_id = ele.value;
        this.getBottomToolbar().changePage(1);
    }
    , _resetFilter: function () {
        this.getStore().baseParams.tab_id = 0;
        Ext.getCmp('msfm-filter-tab').clearValue();
    }
});
Ext.reg('msfm-grid-msfmfieldset', Msfm.grid.MsfmFieldset);


Msfm.window.CreateMsfmFieldset = function (config) {
    config = config || {};
    var r = config.record;
    Ext.applyIf(config, {
        title: r.id ? _('msfieldsmanager.fieldset.title.win_update') : _('msfieldsmanager.fieldset.title.win_create')
        , url: Msfm.config.connectorUrl
        , autoHeight: true
        , modal: true
        , baseParams: {
            action: r.id ? 'mgr/msfmfieldset/update' : 'mgr/msfmfieldset/create'
        }
        , fields: [{
            xtype: 'hidden'
            , name: 'id'
        }, {
            xtype: 'textfield'
            , fieldLabel: _('msfieldsmanager.fieldset.label_key')
            , description: _('msfieldsmanager.fieldset.label_key_help')
            , name: 'key'
            , allowBlank: false
            , validator: function (v) {
                return /^[a-zA-Z\_0-9]*$/.test(v) ? true : _('msfieldsmanager.err_valid_name');
            }
            , readOnly: r.id ? true : false
            , anchor: '100%'
        }, {
            xtype: 'textfield'
            , fieldLabel: _('msfieldsmanager.fieldset.label_title')
            , description: _('msfieldsmanager.fieldset.label_title_help')
            , name: 'title'
            , allowBlank: true
            , anchor: '100%'
        }, {
            xtype: 'msfm-combo-tabs'
            , fieldLabel: _('msfieldsmanager.fieldset.label_tab_id')
            , description: _('msfieldsmanager.fieldset.label_tab_id_help')
            , name: 'tab_id'
            , allowBlank: true
            , anchor: '100%'
        }, {
            xtype: 'combo-boolean'
            , hiddenName: 'collapsible'
            , fieldLabel: _('msfieldsmanager.fieldset.label_collapsible')
            , description: _('msfieldsmanager.fieldset.label_collapsible_help')
            , name: 'collapsible'
            , allowBlank: false
            , anchor: '100%'
        }, {
            xtype: 'msfm-combo-position'
            , fieldLabel: _('msfieldsmanager.fieldset.label_position')
            , description: _('msfieldsmanager.fieldset.label_position_help')
            , name: 'position'
            , allowBlank: false
            , anchor: '100%'
        }, {
            xtype: 'combo-boolean'
            , hiddenName: 'enable'
            , fieldLabel: _('msfieldsmanager.fieldset.label_enable')
            , description: _('msfieldsmanager.fieldset.label_enable_help')
            , name: 'enable'
            , allowBlank: false
            , anchor: '100%'
        }]
    });
    Msfm.window.CreateMsfmFieldset.superclass.constructor.call(this, config);
};
Ext.extend(Msfm.window.CreateMsfmFieldset, MODx.Window);
Ext.reg('msfm-window-msfmfieldset-create', Msfm.window.CreateMsfmFieldset);

Msfm.window.EditMsfmFieldset = function (config) {
    config = config || {};
    Ext.applyIf(config, {});
    Msfm.window.EditMsfmFieldset.superclass.constructor.call(this, config);
};
Ext.extend(Msfm.window.EditMsfmFieldset, Msfm.window.CreateMsfmFieldset);
Ext.reg('msfm-window-msfmfieldset-edit', Msfm.window.EditMsfmFieldset);