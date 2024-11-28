let field = {
    xtype:'modx-combo'
    ,name: 'city'
    ,hiddenName: 'city'
    ,description: '<b>[[*city]]</b><br />'+_('ms2_product_city_help')
    ,anchor: '100%'
    ,fieldLabel: _('ms2_product_city')
    ,displayField: 'city_en'
    ,valueField: 'id'
    ,valueNotFoundText: '- Please select a country first -'
    ,emptyText: '- not chosen -'
    ,fields: ['city_en','id']
    ,url: '/assets/components/campsregions/connector.php'
    ,baseParams: {
        action: 'cmpcities/getlist',
        combo:true,
        countryid: '',
        regionid: '',
        limit:0
    }
    ,id: 'cmp-city-combo'
    ,listeners: {
        focus: {
            fn: function (r)
            {
                var country = Ext.getCmp('cmp-country-combo');
                var region = Ext.getCmp('cmp-region-combo');

                r.baseParams.countryid = country.getValue();
                r.baseParams.regionid = region.getValue();

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
        }
    }
}