# Copyright (c) 2023, Talib Sheikh and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.model.document import Document

class PerformanceAppraisal(Document):
	
	@frappe.whitelist()
	def get_filtered_data():
		 return "Hello from server"


@frappe.whitelist(allow_guest=True)
def get_performance_appraisals(user_id):
    # Specify the date explicitly
    target_date = "2024-11-28"

    # Query the Performance Appraisal Doctype for records created after the target date
    appraisals_list = frappe.get_all(
        "Performance Appraisal",
        filters={
            "user_id": user_id,
            "creation": [">", target_date]  # Filter for records created after the given date
        },
        fields="*",  # Fetch all fields
    )
    return appraisals_list

# For Reporting person
@frappe.whitelist(allow_guest=True)
def get_appraiser_list(appraiser_user_id):
# Specify the date explicitly
    target_date = "2024-11-28"

    # Query the Performance Appraisal Doctype for records created after the target date
    appraisals_list = frappe.get_all(
        "Performance Appraisal",
        filters={
           
             "appraiser_user_id": appraiser_user_id,
           
        },
        fields="*",  # Fetch all fields
    )
    return appraisals_list

@frappe.whitelist(allow_guest=True)
def get_skip_appraiser_list(skip_user):
# Specify the date explicitly
    target_date = "2024-11-28"

    # Query the Performance Appraisal Doctype for records created after the target date
    appraisals_list = frappe.get_all(
        "Performance Appraisal",
        filters={
            "skip_user": skip_user,
           
        },
        fields="*",  # Fetch all fields
    )
    return appraisals_list
   