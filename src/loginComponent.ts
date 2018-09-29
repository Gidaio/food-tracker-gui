import { element } from "./app.js"
import { Component } from "./component.js"
import { Datastore } from "./datastore.js"

interface LoginRequest {
  username: string
  password: string
}

interface LoginResponse {
  authorization: string
}

export class LoginComponent extends Component {
  protected readonly template: HTMLElement = element([
    "form", { id: "login" },
    element(["input", { id: "username", type: "text", placeholder: "Username" }]),
    element(["br"]),
    element(["input", { id: "password", type: "password" }]),
    element(["br"]),
    element(["button", { type: "submit" }, "Login!"])
  ])

  public constructor(datastore: Datastore) {
    super(datastore)
    this.template.addEventListener("submit", this.submitForm.bind(this))
  }

  private submitForm(event: Event): void {
    event.preventDefault()
    event.stopPropagation()

    const username = this.getInput("username").value
    const password = this.getInput("password").value

    console.log(`Got username ${username} and password ${password}.`)

    this.login(username, password).then((response) => {
      console.log(response)
      this.datastore.Authorization = response.authorization
      location.hash = "#/ingredients/create"
    }).catch((error) => {
      console.log(error)
    })
  }

  private async login(username: string, password: string): Promise<LoginResponse> {
    return this.request<LoginRequest, LoginResponse>("POST", "/login", { username, password })
  }
}
