from __future__ import unicode_literals
import frappe
from frappe.utils import nowdate, cstr, flt, now, getdate, add_months
from frappe import msgprint, _
from frappe.model.document import Document
from frappe.model.mapper import get_mapped_doc
from frappe.model.naming import make_autoname
from dateutil import parser
from num2words import num2words

@frappe.whitelist()
def get_price_list(price_list,item_code):
    rate1 = frappe.db.sql("""select price_list_rate from `tabItem Price` where item_code = %s and price_list = %s""",(item_code,price_list))
    rate1 = rate1 and rate1[0][0] or 0
    return rate1
