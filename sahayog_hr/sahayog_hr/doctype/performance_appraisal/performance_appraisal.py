# Copyright (c) 2023, Talib Sheikh and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.model.document import Document
from frappe.utils.password import update_password

class PerformanceAppraisal(Document):
      
    def before_save(self):
        self.set_reporting_details()

    def set_reporting_details(self):
        if not self.employee_id:
            return  # Avoid unnecessary processing if employee_id is missing
    
        # Fetch first-level reporting employee ID
        reporting_emp = frappe.db.get_value(
            "Employee", self.employee_id, ["reports_to"], as_dict=True
        )
    
        reporting_emp_id = reporting_emp.get("reports_to") if reporting_emp else None
    
        if not reporting_emp_id:
            return  # Exit if no reporting manager
    
        # Fetch first-level reporting employee details
        reporting_details = frappe.db.get_value(
            "Employee", reporting_emp_id, 
            ["company_email", "employee_name", "user_id", "reports_to"],
            as_dict=True
        )
    
        if not reporting_details:
            return  # Exit if reporting details are missing
    
        # Fetch second-level reporting employee ID
        skip_reporting_emp_id = reporting_details.get("reports_to")
    
        skip_details = None
        if skip_reporting_emp_id:
            skip_details = frappe.db.get_value(
                "Employee", skip_reporting_emp_id, 
                ["company_email", "employee_name", "user_id"],
                as_dict=True
            )
    
        # Set first-level reporting details
        self.appraiser_name = reporting_emp_id
        self.appraiser_email = reporting_details.get("company_email")
        self.ap_name = reporting_details.get("employee_name")
        self.appraiser_user_id = reporting_details.get("user_id")
    
        # Set skip-level reporting details if available
        if skip_details:
            self.skip_reporting_employee_id = skip_reporting_emp_id
            self.skip_employee_email = skip_details.get("company_email")
            self.skip_reporting_employee_name = skip_details.get("employee_name")
            self.skip_user = skip_details.get("user_id")


@frappe.whitelist(allow_guest=True)
def get_performance_appraisals(user_id):

    # Specify the date explicitly
    target_date = "2024-12-01"

    # Query the Performance Appraisal Doctype for records created after the target date
    appraisals_list = frappe.get_all(
        "Performance Appraisal",
        filters={
            "user_id": user_id,
            "creation": [">", target_date],  # Filter for records created after the given date
            "appraisal_period": ["in", ["Final-Term Appraisal", "Mid-Term Appraisal"]]  # Correct way to filter multiple values
        },
        fields=["*"],  # Fetch all fields
    )
    return appraisals_list


# For Reporting person
@frappe.whitelist(allow_guest=True)
def get_appraiser_list(appraiser_user_id):
# Specify the date explicitly
    target_date = "2025-04-01"

    # Query the Performance Appraisal Doctype for records created after the target date
    appraisals_list = frappe.get_all(
        "Performance Appraisal",
        filters={
           
             "appraiser_user_id": appraiser_user_id,
             "creation": [">", target_date],
             "status":  "Submitted"
           
        },
        fields="*",  # Fetch all fields
    )
    return appraisals_list

@frappe.whitelist(allow_guest=True)
def get_skip_appraiser_list(skip_user):
# Specify the date explicitly
    target_date = "2025-04-01"

    # Query the Performance Appraisal Doctype for records created after the target date
    appraisals_list = frappe.get_all(
        "Performance Appraisal",
        filters={
            "skip_user": skip_user,
            "creation": [">", target_date],
            "employee_status": "Not-Satisfied",
        },
        fields="*",  # Fetch all fields
    )
    return appraisals_list

import math
import frappe

@frappe.whitelist(allow_guest=True)
def get_bell_curve_employee(user_id, from_date="2025-04-01"):
    if not user_id:
        return []

    user_prefix = user_id.split("@")[0]

    # Determine total number of employees
    if frappe.session.user == "Administrator":
        total_no_emp = frappe.db.count("Employee", filters={"status": "Active"})
    else:
        total_no_emp = frappe.db.count("Employee", filters={"status": "Active", "reports_to": user_prefix})

    # Define percentage distribution
    percentages = {
        "Rank 1": 0.15,
        "Rank 2": 0.20,
        "Rank 3": 0.50,
        "Rank 4": 0.10,
        "Rank 5": 0.05
    }

    # Calculate expected distribution
    expected_distribution = {}
    remainder_list = []
    total_allocated = 0

    for rank, perc in percentages.items():
        exact = total_no_emp * perc
        floored = math.floor(exact)
        expected_distribution[rank] = floored
        total_allocated += floored
        remainder_list.append((rank, exact - floored))

    remaining = total_no_emp - total_allocated
    remainder_list.sort(key=lambda x: x[1], reverse=True)

    for i in range(remaining):
        rank_to_increment = remainder_list[i][0]
        expected_distribution[rank_to_increment] += 1

    # Fetch performance appraisal records
    if frappe.session.user == "Administrator":
        filters = {}
        if from_date:
            filters["date_of_appraisal"] = [">=", from_date]
        records = frappe.get_all("Performance Appraisal", filters=filters, fields=["emp_app_rank"])
    else:
        filters1 = {"appraiser_user_id": user_id}
        filters2 = {"skip_user": user_id}
        if from_date:
            filters1["date_of_appraisal"] = [">=", from_date]
            filters2["date_of_appraisal"] = [">=", from_date]
        records1 = frappe.get_all("Performance Appraisal", filters=filters1, fields=["emp_app_rank"])
        records2 = frappe.get_all("Performance Appraisal", filters=filters2, fields=["emp_app_rank"])
        records = records1 + records2

    # Calculate actual distribution
    actual_distribution = {f"Rank {i}": 0 for i in range(1, 6)}
    for r in records:
        try:
            rank = int(r.get("emp_app_rank"))
            if 1 <= rank <= 5:
                actual_distribution[f"Rank {rank}"] += 1
        except (ValueError, TypeError):
            continue

    return {
        "user_id": user_id,
        "from_date": from_date,
        "total_reportees": total_no_emp,
        "expected_distribution": expected_distribution,
        "actual_distribution": actual_distribution
    }


@frappe.whitelist()
def reset_user_password(user, new_password):
    if not frappe.has_permission("User", ptype="write"):
        frappe.throw("You are not allowed to reset passwords.")

    if not user or not new_password:
        frappe.throw("User and new password are required.")

    try:
        update_password(user, new_password, logout_all_sessions=True)
        return "ok"
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Reset User Password Failed")
        return {"error": str(e)}
