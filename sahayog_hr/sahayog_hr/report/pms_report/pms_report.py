import frappe

def execute(filters=None):
    if not filters:
        filters = {}

    data, columns = [], []

    columns = get_columns()
    performance_appraisal_data = get_performance_appraisal_data(filters)

    if not performance_appraisal_data:
        frappe.msgprint("No Records Found")
        return columns, data

    for d in performance_appraisal_data:
        row = {
            "employee_id": d.employee_id,
            "full_name": d.full_name,
            "designation": d.designation,
            "division": d.division,
            "date_of_joining": d.date_of_joining,
            "department": d.department,
            "region": d.region,
            "branch": d.branch,
            "Appraisee Rating": d.emp_ranking,
            "Appraiser Rating": d.emp_app_rank,
            "Skip Rating": d.emp_skip_rank,
            "Final Rating": "",
            "Promotion Recommendation (Yes/No)": d.emp_promotion,
            "Justification for Promotion": ""
        }
        data.append(row)

    return columns, data

def get_columns():
    return [
        {
            "fieldname": "employee_id",
            "label": "Employee ID",
            "fieldtype": "Data",
            "width": "100",
        },
        {
            "fieldname": "full_name",
            "label": "Full Name",
            "fieldtype": "Data",
            "width": "150",
        },
        {
            "fieldname": "designation",
            "label": "Designation",
            "fieldtype": "Data",
            "width": "150",
        },
        {
            "fieldname": "division",
            "label": "Division",
            "fieldtype": "Data",
            "width": "150",
        },
        {
            "fieldname": "date_of_joining",
            "label": "Date of Joining",
            "fieldtype": "Date",
            "width": "120",
        },
        {
            "fieldname": "department",
            "label": "Department",
            "fieldtype": "Data",
            "width": "150",
        },
        {
            "fieldname": "region",
            "label": "Region",
            "fieldtype": "Data",
            "width": "100",
        },
        {
            "fieldname": "branch",
            "label": "Branch",
            "fieldtype": "Data",
            "width": "100",
        },
        {
            "fieldname": "Appraisee Rating",
            "label": "Appraisee Rating",
            "fieldtype": "Data",
            "width": "120",
        },
        {
            "fieldname": "Appraiser Rating",
            "label": "Appraiser Rating",
            "fieldtype": "Data",
            "width": "120",
        },
        {
            "fieldname": "Skip Rating",
            "label": "HOD Rating",
            "fieldtype": "Data",
            "width": "100",
        },
        {
            "fieldname": "Final Rating",
            "label": "Final Rating",
            "fieldtype": "Data",
            "width": "100",
        },
        {
            "fieldname": "Promotion Recommendation (Yes/No)",
            "label": "Promotion Recommendation (Yes/No)",
            "fieldtype": "Data",
            "width": "200",
        },
        {
            "fieldname": "Justification for Promotion",
            "label": "Justification for Promotion",
            "fieldtype": "Data",
            "width": "200",
        }
    ]

def get_performance_appraisal_data(filters):
    sql_query = """
        SELECT
            employee_id,
            full_name,
            designation,
            division,
            date_of_joining,
            department,
            region,
            branch,
            emp_ranking,
            emp_app_rank,
            emp_skip_rank,
            emp_promotion
        FROM
            `tabPerformance Appraisal`
    """

    data = frappe.db.sql(sql_query, as_dict=True)

    return data
