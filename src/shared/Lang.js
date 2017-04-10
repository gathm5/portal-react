const Lang = {
	"title": "Knox Mobile Enrollment for AT&T",
	"header": {},
	"headerSecondary": {
		"dropdown": {
			"options": [
				"Transaction ID",
				"Customer ID"
			],
			"defaultOption": "Transaction ID"
		}
	},
	"dashboard": {
		"title": "Recent History",
		"table": {
			"title": "Recent History",
			"previous": "Previous",
			"next": "Next"
		}
	},
	"transactions": {
		"table": {
			"title": "All Transactions",
			"previous": "Previous",
			"next": "Next"
		}
	},
	"devices": {
		"title": "Transaction Status"
	},
	"newDevice": {
		"title": "Submit new device"
	},
	"bulkDelete": {
		"title": "Bulk delete"
	},
	"admin": {
		"title": "Manage admins",
		"search": {
			"button": "Invite admin"
		}
	},
	"uploader": {
		"upload": {
			"title": "Upload device list",
			"subtitle": "Create a text file with one device ID (IMEI or Serial Number) per line.",
			"formTitle": "Device list (.csv)",
			"btnTitle": "Select",
			"formInfo": "Need the .csv template?",
			"formInfoUrl": "",
			"cancel": "Cancel",
			"submit": "Upload",
			"modal": {
				"success": {
					"title": "Upload Successful",
					"subtitle": "Note: You may want to document the Transaction ID for your records.",
					"label": "Transaction ID:",
					"labelStatus": "Status:"
				},
				"failure": {
					"title": "Upload Failed",
					"subtitle": "Please retry.",
					"label": "Transaction ID:",
					"labelStatus": "Status:"
				}
			}
		},
		"delete": {
			"title": "Upload device list to delete",
			"subtitle": "Create a text file with one device ID (IMEI or Serial Number) per line. Indicate the transaction type for each device (Delete or Returned).",
			"formTitle": "Device list (.csv)",
			"btnTitle": "Select",
			"formInfo": "Need the .csv template?",
			"formInfoUrl": "",
			"cancel": "Cancel",
			"submit": "Upload",
			"modal": {
				"success": {
					"title": "Upload Successful",
					"subtitle": "Note: You may want to document the Transaction ID for your records.",
					"label": "Transaction ID:",
					"labelStatus": "Status:"
				},
				"failure": {
					"title": "Upload Failed",
					"subtitle": "Please retry.",
					"label": "Transaction ID:",
					"labelStatus": "Status:"
				}
			}
		}
	},
	"table": {
		"noRows": "No records found.",
		"pagination": {
			"dropdown": {
				"label": "View:",
				"title": "Page Size"
			}
		}
	}
};

export default Lang;