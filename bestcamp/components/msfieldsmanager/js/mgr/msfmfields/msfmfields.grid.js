Msfm.grid.MsfmFields = function(config) {
    config = config || {};
    if (!config.id) {
        config.id = 'msfm-grid-msfmfields';
    }
    Ext.applyIf(config, {
        baseParams: {
            action: 'mgr/msfmfields/getList',
            sort: 'id',
            dir: 'DESC',
        },
        autoExpandColumn: 'id',
        save_action: 'mgr/msfmfields/updateFromGrid',
        /*
        enableDragDrop: true,
        multi_select: true,
        ddGroup: 'dd',
        ddAction: 'mgr/msfmfields/sort'
        */
    });

    Msfm.grid.MsfmFields.superclass.constructor.call(this,config)
};
Ext.extend(Msfm.grid.MsfmFields, Msfm.grid.Default,{
 getFields: function () {
        return ['id','fieldset_id','name','title','description','dbtype','dbprecision','dbnull','dbdefault','default_value','dbindex','xtype','unit','extjs','sortable','grid','required','enable','polylang','rank','actions'];
  },
  getColumns: function () {
        return [{
				header:_('msfieldsmanager_header_id'),
				dataIndex: 'id',
				sortable: true,
				hidden: false,
			},{
				header:_('msfieldsmanager_header_fieldset_id'),
				dataIndex: 'fieldset_id',
				sortable: true,
				editor: {
					xtype: 'numberfield'
				},
			},{
				header:_('msfieldsmanager_header_name'),
				dataIndex: 'name',
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
				header:_('msfieldsmanager_header_description'),
				dataIndex: 'description',
				sortable: true,
				editor: {
					xtype: 'textfield'
				},
			},{
				header:_('msfieldsmanager_header_dbtype'),
				dataIndex: 'dbtype',
				sortable: true,
				editor: {
					xtype: 'textfield'
				},
			},{
				header:_('msfieldsmanager_header_dbprecision'),
				dataIndex: 'dbprecision',
				sortable: true,
				editor: {
					xtype: 'textfield'
				},
			},{
				header:_('msfieldsmanager_header_dbnull'),
				dataIndex: 'dbnull',
				sortable: true,
				width: 60,
				editor: {
					xtype: 'combo-boolean',
					renderer: 'boolean'
				},
			},{
				header:_('msfieldsmanager_header_dbdefault'),
				dataIndex: 'dbdefault',
				sortable: true,
				editor: {
					xtype: 'textfield'
				},
			},{
				header:_('msfieldsmanager_header_default_value'),
				dataIndex: 'default_value',
				sortable: true,
				editor: {
					xtype: 'textfield'
				},
			},{
				header:_('msfieldsmanager_header_dbindex'),
				dataIndex: 'dbindex',
				sortable: true,
				editor: {
					xtype: 'textfield'
				},
			},{
				header:_('msfieldsmanager_header_xtype'),
				dataIndex: 'xtype',
				sortable: true,
				editor: {
					xtype: 'textfield'
				},
			},{
				header:_('msfieldsmanager_header_unit'),
				dataIndex: 'unit',
				sortable: true,
				editor: {
					xtype: 'textfield'
				},
			},{
				header:_('msfieldsmanager_header_extjs'),
				dataIndex: 'extjs',
				sortable: true,
				editor: {
					xtype: 'textfield'
				},
			},{
				header:_('msfieldsmanager_header_sortable'),
				dataIndex: 'sortable',
				sortable: true,
				width: 60,
				editor: {
					xtype: 'combo-boolean',
					renderer: 'boolean'
				},
			},{
				header:_('msfieldsmanager_header_grid'),
				dataIndex: 'grid',
				sortable: true,
				width: 60,
				editor: {
					xtype: 'combo-boolean',
					renderer: 'boolean'
				},
			},{
				header:_('msfieldsmanager_header_required'),
				dataIndex: 'required',
				sortable: true,
				width: 60,
				editor: {
					xtype: 'combo-boolean',
					renderer: 'boolean'
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
				header:_('msfieldsmanager_header_polylang'),
				dataIndex: 'polylang',
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
                action: 'mgr/msfmfields/multiple',
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
        var w = Ext.getCmp('msfm-window-msfmfields-create');
        if (w) {
            w.close();
        }
        w = MODx.load({
            xtype: 'msfm-window-msfmfields-create',
            id: 'msfm-window-msfmfields-create',
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
                action: 'mgr/msfmfields/get',
                id: id
            },
            listeners: {
                success: {
                    fn: function (r) {
                        var w = Ext.getCmp('msfm-window-msfmfields-update');
                        if (w) {
                            w.close();
                        }
                        w = MODx.load({
                            xtype: 'msfm-window-msfmfields-update',
                            id: 'msfm-window-msfmfields-update',
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
Ext.reg('msfm-grid-msfmfields',Msfm.grid.MsfmFields);


Msfm.window.CreateMsfmFields = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: config.record.id ? _('msfieldsmanager_title_win_update') : _('msfieldsmanager_title_win_create'),
        baseParams: {
            action: config.record.id ? 'mgr/msfmfields/update' : 'mgr/msfmfields/create'
        }
    });
    Msfm.window.CreateMsfmFields.superclass.constructor.call(this,config);
};
Ext.extend(Msfm.window.CreateMsfmFields,Msfm.window.Default,{
    getFields: function (config) {
        return [{
				xtype: 'hidden',
				name: 'id',
			},{
				xtype: 'label',
				html: _('msfieldsmanager_label_id_help'),
				cls: 'desc-under',
			},{
				xtype: 'numberfield',
				fieldLabel: _('msfieldsmanager_label_fieldset_id'),
				description: '<b>[[*fieldset_id]]</b>',
				name: 'fieldset_id',
				allowBlank:false,
				anchor: '100%',
			},{
				xtype: 'label',
				html: _('msfieldsmanager_label_fieldset_id_help'),
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
				xtype: 'textarea',
				fieldLabel: _('msfieldsmanager_label_description'),
				description: '<b>[[*description]]</b>',
				name: 'description',
				allowBlank:true,
				anchor: '100%',
			},{
				xtype: 'label',
				html: _('msfieldsmanager_label_description_help'),
				cls: 'desc-under',
			},{
				xtype: 'textfield',
				fieldLabel: _('msfieldsmanager_label_dbtype'),
				description: '<b>[[*dbtype]]</b>',
				name: 'dbtype',
				allowBlank:false,
				anchor: '100%',
			},{
				xtype: 'label',
				html: _('msfieldsmanager_label_dbtype_help'),
				cls: 'desc-under',
			},{
				xtype: 'textfield',
				fieldLabel: _('msfieldsmanager_label_dbprecision'),
				description: '<b>[[*dbprecision]]</b>',
				name: 'dbprecision',
				allowBlank:true,
				anchor: '100%',
			},{
				xtype: 'label',
				html: _('msfieldsmanager_label_dbprecision_help'),
				cls: 'desc-under',
			},{
				xtype: 'combo-boolean',
				hiddenName: 'dbnull',
				fieldLabel: _('msfieldsmanager_label_dbnull'),
				description: '<b>[[*dbnull]]</b>',
				name: 'dbnull',
				allowBlank:false,
				anchor: '100%',
			},{
				xtype: 'label',
				html: _('msfieldsmanager_label_dbnull_help'),
				cls: 'desc-under',
			},{
				xtype: 'textfield',
				fieldLabel: _('msfieldsmanager_label_dbdefault'),
				description: '<b>[[*dbdefault]]</b>',
				name: 'dbdefault',
				allowBlank:true,
				anchor: '100%',
			},{
				xtype: 'label',
				html: _('msfieldsmanager_label_dbdefault_help'),
				cls: 'desc-under',
			},{
				xtype: 'textfield',
				fieldLabel: _('msfieldsmanager_label_default_value'),
				description: '<b>[[*default_value]]</b>',
				name: 'default_value',
				allowBlank:true,
				anchor: '100%',
			},{
				xtype: 'label',
				html: _('msfieldsmanager_label_default_value_help'),
				cls: 'desc-under',
			},{
				xtype: 'textfield',
				fieldLabel: _('msfieldsmanager_label_dbindex'),
				description: '<b>[[*dbindex]]</b>',
				name: 'dbindex',
				allowBlank:false,
				anchor: '100%',
			},{
				xtype: 'label',
				html: _('msfieldsmanager_label_dbindex_help'),
				cls: 'desc-under',
			},{
				xtype: 'textfield',
				fieldLabel: _('msfieldsmanager_label_xtype'),
				description: '<b>[[*xtype]]</b>',
				name: 'xtype',
				allowBlank:false,
				anchor: '100%',
			},{
				xtype: 'label',
				html: _('msfieldsmanager_label_xtype_help'),
				cls: 'desc-under',
			},{
				xtype: 'textfield',
				fieldLabel: _('msfieldsmanager_label_unit'),
				description: '<b>[[*unit]]</b>',
				name: 'unit',
				allowBlank:true,
				anchor: '100%',
			},{
				xtype: 'label',
				html: _('msfieldsmanager_label_unit_help'),
				cls: 'desc-under',
			},{
				xtype: 'textarea',
				fieldLabel: _('msfieldsmanager_label_extjs'),
				description: '<b>[[*extjs]]</b>',
				name: 'extjs',
				allowBlank:true,
				anchor: '100%',
			},{
				xtype: 'label',
				html: _('msfieldsmanager_label_extjs_help'),
				cls: 'desc-under',
			},{
				xtype: 'combo-boolean',
				hiddenName: 'sortable',
				fieldLabel: _('msfieldsmanager_label_sortable'),
				description: '<b>[[*sortable]]</b>',
				name: 'sortable',
				allowBlank:false,
				anchor: '100%',
			},{
				xtype: 'label',
				html: _('msfieldsmanager_label_sortable_help'),
				cls: 'desc-under',
			},{
				xtype: 'combo-boolean',
				hiddenName: 'grid',
				fieldLabel: _('msfieldsmanager_label_grid'),
				description: '<b>[[*grid]]</b>',
				name: 'grid',
				allowBlank:false,
				anchor: '100%',
			},{
				xtype: 'label',
				html: _('msfieldsmanager_label_grid_help'),
				cls: 'desc-under',
			},{
				xtype: 'combo-boolean',
				hiddenName: 'required',
				fieldLabel: _('msfieldsmanager_label_required'),
				description: '<b>[[*required]]</b>',
				name: 'required',
				allowBlank:false,
				anchor: '100%',
			},{
				xtype: 'label',
				html: _('msfieldsmanager_label_required_help'),
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
				xtype: 'combo-boolean',
				hiddenName: 'polylang',
				fieldLabel: _('msfieldsmanager_label_polylang'),
				description: '<b>[[*polylang]]</b>',
				name: 'polylang',
				allowBlank:false,
				anchor: '100%',
			},{
				xtype: 'label',
				html: _('msfieldsmanager_label_polylang_help'),
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
Ext.reg('msfm-window-msfmfields-create',Msfm.window.CreateMsfmFields);

Msfm.window.UpdateMsfmFields = function(config) {
    config = config || {};
    Ext.applyIf(config,{});
    Msfm.window.UpdateMsfmFields.superclass.constructor.call(this,config);
};

Ext.extend(Msfm.window.UpdateMsfmFields, Msfm.window.CreateMsfmFields);
Ext.reg('msfm-window-msfmfields-update',Msfm.window.UpdateMsfmFields);