Msfm.panel.MsfmTabPanel = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        listeners: {
            afterrender: {fn: this.onAfterRender, scope: this}

        }
    });
    Msfm.panel.MsfmTabPanel.superclass.constructor.call(this, config);
};
Ext.extend(Msfm.panel.MsfmTabPanel, MODx.Panel, {
    form: null,
    allChildren: [],
    onAfterRender: function () {
        this.getForm();
        this.getAllChildren(this, true);
    },
    getForm: function () {
        if (this.form === null) {
            var scope = this, maxDepth = 10, n = 0;
            for (; n < maxDepth && Ext.isDefined(scope.ownerCt); n++) {
                scope = scope.ownerCt;
                if (Ext.isDefined(scope.getForm)) {
                    this.form = scope.getForm();
                    break;
                }
            }
        }
        return this.form;
    },
    getAllChildren: function (panel, addChild) {
        addChild = addChild || false;
        var children = panel.items ? panel.items.items : [];
        Ext.each(children, function (child) {
            if (child.validate && child.xtype) {
                this.allChildren.push(child);
                if (addChild && this.form) {
                    this.form.add(child);
                }
            }
            children = children.concat(this.getAllChildren(child, addChild));
        }, this);
        return children;
    }
});
Ext.reg('msfm-panel-tab', Msfm.panel.MsfmTabPanel);