Msfm.grid.MsfmTabs = function (config) {
    config = config || {};
    if (!config.id) {
        config.id = 'msfm-grid-msfmtabs';
    }
    Ext.applyIf(config, {
        url: Msfm.config.connectorUrl
        , baseParams: {
            action: 'mgr/msfmtabs/getList'
            , sort: 'rank'
            , dir: 'ASC'
        }
        , autoExpandColumn: 'key'
        , save_action: 'mgr/msfmtabs/updateFromGrid'
        , enableDragDrop: true
        , multi_select: true
        , ddGroup: 'dd'
        , ddAction: 'mgr/msfmtabs/sort'

    });
    Msfm.grid.MsfmTabs.superclass.constructor.call(this, config)
};
Ext.extend(Msfm.grid.MsfmTabs, Msfm.grid.Default, {
    getFields: function () {
        return ['id', 'key', 'title', 'enable', 'actions'];
    }
    , getColumns: function () {
        return [{
            header: _('msfieldsmanager.tabs.header_id')
            , dataIndex: 'id'
            , sortable: true
            , hidden: true
        }, {
            header: _('msfieldsmanager.tabs.header_key')
            , dataIndex: 'key'
            , sortable: true
        }, {
            header: _('msfieldsmanager.tabs.header_title')
            , dataIndex: 'title'
            , sortable: true
            , editor: {
                xtype: 'textfield'
            }
        }, {
            header: _('msfieldsmanager.tabs.header_enable')
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
    , getTopBar: function (config) {
        var tbar = [];
        tbar.push({
            text: '<i class="icon icon-plus"></i> ' + _('msfieldsmanager.tabs.btn_create'),
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
                action: 'mgr/msfmtabs/multiple',
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
        var record = {enable: 1};
        var w = Ext.getCmp('msfm-window-msfmtabs-create');
        if (w) {
            w.close();
        }
        w = MODx.load({
            xtype: 'msfm-window-msfmtabs-create'
            , id: 'msfm-window-msfmtabs-create'
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
                action: 'mgr/msfmtabs/get',
                id: id
            },
            listeners: {
                success: {
                    fn: function (r) {
                        var w = Ext.getCmp('msfm-window-msfmtabs-edit');
                        if (w) {
                            w.close();
                        }
                        w = MODx.load({
                            xtype: 'msfm-window-msfmtabs-edit',
                            id: 'msfm-window-msfmtabs-edit',
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
            _('msfieldsmanager.tabs.title.win_remove'),
            ids.length > 1
                ? _('msfieldsmanager.tabs.confirm.multiple_remove')
                : _('msfieldsmanager.tabs.confirm.remove'),
            function (val) {
                if (val == 'yes') {
                    this.actionItem('remove');
                }
            }, this
        );
    }
});
Ext.reg('msfm-grid-msfmtabs', Msfm.grid.MsfmTabs);


Msfm.window.CreateMsfmTabs = function (config) {
    config = config || {};
    var r = config.record;
    Ext.applyIf(config, {
        title: r.id ? _('msfieldsmanager.tabs.title.win_update') : _('msfieldsmanager.tabs.title.win_create')
        , url: Msfm.config.connectorUrl
        , autoHeight: true
        , modal: true
        , baseParams: {
            action: r.id ? 'mgr/msfmtabs/update' : 'mgr/msfmtabs/create'
        }
        , fields: [{
            xtype: 'hidden'
            , name: 'id'
        }, {
            xtype: 'textfield'
            , fieldLabel: _('msfieldsmanager.tabs.label_key')
            , description: _('msfieldsmanager.tabs.label_key_help')
            , name: 'key'
            , allowBlank: false
            , validator: function (v) {
                return /^[a-zA-Z\_0-9]*$/.test(v) ? true : _('msfieldsmanager.err_valid_name');
            }
            , readOnly: r.id ? true : false
            , anchor: '100%'
        }, {
            xtype: 'textfield'
            , fieldLabel: _('msfieldsmanager.tabs.label_title')
            , description: _('msfieldsmanager.tabs.label_title_help')
            , name: 'title'
            , allowBlank: false
            , anchor: '100%'
        }, {
            xtype: 'combo-boolean'
            , hiddenName: 'enable'
            , fieldLabel: _('msfieldsmanager.tabs.label_enable')
            , description: _('msfieldsmanager.tabs.label_enable_help')
            , name: 'enable'
            , allowBlank: false
            , anchor: '100%'
        }]
    });
    Msfm.window.CreateMsfmTabs.superclass.constructor.call(this, config);
};
Ext.extend(Msfm.window.CreateMsfmTabs, MODx.Window);
Ext.reg('msfm-window-msfmtabs-create', Msfm.window.CreateMsfmTabs);

Msfm.window.EditMsfmTabs = function (config) {
    config = config || {};
    Ext.applyIf(config, {});
    Msfm.window.EditMsfmTabs.superclass.constructor.call(this, config);
};
Ext.extend(Msfm.window.EditMsfmTabs, Msfm.window.CreateMsfmTabs);
Ext.reg('msfm-window-msfmtabs-edit', Msfm.window.EditMsfmTabs);