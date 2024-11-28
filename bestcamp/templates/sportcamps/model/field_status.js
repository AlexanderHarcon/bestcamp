let field = {
    xtype: 'radiogroup'
    ,fieldLabel: _('ms2_product_status')
    ,hideLabel: false
    ,columns: 1
    ,value: msfmRecord['status']
    ,allowBlank: true
    ,items: [{
        boxLabel: 'None'
        ,hideLabel: true
        ,name: 'status'
        ,inputValue: 0
    },{
        boxLabel: 'New'
        ,hideLabel: true
        ,name: 'status'
        ,inputValue: 1
    },{
        boxLabel: 'In progress'
        ,hideLabel: true
        ,name: 'status'
        ,inputValue: 2
    },{
        boxLabel: 'Pre-ready'
        ,hideLabel: true
        ,name: 'status'
        ,inputValue: 3
    },{
        boxLabel: 'Ready'
        ,hideLabel: true
        ,name: 'status'
        ,inputValue: 4
    }]
}