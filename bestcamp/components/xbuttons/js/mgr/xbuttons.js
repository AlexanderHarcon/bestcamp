var xButtons = function (config) {
	config = config || {};
	xButtons.superclass.constructor.call(this, config);
};
Ext.extend(xButtons, Ext.Component, {
	page: {}, window: {}, grid: {}, tree: {}, panel: {}, combo: {}, config: {}, view: {}, utils: {},
	getFiles:function(){
		MODx.Ajax.request({
			url: xButtons_config.connector_url,
			params: {
				action: 'mgr/file/getfiles',
				element: xButtons_config.element
			},
			listeners: {
				success: {fn: function(response) {
					this.files = response.message;
					if (this.xbtnFileWindow) this.xbtnFileWindow.el.remove();
					this.xbtnFileWindow = MODx.load({
						xtype: 'xbuttons-files-window',
						id: 'xbuttons-files-window',
						listeners: {
							success: {
								fn: function (r) {
									var response = Ext.decode(r.a.response.responseText),
										code = response.message ? response.message : '<?php\n',
										aceEditor = document.getElementsByClassName('ace_editor')[0];

									if (aceEditor) {
										Ext.getCmp(aceEditor.id).setValue(code);
									}
									document.getElementById(xButtons_config.field).value = code;
								}, scope: this
							},
							failure: {
								fn: function(r){}, scope: this
							}
						}
					});
					this.xbtnFileWindow.setValues({element:xButtons_config.element});
					this.xbtnFileWindow.show(Ext.EventObject.target);
				}, scope: this},
				failure: {fn: function(response) {}, scope: this}
			}
		});
	},
	saveToFile:function(){
		if (this.saveObjectWindow) this.saveObjectWindow.el.remove();
		this.saveObjectWindow = MODx.load({
			xtype: 'xbuttons-save2file-window',
			id: Ext.id(),
			listeners: {
				success: {
					fn: function (response) {
						if (response.a.result.success) {
						}
					}, scope: this
				},
				failure: {
					fn: function(r){}, scope: this
				}
			}
		});
		this.saveObjectWindow.show(Ext.EventObject.target);
	},
	saveToPC:function(){
		MODx.Ajax.request({
			url: xButtons_config.connector_url,
			params: {
				action: 'mgr/file/savetmpfile',
				name: xButtons.getFileName(),
				code: xButtons.getCode(),
				element: xButtons_config.element
			},
			listeners: {
				success: {
					fn: function (result) {
						location.href = xButtons_config.connector_url+"?action=mgr/file/download&filename="+result.object.name+"&HTTP_MODAUTH="+MODx.siteId;
					}, scope: this
				},
				failure: {
					fn: function (result) {
						//panel.el.unmask();
						MODx.msg.alert(_('xbutton_error'), result.message);
					}, scope: this
				}
			}
		});
	},
	saveProp:function(){
		MODx.Ajax.request({
			url: xButtons_config.connector_url,
			params: {
				action: 'mgr/file/saveproperties',
				name: xButtons.getFileName(),
				element: xButtons_config.element
			},
			listeners: {
				success: {
					fn: function (result) {
						location.href = xButtons_config.connector_url+"?action=mgr/file/download&filename="+result.object.name+"&HTTP_MODAUTH="+MODx.siteId;
					}, scope: this
				},
				failure: {
					fn: function (result) {
						MODx.msg.alert(_('xbutton_error'), result.message);
					}, scope: this
				}
			}
		});
	},
	getCode: function(){
		var aceEditor = document.getElementsByClassName('ace_editor')[0], code;
		if (aceEditor) {
			code = Ext.getCmp(aceEditor.id).getValue();
		} else {
			code = document.getElementById(xButtons_config.field).value;
		}
		return code;
	},
	getFileName: function(){
		var name = 'temp.php';
		switch (xButtons_config.element) {
			case 'snippets':
				name = document.getElementById('modx-snippet-name').value;
				break;
			case 'plugins':
				name = document.getElementById('modx-plugin-name').value;
				break;
			case 'chunks':
				name = document.getElementById('modx-chunk-name').value;
				break;
			case 'templates':
				name = document.getElementById('modx-template-templatename').value;
				break;
		}
		return name;
	}

});
Ext.reg('xbuttons', xButtons);

xButtons = new xButtons();

/************************************************************/
xButtons.window.SaveToPC = function (config) {
	config = config || {};

	Ext.applyIf(config, {
		width: 300,
		title: _('xbuttons_file'),
		autoHeight: true,
		modal: true,
		url: xButtons_config.connector_url,
		action: 'mgr/file/savefile2pc',
		fields: [{
			xtype: 'hidden',
			name: 'code',
			value: xButtons.getCode()
		}, {
			xtype: 'hidden',
			name: 'element',
			value: xButtons_config.element
		}, {
			xtype: 'textfield',
			name: 'name',
			allowBlank: false,
			value: xButtons.getFileName() || 'temp',
			fieldLabel: _('xbuttons_enter_file'),
			anchor: '100%'
		}],
		keys: [{
			key: Ext.EventObject.ENTER, shift: true, fn: function () {
				this.submit()
			}, scope: this
		}]
	});
	xButtons.window.SaveToPC.superclass.constructor.call(this, config);
};
Ext.extend(xButtons.window.SaveToPC, MODx.Window);
Ext.reg('xbuttons-save2pc-window', xButtons.window.SaveToPC);

xButtons.window.Save2File = function (config) {
	config = config || {};

	Ext.applyIf(config, {
		width: 300,
		title: _('xbuttons_file'),
		autoHeight: true,
		modal: true,
		url: xButtons_config.connector_url,
		action: 'mgr/file/savefile',
		fields: [{
			xtype: 'hidden',
			name: 'code',
			value: xButtons.getCode()
		}, {
			xtype: 'hidden',
			name: 'element',
			value: xButtons_config.element
		}, {
			xtype: 'textfield',
			name: 'name',
			allowBlank: false,
			value: xButtons.getFileName() || 'temp',
			fieldLabel: _('xbuttons_enter_file_name'),
			anchor: '100%'
		}, {
			xtype: 'checkbox',
			name: 'overwrite',
			boxLabel: _('xbuttons_overwrite_file'),
			checked: false
		}],
		keys: [{
			key: Ext.EventObject.ENTER, shift: true, fn: function () {
				this.submit()
			}, scope: this
		}]
	});
	xButtons.window.Save2File.superclass.constructor.call(this, config);
};
Ext.extend(xButtons.window.Save2File, MODx.Window);
Ext.reg('xbuttons-save2file-window', xButtons.window.Save2File);


xButtons.window.SelectFile = function (config) {
	config = config || {};

	Ext.applyIf(config, {
		title: _('xbuttons_choose_file'),
		width: 300,
		url: xButtons_config.connector_url,
		action: 'mgr/file/loadfile',
		fields: [{
			xtype: 'hidden',
			name: 'element'
		}, {
			xtype: 'xbuttons-combo-files',
			name: 'file',
			emptyText: _('xbuttons_choose_file'),
			id: config.id + '-filename-field'
			,anchor: '100%'
		}],
		keys: [{
			key: Ext.EventObject.ENTER, shift: true, fn: function () {
				this.submit()
			}, scope: this
		}],
		buttons: [{
			text: _('xbuttons_close'),
			id: config.id + '-close-btn',
			handler: function () {
				this.hide();
			},
			scope: this
		}, {
			text: _('xbuttons_load'),
			id: config.id + '-load-btn',
			handler: function () {
				this.submit();
			},
			scope: this
		}]
	});
	xButtons.window.SelectFile.superclass.constructor.call(this, config);
};
Ext.extend(xButtons.window.SelectFile, MODx.Window);
Ext.reg('xbuttons-files-window', xButtons.window.SelectFile);

xButtons.combo.Files = function(config) {
	config = config || {};
	Ext.applyIf(config,{
		triggerAction: 'all',
		mode: 'local',
		hideMode: 'offsets',
		autoScroll: true,
		maxHeight: 200,
		store: xButtons.files,
		hiddenName: 'file',
		editable: false
	});
	xButtons.combo.Files.superclass.constructor.call(this,config);
};
Ext.extend(xButtons.combo.Files,MODx.combo.ComboBox);
Ext.reg('xbuttons-combo-files',xButtons.combo.Files);


/** *********************************************** **/
Ext.onReady(function() {
	function handleFile(e) {
		var file = e.target.files[0];
		var reader = new FileReader();
		reader.onload = function(e) {
			var code = e.target.result;
			var aceEditor = document.getElementsByClassName('ace_editor')[0];
			if (aceEditor) {
				Ext.getCmp(aceEditor.id).setValue(code);
			}
			document.getElementById(xButtons_config.field).value = code;
		};
		reader.readAsText(file);
	}
	function handleProperpties(e) {
		var file = e.target.files[0];
		var reader = new FileReader();
		reader.onload = function(e) {
			var code = Ext.decode(e.target.result);
			var grid = Ext.getCmp('modx-grid-element-properties');
			if (grid && Ext.isArray(code)) {
				grid.defaultProperties = code;
				grid.getStore().loadData(code);
			}
			//xButtons.loadProp(code);
		};
		reader.readAsText(file);
	}
	// Upload file
	var inputFile = document.createElement('input');
	inputFile.type = 'file';
	inputFile.id = 'xbuttons_upload_file';
	inputFile.style = 'display:none';
	document.body.appendChild(inputFile);
	document.getElementById('xbuttons_upload_file').addEventListener('change', handleFile, false);
	// Upload properties
	var inputProp = document.createElement('input');
	inputProp.type = 'file';
	inputProp.id = 'xbuttons_upload_properties';
	inputProp.style = 'display:none';
	document.body.appendChild(inputProp);
	document.getElementById('xbuttons_upload_properties').addEventListener('change', handleProperpties, false);

	var tb = Ext.getCmp("modx-action-buttons");

	var myBtn = new Ext.Button({
		text: "<i class=\"icon icon-file-code-o icon-large\"></i>",
		cls: "x-btn-text bmenu",
		style: "marginRight: 5px",
		menuAlign: 'tr-br',
		menu: {
			id: 'xbuttons-x-menu',
			items: [{
				text: _('xbuttons_load_from_server'),
				handler: function() {
					xButtons.getFiles();
				},
				scope: this
			},  {
				text: _('xbuttons_save_to_server'),
				handler: function() {
					xButtons.saveToFile();
				},
				scope: this
			}, '-',  {
				text: _('xbuttons_load_from_pc'),
				handler: function() {
					document.getElementById('xbuttons_upload_file').click();
				},
				scope: this
			},  {
				text: _('xbuttons_save_to_pc'),
				handler: function() {
					xButtons.saveToPC();
				},
				scope: this
			}, '-',  {
				text: _('xbuttons_load_prop'),
				handler: function() {
					document.getElementById('xbuttons_upload_properties').click();
				},
				scope: this
			},  {
				text: _('xbuttons_save_prop'),
				handler: function() {
					xButtons.saveProp();
				},
				scope: this
			}]
		},
		handler: function(){return false;}
	});
	tb.addButton(myBtn);
	tb.doLayout();
});
