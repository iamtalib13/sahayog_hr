// Copyright (c) 2023, Talib Sheikh and contributors
// For license information, please see license.txt

frappe.ui.form.on("Performance Appraisal", {
  emp_promotion: function (frm) {
    var promotion = "false";
    if (frm.doc.emp_promotion == "Yes") {
      promotion = "true";
      console.log(promotion);
    } else if (frm.doc.emp_promotion == "No") {
      promotion = "true";
      console.log(promotion);
    } else {
      console.log(promotion);
    }
  },

  before_save: function (frm) {
    //*<Appraiser Save doc after giving Section A & Section B Rating>
    let session_emp_user = frappe.session.user;
    //*<Appraiser Save doc after giving Section A & Section B Rating>
    if (session_emp_user === frm.doc.appraiser_user_id) {
      if (frm.doc.appraiser_rating_calculated == "no") {
        let sec_a_message = "";
        let sec_b_message = "";
        let sec_a_empty = "true";
        let sec_b_empty = "true";

        for (let row of frm.doc.appraiser_kra_table) {
          if (row.appraisar_rating !== "") {
            sec_a_empty = "false";
          }

          if ((row.appraisar_rating == "") | null) {
            sec_a_message += "<br>- " + row.kras;
            sec_a_empty = "true";
          }
        }

        for (let row1 of frm.doc.employee_section_b_table) {
          if (row1.appraiser_rating !== "") {
            sec_b_empty = "false";
          }
          if ((row1.appraiser_rating == "") | null) {
            sec_b_message += "<br>- " + row1.employee_data;
            sec_b_empty = "true";
          }
        }
        var promotion = "false";
        if (frm.doc.emp_promotion == "Yes") {
          promotion = "true";
          console.log(promotion);
        } else if (frm.doc.emp_promotion == "No") {
          promotion = "true";
          console.log(promotion);
        } else {
          console.log(promotion);
        }
        if (sec_a_empty == "true") {
          frappe.msgprint("Please Give Rating in:" + sec_a_message);
        }
        if (sec_b_empty == "true") {
          frappe.throw("Please Give Rating in:" + sec_b_message);
        }
        if (promotion == "false") {
          frappe.throw("Please Give Recommendation for Promotion !!");
        } else if (sec_a_empty == "false" && sec_b_empty == "false") {
          frappe.confirm(
            "Just a friendly reminder: Once you rate, you won't be able to change it. Are you sure you want to proceed?",
            () => {
              // action to perform if Yes is selected
              frm.trigger("calculate_appraiser_rating");
              frm.trigger("btn_calculate_app_section_b");
              frm.trigger("btn_calculate_appraiser_overall_rating");
              frm.set_value("appraiser_rating_calculated", "yes");
              frappe.show_alert(
                "Your Rating has been Saved for  " + frm.doc.full_name
              );
            },
            () => {
              // action to perform if No is selected
              frm.set_df_property("appraiser_kra_table", "read_only", 0);
            }
          );
        }
      } else if (frm.doc.appraiser_rating_calculated == "yes") {
        frappe.show_alert(
          "Your Ratings are already saved for  " + frm.doc.full_name
        );
      }
    } //*</Appraiser Save doc after giving Section A & Section B Rating>

    //*<SKIP Save doc after giving Section A & Section B Rating>
    else if (session_emp_user === frm.doc.skip_user) {
      if (frm.doc.skip_confirmation_status == "" || null) {
        frappe.throw("Please Select Your Confirmation Status !!");
      } else if (
        frm.doc.skip_confirmation_status == "SKIP Rating Not-Required"
      ) {
        frappe.confirm(
          "Are you sure, Your ratings are not Required for <b>" +
            frm.doc.full_name +
            "</b>",
          () => {
            // action to perform if Yes is selected
            frm.set_value("skip_sec_calculated", "yes");
          },
          () => {
            // action to perform if No is selected
            frm.set_value("skip_sec_calculated", "no");
          }
        );
      } else if (frm.doc.skip_sec_calculated == "no") {
        let skip_sec_a_message = "";
        let skip_sec_b_message = "";
        let skip_sec_a_empty = "true";
        let skip_sec_b_empty = "true";

        let a_start = frm.doc.skip_kra_table[0].skip_rating;
        let a_end =
          frm.doc.skip_section_b[frm.doc.skip_kra_table.length - 1].skip_rating;
        let start = frm.doc.skip_section_b[0].skip_rating;
        let end =
          frm.doc.skip_section_b[frm.doc.skip_section_b.length - 1].skip_rating;

        for (let row of frm.doc.skip_kra_table) {
          if (row.skip_rating !== "") {
            skip_sec_a_empty = "false";
          }

          if (row.skip_rating == "" || null) {
            skip_sec_a_message += "<br>- " + row.emp_kra;
            skip_sec_a_empty = "true";
          }
        }
        if (a_start === "") {
          skip_sec_a_empty = "true";
          console.log("Sec A :" + skip_sec_a_empty);
        } else if (a_start == "" && a_end == "" && skip_sec_b_empty) {
          skip_sec_a_empty = "true";
          console.log("Sec A :" + skip_sec_a_empty);
        } else if (a_start !== "" && a_end !== "" && !skip_sec_b_empty) {
          skip_sec_a_empty = "false";
          console.log("Sec A :" + skip_sec_a_empty);
        }

        for (let row1 of frm.doc.skip_section_b) {
          if (row1.skip_rating !== "") {
            skip_sec_b_empty = "false";
          }
          if (row1.skip_rating === "" || row1.skip_rating === null) {
            skip_sec_b_message += "<br>- " + row1.employee_data;
            skip_sec_b_empty = "true";
          }
        }

        if (start === "") {
          skip_sec_b_empty = "true";
          console.log("Sec B: " + skip_sec_b_empty);
        } else if (start == "" && end == "" && skip_sec_b_empty) {
          skip_sec_b_empty = "true";
          console.log("Sec B: " + skip_sec_b_empty);
        } else if (start !== "" && end !== "" && !skip_sec_b_empty) {
          skip_sec_b_empty = "false";
          console.log("Sec B: " + skip_sec_b_empty);
        }

        console.log("Final Sec A :" + skip_sec_a_empty);
        console.log("Final Sec B: " + skip_sec_b_empty);

        if (skip_sec_a_empty == "true") {
          frappe.msgprint(
            "Section A: Please Give Rating in:" + skip_sec_a_message
          );
        }

        if (skip_sec_b_empty == "true") {
          frappe.throw(
            "Section B: Please Give Rating in:" + skip_sec_b_message
          );
        }
        if (!frm.doc.skip_report) {
          frappe.throw(
            "Please give reason why your ratings are required for this Employee !!"
          );
        }

        if (frm.doc.skip_sec_calculated == "no") {
          if (skip_sec_a_empty == "false" && skip_sec_b_empty == "false") {
            frappe.confirm(
              "Just a friendly reminder: Once you rate, you won't be able to change it. Are you sure you want to proceed?",
              () => {
                // action to perform if Yes is selected

                frm.trigger("btn_skip_section_a_rating");
                frm.trigger("btn_skip_sec_b_rating");
                frm.trigger("calculate_skip_rating");
                frm.set_value("skip_sec_calculated", "yes");
              },
              () => {
                // action to perform if No is selected
                frm.set_df_property("appraiser_kra_table", "read_only", 0);
              }
            );
          }
        }
      } else if (frm.doc.skip_sec_calculated == "yes") {
        frappe.msgprint({
          title: __("Notification"),
          indicator: "red",
          message: __("Your Ratings are already saved in our system."),
        });
      }
    } //*</SKIP Save doc after giving Section A & Section B Rating>

    //*<Employee Save doc after giving Section A & Section B Rating>
    else if (session_emp_user === frm.doc.user_id) {
      if (frm.doc.employee_rating_fetched == "Not-Fetched") {
        let total_weight = 0;
        for (let row of frm.doc.emp_kra_table) {
          total_weight = total_weight + row.weights;
          console.log(total_weight);
        }
        if (total_weight !== 50) {
          frappe.throw("Sum of Weights must be 50");
        } else if (total_weight == 50) {
          frm.trigger("calculate_section_a");
          frm.trigger("calculate_section_b");
          frm.trigger("cal_emp_tot_weight_ranking");
        }
      }
    }
  },

  //*-----------------------------------------------------------------------------------------------*//

  calculate_appraiser_rating: function (frm) {
    let session_emp_user = frappe.session.user;
    // frappe.msgprint("logged in id : " + session_emp_user);
    if (session_emp_user === frm.doc.user_id) {
      frappe.throw("You dont have Enough Permission");
    } else if (session_emp_user === frm.doc.appraiser_user_id) {
      //frappe.msgprint("Appraiser Matched");
      for (let row of frm.doc.appraiser_kra_table) {
        if ((row.appraisar_rating == "") | null) {
          frappe.msgprint("Please Give Rating in - " + row.kras);
        } else {
          const outstanding = 1;
          const exceeds_expectations = 2;
          const meets_expectations = 3;
          const needs_improvement = 4;
          const poor = 5;
          let app_sum_of_rating = 0;
          let app_total_weight = 50;

          let app_overall_rating = 0.0;
          for (let row1 of frm.doc.appraiser_kra_table) {
            if (row1.appraisar_rating == "Outstanding") {
              app_sum_of_rating = app_sum_of_rating + outstanding;
            }
            if (row1.appraisar_rating == "Exceeds Expectations") {
              app_sum_of_rating = app_sum_of_rating + exceeds_expectations;
            }
            if (row1.appraisar_rating == "Meets Expectations") {
              app_sum_of_rating = app_sum_of_rating + meets_expectations;
            }
            if (row1.appraisar_rating == "Needs Improvement") {
              app_sum_of_rating = app_sum_of_rating + needs_improvement;
            }
            if (row1.appraisar_rating == "Poor") {
              app_sum_of_rating = app_sum_of_rating + poor;
            }
          }
          app_overall_rating = app_total_weight * app_sum_of_rating;
          // frappe.msgprint("Appraiser Rating : " + app_overall_rating.toFixed(1));
          frm.set_value("appraiser_overall_rating", app_overall_rating);

          //* fetching appraiser rating to skip rating table

          let session_emp_user = frappe.session.user;
          if (session_emp_user === frm.doc.appraiser_user_id) {
            frm.clear_table("skip_kra_table");
            for (let row of frm.doc.appraiser_kra_table) {
              let row1 = frm.add_child("skip_kra_table", {
                emp_kra: row.kras,
                emp_rating: row.rating,
                reproting_rating: row.appraisar_rating,
              });
              frm.refresh_field("skip_kra_table");
            }
          }
        }
      }
    } else if (session_emp_user === frm.doc.skip_user) {
      frappe.throw("You dont have Enough Permission");
    }
  },
  //*-----------------------------------------------------------------------------------------------*//

  onload: function (frm) {
    //*<Showing Welcome message and Calculating Overll rating of appraiser Section A & B Ratings
    let session_emp_user = frappe.session.user;
    if (session_emp_user === frm.doc.appraiser_user_id) {
      const fullName = frm.doc.ap_name;
      const firstName = fullName.split(" ")[0];
      const formattedFirstName =
        firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();

      //*<calculating appraiser section A,B and set value in Overall appraiser rating>
      if (frm.doc.appraiser_rating_calculated == "no") {
        // Get the values of field1 and field2
        const field1Value = parseFloat(frm.doc.appraiser_overall_rating);
        const field2Value = parseFloat(frm.doc.app_sec_b_app_rating);

        // Calculate the average
        const average = (field1Value + field2Value) / 2;

        // Set the value of field3 to the calculated average
        frm.set_value("end_app_rating", average);
      }
      //*</calculating appraiser section A,B and set value in Overall appraiser rating>
    } //*<Showing Welcome message and Calculating Overll rating of appraiser Section A & B Ratings
  },

  //*-----------------------------------------------------------------------------------------------*//
  employeeRules: function (frm) {
    console.log("Employee Rules");
  },

  employeeDetailsCss: function (frm) {
    var doc = frm.doc;

    // Create a custom HTML string
    var html = "";
    if (doc.employee_id) {
      html +=
        "<div><strong>Employee ID:</strong> " + doc.employee_id + "</div>";
    }
    if (doc.full_name) {
      html +=
        "<div><strong>Employee Name:</strong> " + doc.full_name + "</div>";
    }
    if (doc.designation) {
      html +=
        "<div><strong>Designation:</strong> " + doc.designation + "</div>";
    }
    if (doc.department) {
      html += "<div><strong>Department:</strong> " + doc.department + "</div>";
    }
    if (doc.branch) {
      html += "<div><strong>Branch:</strong> " + doc.branch + "</div>";
    }
    if (doc.date_of_joining) {
      var dateOfJoining = new Date(doc.date_of_joining);

      var currentDate = new Date();
      var yearsExperience =
        currentDate.getFullYear() - dateOfJoining.getFullYear();
      var monthsExperience = currentDate.getMonth() - dateOfJoining.getMonth();

      // Adjust for negative months
      if (monthsExperience < 0) {
        yearsExperience--;
        monthsExperience += 12;
      }

      var formattedDate =
        dateOfJoining.getDate() +
        "-" +
        (dateOfJoining.getMonth() + 1) +
        "-" +
        dateOfJoining.getFullYear();

      var experienceText = yearsExperience + " yr";
      if (monthsExperience > 0) {
        experienceText += " " + monthsExperience + " mos";
      }

      html +=
        "<div><strong>Date of Joining:</strong> " +
        formattedDate +
        "</div>" +
        "<div><strong>Experience:</strong> " +
        experienceText +
        "</div>";
    }

    // Set the HTML in set_intro
    frm.set_intro(html, "green");
  },
  AppraiserDetailsCss: function (frm) {
    frm.set_intro("Please Give Your Ratings to the Employee ", "green");
  },
  refresh: function (frm) {
    frm.trigger("section_colors");

    let session_emp_user = frappe.session.user;

    // if (frm.doc.employee_status == "Satisfied") {
    //   frm.set_value("final_ranking", frm.doc.end_app_rating);
    // } else if (frm.doc.skip_confirmation_status == "SKIP Rating Not-Required") {
    //   frm.set_value("final_ranking", frm.doc.end_app_rating);
    // } else if (frm.doc.skip_confirmation_status == "SKIP Rating Required") {
    //   frm.set_value("final_ranking", frm.doc.skip_overall_rating);
    // }

    console.log("logged in id : " + session_emp_user);
    //console.log("user id : " + frm.doc.user_id);
    //console.log("Employee ID : " + frm.doc.employee_id);
    if (session_emp_user === frm.doc.user_id) {
      console.log("Employee Matched");
      //Employee - when form is new
      if (frm.is_new()) {
        let user = frappe.session.user;
        let eid = user.match(/\d+/)[0];
        frm.set_value("employee_id", eid);
        let empid = frm.doc.employee_id;

        frappe.db.get_value("Employee", empid, "user_id").then((r) => {
          let empUserID = r.message.user_id;
          console.log("Variable Value : ", empUserID);
          if (empUserID == user) {
            console.log("Employee Matched from Server when form-new");
            frm.trigger("employeeRules");

            frm.set_df_property("employee_id", "hidden", 1);
          }
        });
        frappe.db
          .get_value("Employee", empid, "reporting_employee_user_id")
          .then((r) => {
            let reportingEmpUserID = r.message.reporting_employee_user_id;
            //console.log("Reporting Employee ID : ", reportingEmpUserID);
            frm.set_value("appraiser_user_id", reportingEmpUserID);
            //console.log("Reporting Employee ID : ", frm.doc.appraiser_user_id);
          });

        frappe.call({
          method:
            "sahayog_hr.sahayog_hr.doctype.performance_appraisal.employee_api.get_emp_details",
          args: {
            emp_id: empid,
          },
          callback: function (r) {
            // Check if the message array contains at least one object
            if (r.message.length > 0) {
              // Get the employee department field from the first object in the array
              //var department = r.message[0].department;

              let ap_user = r.message[0].reporting_employee_user_id;

              console.log(
                "Appraiser :",
                r.message[0].reporting_employee_user_id
              );
              frm.set_value("appraiser_user_id", ap_user);
              console.log(frm.doc.appraiser_user_id);
            }
          },
        });
      }

      //Employee - when form is not new
      if (!frm.is_new()) {
        let user = frappe.session.user;
        let empid = frm.doc.user_id;

        if (empid == user) {
          console.log("Employee Matched from Server when form not-new ");
          frm.trigger("employeeRules");

          frm.set_df_property("employee_id", "hidden", 1);
        }
      }

      frm.trigger("hideFromEmployee");
      //*<Appraiser name>
      // Get the full name from frm.doc.ap_name
      var fullName = frm.doc.ap_name;

      // Split the full name into an array
      var nameArray = fullName.split(" ");

      // Get the first and last name from the array
      var firstName = nameArray[0];
      var lastName = nameArray[nameArray.length - 1];

      // Capitalize the first letter of the first and last name
      firstName =
        firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
      lastName =
        lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();
      //*</Appraiser name>

      //*<Read only section b child table for employee>
      frm.set_df_property("skip_section_b", "read_only", 1);
      frm.fields_dict["skip_section_b"].grid.wrapper
        .find(".grid-remove-all-rows")
        .hide();
      frm.fields_dict["skip_section_b"].grid.wrapper
        .find(".grid-remove-rows")
        .hide();
      frm.fields_dict["skip_section_b"].grid.wrapper
        .find(".grid-add-row")
        .hide();
      //*</Read only section b child table for employee>

      frm.set_df_property("emp_kra_table", "read_only", 0);
      frm.set_df_property("appraiser_kra_table", "read_only", 1);
      frm.set_df_property("employee_section_b_table", "read_only", 1);
      frm.set_df_property("skip_kra_table", "read_only", 1);

      frm.toggle_enable("skip_confirmation_status", 0);
      frm.toggle_enable("app_sec_c_recommendation", 0);
      frm.toggle_enable("sec_c_app_final_feedback", 0);

      frm.toggle_display("calculate_skip_rating", 0);

      //*<disable or read only Appraiser Section B>
      frm.toggle_enable("sec_b_tech_emp_rating", 0);
      frm.toggle_enable("sec_b_tech_app_rating", 0);

      //*</disable or read only Appraiser Section B>

      //*<disable save , if rating send to appraiser>
      if (frm.doc.employee_rating_fetched == "Fetched") {
        frm.disable_save();
      } else if (frm.doc.employee_rating_fetched == "Not-Fetched") {
        frm.enable_save();
      }
      //*</disable save , if rating send to appraiser>

      //*<display Employee rating and appraiser rating>
      var employee_ranking = frm.doc.emp_tot_weight_ranking;
      var appraiser_rating = frm.doc.end_app_rating;
      var skip_ranking = frm.doc.skip_overall_rating;

      if (frm.doc.status == "Draft") {
        frm.set_intro(
          "Please Submit to your Appraiser- " +
            "<b><span style='color: black; '>" +
            frm.doc.appraisers_name +
            "",
          "green"
        );
      }
      if (typeof appraiser_rating !== "undefined") {
        // frm.set_intro("Appraiser Ranking: " + appraiser_rating, "green");
      }
      if (typeof skip_ranking !== "undefined") {
        // frm.set_intro("Skip Ranking: " + skip_ranking, "green");
      }
      //*</display Employee rating and appraiser rating>

      if (!frm.doc.__islocal && frm.doc.appraiser_overall_rating == null) {
        if (frm.doc.status == "Draft") {
          frm
            .add_custom_button(__("Send to Appraiser"), function () {
              if (frm.doc.employee_rating_fetched == "Fetched") {
                frappe.msgprint(
                  "Your Rating has been Already Sent to <b>" +
                    firstName +
                    "</b> <b>" +
                    lastName +
                    "</b> "
                );
              } else if (frm.doc.employee_rating_fetched == "Not-Fetched") {
                frappe.confirm(
                  "Are you sure you want to submit your form to <b>" +
                    firstName +
                    "</b> <b>" +
                    lastName +
                    "</b> ?",
                  () => {
                    // action to perform if Yes is selected
                    frappe.show_alert("successfully sent to your Appraiser");
                    frm.trigger("send_to_appraiser");

                    frm.save();
                  },
                  () => {
                    frappe.show_alert(
                      "Now You Can change Your Section A & Section B"
                    );
                  }
                );
              }
            })
            .css({
              "background-color": "#28a745",
              color: "#ffffff",
            });
        }

        //*</Activate (Sent to Appraiser) button when employee want to sent their rating to appraiser>
      } else if (!frm.doc.__islocal && frm.doc.display == "no") {
        //* <Activate skip level button when appraiser give their rating to employee>

        frm.add_custom_button(
          __("Satisfied"),
          function () {
            // Get the first and last name from frm.doc.ap_name and capitalize the first letter
            var fullName = frm.doc.ap_name;
            var nameArray = fullName.split(" ");
            var firstName =
              nameArray[0].charAt(0).toUpperCase() +
              nameArray[0].slice(1).toLowerCase();
            var lastName =
              nameArray[nameArray.length - 1].charAt(0).toUpperCase() +
              nameArray[nameArray.length - 1].slice(1).toLowerCase();

            frappe.confirm(
              "Are you satisfied with the rating given by <b>" +
                firstName +
                "</b> <b>" +
                lastName +
                "</b> ?",
              () => {
                // action to perform if Yes is selectedx
                cur_frm.set_value("display", "yes");
                cur_frm.set_value("employee_status", "Satisfied");
                frappe.msgprint("Appraiser Rating has been accepted ");
                frm.set_value("final_ranking", frm.doc.end_app_rating);
                cur_frm.save();
              },
              () => {
                // action to perform if No is selected
              }
            );
          },
          __("Appraiser Rating")
        );

        frm.add_custom_button(
          __("Not-Satisfied"),
          function () {
            frm.trigger("activate_skip");
          },
          __("Appraiser Rating")
        );
      } //* </Activate skip level button when appraiser give their rating to employee>
    } else if (session_emp_user === frm.doc.appraiser_user_id) {
      let ap = frm.doc.appraiser_user_id;

      console.log("Appraiser Matched : ", ap);
      if (frm.doc.employee_rating_fetched == "Not-Fetched") {
        frm.set_intro("Employee not submitted their Data, ", "red");
        frm.set_intro("You have to wait for their submission of form. ", "red");
      }

      if (
        !frm.doc.end_app_rating &&
        frm.doc.employee_rating_fetched == "Fetched"
      ) {
        frm.trigger("employeeDetailsCss");
        frm.trigger("AppraiserDetailsCss");
      }

      if (frm.doc.employee_rating_fetched == "Fetched") {
        frm.fields_dict["employee_section_b_table"].grid.toggle_reqd(
          "appraiser_rating",
          true
        );
      }
      // frm.set_df_property("emp_promotion", "reqd", 1);

      //*<Read only section b child table for employee>
      frm.set_df_property("skip_section_b", "read_only", 1);
      frm.fields_dict["skip_section_b"].grid.wrapper
        .find(".grid-remove-all-rows")
        .hide();
      frm.fields_dict["skip_section_b"].grid.wrapper
        .find(".grid-remove-rows")
        .hide();
      frm.fields_dict["skip_section_b"].grid.wrapper
        .find(".grid-add-row")
        .hide();
      //*</Read only section b child table for employee>

      frm.set_df_property("emp_kra_table", "read_only", 1);
      //frappe.msgprint("Appraiser Matched");
      frm.toggle_enable("skip_confirmation_status", 0);
      frm.toggle_display("emp_reason", 0);
      frm.toggle_display("calculate_skip_rating", 0);
      if (frm.doc.appraiser_rating_calculated == "no") {
        frm.set_df_property("employee_section_b_table", "read_only", 0);
      } else if (frm.doc.appraiser_rating_calculated == "yes") {
        frm.set_df_property("employee_section_b_table", "read_only", 1);
      }

      for (let row of frm.doc.appraiser_kra_table) {
        if ((row.appraisar_rating == "") | null) {
          //*frappe.msgprint("Empty Appraiser Rating");
        } else if ((row.appraisar_rating !== "") | null) {
          frm.set_df_property("appraiser_kra_table", "read_only", 1);
        }
      }

      frm.set_df_property("emp_kra_table", "read_only", 1);
      // frm.set_df_property("appraiser_kra_table", "read_only", 0);
      frm.set_df_property("skip_kra_table", "read_only", 1);
      frm.fields_dict["appraiser_kra_table"].grid.wrapper
        .find(".grid-remove-all-rows")
        .hide();
      frm.fields_dict["appraiser_kra_table"].grid.wrapper
        .find(".grid-remove-rows")
        .hide();
      frm.fields_dict["appraiser_kra_table"].grid.wrapper
        .find(".grid-add-row")
        .hide();
      //*<hide add rows and delete rows from Appraiser Section B Table>
      frm.fields_dict["employee_section_b_table"].grid.wrapper
        .find(".grid-remove-all-rows")
        .hide();
      frm.fields_dict["employee_section_b_table"].grid.wrapper
        .find(".grid-remove-rows")
        .hide();
      frm.fields_dict["employee_section_b_table"].grid.wrapper
        .find(".grid-add-row")
        .hide();
      //*</hide add rows and delete rows from Appraiser Section B Table>

      //*<Show Employee status to appraiser>
      if (frm.doc.employee_status == "Satisfied") {
        frm.set_intro("Employee is Satisfied with Your Ratings", "green");
      } else if (frm.doc.employee_status == "Not-Satisfied") {
        frm.set_intro(
          "Employee is Not-Satisfied with Your Ratings and applied for SKIP Level",
          "red"
        );
      }
      //*</Show Employee status to appraiser>
    } else if (session_emp_user === frm.doc.skip_user) {
      //frappe.msgprint("SKIP Matched");

      if (frm.doc.skip_sec_calculated == "yes") {
        frm.set_df_property("skip_confirmation_status", "read_only", 1);
      }

      frm.toggle_enable("app_sec_c_recommendation", 0);
      frm.toggle_enable("sec_c_app_final_feedback", 0);
      frm.toggle_display("skip_confirmation_status", 1);
      frm.set_value("skip_app_sec_a_rating", frm.doc.appraiser_overall_rating);
      frm.set_value("skip_emp_overall_rating", frm.doc.emp_tot_weight_ranking);
      frm.set_value("skip_appraiser_overall_rating", frm.doc.end_app_rating);
      frm.set_df_property("employee_section_b_table", "read_only", 1);
      frm.set_df_property("emp_kra_table", "read_only", 1);
      frm.set_df_property("appraiser_kra_table", "read_only", 1);
      frm.set_df_property("skip_kra_table", "read_only", 0);
      frm.fields_dict["skip_kra_table"].grid.wrapper
        .find(".grid-add-row")
        .hide();
      frm.fields_dict["skip_kra_table"].grid.wrapper
        .find(".grid-remove-all-rows")
        .hide();
      frm.fields_dict["skip_kra_table"].grid.wrapper
        .find(".grid-remove-rows")
        .hide();
    } else {
      frm.trigger("employeeDetailsCss");
    }

    //*<Read only section b child table for employee>

    frm.fields_dict["skip_section_b"].grid.wrapper
      .find(".grid-remove-all-rows")
      .hide();
    frm.fields_dict["skip_section_b"].grid.wrapper
      .find(".grid-remove-rows")
      .hide();
    frm.fields_dict["skip_section_b"].grid.wrapper.find(".grid-add-row").hide();
    //*</Read only section b child table for employee>

    //* <skip tab hide /unhide depends on employee rating status>
    if (frm.doc.employee_status == "Satisfied") {
      frm.toggle_display("skip_kra_sec", false);
      frm.toggle_display("calculate_skip_rating", false);
      frm.toggle_display("emp_skip_msg", true);
    } else if (frm.doc.employee_status == "Not-Satisfied") {
      frm.toggle_display("skip_kra_sec", true);
      frm.toggle_display("calculate_skip_rating", true);
      frm.toggle_display("emp_skip_msg", false);
    }

    //* </skip tab hide /unhide depends on employee rating status>
  },
  //*-----------------------------------------------------------------------------------------------*//
  section_colors(frm) {
    frm.fields_dict["section_break_period"].wrapper.css(
      "background-color",
      "antiquewhite"
    );

    // Lightened blue for "ac_information_section"
    frm.fields_dict["section_break_xgllc"].wrapper.css(
      "background-color",
      "#DCF2F1" // Hex color code for the lightened blue
    );

    // Lightened blue for "employee_section_a"
    frm.fields_dict["employee_section_a"].wrapper.css(
      "background-color",
      "#DCF2F1" // Hex color code for the lightened blue
    );

    // Lightened blue for "employee_section_a_btn"
    frm.fields_dict["employee_section_a_btn"].wrapper.css(
      "background-color",
      "#DCF2F1" // Hex color code for the lightened blue
    );

    frm.fields_dict["section_break_22"].wrapper.css(
      "background-color",
      "antiquewhite"
    );
    frm.fields_dict["decision_title"].wrapper.css(
      "background-color",
      "antiquewhite"
    );
    frm.fields_dict["team_section"].wrapper.css(
      "background-color",
      "antiquewhite"
    );
    frm.fields_dict["technical_sectio"].wrapper.css(
      "background-color",
      "antiquewhite"
    );
  },
  hideFromEmployee: function (frm) {
    console.log("Hid");
    frm.set_df_property("employee_rating_tab", "hidden", 1);
  },

  //*-----------------------------------------------------------------------------------------------*//
  //* <Calculate Employee Section A using button>
  calculate_section_a: function (frm) {
    var kra_pattern = /^[a-zA-Z0-9]*$/;

    let session_emp_user = frappe.session.user;
    if (session_emp_user === frm.doc.user_id) {
      if (frm.doc.employee_rating_fetched == "Not-Fetched") {
        for (let row of frm.doc.emp_kra_table) {
          if (row.kras === "" || row.weights === "" || row.rating === "") {
            frappe.msgprint("Please fill KRA Properly !!");
            return;
          } else {
            //*<Calculation logic of Employee Section A>
            const outstanding = 1;
            const exceeds_expectations = 2;
            const meets_expectations = 3;
            const needs_improvement = 4;
            const poor = 5;
            let sum_of_rating = 0;
            let total_weight = 0;
            let total_rating = 0;
            let overall_rating = 0.0;

            for (let row of frm.doc.emp_kra_table) {
              total_weight = total_weight + row.weights;

              if (row.rating == "Outstanding") {
                sum_of_rating = sum_of_rating + outstanding;
              }
              if (row.rating == "Exceeds Expectations") {
                sum_of_rating = sum_of_rating + exceeds_expectations;
              }
              if (row.rating == "Meets Expectations") {
                sum_of_rating = sum_of_rating + meets_expectations;
              }
              if (row.rating == "Needs Improvement") {
                sum_of_rating = sum_of_rating + needs_improvement;
              }
              if (row.rating == "Poor") {
                sum_of_rating = sum_of_rating + poor;
              }
            }

            if (total_weight !== 50) {
              console.log("checking weightage");
              frappe.msgprint(__("Weightage should be 50"));
              return false;
            } else if (total_weight == 50) {
              frm.set_value("total_weightage", total_weight);
              frm.set_value("sum_of_rating", sum_of_rating);

              overall_rating = sum_of_rating / frm.doc.emp_kra_table.length;
              frm.set_value("overall_rating", overall_rating);
              frm.set_value("employee_overall_rating", overall_rating);
              frm.set_value("skip_emp_sec_a_rating", overall_rating);
              console.log("Executing calculate_section_a");
            }
          } //*<Calculation logic of Employee Section A>
        }
      }
    } else if (session_emp_user === frm.doc.appraiser_user_id) {
      frappe.throw("You don't have Enough Permission");
    } else if (session_emp_user === frm.doc.skip_user) {
      frappe.throw("You don't have Enough Permission");
    }

    //*<fetching employee section b rating into appraiser section b rating>
    // frm.set_value("sec_b_tech", frm.doc.technical_emp_rating);
    // frm.set_value("sec_b_tech_comment", frm.doc.technical_emp_comments);
    //*</fetching employee section b rating into appraiser section b rating>
  },
  //*</Calculate Section A using button>

  //*-----------------------------------------------------------------------------------------------*//
  //* <Calculate Section B using button>
  calculate_section_b: function (frm) {
    let session_emp_user = frappe.session.user;
    if (session_emp_user === frm.doc.user_id) {
      frm.clear_table("employee_section_b_table");
      if (
        frm.doc.appraisal_category == 1 ||
        frm.doc.appraisal_category == 2 ||
        frm.doc.appraisal_category == 3
      ) {
        if ((frm.doc.technical_emp_rating == "") | null) {
          frappe.msgprint("Please Rate - Technical & Functional knowledge");
        } else if ((frm.doc.technical_emp_rating !== "") | null) {
          let row1 = frm.add_child("employee_section_b_table", {
            employee_data: "Technical & Functional knowledge",
            employee_rating: frm.doc.technical_emp_rating,
          });
        }
      }
      if (frm.doc.appraisal_category == 1) {
        if ((frm.doc.thought_emp_rating == "") | null) {
          frappe.msgprint(
            "Please Rate - Thought leadership-holistic and strategic perspective"
          );
        } else if ((frm.doc.thought_emp_rating !== "") | null) {
          let row2 = frm.add_child("employee_section_b_table", {
            employee_data:
              "Thought leadership-holistic and strategic perspective",
            employee_rating: frm.doc.thought_emp_rating,
          });
        }
      }

      if (frm.doc.appraisal_category == 1) {
        if ((frm.doc.people_emp_rating == "") | null) {
          frappe.msgprint("Please Rate - People Development");
        } else if ((frm.doc.people_emp_rating !== "") | null) {
          let row3 = frm.add_child("employee_section_b_table", {
            employee_data: "People Development",
            employee_rating: frm.doc.people_emp_rating,
          });
        }
      }
      if (frm.doc.appraisal_category == 1) {
        if ((frm.doc.managing_emp_rating == "") | null) {
          frappe.msgprint(
            "Please Rate - Managing relationships – collaboration"
          );
        } else if ((frm.doc.managing_emp_rating !== "") | null) {
          let row4 = frm.add_child("employee_section_b_table", {
            employee_data: "Managing relationships – collaboration",
            employee_rating: frm.doc.managing_emp_rating,
          });
        }
      }
      if (frm.doc.appraisal_category == 1 || frm.doc.appraisal_category == 3) {
        if ((frm.doc.decision_emp_rating == "") | null) {
          frappe.msgprint("Please Rate - Decision making & problem solving");
        } else if ((frm.doc.decision_emp_rating !== "") | null) {
          let row5 = frm.add_child("employee_section_b_table", {
            employee_data: "Decision making & problem solving",
            employee_rating: frm.doc.decision_emp_rating,
          });
        }
      }
      if (frm.doc.appraisal_category == 1) {
        if ((frm.doc.planning_emp_rating == "") | null) {
          frappe.msgprint("Please Rate - Planning");
        } else if ((frm.doc.planning_emp_rating !== "") | null) {
          let row6 = frm.add_child("employee_section_b_table", {
            employee_data: "Planning",
            employee_rating: frm.doc.planning_emp_rating,
          });
        }
      }
      if (frm.doc.appraisal_category == 1) {
        if ((frm.doc.leadership_emp_rating == "") | null) {
          frappe.msgprint("Please Rate - Leadership Presence");
        } else if ((frm.doc.leadership_emp_rating !== "") | null) {
          let row7 = frm.add_child("employee_section_b_table", {
            employee_data: "Leadership Presence",
            employee_rating: frm.doc.leadership_emp_rating,
          });
        }
      }
      if (frm.doc.appraisal_category == 1) {
        if ((frm.doc.humility_emp_rating == "") | null) {
          frappe.msgprint("Please Rate - Humility to learn");
        } else if ((frm.doc.humility_emp_rating !== "") | null) {
          let row8 = frm.add_child("employee_section_b_table", {
            employee_data: "Humility to learn",
            employee_rating: frm.doc.humility_emp_rating,
          });
        }
      }
      if (frm.doc.appraisal_category == 2) {
        if ((frm.doc.strategic_emp_rating == "") | null) {
          frappe.msgprint("Please Rate - Strategic Thinking");
        } else if ((frm.doc.strategic_emp_rating !== "") | null) {
          let row9 = frm.add_child("employee_section_b_table", {
            employee_data: "Strategic Thinking",
            employee_rating: frm.doc.strategic_emp_rating,
          });
        }
      }
      if (frm.doc.appraisal_category == 2) {
        if ((frm.doc.result_orientation_emp_rating == "") | null) {
          frappe.msgprint("Please Rate - Result Orientation");
        }
        if ((frm.doc.result_orientation_emp_rating !== "") | null) {
          let row10 = frm.add_child("employee_section_b_table", {
            employee_data: "Result Orientation",
            employee_rating: frm.doc.result_orientation_emp_rating,
          });
        }
      }
      if (frm.doc.appraisal_category == 2) {
        if ((frm.doc.personal_and_interpersonal_emp_rating == "") | null) {
          frappe.msgprint(
            "Please Rate - Personal & Interpersonal Effectiveness"
          );
        } else if (
          (frm.doc.personal_and_interpersonal_emp_rating !== "") |
          null
        ) {
          let row11 = frm.add_child("employee_section_b_table", {
            employee_data: "Personal & Interpersonal Effectiveness",
            employee_rating: frm.doc.personal_and_interpersonal_emp_rating,
          });
        }
      }
      if (frm.doc.appraisal_category == 2) {
        if ((frm.doc.people_mngmnt_emp_rating == "") | null) {
          frappe.msgprint("Please Rate - People Management");
        } else if ((frm.doc.people_mngmnt_emp_rating !== "") | null) {
          let row12 = frm.add_child("employee_section_b_table", {
            employee_data: "People Management",
            employee_rating: frm.doc.people_mngmnt_emp_rating,
          });
        }
      }
      if (frm.doc.appraisal_category == 3) {
        if ((frm.doc.team_work_emp_rating == "") | null) {
          frappe.msgprint("Please Rate - Team Work");
        } else if ((frm.doc.team_work_emp_rating !== "") | null) {
          let row13 = frm.add_child("employee_section_b_table", {
            employee_data: "Team Work",
            employee_rating: frm.doc.team_work_emp_rating,
          });
        }
      }
      if (frm.doc.appraisal_category == 3) {
        if ((frm.doc.initiative_emp_rating == "") | null) {
          frappe.msgprint("Please Rate - Initiative");
        } else if ((frm.doc.initiative_emp_rating !== "") | null) {
          let row14 = frm.add_child("employee_section_b_table", {
            employee_data: "Initiative",
            employee_rating: frm.doc.initiative_emp_rating,
          });
        }
      }
      if (frm.doc.appraisal_category == 3) {
        if ((frm.doc.communication_emp_rating == "") | null) {
          frappe.msgprint("Please Rate - Communication");
        } else if ((frm.doc.communication_emp_rating !== "") | null) {
          let row15 = frm.add_child("employee_section_b_table", {
            employee_data: "Communication",
            employee_rating: frm.doc.communication_emp_rating,
          });
        }
      }

      frm.refresh_field("employee_section_b_table");

      const outstanding = 1;
      const exceeds_expectations = 2;
      const meets_expectations = 3;
      const needs_improvement = 4;
      const poor = 5;
      let section_b_sum_of_rating = 0;
      let no_of_attributes = 0;
      let section_b_overall_rating = 0.0;

      for (let row1 of frm.doc.employee_section_b_table) {
        no_of_attributes = no_of_attributes + 1;
        if (row1.employee_rating == "Outstanding") {
          section_b_sum_of_rating = section_b_sum_of_rating + outstanding;
        }
        if (row1.employee_rating == "Exceeds Expectations") {
          section_b_sum_of_rating =
            section_b_sum_of_rating + exceeds_expectations;
        }
        if (row1.employee_rating == "Meets Expectations") {
          section_b_sum_of_rating =
            section_b_sum_of_rating + meets_expectations;
        }
        if (row1.employee_rating == "Needs Improvement") {
          section_b_sum_of_rating = section_b_sum_of_rating + needs_improvement;
        }
        if (row1.employee_rating == "Poor") {
          section_b_sum_of_rating = section_b_sum_of_rating + poor;
        }
      }

      // frappe.msgprint("Appraiser Rating : " + skip_overall_rating.toFixed(1));
      // if (isNaN(section_b_overall_rating)) {
      //   frappe.throw("Please Rate Section B");
      // } else {
      frm.set_value("no_of_attributes", no_of_attributes);
      frm.set_value("sec_b_sum_rating", section_b_sum_of_rating);
      section_b_overall_rating = section_b_sum_of_rating / no_of_attributes;
      frm.set_value("overall_section_b_rating", section_b_overall_rating);
      frm.set_value("app_sec_b_emp_rating", section_b_overall_rating);
      frm.set_value("skip_emp_sec_b_ranking", section_b_overall_rating);
    } else if (session_emp_user === frm.doc.appraiser_user_id) {
      frappe.throw("You don't have Enough Permission");
    } else if (session_emp_user === frm.doc.skip_user) {
      frappe.throw("You don't have Enough Permission");
    }
  }, //* </Calculate Section B using button>

  //*-----------------------------------------------------------------------------------------------*//
  cal_emp_tot_weight_ranking: function (frm) {
    let session_emp_user = frappe.session.user;

    //frappe.msgprint("logged in id : " + session_emp_user);
    if (session_emp_user === frm.doc.user_id) {
      if (frm.doc.employee_rating_fetched == "Not-Fetched") {
        console.log("Calculating total ranking");
        let sectionA = parseInt(frm.doc.overall_rating);
        let sectionB = parseInt(frm.doc.overall_section_b_rating);

        console.log("Sec A - ", sectionA);
        console.log("Sec B - ", sectionB);

        let emp_tot_weights_ranking = (sectionA + sectionB) / 2;

        console.log("Total - ", emp_tot_weights_ranking);

        frm.set_value("emp_tot_weight_ranking", emp_tot_weights_ranking);
        console.log(emp_tot_weights_ranking);

        frm.set_value("emp_given_ranking", emp_tot_weights_ranking);
      } else {
        frappe.throw("You don't have enough Permission");
      }
    }
  },

  //*-----------------------------------------------------------------------------------------------*//
  //* <Send Employee Section A and B Rating to Appraiser Tab>
  send_to_appraiser: function (frm) {
    let session_emp_user = frappe.session.user;
    if (session_emp_user === frm.doc.appraiser_user_id) {
      frm.trigger("calculate_appraiser_rating");
    } else if (session_emp_user === frm.doc.skip_user) {
      frm.trigger("calculate_skip_rating");
    } else if (session_emp_user === frm.doc.user_id) {
      let session_emp_user = frappe.session.user;
      if (session_emp_user === frm.doc.user_id) {
        //*<Calculation logic of Employee Section A>
        const outstanding = 1;
        const exceeds_expectations = 2;
        const meets_expectations = 3;
        const needs_improvement = 4;
        const poor = 5;
        let sum_of_rating = 0;
        let total_weight = 0;
        let total_rating = 0;
        let overall_rating = 0.0;

        for (let row of frm.doc.emp_kra_table) {
          total_weight = total_weight + row.weights;

          if (row.rating == "Outstanding") {
            sum_of_rating = sum_of_rating + outstanding;
          }
          if (row.rating == "Exceeds Expectations") {
            sum_of_rating = sum_of_rating + exceeds_expectations;
          }
          if (row.rating == "Meets Expectations") {
            sum_of_rating = sum_of_rating + meets_expectations;
          }
          if (row.rating == "Needs Improvement") {
            sum_of_rating = sum_of_rating + needs_improvement;
          }
          if (row.rating == "Poor") {
            sum_of_rating = sum_of_rating + poor;
          }
        }

        if (total_weight !== 50) {
          frappe.throw(__("Weightage should be 50"));
        } else if (total_weight == 50) {
          frm.set_value("total_weightage", total_weight);
          frm.set_value("sum_of_rating", sum_of_rating);

          overall_rating = total_weight * sum_of_rating;
          frm.set_value("overall_rating", overall_rating);
          frm.set_value("employee_overall_rating", overall_rating.toFixed(2));
          console.log("Sent successfully To Appraiser");
        }
        //*<Calculation logic of Employee Section A>

        if (frm.doc.employee_rating_fetched == "Not-Fetched") {
          for (let row of frm.doc.emp_kra_table) {
            let row1 = frm.add_child("appraiser_kra_table", {
              kras: row.kras,
              //weights: row.weights,
              rating: row.rating,
            });
            frm.refresh_field("appraiser_kra_table");
            frm.set_value("employee_rating_fetched", "Fetched");
          }
        } else if (frm.doc.employee_rating_fetched == "Fetched") {
          frappe.msgprint("Already fetched");
        }

        frm.set_value("status", "Submitted");
      } else if (session_emp_user === frm.doc.appraiser_user_id) {
        frappe.throw("You don't have Enough Permission");
      } else if (session_emp_user === frm.doc.skip_user) {
        frappe.throw("You don't have Enough Permission");
      }

      //*<Executing section b calculation of employee>
      frm.trigger("calculate_section_b");

      //*<Executing section b calculation of employee>
    }
  }, //* <Send Employee Section A and B Rating to Appraiser Tab>
  //*-----------------------------------------------------------------------------------------------*//
  //*<Employee status (Satisfied/Not-Satisfied) to hide /unhide skip section>
  employee_status: function (frm) {
    if (frm.doc.employee_status == "Satisfied") {
      frm.toggle_display("skip_kra_sec", false);
      frm.toggle_display("calculate_skip_rating", false);
      frm.toggle_display("emp_skip_msg", true);
    } else if (frm.doc.employee_status == "Not-Satisfied") {
      frm.toggle_display("skip_kra_sec", true);
      frm.toggle_display("calculate_skip_rating", true);
      frm.toggle_display("emp_skip_msg", false);
    }
  }, //*</Employee status (Satisfied/Not-Satisfied) to hide /unhide skip section>
  //*-----------------------------------------------------------------------------------------------*//
  //*<Activate SKIP LEVEL if employee not satisfied with manager rating>
  activate_skip: function (frm) {
    let d = new frappe.ui.Dialog({
      title:
        "Your satisfaction is important to us. Request a SKIP level rating if you're not happy.",
      fields: [
        {
          label: "Please explain, why are you not satisfied?",
          fieldname: "emp_reason",
          reqd: 1,
          fieldtype: "Text Editor",
        },
      ],
      primary_action_label: "Submit",
      primary_action(values) {
        let emp_reason = d.get_value("emp_reason");
        if (emp_reason) {
          frappe.confirm(
            "Do you really want rating from <b>" +
              getFormattedName(frm.doc.skip_reporting_employee_name) +
              "</b> ?",
            () => {
              // action to perform if Yes is selected

              frm.set_value("employee_status", "Not-Satisfied");
              frm.set_value("emp_reason", emp_reason);
              frm.set_value("display", "yes");
              d.hide();
              frm.save();
            },
            () => {
              // action to perform if No is selected
            }
          );

          // Function to get formatted first name and last name
          function getFormattedName(name) {
            var nameArray = name.split(" ");
            var firstName =
              "<b>" +
              nameArray[0].charAt(0).toUpperCase() +
              nameArray[0].slice(1).toLowerCase() +
              "</b>";
            var lastName =
              "<b>" +
              nameArray[nameArray.length - 1].charAt(0).toUpperCase() +
              nameArray[nameArray.length - 1].slice(1).toLowerCase() +
              "</b>";
            return firstName + " " + lastName;
          }
        } else {
          frappe.msgprint("Please enter a reason");
        }
      },
    });
    d.show();
  }, //*</Activate SKIP LEVEL if employee not satisfied with manager rating>
  //*-----------------------------------------------------------------------------------------------*//
  //*<Button to Calculate Section B from Appraiser tab>
  btn_calculate_app_section_b: function (frm) {
    let session_emp_user = frappe.session.user;
    if (session_emp_user === frm.doc.user_id) {
      frappe.throw("You don't have Enough Permission");
    } else if (session_emp_user === frm.doc.appraiser_user_id) {
      let all_ratings_given = true;
      let message = "";
      for (let row1 of frm.doc.employee_section_b_table) {
        if (!row1.appraiser_rating) {
          all_ratings_given = false;
          message += "<br>- " + row1.employee_data;
        }
      }
      if (!all_ratings_given) {
        frappe.msgprint("Please Give Rating in:" + message);
      } else {
        const outstanding = 1;
        const exceeds_expectations = 2;
        const meets_expectations = 3;
        const needs_improvement = 4;
        const poor = 5;
        let section_b_sum_of_rating = 0;
        let section_b_no_of_attributes = 0;
        let section_b_overall_rating = 0.0;

        for (let row1 of frm.doc.employee_section_b_table) {
          section_b_no_of_attributes = section_b_no_of_attributes + 1;

          if (row1.appraiser_rating == "Outstanding") {
            section_b_sum_of_rating = section_b_sum_of_rating + outstanding;
          }
          if (row1.appraiser_rating == "Exceeds Expectations") {
            section_b_sum_of_rating =
              section_b_sum_of_rating + exceeds_expectations;
          }
          if (row1.appraiser_rating == "Meets Expectations") {
            section_b_sum_of_rating =
              section_b_sum_of_rating + meets_expectations;
          }
          if (row1.appraiser_rating == "Needs Improvement") {
            section_b_sum_of_rating =
              section_b_sum_of_rating + needs_improvement;
          }
          if (row1.appraiser_rating == "Poor") {
            section_b_sum_of_rating = section_b_sum_of_rating + poor;
          }
        }
        console.log(section_b_sum_of_rating);
        section_b_overall_rating =
          section_b_sum_of_rating / section_b_no_of_attributes;
        frm.set_value("app_sec_b_app_rating", section_b_overall_rating);
        frm.set_value("skip_app_sec_b_ranking", section_b_overall_rating);

        cur_frm.save();
      }
    } else if (session_emp_user === frm.doc.skip_user) {
      frappe.throw("You don't have Enough Permission");
    }
  }, //*</Button to Calculate Section B from Appraiser tab>
  //*-----------------------------------------------------------------------------------------------*//
  check_section_b: function (frm) {
    if (session_emp_user === frm.doc.appraiser_user_id) {
      let all_ratings_given = true;
      let message = "";
      for (let row1 of frm.doc.employee_section_b_table) {
        if (!row1.appraiser_rating) {
          all_ratings_given = false;
          message += "<br>- " + row1.employee_data;
        }
      }
      if (!all_ratings_given) {
        frappe.msgprint("Please Give Rating in:" + message);
      }
    }
  },
  //*-----------------------------------------------------------------------------------------------*//
  onload_post_render: function (frm) {
    // frm.fields_dict.emp_kra_table.$wrapper.on(
    //   "input",
    //   ".input-with-feedback[data-fieldname='kras']",
    //   function (evt) {
    //     // Get the value of the input field
    //     var input_value = evt.target.value;
    //     // Define a regular expression that matches special characters
    //     var special_char_regex = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    //     // Check if the input value contains a special character
    //     if (special_char_regex.test(input_value)) {
    //       // Remove the special character from the input field
    //       var cleaned_input_value = input_value.replace(special_char_regex, "");
    //       // Set the cleaned value back into the input field
    //       evt.target.value = cleaned_input_value;
    //       // Display an alert message
    //       frappe.msgprint({
    //         title: __("Alert"),
    //         indicator: "red",
    //         message: __("Special Characters are not Allowed."),
    //       });
    //     }
    //   }
    // );
  },
  //*-----------------------------------------------------------------------------------------------*//
  //*<Button to Calculate Overall Rating of Section A & B from Appraiser tab>
  btn_calculate_appraiser_overall_rating: function (frm) {
    //*<calculating appraiser section A,B and set value in Overall appraiser rating>

    let session_emp_user = frappe.session.user;

    //frappe.msgprint("logged in id : " + session_emp_user);

    if (session_emp_user === frm.doc.appraiser_user_id) {
      console.log("total hit");
      // Get the values of field1 and field2
      let sectionARating = frm.doc.appraiser_overall_rating;
      let sectionBRating = frm.doc.app_sec_b_app_rating;
      console.log(sectionARating);
      console.log(sectionBRating);

      // Calculate the average
      var average = (sectionARating + sectionBRating) / 100;
      console.log(average);

      // Set the value of field3 to the calculated average
      frm.set_value("end_app_rating", average);
    } else {
      frappe.throw("You dont have enough permission !!");
    }

    //*</calculating appraiser section A,B and set value in Overall appraiser rating>
  }, //*</Button to Calculate Overall Rating of Section A & B from Appraiser tab>

  //*-----------------------------------------------------------------------------------------------*//
  btn_skip_section_a_rating: function (frm) {
    let session_emp_user = frappe.session.user;
    if (session_emp_user === frm.doc.skip_user) {
      //frappe.msgprint("logged in id : " + session_emp_user);
      for (let row of frm.doc.skip_kra_table) {
        if ((row.skip_rating == "") | null) {
          frappe.msgprint("Please Give Rating in - " + row.emp_kra);
        } else {
          const outstanding = 1;
          const exceeds_expectations = 2;
          const meets_expectations = 3;
          const needs_improvement = 4;
          const poor = 5;
          let sum_of_rating = 0;
          let total_weight = 50;
          let total_rating = 0;
          let overall_rating = 0.0;

          for (let row of frm.doc.skip_kra_table) {
            if (row.skip_rating == "Outstanding") {
              sum_of_rating = sum_of_rating + outstanding;
            }
            if (row.skip_rating == "Exceeds Expectations") {
              sum_of_rating = sum_of_rating + exceeds_expectations;
            }
            if (row.skip_rating == "Meets Expectations") {
              sum_of_rating = sum_of_rating + meets_expectations;
            }
            if (row.skip_rating == "Needs Improvement") {
              sum_of_rating = sum_of_rating + needs_improvement;
            }
            if (row.skip_rating == "Poor") {
              sum_of_rating = sum_of_rating + poor;
            }
          }

          if (total_weight !== 50) {
            console.log("checking weightage");
            frappe.msgprint(__("Weightage should be 50"));
            return false;
          } else if (total_weight == 50) {
            overall_rating = total_weight * sum_of_rating;
            frm.set_value("skip_sec_a_rating", overall_rating);
          }
        }
      }
    } else {
      frappe.throw("You dont have enough permission !!");
    }
  },
  //*-----------------------------------------------------------------------------------------------*//

  btn_skip_sec_b_rating: function (frm) {
    let session_emp_user = frappe.session.user;

    //frappe.msgprint("logged in id : " + session_emp_user);

    if (session_emp_user === frm.doc.skip_user) {
      let all_ratings_given = true;
      let message = "";
      for (let row1 of frm.doc.skip_section_b) {
        if (!row1.skip_rating) {
          all_ratings_given = false;
          message += "<br>- " + row1.employee_data;
        }
      }
      if (!all_ratings_given) {
        frappe.msgprint("Please Give Rating in:" + message);
      } else {
        const outstanding = 1;
        const exceeds_expectations = 2;
        const meets_expectations = 3;
        const needs_improvement = 4;
        const poor = 5;
        let skip_section_b_sum_of_rating = 0;
        let skip_section_b_no_of_attributes = 0;
        let skip_section_b_overall_rating = 0.0;

        for (let row1 of frm.doc.skip_section_b) {
          skip_section_b_no_of_attributes = skip_section_b_no_of_attributes + 1;

          if (row1.skip_rating == "Outstanding") {
            skip_section_b_sum_of_rating =
              skip_section_b_sum_of_rating + outstanding;
          }
          if (row1.skip_rating == "Exceeds Expectations") {
            skip_section_b_sum_of_rating =
              skip_section_b_sum_of_rating + exceeds_expectations;
          }
          if (row1.skip_rating == "Meets Expectations") {
            skip_section_b_sum_of_rating =
              skip_section_b_sum_of_rating + meets_expectations;
          }
          if (row1.skip_rating == "Needs Improvement") {
            skip_section_b_sum_of_rating =
              skip_section_b_sum_of_rating + needs_improvement;
          }
          if (row1.skip_rating == "Poor") {
            skip_section_b_sum_of_rating = skip_section_b_sum_of_rating + poor;
          }
        }
        console.log(skip_section_b_sum_of_rating);
        skip_section_b_overall_rating =
          skip_section_b_sum_of_rating / skip_section_b_no_of_attributes;
        frm.set_value("skip_sec_b_rating", skip_section_b_overall_rating);
      }
    } else {
      frappe.throw("You dont have enough permission !!");
    }
  },
  //*-----------------------------------------------------------------------------------------------*//

  calculate_skip_rating: function (frm) {
    let session_emp_user = frappe.session.user;
    if (session_emp_user === frm.doc.user_id) {
      frappe.throw("You don't have Enough Permission");
    } else if (session_emp_user === frm.doc.appraiser_user_id) {
      frappe.throw("You don't have Enough Permission");
    } else if (session_emp_user === frm.doc.skip_user) {
      let skip_sectionARating = parseFloat(frm.doc.skip_sec_a_rating);
      let skip_sectionBRating = parseFloat(frm.doc.skip_sec_b_rating);
      console.log(skip_sectionARating);
      console.log(skip_sectionBRating);

      // Calculate the average
      var skip_average = (skip_sectionARating + skip_sectionBRating) / 100;
      console.log(skip_average);

      // Set the value of field3 to the calculated average
      frm.set_value("skip_overall_rating", skip_average);
    }
  },
  //*-----------------------------------------------------------------------------------------------*//

  // display: function (frm) {
  //   if (frm.doc.display == "yes") {
  //     for (let row of frm.doc.employee_section_b_table) {
  //       for (let row1 of frm.doc.skip_section_b) {
  //         if (row.employee_data == row1.employee_data) {
  //           frm.doc.employee_section_b_table[row.idx - 1].appraiser_rating =
  //             row1.appraiser_rating;
  //           frm.refresh_field("employee_section_b_table");
  //         }
  //       }
  //     }
  //   }
  // },

  skip_confirmation_status: function (frm) {
    if (frm.doc.skip_confirmation_status == "SKIP Rating Required") {
      if (frm.doc.skip_fetch == "Not-Fetched") {
        frm.clear_table("skip_section_b");
        for (let row of frm.doc.employee_section_b_table) {
          let row1 = frm.add_child("skip_section_b", {
            employee_data: row.employee_data,
            employee_rating: row.employee_rating,
            appraiser_rating: row.appraiser_rating,
          });
          frm.refresh_field("skip_section_b");
          frm.set_value("skip_fetch", "Fetched");
        }
      }
    }
  },
});
//*-----------------------------------------------------------------------------------------------*//
