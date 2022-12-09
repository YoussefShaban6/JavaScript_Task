const container = document.querySelector(".container");

const welcomePage = `
<div class="welcome box center ">
<img src="./imgs/welcome.png" alt="">
<div class="box__content">
<h1>Welcome</h1>
<p>We’re glad you’re here! Enjoy this free prototype made with Anima.</p>
<button class="btn get__started">Get Started</button>
</div>
</div>
`;

const registerPage = `
<div class="signup box center">
<img src="./imgs/signup.png" alt="">
<div class="box__content">
<h1>Create Account</h1>
<p>Go ahead and sign up, let everyone know how awesome you are!</p>
<div class="form">
<div class="username">
<input type="text" min="5" max="15" placeholder="Username" class="user">
</div>
<div class="email">
<input type="email" placeholder="E-mail" class="mail">
</div>
<div class="password">
<input type="password" placeholder="Password" class="pass">
</div>
<div>
<input type="password" placeholder="Confirm password" class="pass">
</div>
<button class="btn register__btn">Create Account</button>
</div>
</div>
</div>
`;

const successfulSignupPage = `
<div class="successful__signup box center">
<img src="./imgs/successfullSginup.png" alt="">
<div class="box__content">
<h1>Successfully Logged In</h1>
<a></a>
</div>
</div>
`;

// Funcitons
const showWelcomePage = () => {
  container.innerHTML = welcomePage;
};

const showRegisterPage = () => {
  container.innerHTML = registerPage;
  const registerBtn = document.querySelector(".register__btn");
  registerBtn.addEventListener("click", checkValidation);
};

const showSuccessfulSignupPage = (email) => {
  container.innerHTML = successfulSignupPage;
  const a = document.querySelector(".box__content a");
  a.setAttribute("href", `mailto:${email}`);
  a.innerHTML = `${email}`;
};

// Start
showWelcomePage();

// Go to register page
const startBtn = document.querySelector(".get__started");
startBtn.addEventListener("click", showRegisterPage);

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

      console.log(warningMessages);

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
