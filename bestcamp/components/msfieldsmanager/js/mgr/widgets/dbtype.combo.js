Msfm.combo.Dbtype = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        store: new Ext.data.SimpleStore({
            fields: ['d','v']
            ,data:[
                ['TINYINT','TINYINT'],
                ['SMALLINT','SMALLINT'],
                ['MEDIUMINT','MEDIUMINT'],
                ['INT','INT'],
                ['BIGINT','BIGINT'],
                ['DECIMAL','DECIMAL'],
                ['FLOAT','FLOAT'],
                ['DOUBLE','DOUBLE'],
                ['BIT','BIT'],
                ['BOOLEAN','BOOLEAN'],
                ['DATE','DATE'],
                ['DATETIME','DATETIME'],
                ['TIME','TIME'],
                ['YEAR','YEAR'],
                ['CHAR','CHAR'],
                ['VARCHAR','VARCHAR'],
                ['TINYTEXT','TINYTEXT'],
                ['TEXT','TEXT'],
                ['MEDIUMTEXT','MEDIUMTEXT'],
                ['LONGTEXT','LONGTEXT'],
                ['BINARY','BINARY'],
                ['VARBINARY','VARBINARY'],
                ['TINYBLOB','TINYBLOB'],
                ['MEDIUMBLOB','MEDIUMBLOB'],
                ['BLOB','BLOB'],
                ['LONGBLOB','LONGBLOB'],
                ['ENUM','ENUM'],
                ['SET','SET'],
                ['GEOMETRY','GEOMETRY'],
                ['POINT','POINT'],
                ['LINESTRING','LINESTRING'],
                ['POLYGON','POLYGON'],
                ['MULTIPOINT','MULTIPOINT'],
                ['MULTILINESTRING','MULTILINESTRING'],
                ['MULTIPOLYGON','MULTIPOLYGON'],
                ['GEOMETRYCOLLECTION','GEOMETRYCOLLECTION']
            ]
        })
        ,displayField: 'd'
        ,valueField: 'v'
        ,hiddenName: 'dbtype'
        ,mode: 'local'
        ,triggerAction: 'all'
        ,editable: false
        ,preventRender: true
        ,forceSelection: true
        ,enableKeyEvents: true
    });
    Msfm.combo.Dbtype.superclass.constructor.call(this,config);
};
Ext.extend(Msfm.combo.Dbtype,MODx.combo.ComboBox);
Ext.reg('msfm-combo-dbtype',Msfm.combo.Dbtype);