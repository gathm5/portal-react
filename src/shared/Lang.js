const Lang = {
	"title": "AT&T Portal for Knox Mobile Enrollment",
	"header": {
		"links": {
			"admin": "Manage Admins",
			"logout": "Logout"
		}
	},
	"headerSecondary": {
		"dropdown": {
			"options": [
				"Transaction ID",
				"Customer ID"
			],
			"defaultOption": "Transaction ID"
		},
		"buttons": {
			"reporting": "Download report",
			"delete": "Bulk delete",
			"new": "Submit new devices"
		}
	},
	"login": {
		"forgot": "Forgot password?",
		"signIn": "Sign in",
		"processing": "Logging in..."
	},
	"activate": {
		"title": "Update Your Password",
		"old": "Current Password",
		"new": "New Password",
		"confirm": "Confirm Password",
		"button": "Change Password"
	},
	"search": {
		"dropdown": {
			"options": [
				"Transaction ID",
				"Customer ID",
				"IMEI"
			],
			"defaultOption": "Transaction ID"
		}
	},
	"batches": {
		"title": "Recent History",
		"table": {
			"title": "Recent History",
			"previous": "Previous",
			"next": "Next"
		},
		"info": {
			"field1": "Batch ID",
			"field2": "Batch Type",
			"field3": "Batch Status",
			"field4": "Submitted"
		}
	},
	"batch details": {
		"title": "Batch Details",
		"back": "Return to dashboard",
		"modal": {
			"confirmation": {
				"delete": {
					"title": "Delete device?",
					"subtitle": "This device will be deleted from the Knox Mobile Enrollment system.",
					"key": "IMEI",
					"buttons": {
						"cancel": "Cancel",
						"ok": "Delete"
					}
				},
				"returned": {
					"title": "Return device?",
					"subtitle": "This device will be marked as returned in the Knox Mobile Enrollment system.",
					"key": "IMEI",
					"buttons": {
						"cancel": "Cancel",
						"ok": "Return"
					}
				}
			}
		},
		"info": {
			"field1": "Batch ID",
			"field2": "Customer ID",
			"field3": "Devices",
			"field4": "Transaction ID(s)",
			"field5": "Submitted",
			"field6": "Errors"
		}
	},
	"transactions": {
		"table": {
			"title": "Search by Transaction ID",
			"previous": "Previous",
			"next": "Next"
		},
		"back": "Return to dashboard",
		"modal": {
			"confirmation": {
				"title": "Delete Transaction?",
				"subtitle": "All devices associated with this transaction will be deleted.",
				"key": "Transaction ID",
				"buttons": {
					"cancel": "Cancel",
					"ok": "Delete"
				}
			}
		},
		"resultCount": "results"
	},
	"transaction details": {
		"title": "Transaction Details",
		"back": "Return to search results",
		"modal": {
			"confirmation": {
				"delete": {
					"title": "Delete device?",
					"subtitle": "This device will be deleted from the Knox Mobile Enrollment system.",
					"key": "IMEI",
					"buttons": {
						"cancel": "Cancel",
						"ok": "Delete"
					}
				},
				"returned": {
					"title": "Return device?",
					"subtitle": "This device will be marked as returned in the Knox Mobile Enrollment system.",
					"key": "IMEI",
					"buttons": {
						"cancel": "Cancel",
						"ok": "Return"
					}
				}
			}
		},
		"info": {
			"field1": "Transaction ID",
			"field2": "Customer ID",
			"field3": "Devices",
			"field4": "Batch ID",
			"field5": "Submitted",
			"field6": "Errors"
		}
	},
	"customers": {
		"table": {
			"title": "Search by Customer ID",
			"previous": "Previous",
			"next": "Next"
		},
		"back": "Return to dashboard",
		"resultCount": "results"
	},
	"customer details": {
		"title": "Customer Details",
		"back": "Return to search results",
		"modal": {
			"confirmation": {
				"delete": {
					"title": "Delete device?",
					"subtitle": "This device will be deleted from the Knox Mobile Enrollment system.",
					"key": "IMEI",
					"buttons": {
						"cancel": "Cancel",
						"ok": "Delete"
					}
				},
				"returned": {
					"title": "Return device?",
					"subtitle": "This device will be marked as returned in the Knox Mobile Enrollment system.",
					"key": "IMEI",
					"buttons": {
						"cancel": "Cancel",
						"ok": "Return"
					}
				}
			}
		},
		"info": {
			"field1": "Customer ID",
			"field2": "Devices"
		}
	},
	"devices": {
		"table": {
			"title": "Search by IMEI",
			"previous": "Previous",
			"next": "Next"
		},
		"back": "Return to dashboard",
		"resultCount": "results",
		"modal": {
			"confirmation": {
				"delete": {
					"title": "Delete device?",
					"subtitle": "This device will be deleted from the Knox Mobile Enrollment system.",
					"key": "IMEI",
					"buttons": {
						"cancel": "Cancel",
						"ok": "Delete"
					}
				},
				"returned": {
					"title": "Return device?",
					"subtitle": "This device will be marked as returned in the Knox Mobile Enrollment system.",
					"key": "IMEI",
					"buttons": {
						"cancel": "Cancel",
						"ok": "Return"
					}
				}
			}
		}
	},
	"newDevice": {
		"title": "Submit new device",
		"back": "Return to dashboard",
		"modal": {

		}
	},
	"bulkDelete": {
		"title": "Bulk delete",
		"back": "Return to dashboard"
	},
	"reporting": {
		"title": "Download report",
		"back": "Return to dashboard"
	},
	"admin": {
		"title": "Manage admins",
		"search": {
			"button": "Invite admin"
		},
		"back": "Return to previous page",
		"modal": {
			"confirmation": {
				"delete": {
					"title": "Delete user",
					"subtitle": "Are you sure you wanted to delete this user?",
					"buttons": {
						"cancel": "Cancel",
						"ok": "Delete"
					}
				}
			}
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
				"progress": {
					"pre": "Uploading..."
				},
				"success": {
					"title": "Upload Successful",
					"subtitle": "Note: You may want to document the Batch ID for your records.",
					"label": "Batch ID:",
					"labelStatus": "Status:",
					"errors": "Errors:",
					"btnLabel": "OK"
				},
				"failure": {
					"title": "Upload Failed",
					"subtitle": "Please retry.",
					"label": "Batch ID:",
					"labelStatus": "Status:",
					"errors": "Errors:",
					"btnLabel": "OK"
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
				"progress": {
					"pre": "Uploading..."
				},
				"success": {
					"title": "Upload Successful",
					"subtitle": "Note: You may want to document the Batch ID for your records.",
					"label": "Batch ID:",
					"labelStatus": "Status:",
					"errors": "Errors:",
					"btnLabel": "OK"
				},
				"failure": {
					"title": "Upload Failed",
					"subtitle": "Please retry.",
					"label": "Batch ID:",
					"labelStatus": "Status:",
					"errors": "Errors:",
					"btnLabel": "OK"
				}
			}
		}
	},
	"reportGenerator": {
		"title": "Download Report",
		"select": "Select the date range.",
		"startDate": "Start date",
		"endDate": "End date",
		"btnLabel": "Download Report",
		"generating": "Creating report...",
		"generated": "Downloading report...",
		"dropdown": {
			"title": "Select report type",
			"options": [
				"Devices",
				"Device Errors",
				"Pre-processing Errors"
			],
			"defaultOption": "Devices"
		},
		"downloaded": {
			"heading": "Download complete",
			"message": "Check your downloads folder for the report file.",
			"btnLabel": "OK"
		}
	},
	"table": {
		"noRows": "No records found.",
		"pagination": {
			"dropdown": {
				"label": "View:",
				"title": "Page Size"
			}
		},
		"buttons": {
			"delete": "Delete",
			"return": "Return"
		}
	},
	"errors": {
		"network": "Server error"
	}
};

export default Lang;