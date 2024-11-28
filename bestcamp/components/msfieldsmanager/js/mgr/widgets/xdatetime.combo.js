Msfm.combo.DateTime = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        hiddenFormat: 'Y-m-d H:i:s'
        , timePosition: 'right'
        , dateFormat: MODx.config.manager_date_format
        , timeFormat: MODx.config.manager_time_format
        , startDay: parseInt(MODx.config.manager_week_start)
        , offset_time: MODx.config.server_offset_time
        , dateWidth: 120
        , timeWidth: 120
    });
    Msfm.combo.DateTime.superclass.constructor.call(this, config);
};
Ext.extend(Msfm.combo.DateTime, Ext.ux.form.DateTime);
Ext.reg('msfm-combo-xdatetime', Msfm.combo.DateTime);