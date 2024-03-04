import frappe


@frappe.whitelist()
def get_emp_details(emp_id):
    return frappe.db.sql(
        f"""select user_id,reporting_employee_user_id,employee_name from `tabEmployee` where employee_id='{emp_id}';""",
        as_dict=True,
    )
