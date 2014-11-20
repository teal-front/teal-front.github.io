define(function (require, exports, module) {

    $.fn.validateForm = function () {
        var $form = $(this),
            aRequiredSubject = $form.find("[required]").toArray();

        var $passwords = $form.find(":password");
        if ($passwords.length) {
            var oPassword1 = $passwords[0],
                oPassword2 = $passwords[1];
        }

        $form.on("focus", "input:text, input:password", function () {
            var $this = $(this),
                $tip = $this.next(".help-block"),
                $formGroup  = $this.closest(".form-group"),
                emptyText = $tip.attr("tipText-empty");
            $formGroup.addClass("normal");
            $tip.html(emptyText).css("display", "inline-block");
        });

        $form.on("blur", "input:text, input:password", function () {
            var $this = $(this),
                $tip = $this.next(".help-block"),
                $formGroup  = $this.closest(".form-group"),
                value = $.trim(this.value),
                reg = (new Function ("return " + $this.attr("reg")))(),
                errorText = $tip.attr("tipText-error");

            $formGroup.removeClass("normal error");
            if (value == "") {
                $tip.hide();
                $formGroup.validated = false;
            } else if (reg && !reg.test(value)) {
                $formGroup.addClass("error");
                $tip.html(errorText);
                $formGroup[0].validated = false;
            } else {
                $formGroup.removeClass("error");
                $tip.hide();
                $formGroup[0].validated = true;
            }
            if (this.type === "password" && this == oPassword2 && oPassword1.value !== "" && oPassword1.value !== value) {
                $tip.html($tip.attr("tipText-unequal")).css("display", "inline-block");
                $formGroup.addClass("error");
                $formGroup.validated = false;
            }
        });

        $form.on("change", "select", function () {
            var pass= this.value !== "-1";
            if (pass) {
                $(this).siblings(".help-block").hide().closest(".form-group").removeClass("error");
            } else {
                $(this).siblings(".help-block").show().closest(".form-group").addClass("error");
            }
            $(this).closest(".form-group")[0].validated = pass;
        });
        $form.on("click", "fieldset :checkbox, fieldset :radio", function () {
            var $this = $(this),
                $formGroup = $this.closest(".form-group"),
                $siblings = $this.siblings("[type=" + this.type + "]");
            var pass = this.type === "checkbox" ?
                validate_checkbox(this) :
                validate_radio(this);
            if (pass) {
                $(this).siblings(".help-block").hide().closest(".form-group").removeClass("error");
            }
            $formGroup[0].validated = pass;
        });

        $form.on("submit", function () {
            var pass = true;
            $.each(aRequiredSubject, function () {
                var $this = $(this),
                    $fields = $this.find("input:text, input:password, select, input:checkbox"),
                    field = $fields[0],
                    nodeName = field.nodeName,
                    type = field.type;

                if (nodeName === "INPUT" && /text|password/i.test(type)) {
                    if (field.value === "") {
                        var $tip = $fields.siblings(".help-block"), $formGroup = $fields.closest(".form-group");
                        $tip.html($tip.attr("tipText-empty")).css("display", "inline-block");
                        $formGroup.addClass("error");
                        $formGroup.validated = false;
                    } else {
                        $fields.trigger("blur");
                    }
                } else if ((nodeName === "SELECT" )) {//&& field.value === "-1"
                    if (field.value == "-1") {
                        $fields.trigger("change");
                    } else {
                        this.validated = true;
                    }
                } else if ((nodeName === "INPUT" && /checkbox/i.test(type) && !validate_checkbox(field)) ||
                    (nodeName === "INPUT" && /radio/i.test(type) && !validate_radio(field))) {
                    $(field).siblings(".help-block").css("display", "inline-block").html($(field).siblings(".help-block").attr("tipText-empty"))
                        .closest(".form-group").addClass("error");
                } else {
                    $(field).siblings(".help-block").hide().closest(".form-group").removeClass("error");
                }
            });
            $.each(aRequiredSubject, function () {
                if (!this.validated) {console.log(this);
                    $(window).scrollTop($(this).offset().top);
                    pass = false;
                    return false;
                }
            });
            if (pass && !$("#protocol")[0].checked) {alert("您还未同意《天天禾本用户注册协议》");return false;}
            return pass;
        });

        if ($("[name=account]").length) {
            $("[name=account]").blur(function () {
                var value = this.value,
                    email_reg = /^[\w\-\.]+@[\w\.-]+\.[a-zA-Z]{2,6}$/,
                    phone_reg = /^0?1[3-9]\d{9}$/,
                    account_reg = /^[a-zA-Z]\w{5,19}$/;
                var oType = $("[name=register-type]")[0];
                if (email_reg.test(value)) {
                    oType.value = "email";
                } else if (phone_reg.test(value)) {
                    oType.value = "phone";
                } else if (account_reg.test(value)) {
                    oType.value = "account";
                }
            });
        }


        //-------helpers
        function validate_checkbox (ele) {
            var cPass = false;
            $.each(ele.form.elements[ele.name], function () {
                if (this.checked) {
                    cPass = true;
                    return false;
                }
            });
            return cPass;
        }

        function validate_radio (ele) {
            var pass = true;
            if (ele.form.elements[ele.name].value == "") {
                pass = false;
            }
            return pass;
        }
    };

    return $;
});