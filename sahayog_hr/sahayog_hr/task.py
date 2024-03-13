import frappe

def update_appraiser_emp_comment_for_all():
    # Fetch all Performance Appraisal documents
    all_appraisal_docs = frappe.get_all("Performance Appraisal", filters={}, fields=["name"])

    for doc_info in all_appraisal_docs:
        doc_name = doc_info["name"]
        doc = frappe.get_doc("Performance Appraisal", doc_name)
        
        emp_kra_table = doc.get("emp_kra_table")
        appraiser_kra_table = doc.get("appraiser_kra_table")

        if emp_kra_table and appraiser_kra_table:
            print(f"Updating Appraiser comments for document: {doc_name}")
            # Iterate over emp_kra_table
            for emp_row in emp_kra_table:
                emp_kra = emp_row.get('kras', '')
                emp_comment = emp_row.get('comm', '')

                # Check if emp_kra exists in appraiser_kra_table
                matching_kra_found = False
                for appraiser_row in appraiser_kra_table:
                    appraiser_kra = appraiser_row.get('kras', '')
                    appraiser_comment = appraiser_row.get('appraisee_comment', '')

                    # Check if kras match
                    if emp_kra == appraiser_kra:
                        matching_kra_found = True

                        # Update appraiser_comment with emp_comment if it's blank
                        if not appraiser_comment:
                            frappe.db.set_value('Appraiser KRA', appraiser_row.get('name'), 'appraisee_comment', emp_comment)
                            print(f"Appraiser comment updated successfully for KRA: {emp_kra}")
                        
                        break

                if not matching_kra_found:
                    print(f"No matching KRA found for KRA: {emp_kra}")

        else:
            print(f"No KRA values found for the employee in document: {doc_name}")
