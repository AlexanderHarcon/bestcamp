Polylang.grid.PolylangContent = function (config) {
    config = config || {};
    if (!config.id) {
        config.id = 'polylang-grid-polylangcontent';
    }
    Ext.applyIf(config, {
        baseParams: {
            action: 'mgr/polylangcontent/getList',
            content_id: config.content_id,
            language_group: Polylang.config.localization.filter.language_group,
            language_parent_type: Polylang.config.localization.filter.language_parent_type,
            sort: 'Language.rank',
            dir: 'ASC',
        },
        multi_select: true,
        autoExpandColumn: 'id',
        save_action: 'mgr/polylangcontent/updateFromGrid',
    });

    Polylang.grid.PolylangContent.superclass.constructor.call(this, config);
    this.getStore().on('load', function () {
        Polylang.config.contentLanguages = this.getStore().getTotalCount();
        this.updateStateBtnCreate();
    }, this);
};
Ext.extend(Polylang.grid.PolylangContent, Polylang.grid.Default, {
    getFields: function (config) {
        return ['id', 'content_id', 'culture_key', 'language_id', 'language_name', 'class_key', 'pagetitle', 'seotitle', 'keywords', 'longtitle', 'menutitle', 'introtext', 'description', 'content', 'created_username','edited_username','createdby','createdon', 'editedby', 'editedon', 'active', 'actions'];
    },
    getColumns: function (config) {
        return [config.sm, {
            header: _('id'),
            dataIndex: 'id',
            sortable: true,
            hidden: true,
        }, {
            header: _('polylang_content_header_culture_key'),
            dataIndex: 'culture_key',
            sortable: true,
            width: 80,
            renderer: function (value, props, row) {
                return row.data.language_name + ' (' + value + ')';
            }
        }, {
            header: _('polylang_content_header_pagetitle'),
            dataIndex: 'pagetitle',
            sortable: true,
            editor: {
                xtype: 'textfield'
            },
        }, {
            header: _('polylang_content_header_seotitle'),
            dataIndex: 'seotitle',
            sortable: true,
            editor: {
                xtype: 'textfield'
            },
        }, {
            header: _('polylang_content_header_menutitle'),
            dataIndex: 'menutitle',
            sortable: true,
            editor: {
                xtype: 'textfield'
            },
        }, {
            header: _('polylang_content_header_createdon'),
            dataIndex: 'createdon',
            sortable: true,
            width: 100,
            renderer: Polylang.utils.formatDate
        }, {
            header: _('polylang_content_header_createdby'),
            dataIndex: 'created_username',
            sortable: true,
            renderer: function (val, cell, row) {
                if (parseInt(row.data['createdby'])) {
                    return Polylang.utils.userLink(val, row.data['createdby'], true);
                }
                return val;
            }
        }, {
            header: _('polylang_content_header_editedon'),
            dataIndex: 'editedon',
            sortable: true,
            width: 100,
            renderer: Polylang.utils.formatDate
        }, {
            header: _('polylang_content_header_editedby'),
            dataIndex: 'edited_username',
            sortable: true,
            renderer: function (val, cell, row) {
                if (parseInt(row.data['editedby'])) {
                    return Polylang.utils.userLink(val, row.data['editedby'], true);
                }
                return val;
            }
        }, {
            header: _('polylang_content_header_actions'),
            dataIndex: 'actions',
            renderer: Polylang.utils.renderActions,
            width: 60

        }];
    },
    getTopBar: function (config) {
        var tbar = [];
        tbar.push({
            text: '<i class="icon icon-plus"></i> ' + _('polylang_content_btn_create'),
            id: 'polylang-content-btn-create',
            handler: this.addItem,
            cls: 'primary-button',
            scope: this
        });
        tbar.push({
            text: '<i class="fa fa-cogs"></i> ',
            menu: [{
                text: '<i class="fa fa-globe"></i> ' + _('polylang_content_btn_generate'),
                cls: 'polylang-cogs',
                handler: this.generateItems,
                scope: this
            }]
        });
        tbar.push('->', {
            xtype: 'tbtext',
            text: _('polylang_filter_language_parent_type')
        }, this.getLanguageParentTypeField(config), {
            xtype: 'tbtext',
            text: _('polylang_filter_language_group')
        }, this.getLanguageGroupField(config), this.getSearchField());
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
                action: 'mgr/polylangcontent/multiple',
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
        if (typeof (row) != 'undefined') {
            this.menu.record = row.data;
        }
        MODx.Ajax.request({
            url: Polylang.config.connector_url,
            params: {
                action: 'mgr/polylangcontent/render',
                rid: Polylang.config.rid,
            },
            listeners: {
                success: {
                    fn: function (r) {
                        var w = Ext.getCmp('polylang-window-polylangcontent');
                        if (w) {
                            w.close();
                        }
                        w = MODx.load({
                            xtype: 'polylang-window-polylangcontent',
                            id: 'polylang-window-polylangcontent',
                            record: r.object,
                            grid: this,
                            listeners: {
                                success: {
                                    fn: function () {
                                        this.refresh();
                                    }, scope: this
                                },
                            }
                        });
                        //  w.fp.getForm().reset();
                        w.fp.getForm().setValues(r.object.data);
                        w.show(e.target);
                    }, scope: this
                }
            }
        });
    },
    generateItems: function (btn, e, row) {
        if (typeof (row) != 'undefined') {
            this.menu.record = row.data;
        }
        this.getEl().mask(_('loading'), 'x-mask-loading');
        MODx.Ajax.request({
            url: Polylang.config.connector_url,
            params: {
                action: 'mgr/polylangcontent/generate',
                rid: Polylang.config.rid,
                translate: true,
            },
            listeners: {
                success: {
                    fn: function (r) {
                        this.getEl().unmask();
                        this.refresh();
                    }, scope: this
                },
                failure: {
                    fn: function (response) {
                        this.getEl().unmask();
                        MODx.msg.alert(_('error'), response.message);
                    }, scope: this
                },
            }
        });
    },
    updateItem: function (btn, e, row) {
        if (typeof (row) != 'undefined') {
            this.menu.record = row.data;
        }
        MODx.Ajax.request({
            url: Polylang.config.connector_url,
            params: {
                action: 'mgr/polylangcontent/render',
                rid: Polylang.config.rid,
                id: this.menu.record.id,
            },
            listeners: {
                success: {
                    fn: function (r) {
                        var w = Ext.getCmp('polylang-window-polylangcontent');
                        if (w) {
                            w.close();
                        }
                        w = MODx.load({
                            xtype: 'polylang-window-polylangcontent',
                            id: 'polylang-window-polylangcontent',
                            record: r.object,
                            grid: this,
                            listeners: {
                                success: {
                                    fn: function () {
                                        this.refresh();
                                    }, scope: this
                                },
                            }
                        });
                        // w.fp.getForm().reset();
                        w.fp.getForm().setValues(r.object.data);
                        w.show(e.target);
                    }, scope: this
                }
            }
        });
    },
    copyItem: function (btn, e, row) {
        if (typeof (row) != 'undefined') {
            this.menu.record = row.data;
        }
        MODx.Ajax.request({
            url: Polylang.config.connector_url,
            params: {
                action: 'mgr/polylangcontent/languages',
                rid: this.menu.record.content_id,
                exclude: this.menu.record.culture_key,
            },
            listeners: {
                success: {
                    fn: function (r) {
                        var w = Ext.getCmp('polylang-window-polylangcontent-copy');
                        if (w) {
                            w.close();
                        }
                        w = MODx.load({
                            xtype: 'polylang-window-polylangcontent-copy',
                            id: 'polylang-window-polylangcontent-copy',
                            record: r.object,
                            source: this.menu.record,
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
    },
    editLexicon: function (btn, e, row) {
        if (typeof (row) != 'undefined') {
            this.menu.record = row.data;
        }
        var url = MODx.config.manager_url + '?a=mgr/lexicon&namespace=polylang&language=';
        url += this.menu.record.culture_key;
        window.open(url, '_blank');
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
            _('polylang_content_title_win_remove'),
            ids.length > 1
                ? _('polylang_content_confirm_multiple_remove')
                : _('polylang_content_confirm_remove'),
            function (val) {
                if (val == 'yes') {
                    this.actionItem('remove');
                }
            }, this
        );
    },
    updateStateBtnCreate: function () {
        var btn = Ext.getCmp('polylang-content-btn-create');
        if (Polylang.config.contentLanguages < Polylang.config.totalLanguages) {
            btn.enable();
        } else {
            btn.disable();
        }
    },
    getLanguageParentTypeField: function (config) {
        return {
            xtype: 'polylang-combo-language-parent-type',
            value: Polylang.config.localization.filter.language_parent_type,
            listeners: {
                select: {
                    fn: function (combo) {
                        this.getStore().baseParams.language_parent_type = combo.getValue();
                        this.getBottomToolbar().changePage(1);
                    }, scope: this
                },
                clear: {
                    fn: function (combo) {
                        this.getStore().baseParams.language_parent_type = '';
                        this.getBottomToolbar().changePage(1);
                    }, scope: this
                }
            }
        }
    },
    getLanguageGroupField: function (config) {
        return {
            xtype: 'polylang-combo',
            displayFieldTpl: '{name} ({id})',
            valueField: 'id',
            fields: ['id', 'name'],
            pageSize: 20,
            typeAhead: true,
            editable: true,
            minChars: 2,
            forceSelection: true,
            width: 200,
            url: Polylang.config.connector_url,
            baseParams: {
                combo: true,
                action: 'mgr/polylanglanguagegroup/getlist',
            },
            value: Polylang.config.localization.filter.language_group,
            tpl: new Ext.XTemplate('<tpl for="."><div class="x-combo-list-item"><small>({id})</small> <span style="font-weight: bold">{name}</span></div></tpl>'),
            listeners: {
                select: {
                    fn: function (combo) {
                        this.getStore().baseParams.language_group = combo.getValue();
                        this.getBottomToolbar().changePage(1);
                    }, scope: this
                },
                clear: {
                    fn: function (combo) {
                        this.getStore().baseParams.language_group = '';
                        this.getBottomToolbar().changePage(1);
                    }, scope: this
                }
            }
        }
    },
});
Ext.reg('polylang-grid-polylangcontent', Polylang.grid.PolylangContent);
Polylang.window.PolylangContent = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        title: config.record.data.id ? _('polylang_content_title_win_update') : _('polylang_content_title_win_create'),
        width: 1000,
        height: 800,
        autoHeight: false,
        autoScroll: true,
        buttonAlign: 'left',
        baseParams: {
            action: config.record.data.id ? 'mgr/polylangcontent/update' : 'mgr/polylangcontent/create'
        }
    });
    Polylang.window.PolylangContent.superclass.constructor.call(this, config);
    this.on('activate', function () {
        this.setup(config);
    }, this);
    this.on('beforeSubmit', this.beforeSubmit, this);
};
Ext.extend(Polylang.window.PolylangContent, Polylang.window.Default, {
    idEditors: [],
    setup: function (config) {
        if (!this.initialized) {
            this.initialized = true;
            Ext.iterate(config.record.data || {}, function (key, val) {
                var item = Ext.getCmp('polylang-' + key);
                if (item) {
                    item.setValue(val || '');
                    if (item.name == 'polylangcontent_culture_key') {
                        item.baseParams.exclude = config.record.languages.join(',');
                        item.on('select', function (combo) {
                            var items = this.fp.getForm().items;
                            items.each(function (item) {
                                if (item.hasOwnProperty('culture_key')) {
                                    item.culture_key = combo.getValue();
                                }
                            });
                            this.fireEvent('culture-key-changed', combo);
                        }, this);
                    }
                }
            }, this);
            this.loadEditors();
        }
        this.initFieldsBtns(config);
    },
    initFieldsBtns: function (config) {
        if (this.initedFieldBtns) return;
        this.initedFieldBtns = true;
        var clsBtnTranslate = 'polylang-btn-translate',
            clsBtnCopy = 'polylang-btn-copy';
        if (Polylang.config.localization.btns.translate.show == 1) {
            clsBtnTranslate += ' show';
        }
        if (Polylang.config.localization.btns.copy.show == 1) {
            clsBtnCopy += ' show';
        }
        this.fp.getForm().items.each(function (item) {
            if (item.hasOwnProperty('label')) {
                var btns = '';
                if (config.record.data.id && item.key != 'culture_key' && !item.btnCopy) {
                    btns += '<a id="polylang-copy-field' + item.key + '-' + item.source + '" class="' + clsBtnCopy + '" title="' + _('polylang_btn_copy_field_content') + '" ' +
                        'data-key="' + item.key + '" ' +
                        'data-name="' + item.name + '" ' +
                        'data-source="' + item.source + '">' +
                        '</a>'
                    item.btnCopy = true;
                }
                if (item.translate == 1 && !item.btnTranslate) {
                    btns += '<a id="polylang-translate-' + item.key + '-' + item.source + '" class="' + clsBtnTranslate + '" title="' + _('polylang_translator_translate') + '" ' +
                        'data-key="' + item.key + '" ' +
                        'data-name="' + item.name + '" ' +
                        'data-target="' + item.id + '"' +
                        'data-source="' + item.source + '">' +
                        '</a>';
                    item.btnTranslate = true;
                }
                if (btns) Ext.DomHelper.append(item.label, btns);
            }
        });
        Ext.select('.polylang-btn-translate').on('click', function (e, t, o) {
            if (this.isEnableBtnTranslate(t.id)) {
                var item = this.getBtnAttrData(t);
                if (parseInt(Polylang.config.disallowTranslationCompletedField)) {
                    if (this.getFieldValue(item.target)) {
                        var label = this.getFieldLabel(item.target),
                            warning = _('polylang_translator_warning_translation_nonempty_field_prohibited', {label: label});
                        MODx.msg.alert(_('warning'), warning);
                        return;
                    }
                }
                this.translate([item]);
            }
        }, this);
        Ext.select('.polylang-btn-copy').on('click', function (e, t, o) {
            var item = this.getBtnAttrData(t);
            this.copyFieldContent(item);
        }, this);
    },
    getFields: function (config) {
        if (config.record.tvs) {
            config.record.items.push({
                title: _('polylang_content_tab_tvs'),
                id: 'polylang-window-polylangcontent-tab-tvs',
                forceLayout: true,
                deferredRender: false,
                autoLoad: {
                    url: Polylang.config.connector_url,
                    params: {
                        action: 'mgr/polylangtv/render',
                        id: config.record.data.id,
                        rid: Polylang.config.rid,
                    },
                    scripts: true,
                    scope: this
                }
            });
        }
        return [{
            xtype: 'hidden',
            name: 'id',
        }, {
            xtype: 'hidden',
            name: 'dependent_languages',
            value: config.record.data.id ? Polylang.config.localization.update.dependent_languages : Polylang.config.localization.create.dependent_languages,
        }, {
            xtype: 'modx-tabs',
            id: 'polylang-window-polylangcontent-tabs',
            forceLayout: true,
            deferredRender: false,
            defaults: {border: true, autoHeight: true},
            stateEvents: ['tabchange'],
            items: config.record.items
        }];

    },
    getButtons: function (config) {
        var buttons = Polylang.window.PolylangContent.superclass.getButtons.call(this, config);
        buttons.splice(1, 0, {
            text: '<i class="icon icon-language"></i> ' + _('polylang_content_btn_translate_all'),
            scope: this,
            handler: this.translateAll
        });
        buttons.unshift('->');
        buttons.unshift({
            xtype: 'xcheckbox',
            inputValue: 1,
            hideLabel: true,
            checked: config.record.data.id ? Polylang.config.localization.update.dependent_languages : Polylang.config.localization.create.dependent_languages,
            value: 1,
            boxLabel: config.record.data.id ? _('polylang_content_autoupdate_dependent_languages') : _('polylang_content_autocreate_dependent_languages'),
            listeners: {
                check: {
                    fn: function (cb, checked) {
                        this.fp.getForm().findField('dependent_languages').setValue(~~checked);
                    }, scope: this
                }
            }
        });
        return buttons;
    },
    unloadEditor: function (id) {
        if (MODx.unloadRTE) {
            MODx.unloadRTE(id);
        }
        if (window.hasOwnProperty('tinyMCE')) {
            tinyMCE.execCommand("mceRemoveEditor", true, id);
        }
    },
    getIdEditors: function (cls) {
        cls = cls || 'polylang-text-editor';
        var ids = [],
            useEditor = MODx.config.use_editor;
        if (Polylang.config.useResourceEditorStatus == 1) {
            var richtext = Ext.getCmp('modx-resource-richtext');
            if (richtext) {
                useEditor = richtext.getValue() == 1;
            }
        }
        if (
            useEditor &&
            MODx.loadRTE
        ) {
            Ext.select('#' + this.id + ' .' + cls).each(function (el) {
                ids.push(el.id);
            }, this);
        }
        return ids;
    },
    loadEditors: function (cls) {
        this.ids = this.getIdEditors(cls);
        if (this.ids.length) {
            Ext.each(this.ids, function (id) {
                this.idEditors.push(id);
                this.unloadEditor(id);
                MODx.loadRTE(id);
            }, this);
            Ext.select('#' + this.id + ' .tox-tinymce').setStyle({
                height: Polylang.config.editorHeight + 'px',
            });
        }
    },
    unloadEditors: function () {
        if (this.idEditors.length) {
            Ext.each(this.idEditors, function (id) {
                this.unloadEditor(id);
            }, this);
        }
    },
    beforeSubmit: function () {
        if (window.hasOwnProperty('tinyMCE')) {
            tinyMCE.triggerSave();
        } else if (window.hasOwnProperty('CKEDITOR')) {
            if (this.idEditors.length) {
                Ext.each(this.idEditors, function (id) {
                    CKEDITOR.instances[id].updateElement();
                }, this);
            }
        }
    },
    beforeDestroy: function () {
        this.unloadEditors();
        Polylang.window.PolylangContent.superclass.beforeDestroy.call(this);
    },
    getBtnAttrData: function (el) {
        var data = {};
        if (!el) return data;
        return {
            id: el.id,
            name: el.dataset.name || '',
            key: el.dataset.key,
            target: el.dataset.target,
            source: el.dataset.source
        }
    },
    setBtnTranslateNote: function (id, note) {
        var el = Ext.get(id);
        if (el) {
            el.update('<span>' + note + '</span>');
        }
    },
    enableBtnTranslate: function (id, enable) {
        var el = Ext.get(id);
        if (el) {
            if (enable) {
                el.removeClass('disabled');
            } else {
                el.addClass('disabled');
            }
        }
    },
    isEnableBtnTranslate: function (id) {
        var el = Ext.get(id);
        if (el) {
            return !el.hasClass('disabled');
        }
        return false;
    },
    setTranslate: function (items) {
        Ext.iterate(items || {}, function (item) {
            if (!item.hasOwnProperty('text') || item.text == '') {
                this.setBtnTranslateNote(item.id, _('polylang_translator_note_original_field_empty'));
                this.enableBtnTranslate(item.id, false);
                return true;
            }
            this.setFieldValue(item.target, item.text);
        }, this);
    },
    getFieldValue: function (id) {
        var val = '',
            field = this.getFieldById(id);
        if (field) {
            if (field.isTv) {
                val = field.dom.value;
            } else {
                val = field.getValue();
                if (MODx.loadRTE) {
                    if (window.hasOwnProperty('TinyMCERTE') &&
                        tinyMCE.hasOwnProperty('get') &&
                        tinyMCE.get(id)
                    ) {
                        val = tinyMCE.get(id).getContent();
                    } else if (window.hasOwnProperty('tinyMCE') &&
                        tinyMCE.hasOwnProperty('getInstanceById') &&
                        tinyMCE.getInstanceById(id)
                    ) {
                        val = tinyMCE.getInstanceById(id).getContent();
                    } else if (window.hasOwnProperty('CKEDITOR') && MODx.loadedRTEs[id] != undefined) {
                        val = MODx.loadedRTEs[id].editor.getData();
                    }
                }
            }
        }
        return val;
    },
    isTvSuperSelect(field) {
        return field.dom.classList.contains('x-superboxselect-input-field');
    },
    prepareTvSuperSelectValue(values) {
        const result = [];
        Ext.each(values || [], function (val) {
            result.push({
                value: val
            });
        });
        return result;
    },


    setFieldValue: function (id, val) {
        let field = Ext.getCmp(id);
        if (field) {
            field.setValue(val);
        } else {
            id = 'tv' + id;
            if (field = Ext.get(id)) {
                if (this.isTvSuperSelect(field)) {
                    const tvss = Ext.getCmp(id);
                    tvss.setValueEx(this.prepareTvSuperSelectValue(val));
                } else if (field.getAttribute('tvtype') == 'migx') {
                    const migx = Ext.getCmp(field.getAttribute('name') + '_items');
                    if (migx && migx.loadData) {
                        migx.loadData();
                    }
                } else {
                    field.dom.value = val;
                }
            }
        }
        if (MODx.loadRTE) {
            if (window.hasOwnProperty('TinyMCERTE') &&
                tinyMCE.hasOwnProperty('get') &&
                tinyMCE.get(id)
            ) {
                tinyMCE.get(id).setContent(val);
            } else if (
                window.hasOwnProperty('tinyMCE') &&
                tinyMCE.hasOwnProperty('getInstanceById') &&
                tinyMCE.getInstanceById(id)
            ) {
                tinyMCE.getInstanceById(id).setContent(val);
            } else if (window.hasOwnProperty('CKEDITOR') && MODx.loadedRTEs[id] != undefined) {
                MODx.loadedRTEs[id].editor.setData(val);
            }
        }
    },
    getFieldLabel: function (id) {
        var val = '',
            field = this.getFieldById(id);
        if (field) {
            if (field.isTv) {
                var label = field.up('.x-form-element').prev('label');
                if (label) {
                    val = label.dom.innerText
                }
            } else {
                val = field.fieldLabel;
            }
        }
        return val.trim();
    },
    getFieldById: function (id) {
        var field = Ext.getCmp(id);
        if (!field) {
            if (field = Ext.get('tv' + id)) {
                field.isTv = true;
            }
        }
        return field;
    },
    copyFieldContent: function (data) {
        var f = this.fp.getForm(),
            language = f.findField('polylangcontent_culture_key');
        MODx.Ajax.request({
            url: Polylang.config.connector_url,
            params: {
                action: 'mgr/polylangcontent/languages',
                rid: Polylang.config.rid,
                exclude: language.getValue(),
            },
            listeners: {
                success: {
                    fn: function (r) {
                        r.object.field = data.name;
                        var w = Ext.getCmp('polylang-window-polylangcontent-field-copy');
                        if (w) {
                            w.close();
                        }
                        w = MODx.load({
                            xtype: 'polylang-window-polylangcontent-field-copy',
                            id: 'polylang-window-polylangcontent-field-copy',
                            record: r.object,
                            source: {
                                id: f.findField('id').getValue(),
                                parent: language.getSelectedRecord().data.parent,
                                culture_key: language.getSelectedRecord().data.culture_key,
                                language_id: language.getSelectedRecord().data.id,
                                language_name: language.getSelectedRecord().data.name,
                            },
                            listeners: {
                                success: {
                                    fn: function () {
                                        this.grid.refresh();
                                    }, scope: this
                                },
                            }
                        });
                        w.fp.getForm().setValues(r.object);
                        w.show();
                    }, scope: this
                }
            }
        });
    },
    translate: function (items) {
        if (!items.length) return;
        var language = Ext.getCmp('polylang-polylangcontent-culture_key');
        this.getEl().mask(_('loading'), 'x-mask-loading');
        MODx.Ajax.request({
            url: Polylang.config.connector_url,
            params: {
                action: 'mgr/translator/translate',
                rid: Polylang.config.rid,
                items: Ext.encode(items),
                to: language.getValue(),
                from: Polylang.config.defaultLanguage,
            },
            listeners: {
                success: {
                    fn: function (r) {
                        this.setTranslate(r.object);
                        this.getEl().unmask();
                    }, scope: this
                },
                failure: {
                    fn: function (response) {
                        this.getEl().unmask();
                        MODx.msg.alert(_('error'), response.message);
                    }, scope: this
                },
            }
        });
    },
    translateAll: function () {
        var items = [],
            hasValue = false,
            list = Ext.query('#' + this.id + ' .polylang-btn-translate');
        Ext.each(list || [], function (el) {
            var data = this.getBtnAttrData(el),
                val = this.getFieldValue(data.target);
            data.hasValue = false;
            if (val) {
                hasValue = true;
                data.hasValue = true;
            }
            items.push(data);
        }, this);
        if (hasValue) {
            Ext.MessageBox.confirm(
                _('confirm'),
                _('polylang_translator_confirm_ignore_translate'),
                function (val) {
                    if (val == 'yes') {
                        Ext.each(items, function (item, index) {
                            if (item && item.hasValue) {
                                items.splice(index, 1);
                            }
                        }, this);
                    }
                    this.translate(items);
                }, this
            );
        } else {
            this.translate(items);
        }
    }
});
Ext.reg('polylang-window-polylangcontent', Polylang.window.PolylangContent);

Polylang.window.PolylangContentCopy = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        title: _('polylang_content_title_win_copy') + ' "' + config.source.language_name + ' (' + config.source.culture_key + ')"',
        width: 600,
        height: 400,
        autoHeight: false,
        autoScroll: true,
        buttonAlign: 'left',
        saveBtnIcon: 'files-o',
        saveBtnText: _('polylang_btn_copy'),
        introText: _('polylang_content_copy_help'),
        baseParams: {
            action: 'mgr/polylangcontent/copy'
        }
    });
    Polylang.window.PolylangContentCopy.superclass.constructor.call(this, config);
};
Ext.extend(Polylang.window.PolylangContentCopy, Polylang.window.Default, {
    getFields: function (config) {
        var fields = [{
            xtype: 'hidden',
            name: 'id',
            value: config.source.id
        }, {
            xtype: 'hidden',
            name: 'rid',
        }, {
            xtype: 'modx-description',
            html: config.introText,
            style: 'margin-top:15px',

        }];
        Ext.iterate(config.record.languages || {}, function (key, language) {
            if (key != Polylang.config.defaultLanguage) {
                var hidden = false;
                if (Polylang.config.localization.copy.dependent_languages) {
                    hidden = language.parent != config.source.language_id;
                }
                fields.push({
                    xtype: 'xcheckbox',
                    hideLabel: true,
                    name: 'languages[' + language.culture_key + ']',
                    inputValue: 1,
                    parent: language.parent || 0,
                    checked: false,
                    hidden: hidden,
                    value: 1,
                    boxLabel: language.name + ' (' + language.culture_key + ')',
                });
            }
        });
        return fields;
    },
    getButtons: function (config) {
        var buttons = Polylang.window.PolylangContentCopy.superclass.getButtons.call(this, config);
        buttons.unshift('->');
        buttons.unshift({
            xtype: 'xcheckbox',
            inputValue: 1,
            hideLabel: true,
            checked: Polylang.config.localization.copy.dependent_languages,
            value: 1,
            boxLabel: _('polylang_content_only_dependent_languages'),
            listeners: {
                check: {fn: this.filterLanguages, scope: this}
            }
        });
        return buttons;
    },
    filterLanguages: function (cb, checked) {
        var items = this.fp.getForm().items,
            id = this.source.language_id;
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
Ext.reg('polylang-window-polylangcontent-copy', Polylang.window.PolylangContentCopy);

Polylang.window.PolylangContentFieldCopy = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        title: _('polylang_content_title_win_field_content_copy'),
        introText: _('polylang_content_field_content_copy_help'),
    });
    Polylang.window.PolylangContentFieldCopy.superclass.constructor.call(this, config);
};
Ext.extend(Polylang.window.PolylangContentFieldCopy, Polylang.window.PolylangContentCopy, {
    getFields: function (config) {
        var fields = Polylang.window.PolylangContentFieldCopy.superclass.getFields.call(this, config);
        fields.push({
            xtype: 'hidden',
            name: 'field',
            value: config.record.field
        });
        return fields;
    },
});
Ext.reg('polylang-window-polylangcontent-field-copy', Polylang.window.PolylangContentFieldCopy);