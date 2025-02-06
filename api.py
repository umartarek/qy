import frappe

@frappe.whitelist(allow_guest=True)
def get_element_data():
    query = """
        SELECT 
            vision,
            dimension,
            element,
            SUM(proof_count) AS total,
            SUM(completed_count) AS completed, 
            SUM(proof_count) - SUM(completed_count) AS `not_completed`, 
            TRUNCATE(SUM(completed_count) / NULLIF(SUM(proof_count), 0), 2) * 100 AS complete_percent
        FROM 
            `tabElements-2024`
        WHERE
            Vision = '1:الاستراتيجية والتخطيط'
        GROUP BY 
            vision, dimension, element
    """
    
    result = frappe.db.sql(query, as_dict=True)
    
    return result
