Msfm.grid.MsfmStorageMember = function (config) {
    config = config || {};
    if (!config.id) {
        config.id = 'msfm-grid-msfmstoragemember';
    }
    Ext.applyIf(config, {
        url: Msfm.config.connectorUrl
        , baseParams: {
            action: 'mgr/msfmstoragemember/getList'
            , sort: 'rank'
            , dir: 'ASC'
        }
        , autoExpandColumn: 'key'
        , save_action: 'mgr/msfmstoragemember/updateFromGrid'
        , enableDragDrop: true
        , multi_select: true
        , ddGroup: 'dd'
        , ddAction: 'mgr/msfmstoragemember/sort'

    });

    Msfm.grid.MsfmStorageMember.superclass.constructor.call(this, config)
};
Ext.extend(Msfm.grid.MsfmStorageMember, Msfm.grid.Default, {
    getFields: function () {
        return ['id', 'storage_id', 'storage_name', 'key', 'name', 'rank', 'enable', 'actions'];
    }
    , getColumns: function () {
        return [{
            header: _('msfieldsmanager.storage_member.header_id')
            , dataIndex: 'id'
            , sortable: true
            , hidden: true
        }, {
            header: _('msfieldsmanager.storage_member.header_storage_id')
            , dataIndex: 'storage_name'
            , sortable: false
        }, {
            header: _('msfieldsmanager.storage_member.header_key')
            , dataIndex: 'key'
            , sortable: true
            , editor: {
                xtype: 'textfield'
            }
        }, {
            header: _('msfieldsmanager.storage_member.header_name')
            , dataIndex: 'name'
            , sortable: true
            , editor: {
                xtype: 'textfield'
            }
        }, {
            header: _('msfieldsmanager.storage_member.header_enable')
            , dataIndex: 'enable'
            , sortable: true
            , width: 60
            , editor: {
                xtype: 'combo-boolean',
                renderer: 'boolean'
            }
        }, {
            header: _('msfieldsmanager.storage_member.header_actions')
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
            text: '<i class="icon icon-plus"></i> ' + _('msfieldsmanager.storage_member.btn_create'),
            handler: this.addItem,
            cls: 'primary-button',
            scope: this
        });
        tbar.push(
            '->',
            {
                xtype: 'msfm-combo-storage'
                , id: 'msfm-filter-storage'
                , emptyText: _('msfieldsmanager.storage_member.filter')
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
                action: 'mgr/msfmstoragemember/multiple',
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
        var storage = Ext.getCmp('msfm-filter-storage').getValue(),
            record = {
                enable: 1
            },
            w = Ext.getCmp('msfm-window-msfmstoragemember-create');
        if (storage) {
            record.storage_id = storage;
        }
        if (w) {
            w.close();
        }
        w = MODx.load({
            xtype: 'msfm-window-msfmstoragemember-create'
            , id: 'msfm-window-msfmstoragemember-create'
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
                action: 'mgr/msfmstoragemember/get',
                id: id
            },
            listeners: {
                success: {
                    fn: function (r) {
                        var w = Ext.getCmp('msfm-window-msfmstoragemember-update');
                        if (w) {
                            w.close();
                        }
                        w = MODx.load({
                            xtype: 'msfm-window-msfmstoragemember-update',
                            id: 'msfm-window-msfmstoragemember-update',
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
            _('msfieldsmanager.storage_member.title.win_remove'),
            ids.length > 1
                ? _('msfieldsmanager.storage_member.confirm.multiple_remove')
                : _('msfieldsmanager.storage_member.confirm.remove'),
            function (val) {
                if (val == 'yes') {
                    this.actionItem('remove');
                }
            }, this
        );
    }
    , _filter: function (ele, rec, idx) {
        this.getStore().baseParams.storage_id = ele.value;
        this.getBottomToolbar().changePage(1);
    }
    , _resetFilter: function () {
        this.getStore().baseParams.storage_id = 0;
        Ext.getCmp('msfm-filter-storage').clearValue();
    }

});
Ext.reg('msfm-grid-msfmstoragemember', Msfm.grid.MsfmStorageMember);


Msfm.window.CreateMsfmStorageMember = function (config) {
    config = config || {};
    var r = config.record;
    this.ident = config.ident || Ext.id();
    Ext.applyIf(config, {
        title: r.id ? _('msfieldsmanager.storage_member.title.win_update') : _('msfieldsmanager.storage_member.title.win_create')
        , url: Msfm.config.connectorUrl
        , autoHeight: true
        , modal: true
        , baseParams: {
            action: r.id ? 'mgr/msfmstoragemember/update' : 'mgr/msfmstoragemember/create'
        }
        , fields: [{
            xtype: 'hidden'
            , name: 'id'
        }, {
            xtype: 'msfm-combo-storage'
            , fieldLabel: _('msfieldsmanager.storage_member.label_storage_id')
            , description: '<b>[[*storage_id]]</b><br />' + _('msfieldsmanager.storage_member.label_storage_id_help')
            , name: 'storage_id'
            , allowBlank: false
            , anchor: '100%'
        }, {
            xtype: 'textfield'
            , fieldLabel: _('msfieldsmanager.storage_member.label_key')
            , description: '<b>[[*key]]</b><br />' + _('msfieldsmanager.storage_member.label_key_help')
            , name: 'key'
            , allowBlank: false
            , anchor: '100%'
        }, {
            xtype: 'textfield'
            , fieldLabel: _('msfieldsmanager.storage_member.label_name')
            , description: '<b>[[*name]]</b><br />' + _('msfieldsmanager.storage_member.label_name_help')
            , name: 'name'
            , allowBlank: false
            , anchor: '100%'
        }, {
            xtype: 'combo-boolean'
            , hiddenName: 'enable'
            , fieldLabel: _('msfieldsmanager.storage_member.label_enable')
            , description: '<b>[[*enable]]</b><br />' + _('msfieldsmanager.storage_member.label_enable_help')
            , name: 'enable'
            , allowBlank: false
            , anchor: '100%'
        }]
    });
    Msfm.window.CreateMsfmStorageMember.superclass.constructor.call(this, config);
};
Ext.extend(Msfm.window.CreateMsfmStorageMember, MODx.Window);
Ext.reg('msfm-window-msfmstoragemember-create', Msfm.window.CreateMsfmStorageMember);

Msfm.window.UpdateMsfmStorageMember = function (config) {
    config = config || {};
    Ext.applyIf(config, {});
    Msfm.window.UpdateMsfmStorageMember.superclass.constructor.call(this, config);
};
Ext.extend(Msfm.window.UpdateMsfmStorageMember, Msfm.window.CreateMsfmStorageMember);
Ext.reg('msfm-window-msfmstoragemember-update', Msfm.window.UpdateMsfmStorageMember);