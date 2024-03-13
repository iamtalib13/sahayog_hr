import frappe

def execute(filters=None):
    """
    Execute the performance appraisal report.

    Args:
        filters (dict): Filters for the report.

    Returns:
        tuple: Columns and data for the report.
    """
    if not filters:
        filters = {}

    columns = get_columns()
    performance_appraisal_data = get_performance_appraisal_data(filters)

    if not performance_appraisal_data:
        frappe.msgprint("No Records Found")
        return columns, []

    data = []
    for d in performance_appraisal_data:
        row = {
            "employee_id": d.employee_id,
            "employee_name": d.employee_name,
            "department": d.department,
            "branch": d.branch,
            "division": d.division,
            "designation": d.designation,
            "appraisee": get_appraisee_status(d),
            "appraiser": get_appraiser_status(d),
            "skip": get_skip_status(d)
        }
        data.append(row)

    return columns, data

def get_columns():
    """
    Define columns for the performance appraisal report.

    Returns:
        list: List of column definitions.
    """
    return [
        {
            "fieldname": "employee_id",
            "label": "Employee ID",
            "fieldtype": "Data",
            "width": "100",
        },
        {
            "fieldname": "employee_name",
            "label": "Employee Name",
            "fieldtype": "Data",
            "width": "150",
        },
        {
            "fieldname": "department",
            "label": "Department",
            "fieldtype": "Data",
            "width": "150",
        },
        {
            "fieldname": "branch",
            "label": "Branch",
            "fieldtype": "Data",
            "width": "120",
        },
        {
            "fieldname": "division",
            "label": "Division",
            "fieldtype": "Data",
            "width": "80",
        },
        {
            "fieldname": "designation",
            "label": "Designation",
            "fieldtype": "Data",
            "width": "150",
        },
        {
            "fieldname": "appraisee",
            "label": "Appraisee Status",
            "fieldtype": "Data",
            "width": "120",
        },
        {
            "fieldname": "appraiser",
            "label": "Appraiser Status",
            "fieldtype": "Data",
            "width": "120",
        },
        {
            "fieldname": "skip",
            "label": "SKIP Status",
            "fieldtype": "Data",
            "width": "120",
        }
    ]

def get_performance_appraisal_data(filters):
    """
    Retrieve performance appraisal data from the database.

    Args:
        filters (dict): Filters for the data retrieval.

    Returns:
        list: Performance appraisal data.
    """
    sql_query = """
        SELECT 
            e.employee_id,
            e.employee_name,
            e.department,
            e.branch,
            e.division,
            e.designation,
            e.employee_id AS employee_id,
            CASE 
                WHEN p.employee_rating_fetched = 'Fetched' THEN 'Submitted'
                ELSE 'Pending'
            END AS Appraisee,
            CASE 
                WHEN p.appraiser_rating_calculated = 'yes' THEN 'Submitted'
                WHEN p.appraiser_rating_calculated = 'no' AND p.employee_rating_fetched = 'Fetched' THEN 'Pending'
                WHEN p.status = 'Rejected' THEN 'Changes-Required'
                ELSE ''
            END AS Appraiser,
            CASE 
                WHEN p.employee_status = 'Not-Satisfied' AND p.skip_confirmation_status = '' THEN 'Pending'
                WHEN p.skip_sec_calculated = 'yes' AND p.skip_confirmation_status = 'SKIP Rating Required' THEN 'Submitted'
                WHEN p.skip_confirmation_status = 'SKIP Rating Not-Required' THEN 'Appraiser-Final'
                ELSE ''
            END AS SKIP
        FROM 
            `tabEmployee` e
        LEFT JOIN 
            `tabPerformance Appraisal` p
        ON 
            e.employee_id = p.employee_id
        WHERE 
            e.appraisal_category IS NOT NULL
               AND e.status = 'Active'
    """

    try:
        data = frappe.db.sql(sql_query, as_dict=True)
        return data
    except Exception as e:
        frappe.msgprint(f"Error retrieving data: {str(e)}")
        return []

def get_appraisee_status(row):
    return row['Appraisee']

def get_appraiser_status(row):
    return row['Appraiser']

def get_skip_status(row):
    return row['SKIP']
