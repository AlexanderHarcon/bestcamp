Msfm.combo.Resource = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        displayField: 'pagetitle'
        , valueField: 'id'
        , fields: ['id', 'pagetitle', 'parents', 'context_key', 'context_name']
        , hiddenName: config.name || 'rid'
        , url: Msfm.config.connectorUrl
        , emptyText: _('msfieldsmanager.combo.resource_empty')
        , baseParams: {
            action: 'mgr/element/resource/getlist'
            , combo: true
        }
        , tpl: new Ext.XTemplate('\
            <tpl for=".">\
                <div class="x-combo-list-item minishop2-product-list-item" ext:qtip="{pagetitle}">\
                    <tpl if="parents">\
                        <span class="parents">\
                         <nobr><small>{context_name} / </small></nobr>\
                            <tpl for="parents">\
                                <nobr><small>{pagetitle} / </small></nobr>\
                            </tpl>\
                        </span><br/>\
                    </tpl>\
                    <span><small>({id})</small> <b>{pagetitle}</b></span>\
                </div>\
            </tpl>', {compiled: true}
        )
        , pageSize: 5
        , editable: true
    });
    Msfm.combo.Resource.superclass.constructor.call(this, config);
};
Ext.extend(Msfm.combo.Resource, MODx.combo.ComboBox);
Ext.reg('msfm-combo-resource', Msfm.combo.Resource);