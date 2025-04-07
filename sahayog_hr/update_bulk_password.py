import frappe
from frappe.utils.password import update_password

def bulk_reset_password():
    users = frappe.get_all("User", filters={"enabled": 1, "user_type": "System User"}, pluck="name")
    new_password = "YourNewPassword123"  # 🔹 Set your desired password

    for user in users:
        update_password(user, new_password)
        print(f"Password updated for {user}")

    frappe.db.commit()