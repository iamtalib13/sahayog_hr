// Copyright (c) 2023, Talib Sheikh and contributors
// For license information, please see license.txt

frappe.ui.form.on("Performance Appraisal", {
  after_save: function (frm) {
    location.reload();
  },
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
    // if (session_emp_user === frm.doc.appraiser_user_id) {
    //   if (frm.doc.appraiser_rating_calculated == "no") {
    //     let sec_a_message = "";
    //     let sec_b_message = "";
    //     let sec_a_empty = "true";
    //     let sec_b_empty = "true";

    //     for (let row of frm.doc.appraiser_kra_table) {
    //       if (row.appraisar_rating !== "") {
    //         sec_a_empty = "false";
    //       }

    //       if ((row.appraisar_rating == "") | null) {
    //         sec_a_message += "<br>- " + row.kras;
    //         sec_a_empty = "true";
    //       }
    //     }

    //     for (let row1 of frm.doc.employee_section_b_table) {
    //       if (row1.appraiser_rating !== "") {
    //         sec_b_empty = "false";
    //       }
    //       if ((row1.appraiser_rating == "") | null) {
    //         sec_b_message += "<br>- " + row1.employee_data;
    //         sec_b_empty = "true";
    //       }
    //     }
    //     var promotion = "false";
    //     if (frm.doc.emp_promotion == "Yes") {
    //       promotion = "true";
    //       console.log(promotion);
    //     } else if (frm.doc.emp_promotion == "No") {
    //       promotion = "true";
    //       console.log(promotion);
    //     } else {
    //       console.log(promotion);
    //     }
    //     if (sec_a_empty == "true") {
    //       frappe.msgprint("Please Give Rating in:" + sec_a_message);
    //     }
    //     if (sec_b_empty == "true") {
    //       frappe.throw("Please Give Rating in:" + sec_b_message);
    //     }

    //     if (promotion == "false") {
    //       frappe.throw("Please Give Recommendation for Promotion !!");
    //     } else if (sec_a_empty == "false" && sec_b_empty == "false") {
    //       frappe.confirm(
    //         "Just a friendly reminder: Once you rate, you won't be able to change it. Are you sure you want to proceed?",
    //         () => {
    //           // action to perform if Yes is selected
    //           frm.trigger("calculate_appraiser_rating");
    //           frm.trigger("btn_calculate_app_section_b");
    //           frm.trigger("btn_calculate_appraiser_overall_rating");
    //           frm.set_value("appraiser_rating_calculated", "yes");
    //           frappe.show_alert(
    //             "Your Rating has been Saved for  " + frm.doc.full_name
    //           );
    //         },
    //         () => {
    //           // action to perform if No is selected
    //           frm.set_df_property("appraiser_kra_table", "read_only", 0);
    //         }
    //       );
    //     }
    //   } else if (frm.doc.appraiser_rating_calculated == "yes") {
    //     frappe.show_alert(
    //       "Your Ratings are already saved for  " + frm.doc.full_name
    //     );
    //   }
    // } //*</Appraiser Save doc after giving Section A & Section B Rating>

    //*<SKIP Save doc after giving Section A & Section B Rating>
    if (session_emp_user === frm.doc.skip_user) {
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
          frappe.throw("Sum of Weight in <b>Section A</b> must be <b>50</b>");
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
    console.log("logged in id : " + session_emp_user);
    // if (frappe.session.user == frm.doc.user_id) {
    //   frappe.throw("You dont have Enough Permission");
    // } else
    if (frappe.session.user == frm.doc.appraiser_user_id) {
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
          app_overall_rating =
            app_sum_of_rating / frm.doc.appraiser_kra_table.length;
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
    } else if (frappe.session.user == frm.doc.skip_user) {
      frappe.throw("You dont have Enough Permission");
    }
  },
  //*-----------------------------------------------------------------------------------------------*//

  onload: function (frm) {
    //*<Showing Welcome message and Calculating Overll rating of appraiser Section A & B Ratings
    let session_emp_user = frappe.session.user;
    if (session_emp_user === frm.doc.appraiser_user_id) {
      // const fullName = frm.doc.ap_name;
      // const firstName = fullName.split(" ")[0];
      // const formattedFirstName =
      //   firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
      // //*<calculating appraiser section A,B and set value in Overall appraiser rating>
      // if (frm.doc.appraiser_rating_calculated == "no") {
      //   // Get the values of field1 and field2
      //   const field1Value = parseFloat(frm.doc.appraiser_overall_rating);
      //   const field2Value = parseFloat(frm.doc.app_sec_b_app_rating);
      //   // Calculate the average
      //   const average = (field1Value + field2Value) / 2;
      //   // Set the value of field3 to the calculated average
      //   frm.set_value("end_app_rating", average);
      // }
      //*</calculating appraiser section A,B and set value in Overall appraiser rating>
    } //*<Showing Welcome message and Calculating Overll rating of appraiser Section A & B Ratings
  },

  //*-----------------------------------------------------------------------------------------------*//
  employee_message: function (frm) {
    if (frm.doc.status == "Submitted") {
      frm.set_intro(
        "<div style='display: inline-block; border-radius: 50%; width: 20px; height: 20px; background-color: green; color: white; text-align: center; line-height: 20px;'>&#10003;</div>" +
          "<b> Thank You for Completing the Appraisal Form </b>",
        "green"
      );
    }
  },

  employeeDetailsCss: function (frm) {
    // if (frm.is_new()) {
    //   // Get the numeric part of the user string
    //   let eid = user.match(/\d+/)[0];

    //   // Initialize the modified employee_id
    //   let modifiedEmployeeId = "";

    //   // Check if the user string contains "ABPS" or "MCPS"
    //   if (user.includes("ABPS")) {
    //     modifiedEmployeeId = "ABPS" + eid;
    //   } else if (user.includes("MCPS")) {
    //     modifiedEmployeeId = "MCPS" + eid;
    //   } else {
    //     // If neither "ABPS" nor "MCPS" is found, use the numeric part as is
    //     modifiedEmployeeId = eid;
    //   }

    //   // Set the "employee_id" field with the modified value
    //   frm.set_value("employee_id", modifiedEmployeeId);
    //   let empid = frm.doc.employee_id;
    //   frappe.db.get_value("Employee", empid, "employee_name").then((r) => {
    //     let employee_name = r.message.employee_name;
    //     //console.log("Employee ID : ", frm.doc.employee_id);
    //     frm.set_value("full_name", employee_name);
    //     frm.refresh_field("frm.doc.full_name");
    //     //console.log("Emp name :", frm.doc.full_name);
    //   });
    // }

    console.log("Employee Details");
    var doc = frm.doc;

    // Create a custom HTML string
    var html = "";
    if (doc.employee_id) {
      html +=
        "<div><strong>Employee ID:</strong> " + doc.employee_id + "</div>";
    }
    //console.log(frm.doc.full_name);
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
    if (!frm.is_new()) {
      frm.trigger("common_status");
    }
    frm.trigger("school_description");
    frm.trigger("buttons_colors");
    frm.trigger("appraisee_section_colors");
    frm.trigger("appraiser_section_colors");
    let session_emp_user = frappe.session.user;
    console.log("logged in id : " + session_emp_user);

    if (frm.is_new()) {
      frm.set_df_property("appraisee_submit", "hidden", 1);
      // console.log("work kar raha hai");
      //let user = frappe.session.user;
      // Get the numeric part of the user string
      let eid = frappe.session.user.match(/\d+/)[0];

      // Initialize the modified employee_id
      let modifiedEmployeeId = "";

      // Check if the user string contains "ABPS" or "MCPS"
      if (user.includes("ABPS")) {
        modifiedEmployeeId = "ABPS" + eid;
      } else if (user.includes("MCPS")) {
        modifiedEmployeeId = "MCPS" + eid;
      } else {
        // If neither "ABPS" nor "MCPS" is found, use the numeric part as is
        modifiedEmployeeId = eid;
      }

      // Set the "employee_id" field with the modified value
      frm.set_value("employee_id", modifiedEmployeeId);
      console.log("ID SET");

      let empid = frm.doc.employee_id;
      frappe.db.get_value("Employee", empid, "employee_name").then((r) => {
        let employee_name = r.message.employee_name;
        console.log("Employee ID : ", frm.doc.employee_id);
        frm.set_value("full_name", employee_name);
        console.log("Emp name :", frm.doc.full_name);
      });

      //when form NEW
    } else if (!frm.is_new()) {
      //when form NOT NEW
    }

    // if (frm.doc.employee_status == "Satisfied") {
    //   frm.set_value("final_ranking", frm.doc.end_app_rating);
    // } else if (frm.doc.skip_confirmation_status == "SKIP Rating Not-Required") {
    //   frm.set_value("final_ranking", frm.doc.end_app_rating);
    // } else if (frm.doc.skip_confirmation_status == "SKIP Rating Required") {
    //   frm.set_value("final_ranking", frm.doc.skip_overall_rating);
    // }

    //console.log("user id : " + frm.doc.user_id);
    //console.log("Employee ID : " + frm.doc.employee_id);
    if (frappe.session.user === frm.doc.user_id) {
      console.log("Employee Matched");

      $("#performance-appraisal-skip_tab-tab").css("display", "none");
      $("#performance-appraisal-appraiser_tab-tab").css("display", "none");
      $("#performance-appraisal-appraiser_tab-tab").attr(
        "class",
        "nav-link hide"
      );

      //Employee - when form is new
      if (frm.is_new()) {
        // let user = frappe.session.user;
        // Get the numeric part of the user string
        let eid = frappe.session.user.match(/\d+/)[0];

        // Initialize the modified employee_id
        let modifiedEmployeeId = "";

        // Check if the user string contains "ABPS" or "MCPS"
        if (user.includes("ABPS")) {
          modifiedEmployeeId = "ABPS" + eid;
        } else if (user.includes("MCPS")) {
          modifiedEmployeeId = "MCPS" + eid;
        } else {
          // If neither "ABPS" nor "MCPS" is found, use the numeric part as is
          modifiedEmployeeId = eid;
        }

        // Set the "employee_id" field with the modified value
        frm.set_value("employee_id", modifiedEmployeeId);
        console.log("ID SET");
        let empid = frm.doc.employee_id;

        frappe.db.get_value("Employee", empid, "user_id").then((r) => {
          let empUserID = r.message.user_id;
          console.log("Variable Value : ", empUserID);
          if (empUserID == user) {
            console.log("Employee Matched from Server when form-new");
            //frm.trigger("employeeRules");

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
        frappe.db.get_value("Employee", empid, "employee_name").then((r) => {
          let employee_name = r.message.employee_name;
          //console.log("Reporting Employee ID : ", reportingEmpUserID);
          frm.set_value("full_name", employee_name);
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

              let employee_name = r.message[0].employee_name;
              console.log("Employee Name ", frm.doc.employee_name);

              console.log(
                "Appraiser :",
                r.message[0].reporting_employee_user_id
              );
              frm.set_value("appraiser_user_id", ap_user);
              frm.set_value("full_name", employee_name);
              console.log(frm.doc.appraiser_user_id);
            }
          },
        });
      }

      //Employee - when form is not new
      else if (!frm.is_new()) {
        let user = frappe.session.user;
        let empid = frm.doc.user_id;

        if (empid == user) {
          console.log("Employee Matched from Server when form not-new ");
          frm.trigger("employee_message");

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

      if (frm.doc.status == "Draft" || frm.doc.status == "Rejected") {
        // HTML
        frm.set_intro(
          "<b><span class='blink-text'>Please Submit to your Appraiser -> </span></b>" +
            "<b><span class='appraiser-name'>" +
            frm.doc.appraisers_name +
            "</span></b>",
          "green"
        );

        // CSS
        const style = document.createElement("style");
        style.innerHTML = `
  .blink-text {
      animation: blink 2s ease-in-out infinite;
      font-size: 1.1em; /* Adjust font size as needed */
      color: red;
  }

  @keyframes blink {
      0% { opacity: 1; }
      50% { opacity: 0.5; }
      100% { opacity: 1; }
  }

  .appraiser-name {
      color: black;
      font-size: 1.1em; /* Adjust font size as needed */

  }
`;
        document.head.appendChild(style);
      }
      if (typeof appraiser_rating !== "undefined") {
        // frm.set_intro("Appraiser Ranking: " + appraiser_rating, "green");
      }
      if (typeof skip_ranking !== "undefined") {
        // frm.set_intro("Skip Ranking: " + skip_ranking, "green");
      }
      //*</display Employee rating and appraiser rating>

      if (!frm.doc.__islocal && frm.doc.appraiser_overall_rating == null) {
        if (frm.doc.status == "Draft" || frm.doc.status == "Rejected") {
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
                    frm.trigger("calculate_section_a");
                    frm.trigger("calculate_section_b");
                    frm.trigger("cal_emp_tot_weight_ranking");

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
      }
      // // else if (!frm.doc.__islocal && frm.doc.display == "no") {
      // //   //* <Activate skip level button when appraiser give their rating to employee>

      // //   frm.add_custom_button(
      // //     __("Satisfied"),
      // //     function () {
      // //       // Get the first and last name from frm.doc.ap_name and capitalize the first letter
      // //       var fullName = frm.doc.ap_name;
      // //       var nameArray = fullName.split(" ");
      // //       var firstName =
      // //         nameArray[0].charAt(0).toUpperCase() +
      // //         nameArray[0].slice(1).toLowerCase();
      // //       var lastName =
      // //         nameArray[nameArray.length - 1].charAt(0).toUpperCase() +
      // //         nameArray[nameArray.length - 1].slice(1).toLowerCase();

      // //       frappe.confirm(
      // //         "Are you satisfied with the rating given by <b>" +
      // //           firstName +
      // //           "</b> <b>" +
      // //           lastName +
      // //           "</b> ?",
      // //         () => {
      // //           // action to perform if Yes is selectedx
      // //           cur_frm.set_value("display", "yes");
      // //           cur_frm.set_value("employee_status", "Satisfied");
      // //           frappe.msgprint("Appraiser Rating has been accepted ");
      // //           frm.set_value("final_ranking", frm.doc.end_app_rating);
      // //           cur_frm.save();
      // //         },
      // //         () => {
      // //           // action to perform if No is selected
      // //         }
      // //       );
      // //     },
      // //     __("Appraiser Rating")
      // //   );

      // frm.add_custom_button(
      //   __("Not-Satisfied"),
      //   function () {
      //     frm.trigger("activate_skip");
      //   },
      //   __("Appraiser Rating")
      // );
      // // } //* </Activate skip level button when appraiser give their rating to employee>
    } else if (frappe.session.user === frm.doc.appraiser_user_id) {
      //frm.set_df_property("appraiser_kra_table", "read_only", 0);
      if (frm.doc.appraiser_rating_calculated == "no") {
        if (frm.doc.appraiser_rating_calculated === "no") {
          let sec_a_empty = true;
          let sec_b_empty = true;

          for (let row of frm.doc.appraiser_kra_table) {
            if (row.appraisar_rating !== "") {
              sec_a_empty = false;
              break; // exit loop if any rating is not empty
            }
          }

          for (let row1 of frm.doc.employee_section_b_table) {
            if (row1.appraiser_rating !== "") {
              sec_b_empty = false;
              break; // exit loop if any rating is not empty
            }
          }

          let promotion;
          if (
            frm.doc.emp_promotion === "Yes" ||
            frm.doc.emp_promotion === "No"
          ) {
            promotion = true;
          } else {
            promotion = false;
          }

          if (sec_a_empty && sec_b_empty) {
            console.log(
              "Both Section A and Section B are empty and Promotion is valid (Yes or No)"
            );
          } else if (!sec_a_empty && !sec_b_empty) {
            frm.set_intro(
              "<div style='display: inline-block; border-radius: 50%; width: 20px; height: 20px; background-color: green; color: white; text-align: center; line-height: 20px;'>&#10003;</div>" +
                " Ratings have been saved successfully for <b>" +
                frm.doc.full_name +
                ".</b><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span id='blink-text' style='color: red; font-weight: bold;'>Please submit this rating.</span>",
              "green"
            );

            // CSS for blink animation
            var blinkText = document.getElementById("blink-text");
            blinkText.style.animation = "blink 2s ease-in-out infinite"; // Adjust the animation timing here

            // Define the animation
            var keyframes = `@keyframes blink {
              0% { opacity: 1; }
              50% { opacity: 0.5; }
              100% { opacity: 1; }
          }`;

            // Create a style element and append the animation
            var style = document.createElement("style");
            style.innerHTML = keyframes;
            document.head.appendChild(style);

            console.log(
              "Both Section A and Section B are not empty and Promotion is valid (Yes or No)"
            );
          } else {
            console.log("Conditions do not meet the required criteria.");
          }
        }

        frm.disable_save();

        if (frm.doc.status !== "Rejected") {
          // Code for reject button
          frm
            .add_custom_button(__("Reject"), function () {
              console.log("status : ", frm.doc.status);
              frm.set_value("employee_rating_fetched", "Not-Fetched");
              frm.set_value("status", "Rejected");
              frm.save();
            })
            .css({
              "background-color": "#F70D1A", // Set green color
              color: "#ffffff", // Set font color to white
            });

          frm
            .add_custom_button(__("Submit"), function () {
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
                        frm.set_value("status", "Submitted");
                        frm.save();
                        frappe.show_alert(
                          "Your Rating has been Submitted for " +
                            frm.doc.full_name
                        );
                      },
                      () => {
                        // action to perform if No is selected
                        frm.set_df_property(
                          "appraiser_kra_table",
                          "read_only",
                          0
                        );
                      }
                    );
                  }
                } else if (frm.doc.appraiser_rating_calculated == "yes") {
                  frappe.show_alert(
                    "Your Ratings are already saved for  " + frm.doc.full_name
                  );
                }
              } //*</Appraiser Save doc after giving Section A & Section B Rating>
            })
            .css({
              "background-color": "#28a745", // Set green color
              color: "#ffffff", // Set font color to white
            });
          frm
            .add_custom_button(__("Save"), function () {
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
                      "Are you sure you want to Save?",
                      () => {
                        // action to perform if Yes is selected
                        frm.trigger("calculate_appraiser_rating");
                        frm.trigger("btn_calculate_app_section_b");
                        frm.trigger("btn_calculate_appraiser_overall_rating");
                        frappe.show_alert(
                          "Your Rating has been Saved for  " + frm.doc.full_name
                        );
                        frm.save();
                      },
                      () => {
                        // action to perform if No is selected
                        frm.set_df_property(
                          "appraiser_kra_table",
                          "read_only",
                          0
                        );
                      }
                    );
                  }
                } else if (frm.doc.appraiser_rating_calculated == "yes") {
                  frappe.show_alert(
                    "Your Ratings are already saved for  " + frm.doc.full_name
                  );
                }
              } //*</Appraiser Save doc after giving Section A & Section B Rating>
            })
            .css({
              "background-color": "#4285F4", // Set green color
              color: "#ffffff", // Set font color to white
            });
        }
      } else {
        frm.disable_save();
        // Code for "send to skip level" button
        if (frm.doc.employee_status !== "Not-Satisfied") {
          frm.add_custom_button(__("Send to Skip Level"), function () {
            frm.trigger("activate_skip");
            // Your logic for sending to skip level here
            // For example, you can update document status or perform other actions
            // This is just a placeholder, replace it with your actual logic
            //frm.set_value('status', 'Sent to Skip Level');
            //frm.save();
          });
        }
      }
      let ap = frm.doc.appraiser_user_id;

      // // Add the 'Submit' button
      // frm.add_custom_button(__("Submit"), function () {
      //   // Save the form
      //   frappe.confirm(
      //     "Are you sure you want to submit your form to ?",
      //     () => {
      //       // action to perform if Yes is selected
      //       frappe.show_alert("Submitted successfully");
      //       console.log("console wala message");
      //       frm.trigger("show_sendToSkipLevel");

      //       frm.save();
      //     },
      //     () => {
      //       frappe.show_alert("Now You Can change Your Section A & Section B");
      //     }
      //   );
      // });

      $("#performance-appraisal-tab_employee_tab-tab").css("display", "none");
      $("#performance-appraisal-skip_tab-tab").css("display", "none");
      $("#performance-appraisal-tab_employee_tab").removeClass("active").hide();
      $("#performance-appraisal-appraiser_tab").addClass("active");
      $("#performance-appraisal-appraiser_tab-tab").addClass("active");

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
        // frm.fields_dict["employee_section_b_table"].grid.toggle_reqd(
        //   "appraiser_rating",
        //   true
        // );
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
        frm.set_intro(
          "<div style='display: inline-block; border-radius: 50%; width: 20px; height: 20px; background-color: green; color: white; text-align: center; line-height: 20px;'>&#10003;</div>" +
            " Your Rating has been Submitted for  <b>" +
            frm.doc.full_name +
            "</b>",
          "green"
        );
        frm.set_df_property("employee_section_b_table", "read_only", 1);
      }

      for (let row of frm.doc.appraiser_kra_table) {
        if ((row.appraisar_rating == "") | null) {
          //*frappe.msgprint("Empty Appraiser Rating");
        } else if ((row.appraisar_rating !== "") | null) {
          //frm.set_df_property("appraiser_kra_table", "read_only", 1);
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
      // if (frm.doc.employee_status == "Satisfied") {
      //   frm.set_intro("Employee is Satisfied with Your Ratings", "green");
      // } else if (frm.doc.employee_status == "Not-Satisfied") {
      //   frm.set_intro(
      //     "Employee is Not-Satisfied with Your Ratings and applied for SKIP Level",
      //     "red"
      //   );
      // }
      if (frm.doc.employee_status == "Not-Satisfied") {
        frm.set_intro("This Form is Successfully send to SKIP Level", "green");
      }
      //*</Show Employee status to appraiser>
    } else if (frappe.session.user === frm.doc.skip_user) {
      console.log("Skip Matched: ", session_emp_user);
      if (
        frm.doc.appraiser_rating_calculated == "no" &&
        frm.doc.status == "Submitted"
      ) {
        // frm.set_intro(
        //   "<div style='display: flex; align-items: center;'>" +
        //     "<div style='border-radius: 50%; width: 20px; height: 20px; background-color: green; color: white; text-align: center; line-height: 20px;'>&#10003;</div>" +
        //     "<div style='margin-left: 10px; color: green;'><b>Appraisee :</b> " +
        //     frm.doc.full_name +
        //     "</div>" +
        //     "</div><br>" +
        //     "<hr style='margin-top: 1px; margin-bottom:15px;'>" +
        //     "<div style='display: flex; align-items: center;'>" +
        //     "<div style='border-radius: 50%; width: 20px; height: 20px; background-color: red; color: white; text-align: center; line-height: 15px;'>!</div>" +
        //     "<div style='margin-left: 10px; color: red;'><b>Appraiser :</b> " +
        //     frm.doc.ap_name +
        //     "</div>" +
        //     "</div>",
        //   "green" // You can set this to any default color you prefer
        // );
      }

      frm.disable_save();
      if (frm.doc.skip_sec_calculated == "yes") {
      } else if (
        frm.doc.skip_sec_calculated == "no" &&
        frm.doc.appraiser_rating_calculated == "yes"
      ) {
        frm
          .add_custom_button(__("Save"), function () {
            frm.trigger("btn_skip_section_a_rating");
            frm.trigger("btn_skip_sec_b_rating");
            frm.trigger("calculate_skip_rating");

            frm.set_value("skip_sec_calculated", "no");
            frm.save();
          })
          .css({
            "background-color": "#00b4d8", // Set green color
            color: "#ffffff", // Set font color to white
          });
        frm
          .add_custom_button(__("Submit"), function () {
            frm.trigger("btn_skip_section_a_rating");
            frm.trigger("btn_skip_sec_b_rating");
            frm.trigger("calculate_skip_rating");

            frm.set_value("skip_sec_calculated", "yes");
            frm.save();
          })
          .css({
            "background-color": "#06d6a0", // Set green color
            color: "#ffffff", // Set font color to white
          });
      }

      //hide Appraisee Tab
      $("#performance-appraisal-tab_employee_tab-tab").css("display", "none");
      $("#performance-appraisal-tab_employee_tab").removeClass("active").hide();

      //hide Appraiser Tab
      $("#performance-appraisal-appraiser_tab").css("display", "none");
      $("#performance-appraisal-appraiser_tab").removeClass("active").hide();
      $("#performance-appraisal-appraiser_tab-tab").hide();

      //show Skip Tab
      $("#performance-appraisal-skip_tab-tab").addClass("active");
      $("#performance-appraisal-skip_tab").addClass("active");

      if (frm.doc.skip_sec_calculated === "yes") {
        frm.set_intro(
          "Your Rating has been Saved for <b>" + frm.doc.full_name + "</b>",
          "green"
        );

        frm.set_df_property("skip_confirmation_status", "read_only", 1);
      }

      // Disable certain fields
      frm.toggle_enable("app_sec_c_recommendation", 0);
      frm.toggle_enable("sec_c_app_final_feedback", 0);
      frm.toggle_display("skip_confirmation_status", 1);

      //fetching values
      frm.set_value("skip_app_sec_a_rating", frm.doc.appraiser_overall_rating);
      frm.set_value("skip_emp_overall_rating", frm.doc.emp_tot_weight_ranking);
      frm.set_value("skip_appraiser_overall_rating", frm.doc.end_app_rating);

      // Set read-only properties for various tables
      frm.set_df_property("employee_section_b_table", "read_only", 1);
      frm.set_df_property("emp_kra_table", "read_only", 1);
      frm.set_df_property("appraiser_kra_table", "read_only", 1);
      frm.set_df_property("skip_kra_table", "read_only", 0);

      // Hide certain grid buttons
      frm.fields_dict["skip_kra_table"].grid.wrapper
        .find(".grid-add-row, .grid-remove-all-rows, .grid-remove-rows")
        .hide();
    } else {
      // Trigger another function if conditions are not met
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
  // show_sendToSkipLevel: function (frm) {
  //   let session_emp_user = frappe.session.user;
  //   if (session_emp_user === frm.doc.appraiser_user_id) {
  //     if (frm.save()) {
  //     }
  //   }
  // },
  //*-----------------------------------------------------------------------------------------------*//
  appraisee_save(frm) {
    frm.save();
  },
  appraisee_submit(frm) {
    if (frm.is_new()) {
      show_alert("Hi, Please save your form", 5);
    } else if (!frm.is_new()) {
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
            frm.trigger("calculate_section_a");
            frm.trigger("calculate_section_b");
            frm.trigger("cal_emp_tot_weight_ranking");

            frm.trigger("send_to_appraiser");

            frm.save();
          },
          () => {
            frappe.show_alert("Now You Can change Your Section A & Section B");
          }
        );
      }
    }
  },
  common_status(frm) {
    console.log("common_status");
    var appraiser_status = "";
    var appraisee_status = "";
    var skip_status = "";

    // Determine skip status
    if (
      frm.doc.employee_status === "Not-Satisfied" &&
      frm.doc.skip_confirmation_status === ""
    ) {
      skip_status = "Pending";
    } else if (
      frm.doc.skip_sec_calculated === "yes" &&
      frm.doc.skip_confirmation_status === "SKIP Rating Required"
    ) {
      skip_status = "Submitted";
    } else if (
      frm.doc.skip_confirmation_status === "SKIP Rating Not-Required"
    ) {
      skip_status = "Appraiser-Final";
    } else {
      skip_status = "Not-Received";
    }

    // Determine appraisee status
    appraisee_status =
      frm.doc.employee_rating_fetched === "Fetched" ? "Submitted" : "Pending";

    // Determine appraiser status
    if (frm.doc.appraiser_rating_calculated === "yes") {
      appraiser_status = "Submitted";
    } else if (
      frm.doc.appraiser_rating_calculated === "no" &&
      frm.doc.employee_rating_fetched === "Fetched"
    ) {
      appraiser_status = "Pending";
    } else if (frm.doc.status === "Rejected") {
      appraiser_status = "Changes-Required";
    } else {
      appraiser_status = "Not-Received";
    }

    // Determine colors
    var statusColors = {
      Submitted: "green",
      "Not-Received": "blue",
      "Changes-Required": "#FFA500",
      Pending: "red",
      "Appraiser-Final": "green",
    };

    var appraisee_status_color = statusColors[appraisee_status];
    var appraiser_status_color = statusColors[appraiser_status];
    var skip_status_color = statusColors[skip_status];

    // Prepare names
    var fullNameParts = frm.doc.full_name.split(" ");
    var appraiserNameParts = frm.doc.ap_name.split(" ");
    var skipReportingEmployeeNameParts = frm.doc.skip_reporting_employee_name
      ? frm.doc.skip_reporting_employee_name.split(" ")
      : ["Skip", "Not", "Available"];

    var fullName =
      fullNameParts[0] + " " + fullNameParts[fullNameParts.length - 1];
    var appraiserName =
      appraiserNameParts[0] +
      " " +
      appraiserNameParts[appraiserNameParts.length - 1];
    var skipReportingEmployeeName =
      skipReportingEmployeeNameParts[0] +
      " " +
      skipReportingEmployeeNameParts[skipReportingEmployeeNameParts.length - 1];

    var html = `
      <!-- Link Button -->
      <div >
        <a href="/app/pms" style="text-decoration: none; color: #2490ef; float:right;">Go to Home <img src="/files/home.png" style="width:13px;color:blue; margin-bottom:4px;"></a>
      </div>
        <div class="custom-intro-container" style="display: flex; align-items: center;">
          <div class="custom-intro-box" style="border-radius: 10px; display: flex; flex-direction: column; justify-content: center; align-items: center; color: black; text-align: center; font-size: 0.8em; padding: 10px;">
            <div class="status_heading"><strong>Appraisee</strong></div>
            <div class="status_Name">${fullName}</div>
            <div class="status_status" style="color: ${appraisee_status_color};">${appraisee_status}</div>
          </div>
          <div class="arrow-right" style="color: black; font-size: 1.5em;">&rArr;</div>
          <div class="custom-intro-box" style="border-radius: 10px; display: flex; flex-direction: column; justify-content: center; align-items: center; color: black; text-align: center; font-size: 0.8em; padding: 10px;">
            <div class="status_heading"><strong>Appraiser</strong></div>
            <div class="status_Name">${appraiserName}</div>
            <div class="status_status" style="color: ${appraiser_status_color};">${appraiser_status}</div>
          </div>
          
          ${
            frm.doc.employee_status == "Not-Satisfied"
              ? `<div class="arrow-right" style="color: black; font-size: 1.5em;">&rArr;</div>
          <div class="custom-intro-box" style="border-radius: 10px; display: flex; flex-direction: column; justify-content: center; align-items: center; color: black; text-align: center; font-size: 0.8em; padding: 10px;">
            <div class="status_heading"><strong>Skip</strong></div>
            <div class="status_Name">${skipReportingEmployeeName}</div>
            <div class="status_status" style="color: ${skip_status_color};">${skip_status}</div>
          </div>`
              : ""
          }
        </div>
        `;

    // Set the HTML in set_intro with the color "green"
    frm.set_intro(html, "green");
  },

  school_description(frm) {
    if (frm.is_new()) {
      // Get the numeric part of the user string
      let eid = user.match(/\d+/)[0];

      // Initialize the modified employee_id
      let modifiedEmployeeId = "";

      // Check if the user string contains "ABPS" or "MCPS"
      if (user.includes("ABPS")) {
        modifiedEmployeeId = "ABPS" + eid;
      } else if (user.includes("MCPS")) {
        modifiedEmployeeId = "MCPS" + eid;
      } else {
        // If neither "ABPS" nor "MCPS" is found, use the numeric part as is
        modifiedEmployeeId = eid;
      }

      // Set the "employee_id" field with the modified value
      frm.set_value("employee_id", modifiedEmployeeId);
    }

    let empid = frm.doc.employee_id;

    frappe.db
      .get_value("Employee", empid, ["division", "appraisal_category"])
      .then((r) => {
        let division = r.message.division;
        let appraisalCategory = r.message.appraisal_category;

        if (division == "School" && appraisalCategory == "S1") {
          console.log("S1");

          //technical section
          document.querySelector("#section_technical").innerText =
            "Exhibits comprehensive understanding of the core set of Technical and functional aspects to teach & managing school";

          //strategic_thinking_section section
          document.querySelector(
            "#section_strategic_thinking_section"
          ).innerText =
            "Establishes and strengthens the processes, teams and Organization's Competitive advantage and position. Provides direction in preparing strategies and conjure ideas that will both cope with changing environment and consider the various challenges that lie ahead. ";

          //section_managing_title section
          document.querySelector("#section_managing_title").innerText =
            "Builds effective relationships across functions/levels/roles. Utilizes those relationships effectively to achieve the goals of the organization  and self. Connects well with people internally and externally.";

          //section_people_management_section section
          document.querySelector(
            "#section_people_management_section"
          ).innerText =
            "Realizes and leverages on the full potential of people, achieves cohesiveness, reduces divisionary tendencies, nurtures talent and creates a climate of trust";

          //section_decision_title section
          document.querySelector("#section_decision_title").innerText =
            "Is capable of identifying the precise cause of the problem, carrying out root cause analysis and identify deviations from standards or objectives.  Once he/she identifies the problem, implements a suitable course of action  without delay. Gathers and provides resources to achieve objectives.";

          //section_planning_section section
          document.querySelector("#section_planning_section").innerText =
            "Plans and prioritizes all activities. Manages time and task effectively to meet the organization's objectives";

          //section_leadership_emp_title section
          document.querySelector("#section_leadership_emp_title").innerText =
            "Using the power of self appropriately to guide and lead a team towards a shared vision.";

          //section_humility_emp_title section
          document.querySelector("#section_humility_emp_title").innerText =
            "Strives to learn continously from anyone for self and  organizational growth.";
        } else if (division == "School" && appraisalCategory == "S2") {
          console.log("S2");
          //technical section
          document.querySelector("#section_technical").innerText =
            " Demonstrates an understanding of the curriculum, subject content, and developmental needs of students by providing relevant learning experiences.  Engaged with a fabulous classroom presence and establish creative learning sessions all the time - both offline and digital.  Empathy and understanding to determining each student's strengths and weaknesses.";

          //initiative section
          document.querySelector("#section_initiative_section").innerText =
            "A preference to act and doing more than what is required or expected";

          //communication section
          document.querySelector("#section_communication_section").innerText =
            "An ability to impart or exchange and understand core subject, thoughts and ideas orally and in written";

          //personal interpersonal effectiveness section
          document.querySelector(
            "#section_personal_interpersonal_effectiveness"
          ).innerText =
            "Exhibits a willingness and ability to grow professionally and helps others grow as well. Teacher collaborates and works with colleagues, students, parents and communities to develop and sustain a positive school climate that supports students’ learning.";

          //decision_title section
          document.querySelector("#section_decision_title").innerText =
            "An ability to select a best course of action amongst several alternatives";

          //Humility to learn section
          document.querySelector("#section_humility_emp_title").innerText =
            "Strives to learn continously from anyone for self and  organizational growth.";
        } else if (division == "School" && appraisalCategory == "S3") {
          console.log("S3");

          //section_technical section
          document.querySelector("#section_technical").innerText =
            "Demonstrates an understanding, knowledge and skill of the core function.  Identifying developmental needs of the department.  ";

          //section_initiative_section section
          document.querySelector("#section_initiative_section").innerText =
            "A preference to act and doing more than what is required or expected  ";

          //section_communication_section section
          document.querySelector("#section_communication_section").innerText =
            "An ability to impart or exchange and understand core subject, thoughts and ideas orally and in written  ";

          //section_personal_interpersonal_effectiveness section
          document.querySelector(
            "#section_personal_interpersonal_effectiveness"
          ).innerText =
            "Exhibits a willingness and ability to grow professionally and helps others grow as well. Collaborates and works with Teaching and non teaching staff, colleagues, students and communities to develop and sustain a positive school climate that supports students’ learning.  ";

          //section_team_section section
          document.querySelector("#section_team_section").innerText =
            "A Cooperative attitude between those working together on a task/ series of tasks and jobs";
        }
      })
      .catch((err) => {
        console.error("Error fetching employee data:", err);
      });

    //console.log("school change");
    // Get the element with the specified class name
  },
  buttons_colors(frm) {
    frm.fields_dict.appraisee_save.$input.css({
      "background-color": "black",
      color: "white",
      width: "100%",
      position: "relative",
      padding: "10px",
      border: "none",
      cursor: "pointer",
      "margin-top": "138px", // Use dash instead of camel case for margin-top
    });
    frm.fields_dict.appraisee_submit.$input.css({
      "background-color": "black",
      color: "white",
      width: "100%",
      position: "relative",
      padding: "10px",
      border: "none",
      cursor: "pointer",
      "margin-top": "138px", // Use dash instead of camel case for margin-top
    });

    frm.fields_dict.calculate_section_a.$input.css({
      "background-color": "black", // Set the background color to black
      color: "white", // Set the text color to white

      position: "relative", // Add position: relative
      padding: "10px", // Add padding for better visibility and aesthetics
      border: "none", // Remove border if needed
      cursor: "pointer", // Change cursor to pointer for better UX
    });

    frm.fields_dict.calculate_section_b.$input.css({
      "background-color": "black", // Set the background color to black
      color: "white", // Set the text color to white

      position: "relative", // Add position: relative
      padding: "10px", // Add padding for better visibility and aesthetics
      border: "none", // Remove border if needed
      cursor: "pointer", // Change cursor to pointer for better UX
    });
    frm.fields_dict.cal_emp_tot_weight_ranking.$input.css({
      "background-color": "black", // Set the background color to black
      color: "white", // Set the text color to white

      position: "relative", // Add position: relative
      padding: "10px", // Add padding for better visibility and aesthetics
      border: "none", // Remove border if needed
      cursor: "pointer", // Change cursor to pointer for better UX
    });
    frm.fields_dict.calculate_appraiser_rating.$input.css({
      "background-color": "black", // Set the background color to black
      color: "white", // Set the text color to white

      position: "relative", // Add position: relative
      padding: "10px", // Add padding for better visibility and aesthetics
      border: "none", // Remove border if needed
      cursor: "pointer", // Change cursor to pointer for better UX
    });
    frm.fields_dict.btn_calculate_app_section_b.$input.css({
      "background-color": "black", // Set the background color to black
      color: "white", // Set the text color to white

      position: "relative", // Add position: relative
      padding: "10px", // Add padding for better visibility and aesthetics
      border: "none", // Remove border if needed
      cursor: "pointer", // Change cursor to pointer for better UX
    });
    frm.fields_dict.btn_calculate_appraiser_overall_rating.$input.css({
      "background-color": "black", // Set the background color to black
      color: "white", // Set the text color to white

      position: "relative", // Add position: relative
      padding: "10px", // Add padding for better visibility and aesthetics
      border: "none", // Remove border if needed
      cursor: "pointer", // Change cursor to pointer for better UX
    });
    frm.fields_dict.btn_skip_section_a_rating.$input.css({
      "background-color": "black", // Set the background color to black
      color: "white", // Set the text color to white

      position: "relative", // Add position: relative
      padding: "10px", // Add padding for better visibility and aesthetics
      border: "none", // Remove border if needed
      cursor: "pointer", // Change cursor to pointer for better UX
    });
    frm.fields_dict.btn_skip_sec_b_rating.$input.css({
      "background-color": "black", // Set the background color to black
      color: "white", // Set the text color to white

      position: "relative", // Add position: relative
      padding: "10px", // Add padding for better visibility and aesthetics
      border: "none", // Remove border if needed
      cursor: "pointer", // Change cursor to pointer for better UX
    });
    frm.fields_dict.calculate_skip_rating.$input.css({
      "background-color": "black", // Set the background color to black
      color: "white", // Set the text color to white

      position: "relative", // Add position: relative
      padding: "10px", // Add padding for better visibility and aesthetics
      border: "none", // Remove border if needed
      cursor: "pointer", // Change cursor to pointer for better UX
    });
  },

  appraisee_section_colors(frm) {
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
    frm.fields_dict["initiative_sections"].wrapper.css(
      "background-color",
      "antiquewhite"
    );
    frm.fields_dict["communication_section"].wrapper.css(
      "background-color",
      "antiquewhite"
    );
    frm.fields_dict["strategic_thinking_section"].wrapper.css(
      "background-color",
      "antiquewhite"
    );
    frm.fields_dict["result_orientation_section"].wrapper.css(
      "background-color",
      "antiquewhite"
    );
    frm.fields_dict["personal_interpersonal_effectiveness"].wrapper.css(
      "background-color",
      "antiquewhite"
    );
    frm.fields_dict["people_management_section"].wrapper.css(
      "background-color",
      "antiquewhite"
    );
    frm.fields_dict["section_b_btn"].wrapper.css(
      "background-color",
      "antiquewhite"
    );
    frm.fields_dict["fhhdfhd"].wrapper.css("background-color", "antiquewhite");
    frm.fields_dict["thougtss"].wrapper.css("background-color", "antiquewhite");
    frm.fields_dict["ped"].wrapper.css("background-color", "antiquewhite");
    frm.fields_dict["managing_title"].wrapper.css(
      "background-color",
      "antiquewhite"
    );
    frm.fields_dict["planning_section"].wrapper.css(
      "background-color",
      "antiquewhite"
    );
    frm.fields_dict["leadership_emp_title"].wrapper.css(
      "background-color",
      "antiquewhite"
    );
    frm.fields_dict["humility_emp_title"].wrapper.css(
      "background-color",
      "antiquewhite"
    );

    //ranking section
    frm.fields_dict["emp_ranking_section"].wrapper.css(
      "background-color",
      "#DCF2F1"
    );
    frm.fields_dict["column_break_5cwmw"].wrapper.css(
      "background-color",
      "#DCF2F1"
    );

    //section C
    frm.fields_dict["section_c"].wrapper.css(
      "background-color",
      "antiquewhite"
    );
    frm.fields_dict["section_c_a"].wrapper.css(
      "background-color",
      "antiquewhite"
    );
    frm.fields_dict["fkjbfjgb"].wrapper.css("background-color", "antiquewhite");
  },

  appraiser_section_colors(frm) {
    //Section-A-Colors
    frm.fields_dict["kra_2"].wrapper.css("background-color", "antiquewhite");
    frm.fields_dict["section_break_93"].wrapper.css(
      "background-color",
      "antiquewhite"
    );

    //Section-B-Colors
    frm.fields_dict["section_b_2"].wrapper.css(
      "background-color",
      "#DCF2F1" // Hex color code for the lightened blue
    );
    frm.fields_dict["app_section_b_btn"].wrapper.css(
      "background-color",
      "#DCF2F1" // Hex color code for the lightened blue
    );

    //Section-C-Colors
    frm.fields_dict["appraiser_feedback_section"].wrapper.css(
      "background-color",
      "antiquewhite"
    );
    frm.fields_dict["section_break_93"].wrapper.css(
      "background-color",
      "antiquewhite"
    );
    //feedback-Section-Colors
    frm.fields_dict["cseptrator1"].wrapper.css(
      "background-color",
      "#DCF2F1" // Hex color code for the lightened blue
    );
  },
  hideFromEmployee: function (frm) {
    console.log("Hid");
    //frm.set_df_property("employee_rating_tab", "hidden", 1);
  },

  //*-----------------------------------------------------------------------------------------------*//
  //* <Calculate Employee Section A using button>
  calculate_section_a: function (frm) {
    console.log("section A Clicked");
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
              //console.log("checking weightage");
              frappe.msgprint(__("Please ensure that the weights total to 50"));
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
      //Technical Section
      if (
        frm.doc.appraisal_category == 1 ||
        frm.doc.appraisal_category == 2 ||
        frm.doc.appraisal_category == "S1" ||
        frm.doc.appraisal_category == "S2" ||
        frm.doc.appraisal_category == "S3"
      ) {
        if ((frm.doc.technical_emp_rating == "") | null) {
          frappe.msgprint("Please Rate - Technical & Functional knowledge");
        } else if ((frm.doc.technical_emp_rating !== "") | null) {
          let row1 = frm.add_child("employee_section_b_table", {
            employee_data: "Technical & Functional knowledge",
            employee_rating: frm.doc.technical_emp_rating,
            appraisee_comment: frm.doc.technical_emp_comments,
          });
        }
      }
      //Thoughts Leadership holistic and strategic prespective
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
            appraisee_comment: frm.doc.employee_comments,
          });
        }
      }
      // People Development
      if (frm.doc.appraisal_category == 1) {
        if ((frm.doc.people_emp_rating == "") | null) {
          frappe.msgprint("Please Rate - People Development");
        } else if ((frm.doc.people_emp_rating !== "") | null) {
          let row3 = frm.add_child("employee_section_b_table", {
            employee_data: "People Development",
            employee_rating: frm.doc.people_emp_rating,
            appraisee_comment: frm.doc.people_emp_comments,
          });
        }
      }
      //Managing relationships
      if (
        frm.doc.appraisal_category == 1 ||
        frm.doc.appraisal_category == "S1"
      ) {
        if ((frm.doc.managing_emp_rating == "") | null) {
          frappe.msgprint(
            "Please Rate - Managing relationships – collaboration"
          );
        } else if ((frm.doc.managing_emp_rating !== "") | null) {
          let row4 = frm.add_child("employee_section_b_table", {
            employee_data: "Managing relationships – collaboration",
            employee_rating: frm.doc.managing_emp_rating,
            appraisee_comment: frm.doc.managing_emp_comments,
          });
        }
      }
      //Decision making & problem solving
      if (
        frm.doc.appraisal_category == 1 ||
        frm.doc.appraisal_category == "S1" ||
        frm.doc.appraisal_category == "S2"
      ) {
        if ((frm.doc.decision_emp_rating == "") | null) {
          frappe.msgprint("Please Rate - Decision making & problem solving");
        } else if ((frm.doc.decision_emp_rating !== "") | null) {
          let row5 = frm.add_child("employee_section_b_table", {
            employee_data: "Decision making & problem solving",
            employee_rating: frm.doc.decision_emp_rating,
            appraisee_comment: frm.doc.decision_emp_comment,
          });
        }
      }
      //Planning
      if (
        frm.doc.appraisal_category == 1 ||
        frm.doc.appraisal_category == "S1"
      ) {
        if ((frm.doc.planning_emp_rating == "") | null) {
          frappe.msgprint("Please Rate - Planning");
        } else if ((frm.doc.planning_emp_rating !== "") | null) {
          let row6 = frm.add_child("employee_section_b_table", {
            employee_data: "Planning",
            employee_rating: frm.doc.planning_emp_rating,
            appraisee_comment: frm.doc.planning_emp_comment,
          });
        }
      }
      //Leadership Presence
      if (
        frm.doc.appraisal_category == 1 ||
        frm.doc.appraisal_category == "S1"
      ) {
        if ((frm.doc.leadership_emp_rating == "") | null) {
          frappe.msgprint("Please Rate - Leadership Presence");
        } else if ((frm.doc.leadership_emp_rating !== "") | null) {
          let row7 = frm.add_child("employee_section_b_table", {
            employee_data: "Leadership Presence",
            employee_rating: frm.doc.leadership_emp_rating,
            appraisee_comment: frm.doc.leadership_emp_comments,
          });
        }
      }

      //Humility to learn
      if (
        frm.doc.appraisal_category == 1 ||
        frm.doc.appraisal_category == "S1" ||
        frm.doc.appraisal_category == "S2"
      ) {
        if ((frm.doc.humility_emp_rating == "") | null) {
          frappe.msgprint("Please Rate - Humility to learn");
        } else if ((frm.doc.humility_emp_rating !== "") | null) {
          let row8 = frm.add_child("employee_section_b_table", {
            employee_data: "Humility to learn",
            employee_rating: frm.doc.humility_emp_rating,
            appraisee_comment: frm.doc.humility_emp_comments,
          });
        }
      }

      // Strategic Thinking
      if (frm.doc.appraisal_category == "S1") {
        if ((frm.doc.strategic_emp_rating == "") | null) {
          frappe.msgprint("Please Rate - Strategic Thinking");
        } else if ((frm.doc.strategic_emp_rating !== "") | null) {
          let row9 = frm.add_child("employee_section_b_table", {
            employee_data: "Strategic Thinking",
            employee_rating: frm.doc.strategic_emp_rating,
            appraisee_comment: frm.doc.strategic_emp_comment,
          });
        }
      }

      //Result Orientation
      // if (frm.doc.appraisal_category == 2) {
      //   if ((frm.doc.result_orientation_emp_rating == "") | null) {
      //     frappe.msgprint("Please Rate - Result Orientation");
      //   }
      //   if ((frm.doc.result_orientation_emp_rating !== "") | null) {
      //     let row10 = frm.add_child("employee_section_b_table", {
      //       employee_data: "Result Orientation",
      //       employee_rating: frm.doc.result_orientation_emp_rating,
      //     });
      //   }
      // }

      //Personal & Interpersonal Effectiveness
      if (
        frm.doc.appraisal_category == 2 ||
        frm.doc.appraisal_category == "S2" ||
        frm.doc.appraisal_category == "S3"
      ) {
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
            appraisee_comment: frm.doc.personal_interpersoanl_emp_comment,
          });
        }
      }

      //People Management
      if (frm.doc.appraisal_category == "S1") {
        if ((frm.doc.people_mngmnt_emp_rating == "") | null) {
          frappe.msgprint("Please Rate - People Management");
        } else if ((frm.doc.people_mngmnt_emp_rating !== "") | null) {
          let row12 = frm.add_child("employee_section_b_table", {
            employee_data: "People Management",
            employee_rating: frm.doc.people_mngmnt_emp_rating,
            appraisee_comment: frm.doc.people_mngmnt_emp_comment,
          });
        }
      }
      //Team Work
      if (
        frm.doc.appraisal_category == 2 ||
        frm.doc.appraisal_category == "S3"
      ) {
        if ((frm.doc.team_work_emp_rating == "") | null) {
          frappe.msgprint("Please Rate - Team Work");
        } else if ((frm.doc.team_work_emp_rating !== "") | null) {
          let row13 = frm.add_child("employee_section_b_table", {
            employee_data: "Team Work",
            employee_rating: frm.doc.team_work_emp_rating,
            appraisee_comment: frm.doc.team_work_emp_comment,
          });
        }
      }

      //Initiative
      if (
        frm.doc.appraisal_category == 2 ||
        frm.doc.appraisal_category == "S2" ||
        frm.doc.appraisal_category == "S3"
      ) {
        if ((frm.doc.initiative_emp_rating == "") | null) {
          frappe.msgprint("Please Rate - Initiative");
        } else if ((frm.doc.initiative_emp_rating !== "") | null) {
          let row14 = frm.add_child("employee_section_b_table", {
            employee_data: "Initiative",
            employee_rating: frm.doc.initiative_emp_rating,
            appraisee_comment: frm.doc.initiative_emp_comment,
          });
        }
      }
      //Communication
      if (
        frm.doc.appraisal_category == 2 ||
        frm.doc.appraisal_category == "S2" ||
        frm.doc.appraisal_category == "S3"
      ) {
        if ((frm.doc.communication_emp_rating == "") | null) {
          frappe.msgprint("Please Rate - Communication");
        } else if ((frm.doc.communication_emp_rating !== "") | null) {
          let row15 = frm.add_child("employee_section_b_table", {
            employee_data: "Communication",
            employee_rating: frm.doc.communication_emp_rating,
            appraisee_comment: frm.doc.communication_emp_comment,
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
        let sectionA = parseFloat(frm.doc.overall_rating);
        let sectionB = parseFloat(frm.doc.overall_section_b_rating);

        console.log("Sec A - ", sectionA);
        console.log("Sec B - ", sectionB);

        if (!isNaN(sectionA) && !isNaN(sectionB)) {
          let emp_tot_weights_ranking = ((sectionA + sectionB) / 2).toFixed(2);

          console.log("Total - ", emp_tot_weights_ranking);

          frm.set_value("emp_tot_weight_ranking", emp_tot_weights_ranking);
          console.log(emp_tot_weights_ranking);

          frm.set_value("emp_given_ranking", emp_tot_weights_ranking);
          // Determine status based on ranking range
          let status = "";
          let rank = "";

          if (
            emp_tot_weights_ranking >= 1.0 &&
            emp_tot_weights_ranking <= 1.59
          ) {
            status = "Outstanding";
            rank = "1";
          } else if (
            emp_tot_weights_ranking >= 1.6 &&
            emp_tot_weights_ranking <= 2.59
          ) {
            status = "Exceed Expectations";
            rank = "2";
          } else if (
            emp_tot_weights_ranking >= 2.6 &&
            emp_tot_weights_ranking <= 3.59
          ) {
            status = "Meets Expectations";
            rank = "3";
          } else if (
            emp_tot_weights_ranking >= 3.6 &&
            emp_tot_weights_ranking <= 4.59
          ) {
            status = "Need Improvement";
            rank = "4";
          } else if (
            emp_tot_weights_ranking >= 4.6 &&
            emp_tot_weights_ranking <= 5.0
          ) {
            status = "Poor";
            rank = "5";
          }

          console.log("Rank: ", rank);
          console.log("Status: ", status);

          // Set emp_ranking and emp_status field
          frm.set_value("emp_ranking", rank);
          frm.set_value("emp_status", status);

          // Set emp_given_rank and emp_given_status
          frm.set_value("emp_given_rank", rank);
          frm.set_value("emp_given_status", status);
        } else {
          if (isNaN(sectionA)) {
            frappe.throw("Section A rating is not calculated");
          }
          if (isNaN(sectionB)) {
            frappe.throw("Section B rating is not calculated");
          }
        }
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

          overall_rating = sum_of_rating / frm.doc.emp_kra_table.length;

          frm.set_value("overall_rating", overall_rating);
          frm.set_value("employee_overall_rating", overall_rating.toFixed(2));
          console.log("Sent successfully To Appraiser");
        }
        //*<Calculation logic of Employee Section A>

        if (frm.doc.employee_rating_fetched == "Not-Fetched") {
          cur_frm.clear_table("appraiser_kra_table");
          for (let row of frm.doc.emp_kra_table) {
            let row1 = frm.add_child("appraiser_kra_table", {
              kras: row.kras,
              //weights: row.weights,
              appraisee_comment: row.comm,
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
  // employee_status: function (frm) {
  //   if (frm.doc.employee_status == "Satisfied") {
  //     frm.toggle_display("skip_kra_sec", false);
  //     frm.toggle_display("calculate_skip_rating", false);
  //     frm.toggle_display("emp_skip_msg", true);
  //   } else if (frm.doc.employee_status == "Not-Satisfied") {
  //     frm.toggle_display("skip_kra_sec", true);
  //     frm.toggle_display("calculate_skip_rating", true);
  //     frm.toggle_display("emp_skip_msg", false);
  //   }
  // }, //*</Employee status (Satisfied/Not-Satisfied) to hide /unhide skip section>
  //*-----------------------------------------------------------------------------------------------*//
  //*<Activate SKIP LEVEL if employee not satisfied with manager rating>
  activate_skip: function (frm) {
    let d = new frappe.ui.Dialog({
      title: "Request for SKIP level",
      fields: [
        {
          label: "Please explain, why are you not satisfied?",
          fieldname: "emp_reason",
          reqd: 1,
          fieldtype: "Text",
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

        //cur_frm.save();
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
      let sectionARating = parseFloat(frm.doc.appraiser_overall_rating);
      let sectionBRating = parseFloat(frm.doc.app_sec_b_app_rating);
      console.log("Sec A -", sectionARating);
      console.log("Sec A -", sectionBRating);

      if (!isNaN(sectionARating) && !isNaN(sectionBRating)) {
        let average = ((sectionARating + sectionBRating) / 2).toFixed(2);

        console.log("Total -", average);

        // Set the value of field3 to the calculated average
        frm.set_value("end_app_rating", average);
        // Determine status based on ranking range
        let status = "";
        let rank = "";

        if (average >= 1.0 && average <= 1.59) {
          status = "Outstanding";
          rank = "1";
        } else if (average >= 1.6 && average <= 2.59) {
          status = "Exceed Expectations";
          rank = "2";
        } else if (average >= 2.6 && average <= 3.59) {
          status = "Meets Expectations";
          rank = "3";
        } else if (average >= 3.6 && average <= 4.59) {
          status = "Need Improvement";
          rank = "4";
        } else if (average >= 4.6 && average <= 5.0) {
          status = "Poor";
          rank = "5";
        }

        console.log("Rank: ", rank);
        console.log("Status: ", status);

        // Set emp_ranking and emp_status field
        frm.set_value("emp_app_rank", rank);
        frm.set_value("emp_app_status", status);

        // Set emp_given_rank and emp_given_status
        //frm.set_value("emp_given_rank", rank);
        //frm.set_value("emp_given_status", status);
      } else {
        if (isNaN(sectionARating)) {
          frappe.throw("Section A rating is not calculated");
        }
        if (isNaN(sectionBRating)) {
          frappe.throw("Section B rating is not calculated");
        }
      }
    } else {
      frappe.throw("You don't have enough Permission");
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
            overall_rating = sum_of_rating / frm.doc.skip_kra_table.length;
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
    }
    if (session_emp_user === frm.doc.skip_user) {
      let skip_sectionARating = parseFloat(frm.doc.skip_sec_a_rating);
      let skip_sectionBRating = parseFloat(frm.doc.skip_sec_b_rating);
      console.log(skip_sectionARating);
      console.log(skip_sectionBRating);
      // fetching emp and appraiser values
      frm.set_value("emp_give_rank", frm.doc.emp_ranking);
      frm.set_value("emp_give_status", frm.doc.emp_status);

      frm.set_value("appraiser_given_rank", frm.doc.emp_app_rank);
      frm.set_value("appraiser_given_status", frm.doc.emp_app_status);
      // Calculate the average

      let status = "";
      let rank = "";
      var skip_average = (skip_sectionARating + skip_sectionBRating) / 2;
      skip_average = Number(skip_average).toFixed(2); // Ensure two decimal places
      console.log(skip_average);

      if (skip_average >= 1.0 && skip_average <= 1.59) {
        status = "Outstanding";
        rank = "1";
      } else if (skip_average >= 1.6 && skip_average <= 2.59) {
        status = "Exceed Expectations";
        rank = "2";
      } else if (skip_average >= 2.6 && skip_average <= 3.59) {
        status = "Meets Expectations";
        rank = "3";
      } else if (skip_average >= 3.6 && skip_average <= 4.59) {
        status = "Need Improvement";
        rank = "4";
      } else if (skip_average >= 4.6 && skip_average <= 5.0) {
        status = "Poor";
        rank = "5";
      }
      frm.set_value("emp_skip_rank", rank);
      frm.set_value("emp_skip_status", status);

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
