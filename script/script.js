const container = document.querySelector(".container");
const welcomePage = document.querySelector(".welcome");
const signupPage = document.querySelector(".signup");
const successfulSignupPage = document.querySelector(".successful__signup");

// Form validation
const fetchErrors = async (username, email, password, confirmation) => {
  const response = await fetch(
    "https://goldblv.com/api/hiring/tasks/register",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
        password_confirmation: confirmation,
      }),
    }
  );

  let userErrors = [];
  let emailErrors = [];
  let passwordErrors = [];

  if (!response.ok) {
    const response_1 = await response.json();

    userErrors = !response_1.errors.username
      ? []
      : [...response_1.errors.username];

    emailErrors = !response_1.errors.email ? [] : [...response_1.errors.email];

    passwordErrors = !response_1.errors.password
      ? []
      : [...response_1.errors.password];
    // console.log(!userErrors.legnth);
    // console.log(userErrors.length)
  }

  const regex = /(^[^0-9])+\w[^_-]*([a-z]+$)/;
  if (!regex.test(username.trim())) {
    userErrors.push(
      "The username must be only alphanumric and not start or end with a number."
    );
    console.log(userErrors);
  }

  return {
    isValid: response.ok,
    messages: [userErrors, emailErrors, passwordErrors],
  };
};

const checkValidation = () => {
  const username = document.querySelector(".user").value;
  const email = document.querySelector(".mail").value;
  const password = document.querySelectorAll(".pass");
  fetchErrors(username, email, password[0].value, password[1].value).then(
    (res) => {
      const warningMessages = res.messages;
      const isValid = res.isValid;
      const inputs = document.querySelectorAll(".form div");

      inputs.forEach((input) => {
        if (input.children.length > 1) input.removeChild(input.lastChild);
      });


      if (!isValid) {
        warningMessages.forEach((messages, index) => {
          const ul = document.createElement("ul");

          if (messages.length !== 0) {
            messages.forEach((message) => {
              if (inputs[index].children.length === 1) {
                const li = document.createElement("li");
                li.appendChild(document.createTextNode(message));
                ul.appendChild(li);
              }
            });
            ul.classList.add("warning");
            inputs[index].appendChild(ul);
          }
        });
      } else {
        showSuccessfulSignupPage(email);
      }
    }
  );
};


// Funcitons
const showSingupPage = () => {
  welcomePage.classList.add("hide");
  signupPage.classList.remove("hide");
  document
    .querySelector(".register__btn")
    .addEventListener("click", checkValidation);
};

const showSuccessfulSignupPage = (email) => {
  signupPage.classList.add("hide");
  successfulSignupPage.classList.remove("hide");
  const a = document.querySelector(".box__content a");
  a.setAttribute("href", `mailto:${email}`);
  a.innerHTML = `${email}`;
};

// Go to register page
document.querySelector(".get__started").addEventListener("click", showSingupPage);