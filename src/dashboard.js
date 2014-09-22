(function($) {
"use strict";

if (Echo.AppServer.Dashboard.isDefined("Echo.Apps.SocialChatter.Dashboard")) return;

var dashboard = Echo.AppServer.Dashboard.manifest("Echo.Apps.SocialChatter.Dashboard");

dashboard.inherits = Echo.Utils.getComponent("Echo.AppServer.Dashboards.AppSettings");

dashboard.mappings = {
	"dependencies.appkey": {
		"key": "dependencies.StreamServer.appkey"
	},
	"dependencies.janrainapp": {
		"key": "dependencies.Janrain.appId"
	}
};

dashboard.dependencies = [{
	"url": "{config:cdnBaseURL.apps.appserver}/controls/configurator.js",
	"control": "Echo.AppServer.Controls.Configurator"
}, {
	"url": "{config:cdnBaseURL.apps.dataserver}/full.pack.js",
	"control": "Echo.DataServer.Controls.Pack"
}];

dashboard.config = {
	"appkeys": [],
	"janrainapps": []
};

dashboard.config.ecl = [{
	"name": "targetURL",
	"component": "Echo.DataServer.Controls.Dashboard.DataSourceGroup",
	"type": "string",
	"required": true,
	"config": {
		"title": "",
		"labels": {
			"dataserverBundleName": "Echo Social Chatter Auto-Generated Bundle for {instanceName}"
		},
		"apiBaseURLs": {
			"DataServer": "{%= apiBaseURLs.DataServer %}/"
		}
	}
}, {
	"component": "Group",
	"name": "dependencies",
	"type": "object",
	"config": {
		"title": "Dependencies",
		"expanded": false
	},
	"items": [{
		"component": "Select",
		"name": "appkey",
		"type": "string",
		"config": {
			"title": "StreamServer application key",
			"desc": "Specifies the application key for this instance",
			"options": []
		}
	}, {
		"component": "Select",
		"name": "janrainapp",
		"type": "string",
		"config": {
			"title": "Janrain application ID",
			"validators": ["required"],
			"options": []
		}
	}, {
		"component": "Fieldset",
		"name": "FilePicker",
		"type": "object",
		"items": [{
			"component": "Input",
			"name": "apiKey",
			"type": "string",
			"config": {
				"title": "FilePicker API key",
				"desc": "Specifies the Filepicker api key for this instance",
				"options": []
			}
		}]
	}, {
		"component": "Fieldset",
		"name": "embedly",
		"type": "object",
		"items": [{
			"component": "Input",
			"name": "apiKey",
			"type": "string",
			"config": {
				"title": "Embed.ly API Key"
			}
		}]
	}]
}, {
	"component": "Dashboard",
	"name": "advanced",
	"type": "object",
	"config": {
		"title": "Advanced",
		"component": "Echo.Apps.Conversations.Dashboard",
		"url": "http://cdn.echoenabled.com/apps/echo/conversations/v2/dashboard.js",
		"config": {
			"disableSettings": ["targetURL", "dependencies"]
		}
	},
	"items": []
}];

dashboard.config.normalizer = {
	"ecl": function(obj, component) {
		var self = this;
		return $.map(obj, function(field) {
			if (field.name === "advanced") {
				field.config = $.extend(true, field.config, {
					"config": {
						"data": self.get("data"),
						"request": self.get("request")
					}
				});
			}
			return field;
		});
	}
};

dashboard.modifiers = {
	"dependencies.appkey": {
		"endpoint": "customer/{self:user.getCustomerId}/appkeys",
		"processor": function() {
			return this.getAppkey.apply(this, arguments);
		}
	},
	"dependencies.janrainapp": {
		"endpoint": "customer/{self:user.getCustomerId}/janrainapps",
		"processor": function() {
			return this.getJanrainApp.apply(this, arguments);
		}
	},
	"targetURL": {
		"endpoint": "customer/{self:user.getCustomerId}/subscriptions",
		"processor": function() {
			return this.getBundleTargetURL.apply(this, arguments);
		}
	}
};

dashboard.init = function() {
	this.parent();
};

dashboard.methods.declareInitialConfig = function() {
	return {
		"targetURL": this.assembleTargetURL(),
		"dependencies": {
			"Janrain": {
				"appId": this.getDefaultJanrainApp()
			},
			"StreamServer": {
				"appkey": this.getDefaultAppKey()
			},
			"FilePicker": {
				"apiKey": "AFLWUBllDRwWZl7sQO1V1z"
			},
			"embedly": {
				"apiKey": "5945901611864679a8761b0fcaa56f87"
			}
		}
	};
};

Echo.AppServer.Dashboard.create(dashboard);

})(Echo.jQuery);
