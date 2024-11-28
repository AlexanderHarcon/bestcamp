Msfm.grid.MsfmStorage = function(config) {
    config = config || {};
    if (!config.id) {
        config.id = 'msfm-grid-msfmstorage';
    }
    Ext.applyIf(config, {
        baseParams: {
            action: 'mgr/msfmstorage/getList',
            sort: 'id',
            dir: 'DESC',
        },
        autoExpandColumn: 'id',
        save_action: 'mgr/msfmstorage/updateFromGrid',
        /*
        enableDragDrop: true,
        multi_select: true,
        ddGroup: 'dd',
        ddAction: 'mgr/msfmstorage/sort'
        */
    });

    Msfm.grid.MsfmStorage.superclass.constructor.call(this,config)
};
Ext.extend(Msfm.grid.MsfmStorage, Msfm.grid.Default,{
 getFields: function () {
        return ['id','name','description','actions'];
  },
  getColumns: function () {
        return [{
				header:_('msfieldsmanager_header_id'),
				dataIndex: 'id',
				sortable: true,
				hidden: true,
			},{
				header:_('msfieldsmanager_header_name'),
				dataIndex: 'name',
				sortable: true,
				editor: {
					xtype: 'textfield'
				},
			},{
				header:_('msfieldsmanager_header_description'),
				dataIndex: 'description',
				sortable: true,
				editor: {
					xtype: 'textfield'
				},
			}, {
            header: _('msfieldsmanager_header_actions'),
            dataIndex: 'actions',
            renderer: Msfm.utils.renderActions,
            width: 60

        }];
    },
    getTopBar: function (config) {
        var tbar = [];
        tbar.push({
            text: '<i class="icon icon-plus"></i> ' + _('msfieldsmanager_btn_create'),
            handler: this.addItem,
            cls: 'primary-button',
            scope: this
        });
        /*tbar.push({
            text: '<i class="fa fa-cogs"></i> ',
            menu: [{
                text: '<i class="fa fa-plus"></i> ' + _('msfieldsmanager_btn_create'),
                cls: 'msfm-cogs',
                handler: this.addItem,
                scope: this
            }, '-', {
                text: '<i class="fa fa-refresh"></i> ' + _('msfieldsmanager_btn_update'),
                cls: 'msfm-cogs',
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
            url:  Msfm.config.connector_url,
            params: {
                action: 'mgr/msfmstorage/multiple',
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
        var w = Ext.getCmp('msfm-window-msfmstorage-create');
        if (w) {
            w.close();
        }
        w = MODx.load({
            xtype: 'msfm-window-msfmstorage-create',
            id: 'msfm-window-msfmstorage-create',
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
        if (typeof(row) != 'undefined') {
            this.menu.record = row.data;
        }
        var id = this.menu.record.id;
        MODx.Ajax.request({
            url:  Msfm.config.connector_url,
            params: {
                action: 'mgr/msfmstorage/get',
                id: id
            },
            listeners: {
                success: {
                    fn: function (r) {
                        var w = Ext.getCmp('msfm-window-msfmstorage-update');
                        if (w) {
                            w.close();
                        }
                        w = MODx.load({
                            xtype: 'msfm-window-msfmstorage-update',
                            id: 'msfm-window-msfmstorage-update',
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
            _('msfieldsmanager_title_win_remove'),
            ids.length > 1
                ? _('msfieldsmanager_confirm.multiple_remove')
                : _('msfieldsmanager_confirm_remove'),
            function (val) {
                if (val == 'yes') {
                    this.actionItem('remove');
                }
            }, this
        );
    }

});
Ext.reg('msfm-grid-msfmstorage',Msfm.grid.MsfmStorage);


Msfm.window.CreateMsfmStorage = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: config.record.id ? _('msfieldsmanager_title_win_update') : _('msfieldsmanager_title_win_create'),
        baseParams: {
            action: config.record.id ? 'mgr/msfmstorage/update' : 'mgr/msfmstorage/create'
        }
    });
    Msfm.window.CreateMsfmStorage.superclass.constructor.call(this,config);
};
Ext.extend(Msfm.window.CreateMsfmStorage,Msfm.window.Default,{
    getFields: function (config) {
        return [{
				xtype: 'hidden',
				name: 'id',
			},{
				xtype: 'label',
				html: _('msfieldsmanager_label_id_help'),
				cls: 'desc-under',
			},{
				xtype: 'textfield',
				fieldLabel: _('msfieldsmanager_label_name'),
				description: '<b>[[*name]]</b>',
				name: 'name',
				allowBlank:false,
				anchor: '100%',
			},{
				xtype: 'label',
				html: _('msfieldsmanager_label_name_help'),
				cls: 'desc-under',
			},{
				xtype: 'textarea',
				fieldLabel: _('msfieldsmanager_label_description'),
				description: '<b>[[*description]]</b>',
				name: 'description',
				allowBlank:false,
				anchor: '100%',
			},{
				xtype: 'label',
				html: _('msfieldsmanager_label_description_help'),
				cls: 'desc-under',
			}];
    },
});
Ext.reg('msfm-window-msfmstorage-create',Msfm.window.CreateMsfmStorage);

Msfm.window.UpdateMsfmStorage = function(config) {
    config = config || {};
    Ext.applyIf(config,{});
    Msfm.window.UpdateMsfmStorage.superclass.constructor.call(this,config);
};

Ext.extend(Msfm.window.UpdateMsfmStorage, Msfm.window.CreateMsfmStorage);
Ext.reg('msfm-window-msfmstorage-update',Msfm.window.UpdateMsfmStorage);