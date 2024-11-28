let field = {
    xtype:'modx-combo'
    ,name: 'region'
    ,hiddenName: 'region'
    ,description: '<b>[[*region]]</b><br />'+_('ms2_product_region_help')
    ,anchor: '100%'
    ,fieldLabel: _('ms2_product_region')
    ,displayField: 'region_en'
    ,value: msfmRecord['region']
    ,valueField: 'id'
    ,fields: ['region_en','id']
    ,valueNotFoundText: '- Please select a country first -'
    ,emptyText: '- not chosen -'
    ,url: '/assets/components/campsregions/connector.php'
    ,baseParams:{
        action: 'cmpregions/getlist',
        combo:true,
        countryid: '',
        limit:0
    }
    ,id: 'cmp-region-combo'
    ,listeners: {
        focus: {
            fn: function (r)
            {
                var country = Ext.getCmp('cmp-country-combo');

                r.baseParams.countryid = country.getValue();

                if (!r.baseParams.countryid)
                {
                    Ext.MessageBox.alert('OK', 'Choose the country');
                }
                else
                {
                    r.getStore().load();
                }
            }
            ,scope: this
        },
        select: {
            fn: function (tf, nv, ov)
            {
                var city = Ext.getCmp('cmp-city-combo');

                city.reset();
                city.clearValue();
                city.baseParams.regionid = tf.getValue();
                city.getStore().load();
            }
            ,scope: this
        }
    }
}