// Copyright (c) 2019, Ridhosribumi and contributors
// For license information, please see license.txt
/* eslint-disable */

frappe.ui.form.on("Sales Invoice Item", "discount", function(frm, cdt, cdn) {
    var row = locals[cdt][cdn];
    if(row.discount) {
      var stringsearch = "+",str = row.discount;
      for(var i=0, count=0; i<str.length; count+=+(stringsearch===str[i++]));
      if(count >= 1){
        var banyak = count;
        var arr = row.discount.split('+');
        var disco = 100 - ((arr[0]/100) * 100);
        for(var nn=1; nn<=banyak; nn++){
          var disco = disco - ((arr[nn]/100) * disco);
        }
        var sisa = 100 - disco

      }
      else{
        var sisa = row.discount;
      }
			var rate = (row.rate1 - (row.rate1 * sisa/100))
			var amount = rate * row.qty
      frappe.model.set_value(cdt, cdn, "additional_discount", sisa);
			frappe.model.set_value(cdt, cdn, "rate", rate);
			frappe.model.set_value(cdt, cdn, "amount", amount);
    }
})

frappe.ui.form.on("Sales Invoice",{
	validate: function(frm){
		calculate_total_discount(frm);
	}
})
frappe.ui.form.on("Sales Invoice Item",{
	item_code: function(frm,cdt,cdn){
		var d = locals[cdt][cdn];
		if(d.item_code){
			frappe.call({
				method: "discountitem.reference.get_price_list",
				args:{
					item_code: d.item_code,
					price_list: frm.doc.selling_price_list,
				},
				callback: function (r){
					if(r.message){
						frappe.model.set_value(cdt, cdn, "rate1", r.message);
					}
				}
			});
		}
		refresh_field(["rate1"], d.name, 'items');
  },

	rate1: function(frm,cdt,cdn){
		var d = locals[cdt][cdn];
		d.rate = d.rate1
		d.discount = 0
		d.additional_discount = 0
		d.amount = d.rate * d.qty
		refresh_field(["rate","amount","discount","additional_discount"], d.name, 'items');
	},
	qty: function(frm,cdt,cdn){
		var d = locals[cdt][cdn];
		calculate_total_amount(frm, cdt, cdn);
		calculate_total_discount(frm, cdt, cdn);
	},
	price_list_rate: function(frm,cdt,cdn){
		var d = locals[cdt][cdn];
		d.rate1 = (d.price_list_rate - (d.price_list_rate * d.discount_percentage/100))
		d.discount = 0
		d.additional_discount = 0
		refresh_field(["rate1","discount","additional_discount"], d.name, 'items');
	},

	discount_percentage: function(frm,cdt,cdn){
		var d = locals[cdt][cdn];
		d.rate1 = (d.price_list_rate - (d.price_list_rate * d.discount_percentage/100))
		d.discount = 0
		d.additional_discount = 0
	},

	margin_rate_or_amount: function(frm,cdt,cdn){
		var d = locals[cdt][cdn];
		d.rate1 = (d.price_list_rate + d.margin_rate_or_amount)
		d.discount = 0
		d.additional_discount = 0
	},
	items_remove: function(frm, cdt, cdn) {
		calculate_total_discount(frm, cdt, cdn);
	},
});

var calculate_total_amount = function(frm) {
    var total_amount = frappe.utils.sum(
        (frm.doc.items || []).map(function(i) {
			return (i.amount);
		})
    );
    frm.set_value("total", total_amount);
}
var calculate_total_discount = function(frm) {
	var total_discount = frappe.utils.sum(
		(frm.doc.items || []).map(function(i) {
      var price = (flt(i.rate1) * flt(i.qty) * flt(i.conversion_factor)) - flt(i.amount);
			return (price);
		})
	);
	frm.set_value("total_discount_item", total_discount);
}
