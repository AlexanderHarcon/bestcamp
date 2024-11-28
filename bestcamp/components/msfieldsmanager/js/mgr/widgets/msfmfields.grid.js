Msfm.grid.MsfmFields = function (config) {
    config = config || {};
    if (!config.id) {
        config.id = 'msfm-grid-msfmfields';
    }
    Ext.applyIf(config, {
        url: Msfm.config.connectorUrl
        , baseParams: {
            action: 'mgr/msfmfields/getList'
            , sort: 'rank'
            , dir: 'ASC'
        }
        , autoExpandColumn: 'name'
        , save_action: 'mgr/msfmfields/updateFromGrid'
        , enableDragDrop: true
        , multi_select: true
        , ddGroup: 'dd'
        , ddAction: 'mgr/msfmfields/sort'

    });
    Msfm.grid.MsfmFields.superclass.constructor.call(this, config)
};
Ext.extend(Msfm.grid.MsfmFields, Msfm.grid.Default, {
    getFields: function () {
        return ['id', 'fieldset_id', 'name', 'title', 'dbtype', 'unit', 'dbindex', 'dbprecision', 'dbnull', 'dbdefault', 'default_value', 'xtype', 'sortable', 'grid', 'enable', 'polylang', 'rank', 'description', 'extjs', 'required', 'actions'];
    }
    , getColumns: function () {
        return [{
            header: _('msfieldsmanager.header_id')
            , dataIndex: 'id'
            , sortable: true
            , hidden: true
        }, {
            header: _('msfieldsmanager.header_dbname')
            , dataIndex: 'name'
            , sortable: true
        }, {
            header: _('msfieldsmanager.header_dbtype')
            , dataIndex: 'dbtype'
            , sortable: true
        }, {
            header: _('msfieldsmanager.header_ms2_title')
            , dataIndex: 'title'
            , sortable: true
        }, {
            header: _('msfieldsmanager.header_ms2_rank')
            , dataIndex: 'rank'
            , sortable: true
            , editor: {
                xtype: 'numberfield'
            }
        }, {
            header: _('msfieldsmanager.header_unit')
            , dataIndex: 'unit'
            , sortable: true
            , editor: {
                xtype: 'textfield'
            }
        }, {
            header: _('msfieldsmanager.header_fieldset_id')
            , dataIndex: 'fieldset_id'
            , sortable: true
            , width: 60
            , editor: {
                xtype: 'msfm-combo-fieldset',
                renderer: true
            }
        }, {
            header: _('msfieldsmanager.header_sortable')
            , dataIndex: 'sortable'
            , sortable: true
            , width: 60
            , editor: {
                xtype: 'combo-boolean',
                renderer: 'boolean'
            }
        }, {
            header: _('msfieldsmanager.header_grid')
            , dataIndex: 'grid'
            , sortable: true
            , width: 60
            , editor: {
                xtype: 'combo-boolean',
                renderer: 'boolean'
            }
        }, {
            header: _('msfieldsmanager.header_ms2_enable')
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
            text: '<i class="icon icon-plus"></i> ' + _('msfieldsmanager.btn_create'),
            handler: this.addItem,
            cls: 'primary-button',
            scope: this
        });
        tbar.push(
            '->',
            {
                xtype: 'msfm-combo-fieldset'
                , id: 'msfm-filter-fieldset'
                , emptyText: _('msfieldsmanager.filter_fieldset')
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
    }
    , addItem: function (btn, e, row) {
        var fieldset = Ext.getCmp('msfm-filter-fieldset').getValue(),
            record = {
                extjs: '',
                dbindex: 'no',
                dbdefault: 'none',
                dbnull: 0,
                enable: 1,
                required: 0,
                polylang: 0,
                fieldset_id: fieldset ? fieldset : 0
            },
            w = Ext.getCmp('msfm-window-msfmfields-create');

        if (w) {
            w.close();
        }
        w = MODx.load({
            xtype: 'msfm-window-msfmfields-create'
            , id: 'msfm-window-msfmfields-create'
            , record: record
            , listeners: {
                success: {
                    fn: function () {
                        this.refresh();
                    }, scope: this
                }
            }
        });
        w.fp.getForm().setValues(record);
        w.show(e.target);
    }
    , updateItem: function (btn, e, row) {
        if (typeof (row) != 'undefined') {
            this.menu.record = row.data;
        }
        var id = this.menu.record.id;
        MODx.Ajax.request({
            url: Msfm.config.connectorUrl,
            params: {
                action: 'mgr/msfmfields/get',
                id: id
            },
            listeners: {
                success: {
                    fn: function (r) {
                        var w = Ext.getCmp('msfm-window-msfmfields-edit');
                        if (w) {
                            w.close();
                        }
                        w = MODx.load({
                            xtype: 'msfm-window-msfmfields-edit',
                            id: 'msfm-window-msfmfields-edit',
                            record: r.object,
                            listeners: {
                                success: {
                                    fn: function () {
                                        this.refresh();
                                    }, scope: this
                                },
                            }
                        });
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
            _('msfieldsmanager.win_remove'),
            ids.length > 1
                ? _('msfieldsmanager.confirm.multiple_remove')
                : _('msfieldsmanager.confirm.remove'),
            function (val) {
                if (val == 'yes') {
                    this.actionItem('remove');
                }
            }, this
        );
    }
    , _filter: function (ele, rec, idx) {
        this.getStore().baseParams.fieldset_id = ele.value;
        this.getBottomToolbar().changePage(1);
    }
    , _resetFilter: function () {
        this.getStore().baseParams.fieldset_id = 0;
        Ext.getCmp('msfm-filter-fieldset').clearValue();
    }
});
Ext.reg('msfm-grid-msfmfields', Msfm.grid.MsfmFields);

Msfm.window.CreateMsfmFields = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        title: _('msfieldsmanager.title.win_create')
        , url: Msfm.config.connectorUrl
        , width: 600
        , height: 600
        , modal: true
        , keys: []
        , baseParams: {
            action: 'mgr/msfmfields/create'
        }
        , fields: this.getFields(config)
    });
    Msfm.window.CreateMsfmFields.superclass.constructor.call(this, config);
    this.on('show', this.onShow, this);

};
Ext.extend(Msfm.window.CreateMsfmFields, MODx.Window, {
    getFields: function (config) {
        var r = config.record
            , items = [
            {
                title: _('msfieldsmanager.fieldset.db')
                , xtype: 'fieldset'
                , cls: 'x-fieldset-checkbox-toggle'
                , style: 'padding-top: 5px'
                , collapsible: true
                , stateId: 'msfm-fieldset-db'
                , stateful: true
                , stateEvents: ['collapse', 'expand']
                , items: [{
                    xtype: 'hidden'
                    , name: 'id'
                }, {
                    xtype: 'hidden'
                    , name: 'processor_id'
                }, {
                    xtype: 'textfield'
                    , fieldLabel: _('msfieldsmanager.label_dbname')
                    , description: _('msfieldsmanager.label_dbname_help')
                    , name: 'name'
                    , allowBlank: false
                    , msgTarget: 'under'
                    , anchor: '100%'
                    , disabled: r.id ? true : false
                    , validator: function (v) {
                        return /^[a-zA-Z\_0-9]*$/.test(v) ? true : _('msfieldsmanager.err_valid_name');
                    }
                }, {
                    xtype: 'msfm-combo-dbtype'
                    , fieldLabel: _('msfieldsmanager.label_dbtype')
                    , description: _('msfieldsmanager.label_dbtype_help')
                    , name: 'dbtype'
                    , allowBlank: false
                    , msgTarget: 'under'
                    , anchor: '100%'
                    , listeners: {
                        select: {fn: this.onChangeDBType, scope: this}
                    }
                }, {
                    xtype: 'textfield'
                    , fieldLabel: _('msfieldsmanager.label_dbprecision')
                    , description: _('msfieldsmanager.label_dbprecision_help')
                    , name: 'dbprecision'
                    , allowBlank: true
                    , anchor: '100%'
                    , msgTarget: 'under'
                }, {
                    xtype: 'msfm-combo-default-val'
                    , fieldLabel: _('msfieldsmanager.label_dbdefault')
                    , description: _('msfieldsmanager.label_dbdefault_help')
                    , name: 'dbdefault'
                    , allowBlank: true
                    , anchor: '100%'
                    , listeners: {
                        select: {fn: this.onChangeDBDefault, scope: this}
                    }
                }, {
                    xtype: 'textfield'
                    , fieldLabel: _('msfieldsmanager.label_default_value')
                    , description: _('msfieldsmanager.label_default_value_help')
                    , name: 'default_value'
                    , allowBlank: true
                    , anchor: '100%'
                    , hidden: true
                }, {
                    xtype: 'msfm-combo-index'
                    , fieldLabel: _('msfieldsmanager.label_index')
                    , description: _('msfieldsmanager.label_index_help')
                    , name: 'dbindex'
                    , allowBlank: false
                    , msgTarget: 'under'
                    , anchor: '100%'
                }]
            },
            {
                title: _('msfieldsmanager.fieldset.minishop2')
                , xtype: 'fieldset'
                , cls: 'x-fieldset-checkbox-toggle'
                , style: 'padding-top: 5px'
                , collapsible: true
                , stateId: 'msfm-fieldset-minishop2'
                , stateful: true
                , stateEvents: ['collapse', 'expand']
                , items: [{
                    xtype: 'textfield'
                    , fieldLabel: _('msfieldsmanager.label_ms2_title')
                    , description: _('msfieldsmanager.label_ms2_title_help')
                    , name: 'title'
                    , allowBlank: false
                    , msgTarget: 'under'
                    , anchor: '100%'
                }, {
                    xtype: 'textarea'
                    , fieldLabel: _('msfieldsmanager.label_description')
                    , description: _('msfieldsmanager.label_description_help')
                    , name: 'description'
                    , allowBlank: true
                    , anchor: '100%'
                }, {
                    xtype: 'textfield'
                    , fieldLabel: _('msfieldsmanager.label_unit')
                    , description: _('msfieldsmanager.label_unit_help')
                    , name: 'unit'
                    , allowBlank: true
                    , anchor: '100%'
                    , msgTarget: 'under'
                }, {
                    xtype: 'msfm-combo-xtype'
                    , fieldLabel: _('msfieldsmanager.label_xtype')
                    , description: _('msfieldsmanager.label_xtype_help')
                    , name: 'xtype'
                    , allowBlank: false
                    , msgTarget: 'under'
                    , anchor: '100%'
                    , listeners: {
                        select: {fn: this.onChangeXType, scope: this}
                    }
                }, {
                    xtype: 'panel'
                    , layout: 'form'
                    , style: {'padding-top': '15px'}
                    , cls: 'msfm-panel-extjs-code'
                    , items: [{
                        layout: 'column'
                        , border: false
                        , labelAlign: 'top'
                        , fieldLabel: _('msfieldsmanager.label_extjs')
                        , items: [{
                            xtype: 'msfm-combo-extjs'
                            , name: 'combo-extjs'
                            , columnWidth: .9
                            , listeners: {
                                select: {
                                    fn: function (combo, record) {
                                        var val = combo.getValue(),
                                            field = this.fp.getForm().findField('processor_id')
                                        if (Msfm.utils.isNumber(val)) {
                                            field.setValue(val);
                                        } else {
                                            field.setValue(0);
                                        }
                                    },
                                    scope: this,
                                }
                            }
                        }, {
                            xtype: 'button'
                            , text: _('msfieldsmanager.btn_extjs_generate')
                            , cls: 'primary-button'
                            , scope: this
                            , handler: this.codeGenerate
                        }]
                    }, {
                        xtype: Ext.ComponentMgr.types['modx-texteditor'] ? 'modx-texteditor' : 'textarea'
                        , mimeType: 'application/javascript'
                        , height: 200
                        , fieldLabel: _('msfieldsmanager.label_extjs')
                        , description: _('msfieldsmanager.label_extjs_help')
                        , name: 'extjs'
                        , allowBlank: true
                        , anchor: '100%'
                    }]
                }, {
                    xtype: parseInt(Msfm.config.hide_user_group) ? 'hidden' : 'msfm-combo-usergroup'
                    , fieldLabel: _('msfieldsmanager.label_user_group')
                    , description: _('msfieldsmanager.label_user_group_help')
                    , name: 'user_group'
                    , value: r.user_group
                    , allowBlank: true
                    , msgTarget: 'under'
                    , anchor: '100%'
                }, {
                    xtype: 'msfm-combo-fieldset'
                    , fieldLabel: _('msfieldsmanager.label_fieldset_id')
                    , description: _('msfieldsmanager.label_fieldset_id_help')
                    , name: 'fieldset_id'
                    , allowBlank: false
                    , msgTarget: 'under'
                    , anchor: '100%'
                }, {
                    xtype: 'msfm-combo-boolean'
                    , fieldLabel: _('msfieldsmanager.label_sortable')
                    , description: _('msfieldsmanager.label_sortable_help')
                    , name: 'sortable'
                    , allowBlank: true
                    , msgTarget: 'under'
                    , anchor: '100%'
                }, {
                    xtype: 'msfm-combo-boolean'
                    , fieldLabel: _('msfieldsmanager.label_grid')
                    , description: _('msfieldsmanager.label_grid_help')
                    , name: 'grid'
                    , allowBlank: true
                    , msgTarget: 'under'
                    , anchor: '100%'
                }, {
                    xtype: 'msfm-combo-boolean'
                    , fieldLabel: _('msfieldsmanager.label_required')
                    , description: _('msfieldsmanager.label_required_help')
                    , name: 'required'
                    , allowBlank: false
                    , msgTarget: 'under'
                    , anchor: '100%'
                }, {
                    xtype: 'msfm-combo-boolean'
                    , fieldLabel: _('msfieldsmanager.label_ms2_enable')
                    , description: _('msfieldsmanager.label_ms2_enable_help')
                    , name: 'enable'
                    , allowBlank: false
                    , msgTarget: 'under'
                    , anchor: '100%'
                }, {
                    xtype: r.id ? 'numberfield' : 'hidden'
                    , fieldLabel: _('msfieldsmanager.label_ms2_rank')
                    , description: _('msfieldsmanager.label_ms2_rank_help')
                    , name: 'rank'
                    , allowBlank: true
                    , msgTarget: 'under'
                    , anchor: '100%'
                }, {
                    xtype: Msfm.config.polylang && r.id ? 'xcheckbox' : 'hidden'
                    , boxLabel: _('msfieldsmanager.label_polylang')
                    , description: _('msfieldsmanager.label_polylang_help')
                    , name: 'polylang'
                    , inputValue: 1
                    , listeners: {
                        check: {
                            fn: function (checkbox, checked) {
                                if (!checked && r.id) {
                                    Ext.MessageBox.confirm(
                                        _('msfieldsmanager.win_remove'),
                                        _('msfieldsmanager.confirm.remove_polylang'),
                                        function (val) {
                                            if (val == 'no') {
                                                checkbox.setValue(1);
                                            }
                                        }, this
                                    );
                                }
                            },
                            scope: this
                        }
                    }
                }]
            }
        ];
        if (Msfm.config.isMsPCS == true) {
            items.push(this.getMsPCSFields(config));
        }
        return items;
    }
    , getMsPCSFields: function (config) {
        var r = config.record;
        return {
            title: _('msfieldsmanager.fieldset.mspcs')
            , xtype: 'fieldset'
            , cls: 'x-fieldset-checkbox-toggle'
            , style: 'padding-top: 5px'
            , collapsible: true
            , stateId: 'msfm-fieldset-mspcs'
            , stateful: true
            , stateEvents: ['collapse', 'expand']
            , items: [{
                xtype: 'hidden'
                , name: 'mspcs_id'
            }, {
                xtype: 'xcheckbox',
                boxLabel: r.mspcs_id ? _('msfieldsmanager.mspcs.label_use_in_filter') : _('msfieldsmanager.mspcs.label_add_in_filter'),
                hideLabel: true,
                inputValue: 1,
                name: 'mspcs_use',
                readOnly: r.mspcs_id ? true : false
            }, {
                xtype: 'msproductscomposerselection-combo-type'
                , fieldLabel: _('msproductscomposerselection.label_filter_type')
                , description: _('msproductscomposerselection.label_filter_type_desc')
                , name: 'mspcs_type'
                , msgTarget: 'under'
                , anchor: '100%'
                , baseParams: {
                    action: 'mgr/types/getList',
                    key: (r.mspcs_id ? r.mspcs_key : '')
                }
            }, {
                xtype: 'textfield'
                , fieldLabel: _('msproductscomposerselection.label_filter_alias')
                , description: _('msproductscomposerselection.label_filter_alias_desc')
                , name: 'mspcs_alias'
                , msgTarget: 'under'
                , anchor: '100%'
            }, {
                xtype: 'textfield'
                , fieldLabel: _('msproductscomposerselection.label_filter_lexicon')
                , description: _('mmsproductscomposerselection.label_filter_lexicon_desc')
                , name: 'mspcs_lexicon'
                , msgTarget: 'under'
                , anchor: '100%'
            }, {
                xtype: 'msproductscomposerselection-combo-chunk'
                , name: 'mspcs_tpl_outer'
                , fieldLabel: _('msproductscomposerselection.label_filter_tpl_outer')
                , description: _('msproductscomposerselection.label_filter_tpl_outer_desc')
                , anchor: '100%'
            }, {
                xtype: 'msproductscomposerselection-combo-chunk'
                , name: 'mspcs_tpl_row'
                , fieldLabel: _('msproductscomposerselection.label_filter_tpl_row')
                , description: _('msproductscomposerselection.label_filter_tpl_row_desc')
                , anchor: '100%'
            }, {
                xtype: 'textarea'
                , fieldLabel: _('msproductscomposerselection.label_filter_description')
                , name: 'mspcs_description'
                , anchor: '100%'
            }, {
                title: _('msfieldsmanager.fieldset.mspcs_resource')
                , xtype: 'fieldset'
                , cls: 'x-fieldset-checkbox-toggle'
                , style: 'padding-top: 5px'
                , collapsible: true
                , stateId: 'msfm-fieldset-mspcs-resource'
                , stateful: true
                , stateEvents: ['collapse', 'expand']
                , items: [{
                    xtype: 'msfm-panel-resources'
                    , resources: r.mspcs_resources || []
                }
                ]
            }]
        };
    }
    , onShow: function () {
        var f = this.fp.getForm()
            , xtype = f.findField('xtype').getValue();

        f.findField('combo-extjs').reload(xtype);
        this.switchExtjsPanel(xtype);
        this.setDBDefault(f.findField('dbdefault').getValue());
    }
    , onChangeDBType: function (ele, rec, idx) {
        var f = this.fp.getForm(),
            precision = f.findField('dbprecision');

        if (ele.value === 'VARCHAR' || ele.value === 'CHAR') {
            precision.allowBlank = false;
        } else {
            precision.allowBlank = true;
        }
    }
    , onChangeDBDefault: function (ele, rec, idx) {
        this.setDBDefault(ele.value);
    }
    , onChangeXType: function (ele, rec, idx) {
        var f = this.fp.getForm();
        this.switchExtjsPanel(ele.value);
        f.findField('combo-extjs').reload(ele.value);
    }
    , setDBDefault: function (val) {
        var f = this.fp.getForm(),
            defaultValue = f.findField('default_value');

        if (val === 'user_defined') {
            defaultValue.show().allowBlank = false; //.validate();
        } else {
            defaultValue.hide().setValue('').allowBlank = true;
        }
    }
    , switchExtjsPanel: function (val) {
        var panel = Ext.select('.msfm-panel-extjs-code');
        panel.setVisibilityMode(Ext.Element.DISPLAY);
        if (val === 'combobox_custom' || val === 'radiogroup' || val === 'checkboxgroup') {
            panel.show(); //.doLayout();
        } else {
            panel.hide();
        }
    }
    , codeGenerate: function () {
        var f = this.fp.getForm();
        if (!this.mask) this.mask = new Ext.LoadMask(this.getEl());
        this.mask.show();
        var params = {
            action: 'mgr/extjs/generate'
            , extjs: f.findField('combo-extjs').getValue()
            , xtype: f.findField('xtype').getValue()
            , name: f.findField('name').getValue()
            , required: f.findField('required').getValue()
        };
        MODx.Ajax.request({
            url: Msfm.config.connectorUrl
            , params: params
            , listeners: {
                'success': {
                    fn: function (r) {
                        this.mask.hide();
                        f.findField('extjs').setValue(r.object.code);
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
Ext.reg('msfm-window-msfmfields-create', Msfm.window.CreateMsfmFields);


Msfm.window.EditMsfmFields = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        title: _('msfieldsmanager.title.win_edit')
        , baseParams: {
            action: 'mgr/msfmfields/update'
        }
    });
    Msfm.window.EditMsfmFields.superclass.constructor.call(this, config);
};
Ext.extend(Msfm.window.EditMsfmFields, Msfm.window.CreateMsfmFields, {});
Ext.reg('msfm-window-msfmfields-edit', Msfm.window.EditMsfmFields);