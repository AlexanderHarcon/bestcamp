Msfm.panel.Resources = function (config) {
    config = config || {};
    this.ident = config.ident || 'msfm-panel-resources-' + Ext.id();
    Ext.applyIf(config, {
        layout: 'form'
        , labelAlign: 'top'
        , header: false
        , border: false
        , defaults: {border: false}
        , cls: 'msfm-panel-resources'
        , items: [{
            xtype: 'panel'
            , id: this.ident + '-container'
            , items: []
        }, {
            xtype: 'button'
            , text: '<i class="icon icon-plus"></i> ' + _('msfieldsmanager.btn_add_filter_resource')
            , cls: 'primary-button btn btn-sm'
            , style: 'margin-top: 15px;'
            , listeners: {
                'click': {
                    fn: this.onAddItem, scope: this
                }
            }
        }]
    });
    Msfm.panel.Resources.superclass.constructor.call(this, config);
    this.panel = Ext.getCmp(this.ident + '-container');
    this.on('render', function () {
        this.clear();
        Ext.each(config.resources || [], function (item) {
            this.addItem(item);
        }, this);
    }, this);
};
Ext.extend(Msfm.panel.Resources, MODx.Panel, {
    onAddItem: function (e) {
        this.addItem();
    }
    , addItem: function (rid) {
        var index = this.panel.items.length + 1
            , id = 'msfm-resource-item-' + Ext.id()
            , col = {
            layout: 'column'
            , id: id
            , border: false
            , labelAlign: 'top'
            , cls: 'msfm-panel-resources-item'
            , items: [{
                xtype: 'msfm-combo-resource'
                , value: rid
                , name: 'mspcs_resources[]'
                , columnWidth: .8
            }, {
                xtype: 'button'
                , text: '<i class="icon icon-trash-o"></i>'
                , cls: 'msfm-resource-item-btn'
                , columnWidth: .2
                , rid: id
                , listeners: {
                    'click': {fn: this.removeItem, scope: this}
                }
            }]
        };
        this.panel.insert(index, col);
        this.panel.doLayout();
    }
    , removeItem: function (e) {
        var item = Ext.getCmp(e.rid);
        this.panel.remove(item, true);
    }
    , clear: function () {
        this.panel.removeAll();
    }
});
Ext.reg('msfm-panel-resources', Msfm.panel.Resources);