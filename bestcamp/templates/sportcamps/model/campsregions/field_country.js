let field = {
    xtype:'modx-combo'
    ,name: 'country'
    ,hiddenName: 'country'
    ,description: '<b>[[*country]]</b><br />'+_('ms2_product_country_help')
    ,anchor: '100%'
    ,fieldLabel: _('ms2_product_country')
    ,displayField: 'country_en'
    ,value: msfmRecord['country']
    ,valueField: 'id'
    ,valueNotFoundText: '- not chosen -'
    ,fields: ['country_en','id']
    ,url: '/assets/components/campsregions/connector.php'
    ,baseParams:{
        action: 'cmpcountries/getlist',
        combo:true,
        limit:0
    }
    ,id: 'cmp-country-combo'
    ,listeners: {
        select: {
            fn: function (tf, nv, ov)
            {
                var region = Ext.getCmp('cmp-region-combo');

                region.reset();
                region.clearValue();
                region.baseParams.countryid = tf.getValue();
                region.getStore().load();

                var city = Ext.getCmp('cmp-city-combo');

                city.reset();
                city.clearValue();
                city.baseParams.countryid = tf.getValue();
                city.getStore().load();
            }
            ,scope: this
        }
    }
}