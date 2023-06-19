# Copyright (c) 2023, Talib Sheikh and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.model.document import Document

class PerformanceAppraisal(Document):
	
	@frappe.whitelist()
	def get_filtered_data():
		 return "Hello from server"
