let field = {
    xtype: 'msfm-checkboxgroup'
    ,fieldLabel: _('ms2_product_services')
    ,description: '<b>[[*services]]</b><br />'+_('ms2_product_services_help')
    ,columns: 1
    ,hiddenName: 'services'
    ,values: msfmRecord['services']
    ,displayField: 'title_en'
    ,valueField: 'id'
    ,url: '/assets/components/campservices/connector.php'
    ,baseParams:{
        action: 'cmpobjservices/getlist',
        combo:true,
        limit:0
    }
    ,allowBlank: true
    //,vertical: true
};