Msfm.grid.MsfmTabs = function(config) {
    config = config || {};
    if (!config.id) {
        config.id = 'msfm-grid-msfmtabs';
    }
    Ext.applyIf(config, {
        baseParams: {
            action: 'mgr/msfmtabs/getList',
            sort: 'id',
            dir: 'DESC',
        },
        autoExpandColumn: 'id',
        save_action: 'mgr/msfmtabs/updateFromGrid',
        /*
        enableDragDrop: true,
        multi_select: true,
        ddGroup: 'dd',
        ddAction: 'mgr/msfmtabs/sort'
        */
    });

    Msfm.grid.MsfmTabs.superclass.constructor.call(this,config)
};
Ext.extend(Msfm.grid.MsfmTabs, Msfm.grid.Default,{
 getFields: function () {
        return ['id','key','title','enable','rank','actions'];
  },
  getColumns: function () {
        return [{
				header:_('msfieldsmanager_header_id'),
				dataIndex: 'id',
				sortable: true,
				hidden: true,
			},{
				header:_('msfieldsmanager_header_key'),
				dataIndex: 'key',
				sortable: true,
				editor: {
					xtype: 'textfield'
				},
			},{
				header:_('msfieldsmanager_header_title'),
				dataIndex: 'title',
				sortable: true,
				editor: {
					xtype: 'textfield'
				},
			},{
				header:_('msfieldsmanager_header_enable'),
				dataIndex: 'enable',
				sortable: true,
				width: 60,
				editor: {
					xtype: 'combo-boolean',
					renderer: 'boolean'
				},
			},{
				header:_('msfieldsmanager_header_rank'),
				dataIndex: 'rank',
				sortable: true,
				editor: {
					xtype: 'numberfield'
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
    },
    addItem: function (btn, e, row) {
        var record = {};
        var w = Ext.getCmp('msfm-window-msfmtabs-create');
        if (w) {
            w.close();
        }
        w = MODx.load({
            xtype: 'msfm-window-msfmtabs-create',
            id: 'msfm-window-msfmtabs-create',
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
                action: 'mgr/msfmtabs/get',
                id: id
            },
            listeners: {
                success: {
                    fn: function (r) {
                        var w = Ext.getCmp('msfm-window-msfmtabs-update');
                        if (w) {
                            w.close();
                        }
                        w = MODx.load({
                            xtype: 'msfm-window-msfmtabs-update',
                            id: 'msfm-window-msfmtabs-update',
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
Ext.reg('msfm-grid-msfmtabs',Msfm.grid.MsfmTabs);


Msfm.window.CreateMsfmTabs = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: config.record.id ? _('msfieldsmanager_title_win_update') : _('msfieldsmanager_title_win_create'),
        baseParams: {
            action: config.record.id ? 'mgr/msfmtabs/update' : 'mgr/msfmtabs/create'
        }
    });
    Msfm.window.CreateMsfmTabs.superclass.constructor.call(this,config);
};
Ext.extend(Msfm.window.CreateMsfmTabs,Msfm.window.Default,{
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
				fieldLabel: _('msfieldsmanager_label_key'),
				description: '<b>[[*key]]</b>',
				name: 'key',
				allowBlank:false,
				anchor: '100%',
			},{
				xtype: 'label',
				html: _('msfieldsmanager_label_key_help'),
				cls: 'desc-under',
			},{
				xtype: 'textfield',
				fieldLabel: _('msfieldsmanager_label_title'),
				description: '<b>[[*title]]</b>',
				name: 'title',
				allowBlank:false,
				anchor: '100%',
			},{
				xtype: 'label',
				html: _('msfieldsmanager_label_title_help'),
				cls: 'desc-under',
			},{
				xtype: 'combo-boolean',
				hiddenName: 'enable',
				fieldLabel: _('msfieldsmanager_label_enable'),
				description: '<b>[[*enable]]</b>',
				name: 'enable',
				allowBlank:false,
				anchor: '100%',
			},{
				xtype: 'label',
				html: _('msfieldsmanager_label_enable_help'),
				cls: 'desc-under',
			},{
				xtype: 'numberfield',
				fieldLabel: _('msfieldsmanager_label_rank'),
				description: '<b>[[*rank]]</b>',
				name: 'rank',
				allowBlank:false,
				anchor: '100%',
			},{
				xtype: 'label',
				html: _('msfieldsmanager_label_rank_help'),
				cls: 'desc-under',
			}];
    },
});
Ext.reg('msfm-window-msfmtabs-create',Msfm.window.CreateMsfmTabs);

Msfm.window.UpdateMsfmTabs = function(config) {
    config = config || {};
    Ext.applyIf(config,{});
    Msfm.window.UpdateMsfmTabs.superclass.constructor.call(this,config);
};

Ext.extend(Msfm.window.UpdateMsfmTabs, Msfm.window.CreateMsfmTabs);
Ext.reg('msfm-window-msfmtabs-update',Msfm.window.UpdateMsfmTabs);