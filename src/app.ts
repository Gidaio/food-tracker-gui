interface ElementAttributes {
  [key: string]: string
}

interface LoginResponse {
  authorization: string
}

type ElementDescriptor = [string, ElementAttributes?, ...Array<string | HTMLElement>]

function element(descriptor: ElementDescriptor): HTMLElement {
  const elementToCreate = document.createElement(descriptor[0])

  if (descriptor[1]) {
    Reflect.ownKeys(descriptor[1]!).forEach((attributeName) => {
      const attributeValue = descriptor[1]![attributeName as string]
      elementToCreate.setAttribute(attributeName as string, attributeValue)
    })

    for (let childIndex = 2; childIndex < descriptor.length; childIndex++) {
      const child = descriptor[childIndex]
      if (typeof child === "string") {
        elementToCreate.appendChild(document.createTextNode(child))
      }
      else if (child instanceof HTMLElement) {
        elementToCreate.appendChild(child)
      }
    }
  }

  return elementToCreate
}

class LoginComponent {
  private authorization: string = ""

  private readonly template: HTMLElement = element([
    "form", { id: "login" },
    element(["input", { id: "username", type: "text", placeholder: "Username" }]),
    element(["br"]),
    element(["input", { id: "password", type: "password" }]),
    element(["br"]),
    element(["button", { type: "submit" }, "Login!"])
  ])

  public constructor(root: Element) {
    this.template.addEventListener("submit", this.submitForm.bind(this))
    root.appendChild(this.template)
  }

  private submitForm(event: Event): void {
    event.preventDefault()
    event.stopPropagation()

    const usernameInput = this.template.querySelector("input#username") as HTMLInputElement
    const passwordInput = this.template.querySelector("input#password") as HTMLInputElement

    console.log(`Got username ${usernameInput.value} and password ${passwordInput.value}.`)

    this.login(usernameInput.value, passwordInput.value).then((response) => {
      console.log(response)
      this.authorization = response.authorization
    }).catch((error) => {
      console.log(error)
    })
  }

  private async login(username: string, password: string): Promise<LoginResponse> {
    return new Promise<LoginResponse>((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      xhr.open("POST", "http://localhost:3000/login")

      xhr.onload = (): void => {
        console.log(`Got response data ${xhr.response}.`)
        resolve(JSON.parse(xhr.response))
      }

      xhr.onerror = (): void => {
        console.log("There was an error!")
        reject(new Error("Derp."))
      }

      xhr.setRequestHeader("Content-Type", "application/json")
      xhr.setRequestHeader("Authorization", this.authorization)

      const body = JSON.stringify({ username, password })
      console.log("Body", body)

      xhr.send(body)
    })
  }
}

const mainElement = document.querySelector("main") as HTMLMainElement

// tslint:disable-next-line:no-unused-expression
new LoginComponent(mainElement as Element)
