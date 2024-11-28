let field = {
    xtype:'modx-combo'
    ,name: 'rating'
    ,hiddenName: 'rating'
    ,description: '<b>[[*rating]]</b><br />'+_('ms2_product_rating_help')
    ,value: msfmRecord['rating']
    ,anchor: '100%'
    ,fieldLabel: _('ms2_product_rating')
    ,displayField: 'name'
    ,valueField: 'key'
    ,valueNotFoundText: '- not chosen -'
    ,emptyText: '- not chosen -'
    ,fields: ['name','key']
    ,url: '/assets/components/msfieldsmanager/connector.php'
    ,baseParams:{
        action: 'mgr/custom/object_ratingstorage',
        combo:true,
        limit:0
    }
}