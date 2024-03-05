// Copyright (c) 2023, Talib Sheikh and contributors
// For license information, please see license.txt

frappe.ui.form.on("Sahayog Survey", {
  check_validation: function (frm) {
    var blankFields = [];

    if (!frm.doc.first_response) {
      blankFields.push("First Response");
    }
    if (!frm.doc.second_response) {
      blankFields.push("Second Response");
    }
    if (!frm.doc.third_response) {
      blankFields.push("Third Response");
    }
    if (!frm.doc.fourth_response) {
      blankFields.push("Fourth Response");
    }
    if (!frm.doc.fifth_response) {
      blankFields.push("Fifth Response");
    }
    if (!frm.doc.sixth_response) {
      blankFields.push("Sixth Response");
    }
    if (!frm.doc.seventh_response) {
      blankFields.push("Seventh Response");
    }
    if (!frm.doc.eighth_response) {
      blankFields.push("Eighth Response");
    }
    if (!frm.doc.ninth_response) {
      blankFields.push("Ninth Response");
    }

    if (blankFields.length > 0) {
      var message = "";

      for (var i = 0; i < blankFields.length; i++) {
        message +=
          "<span style='color:red'>❗</span> " + blankFields[i] + "<br>";
      }

      frappe.msgprint({
        title: "Please Fill Survey Properly",
        message: message,
      });
      frappe.validated = false; // Prevent saving the form
    } else {
      let d = new frappe.ui.Dialog({
        title:
          "<b>Do you want to share your Personal Details with this Survey Form?</b>",
        fields: [
          {
            label: "Yes",
            fieldname: "shared_yes",
            fieldtype: "Check",
            onchange: () => {
              if (d.get_value("shared_yes")) {
                d.set_value("shared_no", 0);
              }
            },
          },
          {
            label: "No",
            fieldname: "shared_no",
            fieldtype: "Check",
            onchange: () => {
              if (d.get_value("shared_no")) {
                d.set_value("shared_yes", 0);
              }
            },
          },
        ],
        primary_action_label: "Submit",
        primary_action(values) {
          console.log(values);

          // Set the values in the form (frm) based on the selected options
          if (values.shared_yes) {
            frm.set_value("shared", "Yes");
          } else if (values.shared_no) {
            frm.set_value("shared", "No");
          }
          cur_frm.save();
          d.hide();
        },
      });

      d.show();
      //
    }
  },
  refresh: function (frm) {
    if (frm.doc.shared) {
      frm.set_read_only();
      frm.disable_form();
      frm.disable_save();
    }
    frm.disable_save();
    let user = frappe.session.user;
    frm.set_value("survey_period", "June");
    console.log("Logged-in-user = " + user);

    if (frm.is_new()) {
      let eid = user.match(/\d+/)[0];
      frm.set_value("employee_id", eid);
      console.log("ID SET");

      //<Set Survey Period>
      frm.set_value("survey_period", "June");
      //</Set Survey Period>

      frm.add_custom_button(__("Submit"), function () {
        frm.trigger("check_validation");
      });
    }
  },

  // <First Radio Button>------------------------------------------
  first_check_agree: function (frm) {
    if (frm.doc.first_check_agree) {
      frm.set_value("first_response", "Agree");
      frm.doc.first_check_somewhat_agree = false;
      frm.doc.first_check_neutral = false;
      frm.doc.first_check_somewhat_disagree = false;
      frm.doc.first_check_disagree = false;
    } else {
      frm.set_value("first_response", null);
    }
    frm.refresh_field("first_check_somewhat_agree");
    frm.refresh_field("first_check_neutral");
    frm.refresh_field("first_check_somewhat_disagree");
    frm.refresh_field("first_check_disagree");
  },

  first_check_somewhat_agree: function (frm) {
    if (frm.doc.first_check_somewhat_agree) {
      frm.set_value("first_response", "Somewhat agree");
      frm.doc.first_check_agree = false;
      frm.doc.first_check_neutral = false;
      frm.doc.first_check_somewhat_disagree = false;
      frm.doc.first_check_disagree = false;
    } else {
      frm.set_value("first_response", null);
    }
    frm.refresh_field("first_check_agree");
    frm.refresh_field("first_check_neutral");
    frm.refresh_field("first_check_somewhat_disagree");
    frm.refresh_field("first_check_disagree");
  },

  first_check_neutral: function (frm) {
    if (frm.doc.first_check_neutral) {
      frm.set_value("first_response", "Neutral");
      frm.doc.first_check_agree = false;
      frm.doc.first_check_somewhat_agree = false;
      frm.doc.first_check_somewhat_disagree = false;
      frm.doc.first_check_disagree = false;
    } else {
      frm.set_value("first_response", null);
    }
    frm.refresh_field("first_check_agree");
    frm.refresh_field("first_check_somewhat_agree");
    frm.refresh_field("first_check_somewhat_disagree");
    frm.refresh_field("first_check_disagree");
  },

  first_check_somewhat_disagree: function (frm) {
    if (frm.doc.first_check_somewhat_disagree) {
      frm.set_value("first_response", "Somewhat disagree");
      frm.doc.first_check_agree = false;
      frm.doc.first_check_somewhat_agree = false;
      frm.doc.first_check_neutral = false;
      frm.doc.first_check_disagree = false;
    } else {
      frm.set_value("first_response", null);
    }
    frm.refresh_field("first_check_agree");
    frm.refresh_field("first_check_somewhat_agree");
    frm.refresh_field("first_check_neutral");
    frm.refresh_field("first_check_disagree");
  },

  first_check_disagree: function (frm) {
    if (frm.doc.first_check_disagree) {
      frm.set_value("first_response", "Disagree");
      frm.doc.first_check_agree = false;
      frm.doc.first_check_somewhat_agree = false;
      frm.doc.first_check_neutral = false;
      frm.doc.first_check_somewhat_disagree = false;
    } else {
      frm.set_value("first_response", null);
    }
    frm.refresh_field("first_check_agree");
    frm.refresh_field("first_check_somewhat_agree");
    frm.refresh_field("first_check_neutral");
    frm.refresh_field("first_check_somewhat_disagree");
  },
  // </First Radio Button>------------------------------------------

  // <Second Radio Button>------------------------------------------
  second_check_agree: function (frm) {
    if (frm.doc.second_check_agree) {
      frm.set_value("second_response", "Agree");
      frm.doc.second_check_somewhat_agree = false;
      frm.doc.second_check_neutral = false;
      frm.doc.second_check_somewhat_disagree = false;
      frm.doc.second_check_disagree = false;
    } else {
      frm.set_value("second_response", null);
    }
    frm.refresh_field("second_check_somewhat_agree");
    frm.refresh_field("second_check_neutral");
    frm.refresh_field("second_check_somewhat_disagree");
    frm.refresh_field("second_check_disagree");
  },

  second_check_somewhat_agree: function (frm) {
    if (frm.doc.second_check_somewhat_agree) {
      frm.set_value("second_response", "Somewhat agree");
      frm.doc.second_check_agree = false;
      frm.doc.second_check_neutral = false;
      frm.doc.second_check_somewhat_disagree = false;
      frm.doc.second_check_disagree = false;
    } else {
      frm.set_value("second_response", null);
    }
    frm.refresh_field("second_check_agree");
    frm.refresh_field("second_check_neutral");
    frm.refresh_field("second_check_somewhat_disagree");
    frm.refresh_field("second_check_disagree");
  },

  second_check_neutral: function (frm) {
    if (frm.doc.second_check_neutral) {
      frm.set_value("second_response", "Neutral");
      frm.doc.second_check_agree = false;
      frm.doc.second_check_somewhat_agree = false;
      frm.doc.second_check_somewhat_disagree = false;
      frm.doc.second_check_disagree = false;
    } else {
      frm.set_value("second_response", null);
    }
    frm.refresh_field("second_check_agree");
    frm.refresh_field("second_check_somewhat_agree");
    frm.refresh_field("second_check_somewhat_disagree");
    frm.refresh_field("second_check_disagree");
  },

  second_check_somewhat_disagree: function (frm) {
    if (frm.doc.second_check_somewhat_disagree) {
      frm.set_value("second_response", "Somewhat disagree");
      frm.doc.second_check_agree = false;
      frm.doc.second_check_somewhat_agree = false;
      frm.doc.second_check_neutral = false;
      frm.doc.second_check_disagree = false;
    } else {
      frm.set_value("second_response", null);
    }
    frm.refresh_field("second_check_agree");
    frm.refresh_field("second_check_somewhat_agree");
    frm.refresh_field("second_check_neutral");
    frm.refresh_field("second_check_disagree");
  },

  second_check_disagree: function (frm) {
    if (frm.doc.second_check_disagree) {
      frm.set_value("second_response", "Disagree");
      frm.doc.second_check_agree = false;
      frm.doc.second_check_somewhat_agree = false;
      frm.doc.second_check_neutral = false;
      frm.doc.second_check_somewhat_disagree = false;
    } else {
      frm.set_value("second_response", null);
    }
    frm.refresh_field("second_check_agree");
    frm.refresh_field("second_check_somewhat_agree");
    frm.refresh_field("second_check_neutral");
    frm.refresh_field("second_check_somewhat_disagree");
  },
  // </Second Radio Button>------------------------------------------

  //<Third Radio Button>------------------------------------------
  third_check_agree: function (frm) {
    if (frm.doc.third_check_agree) {
      frm.set_value("third_response", "Agree");
      frm.doc.third_check_somewhat_agree = false;
      frm.doc.third_check_neutral = false;
      frm.doc.third_check_somewhat_disagree = false;
      frm.doc.third_check_disagree = false;
    } else {
      frm.set_value("third_response", null);
    }
    frm.refresh_field("third_check_somewhat_agree");
    frm.refresh_field("third_check_neutral");
    frm.refresh_field("third_check_somewhat_disagree");
    frm.refresh_field("third_check_disagree");
  },

  third_check_somewhat_agree: function (frm) {
    if (frm.doc.third_check_somewhat_agree) {
      frm.set_value("third_response", "Somewhat agree");
      frm.doc.third_check_agree = false;
      frm.doc.third_check_neutral = false;
      frm.doc.third_check_somewhat_disagree = false;
      frm.doc.third_check_disagree = false;
    } else {
      frm.set_value("third_response", null);
    }
    frm.refresh_field("third_check_agree");
    frm.refresh_field("third_check_neutral");
    frm.refresh_field("third_check_somewhat_disagree");
    frm.refresh_field("third_check_disagree");
  },

  third_check_neutral: function (frm) {
    if (frm.doc.third_check_neutral) {
      frm.set_value("third_response", "Neutral");
      frm.doc.third_check_agree = false;
      frm.doc.third_check_somewhat_agree = false;
      frm.doc.third_check_somewhat_disagree = false;
      frm.doc.third_check_disagree = false;
    } else {
      frm.set_value("third_response", null);
    }
    frm.refresh_field("third_check_agree");
    frm.refresh_field("third_check_somewhat_agree");
    frm.refresh_field("third_check_somewhat_disagree");
    frm.refresh_field("third_check_disagree");
  },

  third_check_somewhat_disagree: function (frm) {
    if (frm.doc.third_check_somewhat_disagree) {
      frm.set_value("third_response", "Somewhat disagree");
      frm.doc.third_check_agree = false;
      frm.doc.third_check_somewhat_agree = false;
      frm.doc.third_check_neutral = false;
      frm.doc.third_check_disagree = false;
    } else {
      frm.set_value("third_response", null);
    }
    frm.refresh_field("third_check_agree");
    frm.refresh_field("third_check_somewhat_agree");
    frm.refresh_field("third_check_neutral");
    frm.refresh_field("third_check_disagree");
  },

  third_check_disagree: function (frm) {
    if (frm.doc.third_check_disagree) {
      frm.set_value("third_response", "Disagree");
      frm.doc.third_check_agree = false;
      frm.doc.third_check_somewhat_agree = false;
      frm.doc.third_check_neutral = false;
      frm.doc.third_check_somewhat_disagree = false;
    } else {
      frm.set_value("third_response", null);
    }
    frm.refresh_field("third_check_agree");
    frm.refresh_field("third_check_somewhat_agree");
    frm.refresh_field("third_check_neutral");
    frm.refresh_field("third_check_somewhat_disagree");
  },
  //</Third Radio Button>------------------------------------------

  //<Fourth Radio Button>------------------------------------------
  fourth_check_agree: function (frm) {
    if (frm.doc.fourth_check_agree) {
      frm.set_value("fourth_response", "Agree");
      frm.doc.fourth_check_somewhat_agree = false;
      frm.doc.fourth_check_neutral = false;
      frm.doc.fourth_check_somewhat_disagree = false;
      frm.doc.fourth_check_disagree = false;
    } else {
      frm.set_value("fourth_response", null);
    }
    frm.refresh_field("fourth_check_somewhat_agree");
    frm.refresh_field("fourth_check_neutral");
    frm.refresh_field("fourth_check_somewhat_disagree");
    frm.refresh_field("fourth_check_disagree");
  },

  fourth_check_somewhat_agree: function (frm) {
    if (frm.doc.fourth_check_somewhat_agree) {
      frm.set_value("fourth_response", "Somewhat agree");
      frm.doc.fourth_check_agree = false;
      frm.doc.fourth_check_neutral = false;
      frm.doc.fourth_check_somewhat_disagree = false;
      frm.doc.fourth_check_disagree = false;
    } else {
      frm.set_value("fourth_response", null);
    }
    frm.refresh_field("fourth_check_agree");
    frm.refresh_field("fourth_check_neutral");
    frm.refresh_field("fourth_check_somewhat_disagree");
    frm.refresh_field("fourth_check_disagree");
  },

  fourth_check_neutral: function (frm) {
    if (frm.doc.fourth_check_neutral) {
      frm.set_value("fourth_response", "Neutral");
      frm.doc.fourth_check_agree = false;
      frm.doc.fourth_check_somewhat_agree = false;
      frm.doc.fourth_check_somewhat_disagree = false;
      frm.doc.fourth_check_disagree = false;
    } else {
      frm.set_value("fourth_response", null);
    }
    frm.refresh_field("fourth_check_agree");
    frm.refresh_field("fourth_check_somewhat_agree");
    frm.refresh_field("fourth_check_somewhat_disagree");
    frm.refresh_field("fourth_check_disagree");
  },

  fourth_check_somewhat_disagree: function (frm) {
    if (frm.doc.fourth_check_somewhat_disagree) {
      frm.set_value("fourth_response", "Somewhat disagree");
      frm.doc.fourth_check_agree = false;
      frm.doc.fourth_check_somewhat_agree = false;
      frm.doc.fourth_check_neutral = false;
      frm.doc.fourth_check_disagree = false;
    } else {
      frm.set_value("fourth_response", null);
    }
    frm.refresh_field("fourth_check_agree");
    frm.refresh_field("fourth_check_somewhat_agree");
    frm.refresh_field("fourth_check_neutral");
    frm.refresh_field("fourth_check_disagree");
  },

  fourth_check_disagree: function (frm) {
    if (frm.doc.fourth_check_disagree) {
      frm.set_value("fourth_response", "Disagree");
      frm.doc.fourth_check_agree = false;
      frm.doc.fourth_check_somewhat_agree = false;
      frm.doc.fourth_check_neutral = false;
      frm.doc.fourth_check_somewhat_disagree = false;
    } else {
      frm.set_value("fourth_response", null);
    }
    frm.refresh_field("fourth_check_agree");
    frm.refresh_field("fourth_check_somewhat_agree");
    frm.refresh_field("fourth_check_neutral");
    frm.refresh_field("fourth_check_somewhat_disagree");
  },
  //</Fourth Radio Button>------------------------------------------

  //<Fifth Radio Button>------------------------------------------
  fifth_check_agree: function (frm) {
    if (frm.doc.fifth_check_agree) {
      frm.set_value("fifth_response", "Agree");
      frm.doc.fifth_check_somewhat_agree = false;
      frm.doc.fifth_check_neutral = false;
      frm.doc.fifth_check_somewhat_disagree = false;
      frm.doc.fifth_check_disagree = false;
    } else {
      frm.set_value("fifth_response", null);
    }
    frm.refresh_field("fifth_check_somewhat_agree");
    frm.refresh_field("fifth_check_neutral");
    frm.refresh_field("fifth_check_somewhat_disagree");
    frm.refresh_field("fifth_check_disagree");
  },

  fifth_check_somewhat_agree: function (frm) {
    if (frm.doc.fifth_check_somewhat_agree) {
      frm.set_value("fifth_response", "Somewhat agree");
      frm.doc.fifth_check_agree = false;
      frm.doc.fifth_check_neutral = false;
      frm.doc.fifth_check_somewhat_disagree = false;
      frm.doc.fifth_check_disagree = false;
    } else {
      frm.set_value("fifth_response", null);
    }
    frm.refresh_field("fifth_check_agree");
    frm.refresh_field("fifth_check_neutral");
    frm.refresh_field("fifth_check_somewhat_disagree");
    frm.refresh_field("fifth_check_disagree");
  },

  fifth_check_neutral: function (frm) {
    if (frm.doc.fifth_check_neutral) {
      frm.set_value("fifth_response", "Neutral");
      frm.doc.fifth_check_agree = false;
      frm.doc.fifth_check_somewhat_agree = false;
      frm.doc.fifth_check_somewhat_disagree = false;
      frm.doc.fifth_check_disagree = false;
    } else {
      frm.set_value("fifth_response", null);
    }
    frm.refresh_field("fifth_check_agree");
    frm.refresh_field("fifth_check_somewhat_agree");
    frm.refresh_field("fifth_check_somewhat_disagree");
    frm.refresh_field("fifth_check_disagree");
  },

  fifth_check_somewhat_disagree: function (frm) {
    if (frm.doc.fifth_check_somewhat_disagree) {
      frm.set_value("fifth_response", "Somewhat disagree");
      frm.doc.fifth_check_agree = false;
      frm.doc.fifth_check_somewhat_agree = false;
      frm.doc.fifth_check_neutral = false;
      frm.doc.fifth_check_disagree = false;
    } else {
      frm.set_value("fifth_response", null);
    }
    frm.refresh_field("fifth_check_agree");
    frm.refresh_field("fifth_check_somewhat_agree");
    frm.refresh_field("fifth_check_neutral");
    frm.refresh_field("fifth_check_disagree");
  },

  fifth_check_disagree: function (frm) {
    if (frm.doc.fifth_check_disagree) {
      frm.set_value("fifth_response", "Disagree");
      frm.doc.fifth_check_agree = false;
      frm.doc.fifth_check_somewhat_agree = false;
      frm.doc.fifth_check_neutral = false;
      frm.doc.fifth_check_somewhat_disagree = false;
    } else {
      frm.set_value("fifth_response", null);
    }
    frm.refresh_field("fifth_check_agree");
    frm.refresh_field("fifth_check_somewhat_agree");
    frm.refresh_field("fifth_check_neutral");
    frm.refresh_field("fifth_check_somewhat_disagree");
  },
  //</Fifth Radio Button>------------------------------------------
  //<Sixth Radio Button>------------------------------------------
  sixth_check_agree: function (frm) {
    if (frm.doc.sixth_check_agree) {
      frm.set_value("sixth_response", "Agree");
      frm.doc.sixth_check_somewhat_agree = false;
      frm.doc.sixth_check_neutral = false;
      frm.doc.sixth_check_somewhat_disagree = false;
      frm.doc.sixth_check_disagree = false;
    } else {
      frm.set_value("sixth_response", null);
    }
    frm.refresh_field("sixth_check_somewhat_agree");
    frm.refresh_field("sixth_check_neutral");
    frm.refresh_field("sixth_check_somewhat_disagree");
    frm.refresh_field("sixth_check_disagree");
  },

  sixth_check_somewhat_agree: function (frm) {
    if (frm.doc.sixth_check_somewhat_agree) {
      frm.set_value("sixth_response", "Somewhat agree");
      frm.doc.sixth_check_agree = false;
      frm.doc.sixth_check_neutral = false;
      frm.doc.sixth_check_somewhat_disagree = false;
      frm.doc.sixth_check_disagree = false;
    } else {
      frm.set_value("sixth_response", null);
    }
    frm.refresh_field("sixth_check_agree");
    frm.refresh_field("sixth_check_neutral");
    frm.refresh_field("sixth_check_somewhat_disagree");
    frm.refresh_field("sixth_check_disagree");
  },

  sixth_check_neutral: function (frm) {
    if (frm.doc.sixth_check_neutral) {
      frm.set_value("sixth_response", "Neutral");
      frm.doc.sixth_check_agree = false;
      frm.doc.sixth_check_somewhat_agree = false;
      frm.doc.sixth_check_somewhat_disagree = false;
      frm.doc.sixth_check_disagree = false;
    } else {
      frm.set_value("sixth_response", null);
    }
    frm.refresh_field("sixth_check_agree");
    frm.refresh_field("sixth_check_somewhat_agree");
    frm.refresh_field("sixth_check_somewhat_disagree");
    frm.refresh_field("sixth_check_disagree");
  },

  sixth_check_somewhat_disagree: function (frm) {
    if (frm.doc.sixth_check_somewhat_disagree) {
      frm.set_value("sixth_response", "Somewhat disagree");
      frm.doc.sixth_check_agree = false;
      frm.doc.sixth_check_somewhat_agree = false;
      frm.doc.sixth_check_neutral = false;
      frm.doc.sixth_check_disagree = false;
    } else {
      frm.set_value("sixth_response", null);
    }
    frm.refresh_field("sixth_check_agree");
    frm.refresh_field("sixth_check_somewhat_agree");
    frm.refresh_field("sixth_check_neutral");
    frm.refresh_field("sixth_check_disagree");
  },

  sixth_check_disagree: function (frm) {
    if (frm.doc.sixth_check_disagree) {
      frm.set_value("sixth_response", "Disagree");
      frm.doc.sixth_check_agree = false;
      frm.doc.sixth_check_somewhat_agree = false;
      frm.doc.sixth_check_neutral = false;
      frm.doc.sixth_check_somewhat_disagree = false;
    } else {
      frm.set_value("sixth_response", null);
    }
    frm.refresh_field("sixth_check_agree");
    frm.refresh_field("sixth_check_somewhat_agree");
    frm.refresh_field("sixth_check_neutral");
    frm.refresh_field("sixth_check_somewhat_disagree");
  },
  //</Sixth Radio Button>------------------------------------------

  //<Seventh Radio Button>------------------------------------------
  seventh_check_agree: function (frm) {
    if (frm.doc.seventh_check_agree) {
      frm.set_value("seventh_response", "Agree");
      frm.doc.seventh_check_somewhat_agree = false;
      frm.doc.seventh_check_neutral = false;
      frm.doc.seventh_check_somewhat_disagree = false;
      frm.doc.seventh_check_disagree = false;
    } else {
      frm.set_value("seventh_response", null);
    }
    frm.refresh_field("seventh_check_somewhat_agree");
    frm.refresh_field("seventh_check_neutral");
    frm.refresh_field("seventh_check_somewhat_disagree");
    frm.refresh_field("seventh_check_disagree");
  },

  seventh_check_somewhat_agree: function (frm) {
    if (frm.doc.seventh_check_somewhat_agree) {
      frm.set_value("seventh_response", "Somewhat agree");
      frm.doc.seventh_check_agree = false;
      frm.doc.seventh_check_neutral = false;
      frm.doc.seventh_check_somewhat_disagree = false;
      frm.doc.seventh_check_disagree = false;
    } else {
      frm.set_value("seventh_response", null);
    }
    frm.refresh_field("seventh_check_agree");
    frm.refresh_field("seventh_check_neutral");
    frm.refresh_field("seventh_check_somewhat_disagree");
    frm.refresh_field("seventh_check_disagree");
  },

  seventh_check_neutral: function (frm) {
    if (frm.doc.seventh_check_neutral) {
      frm.set_value("seventh_response", "Neutral");
      frm.doc.seventh_check_agree = false;
      frm.doc.seventh_check_somewhat_agree = false;
      frm.doc.seventh_check_somewhat_disagree = false;
      frm.doc.seventh_check_disagree = false;
    } else {
      frm.set_value("seventh_response", null);
    }
    frm.refresh_field("seventh_check_agree");
    frm.refresh_field("seventh_check_somewhat_agree");
    frm.refresh_field("seventh_check_somewhat_disagree");
    frm.refresh_field("seventh_check_disagree");
  },

  seventh_check_somewhat_disagree: function (frm) {
    if (frm.doc.seventh_check_somewhat_disagree) {
      frm.set_value("seventh_response", "Somewhat disagree");
      frm.doc.seventh_check_agree = false;
      frm.doc.seventh_check_somewhat_agree = false;
      frm.doc.seventh_check_neutral = false;
      frm.doc.seventh_check_disagree = false;
    } else {
      frm.set_value("seventh_response", null);
    }
    frm.refresh_field("seventh_check_agree");
    frm.refresh_field("seventh_check_somewhat_agree");
    frm.refresh_field("seventh_check_neutral");
    frm.refresh_field("seventh_check_disagree");
  },

  seventh_check_disagree: function (frm) {
    if (frm.doc.seventh_check_disagree) {
      frm.set_value("seventh_response", "Disagree");
      frm.doc.seventh_check_agree = false;
      frm.doc.seventh_check_somewhat_agree = false;
      frm.doc.seventh_check_neutral = false;
      frm.doc.seventh_check_somewhat_disagree = false;
    } else {
      frm.set_value("seventh_response", null);
    }
    frm.refresh_field("seventh_check_agree");
    frm.refresh_field("seventh_check_somewhat_agree");
    frm.refresh_field("seventh_check_neutral");
    frm.refresh_field("seventh_check_somewhat_disagree");
  },
  //</Seventh Radio Button>------------------------------------------

  //<Eighth Radio Button>------------------------------------------
  eighth_check_agree: function (frm) {
    if (frm.doc.eighth_check_agree) {
      frm.set_value("eighth_response", "Agree");
      frm.doc.eighth_check_somewhat_agree = false;
      frm.doc.eighth_check_neutral = false;
      frm.doc.eighth_check_somewhat_disagree = false;
      frm.doc.eighth_check_disagree = false;
    } else {
      frm.set_value("eighth_response", null);
    }
    frm.refresh_field("eighth_check_somewhat_agree");
    frm.refresh_field("eighth_check_neutral");
    frm.refresh_field("eighth_check_somewhat_disagree");
    frm.refresh_field("eighth_check_disagree");
  },

  eighth_check_somewhat_agree: function (frm) {
    if (frm.doc.eighth_check_somewhat_agree) {
      frm.set_value("eighth_response", "Somewhat agree");
      frm.doc.eighth_check_agree = false;
      frm.doc.eighth_check_neutral = false;
      frm.doc.eighth_check_somewhat_disagree = false;
      frm.doc.eighth_check_disagree = false;
    } else {
      frm.set_value("eighth_response", null);
    }
    frm.refresh_field("eighth_check_agree");
    frm.refresh_field("eighth_check_neutral");
    frm.refresh_field("eighth_check_somewhat_disagree");
    frm.refresh_field("eighth_check_disagree");
  },

  eighth_check_neutral: function (frm) {
    if (frm.doc.eighth_check_neutral) {
      frm.set_value("eighth_response", "Neutral");
      frm.doc.eighth_check_agree = false;
      frm.doc.eighth_check_somewhat_agree = false;
      frm.doc.eighth_check_somewhat_disagree = false;
      frm.doc.eighth_check_disagree = false;
    } else {
      frm.set_value("eighth_response", null);
    }
    frm.refresh_field("eighth_check_agree");
    frm.refresh_field("eighth_check_somewhat_agree");
    frm.refresh_field("eighth_check_somewhat_disagree");
    frm.refresh_field("eighth_check_disagree");
  },

  eighth_check_somewhat_disagree: function (frm) {
    if (frm.doc.eighth_check_somewhat_disagree) {
      frm.set_value("eighth_response", "Somewhat disagree");
      frm.doc.eighth_check_agree = false;
      frm.doc.eighth_check_somewhat_agree = false;
      frm.doc.eighth_check_neutral = false;
      frm.doc.eighth_check_disagree = false;
    } else {
      frm.set_value("eighth_response", null);
    }
    frm.refresh_field("eighth_check_agree");
    frm.refresh_field("eighth_check_somewhat_agree");
    frm.refresh_field("eighth_check_neutral");
    frm.refresh_field("eighth_check_disagree");
  },

  eighth_check_disagree: function (frm) {
    if (frm.doc.eighth_check_disagree) {
      frm.set_value("eighth_response", "Disagree");
      frm.doc.eighth_check_agree = false;
      frm.doc.eighth_check_somewhat_agree = false;
      frm.doc.eighth_check_neutral = false;
      frm.doc.eighth_check_somewhat_disagree = false;
    } else {
      frm.set_value("eighth_response", null);
    }
    frm.refresh_field("eighth_check_agree");
    frm.refresh_field("eighth_check_somewhat_agree");
    frm.refresh_field("eighth_check_neutral");
    frm.refresh_field("eighth_check_somewhat_disagree");
  },
  //</Eighth Radio Button>------------------------------------------

  //<Ninth Radio Button>------------------------------------------
  ninth_check_agree: function (frm) {
    if (frm.doc.ninth_check_agree) {
      frm.set_value("ninth_response", "Agree");
      frm.doc.ninth_check_somewhat_agree = false;
      frm.doc.ninth_check_neutral = false;
      frm.doc.ninth_check_somewhat_disagree = false;
      frm.doc.ninth_check_disagree = false;
    } else {
      frm.set_value("ninth_response", null);
    }
    frm.refresh_field("ninth_check_somewhat_agree");
    frm.refresh_field("ninth_check_neutral");
    frm.refresh_field("ninth_check_somewhat_disagree");
    frm.refresh_field("ninth_check_disagree");
  },

  ninth_check_somewhat_agree: function (frm) {
    if (frm.doc.ninth_check_somewhat_agree) {
      frm.set_value("ninth_response", "Somewhat agree");
      frm.doc.ninth_check_agree = false;
      frm.doc.ninth_check_neutral = false;
      frm.doc.ninth_check_somewhat_disagree = false;
      frm.doc.ninth_check_disagree = false;
    } else {
      frm.set_value("ninth_response", null);
    }
    frm.refresh_field("ninth_check_agree");
    frm.refresh_field("ninth_check_neutral");
    frm.refresh_field("ninth_check_somewhat_disagree");
    frm.refresh_field("ninth_check_disagree");
  },

  ninth_check_neutral: function (frm) {
    if (frm.doc.ninth_check_neutral) {
      frm.set_value("ninth_response", "Neutral");
      frm.doc.ninth_check_agree = false;
      frm.doc.ninth_check_somewhat_agree = false;
      frm.doc.ninth_check_somewhat_disagree = false;
      frm.doc.ninth_check_disagree = false;
    } else {
      frm.set_value("ninth_response", null);
    }
    frm.refresh_field("ninth_check_agree");
    frm.refresh_field("ninth_check_somewhat_agree");
    frm.refresh_field("ninth_check_somewhat_disagree");
    frm.refresh_field("ninth_check_disagree");
  },

  ninth_check_somewhat_disagree: function (frm) {
    if (frm.doc.ninth_check_somewhat_disagree) {
      frm.set_value("ninth_response", "Somewhat disagree");
      frm.doc.ninth_check_agree = false;
      frm.doc.ninth_check_somewhat_agree = false;
      frm.doc.ninth_check_neutral = false;
      frm.doc.ninth_check_disagree = false;
    } else {
      frm.set_value("ninth_response", null);
    }
    frm.refresh_field("ninth_check_agree");
    frm.refresh_field("ninth_check_somewhat_agree");
    frm.refresh_field("ninth_check_neutral");
    frm.refresh_field("ninth_check_disagree");
  },

  ninth_check_disagree: function (frm) {
    if (frm.doc.ninth_check_disagree) {
      frm.set_value("ninth_response", "Disagree");
      frm.doc.ninth_check_agree = false;
      frm.doc.ninth_check_somewhat_agree = false;
      frm.doc.ninth_check_neutral = false;
      frm.doc.ninth_check_somewhat_disagree = false;
    } else {
      frm.set_value("ninth_response", null);
    }
    frm.refresh_field("ninth_check_agree");
    frm.refresh_field("ninth_check_somewhat_agree");
    frm.refresh_field("ninth_check_neutral");
    frm.refresh_field("ninth_check_somewhat_disagree");
  },
  //</Ninth Radio Button>------------------------------------------
});
