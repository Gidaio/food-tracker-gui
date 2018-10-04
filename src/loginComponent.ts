import { element } from "./app.js"
import { Component } from "./component.js"

interface LoginRequest {
  username: string
  password: string
}

interface LoginResponse {
  authorization: string
}

export class LoginComponent extends Component {
  protected buildTemplate(): HTMLElement {
    const template = element([
      "form", { id: "login" },
      element(["input", { id: "username", type: "text", placeholder: "Username" }]),
      element(["br"]),
      element(["input", { id: "password", type: "password" }]),
      element(["br"]),
      element(["button", { type: "submit" }, "Login!"])
    ])

    template.addEventListener("submit", this.submitForm.bind(this))

    return template
  }

  private submitForm(event: Event): void {
    event.preventDefault()
    event.stopPropagation()

    const username = this.getElementByID("username").value
    const password = this.getElementByID("password").value

    console.log(`Got username ${username} and password ${password}.`)

    this.login(username, password).then((response) => {
      console.log(response)
      this.datastore.Authorization = response.authorization
      location.hash = "#/ingredients"
    }).catch((error) => {
      console.log(error)
    })
  }

  private async login(username: string, password: string): Promise<LoginResponse> {
    return this.request<LoginRequest, LoginResponse>("POST", "/login", { username, password })
  }
}
