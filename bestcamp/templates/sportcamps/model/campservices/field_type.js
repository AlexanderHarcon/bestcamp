let field = {
    xtype:'modx-combo'
    ,name: 'type'
    ,hiddenName: 'type'
    ,description: '<b>[[*type]]</b><br />'+_('ms2_product_type_help')
    ,anchor: '100%'
    ,fieldLabel: _('ms2_product_type')
    ,displayField: 'title_en'
    ,value: msfmRecord['type']
    ,valueField: 'id'
    ,valueNotFoundText: '- not chosen -'
    ,fields: ['title_en','id']
    ,url: '/assets/components/campservices/connector.php'
    ,baseParams:{
        action: 'cmpobjtypes/getlist',
        combo:true,
        limit:0
    }
}