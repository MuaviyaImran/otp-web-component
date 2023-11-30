class OTPInput extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    const template = document.createElement("template");
    template.innerHTML = `
        <style>
        .page-title{
          text-align: center;
          }
          #otpForm {
            display: flex;
          }
          .otpInput {
            width: 150px;
            height: 40px;
            font-size: 18px;
            text-align: center;
            border: none;
            border-bottom: 1px solid #e5e7eb;
            margin: 0 5px;
          }
          .input-container {
            border: 1px solid #76767b;
            border-collapse: collapse;
            padding: 20px 40px;
          }
          .otpInput:focus {
            border-bottom: 1px solid #ffcf25;
            outline: none;
          }
          .verify-btn {
            justify-content: end;
            display: flex;
            margin: 10px 0;
          }
          .verify-btn button {
            cursor: pointer;
            padding: 10px 20px;
            border: none;
            background-color: #ffcf25;
            border-radius: 7px;
          }
          #otp {
            height: 20px;
            display: flex;
            justify-content: center;
            font-weight: 400;
            font-size: 18px;
          }
        </style>
        <section class="main">
        <slot name="page-title" class="page-title">OTP</slot>
          <form id="otpForm">
            <div class="input-container">
              <input type="text" class="otpInput" maxlength="1" inputmode="numeric">
            </div>
            <div class="input-container">
              <input type="text" class="otpInput" maxlength="1" inputmode="numeric">
            </div>
            <div class="input-container">
              <input type="text" class="otpInput" maxlength="1" inputmode="numeric">
            </div>
            <div class="input-container">
              <input type="text" class="otpInput" maxlength="1" inputmode="numeric">
            </div>
          </form>
          <div class="verify-btn">
            <button id="verifyButton">Verify OTP</button>
          </div>
          <div><p id="otp"></p></div>
        </section>
      `;

    shadow.appendChild(template.content.cloneNode(true));

    this.shadowRoot
      .getElementById("verifyButton")
      .addEventListener("click", this.getOTP.bind(this));

    const otpInputs = this.shadowRoot.querySelectorAll(".otpInput");

    otpInputs.forEach((input) => {
      input.addEventListener("input", () => {
        this.focusNext(input);
      });

      input.addEventListener("keydown", (event) => {
        if (event.key === "Backspace" || event.key === "Delete") {
          this.focusPrevious(input);
        } else if (event.key === "ArrowLeft") {
          this.focusPrevious(input);
        } else if (event.key === "ArrowRight") {
          this.focusNext(input);
        }
      });

      input.addEventListener("paste", (e) => {
        e.preventDefault();
        const pastedDigits = e.clipboardData.getData("text");
        if (isNaN(pastedDigits)) {
          input.value = "";
          return;
        }
        if (pastedDigits) {
          for (let i = 0; i < otpInputs.length; i++) {
            const digit = i < pastedDigits.length ? pastedDigits[i] : "";
            otpInputs[i].value = digit;
          }
          otpInputs[otpInputs.length - 1].focus();
        }
      });
    });
  }

  getOTP() {
    const otpInputs = this.shadowRoot.querySelectorAll(".otpInput");
    let otp = "";
    for (let i = 0; i < otpInputs.length; i++) {
      otp += otpInputs[i].value;
    }
    const otpDisplay = this.shadowRoot.getElementById("otp");

    if (otp.length !== 4) {
      otpDisplay.innerHTML = `Entered OTP is not Valid`;
      console.log("OTP: Not Valid");
    } else {
      console.log("OTP:", otp);
      otpDisplay.innerHTML = `One Time Password = ${otp}`;
    }
  }

  focusNext(currentInput) {
    const otpInputs = this.shadowRoot.querySelectorAll(".otpInput");
    const maxLength = parseInt(currentInput.maxLength, 10);
    const currentInputIndex = Array.from(otpInputs).indexOf(currentInput);
    if (isNaN(currentInput.value)) {
      currentInput.value = "";
      return;
    }

    if (currentInput.value.length === maxLength) {
      const nextInput = otpInputs[currentInputIndex + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  focusPrevious(currentInput) {
    const otpInputs = this.shadowRoot.querySelectorAll(".otpInput");
    const currentInputIndex = Array.from(
      currentInput.parentElement.parentElement.children
    ).indexOf(currentInput.parentElement);
    if (currentInput.value.length === 0) {
      const previousInput = otpInputs[currentInputIndex - 1];
      if (previousInput) {
        previousInput.focus();
      }
    }
  }
}

customElements.define("otp-input", OTPInput);
