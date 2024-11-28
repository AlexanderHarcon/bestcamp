miniShop2.plugin.msfieldsmanager = {
	getFields: function(config) {
		return {
		}
	},
	getColumns: function() {
		return {
			country: {
				header: _('ms2_product_country')
				,dataIndex: 'country'
				,name: 'country'
				,sortable: true
			},
			city: {
				header: _('ms2_product_city')
				,dataIndex: 'city'
				,name: 'city'
				,sortable: true
			}
		}
	}
};