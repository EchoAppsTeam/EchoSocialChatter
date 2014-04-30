(function($) {
"use strict";

if (Echo.App.isDefined("Echo.Apps.SocialChatter")) return;

var chatter = Echo.App.manifest("Echo.Apps.SocialChatter");

chatter.config = {
	"refreshOnUserInvalidate": false,
	"targetURL": undefined,
	"dependencies": {
		"Janrain": {
			"appId": undefined
		},
		"StreamServer": {
			"appkey": undefined
		},
		"FilePicker": {
			"apiKey": undefined
		},
		"embedly": {
			"apiKey": undefined
		}
	},
	"advanced": {}
};

chatter.dependencies = [{
	"url": "//cdn.echoenabled.com/apps/echo/conversations/v2/dev/app.js",
	"app": "Echo.Apps.Conversations"
}];

chatter.templates.main =
	'<div class="{class:container}">' +
		'<div class="{class:content}"></div>' +
	'</div>';

chatter.init = function() {
	this.render();
	this.ready();
};

chatter.renderers.content = function(element) {
	this.initComponent({
		"id": "Conversations",
		"component": "Echo.Apps.Conversations",
		"config": $.extend(true, {}, this.config.get("advanced"), {
			"target": element,
			"targetURL": this.config.get("targetURL"),
			"dependencies": this.config.get("dependencies")
		})
	});
	return element;
};

Echo.App.create(chatter);

})(Echo.jQuery);
