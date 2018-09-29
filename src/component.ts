import { Datastore } from "./datastore.js"

const apiBaseURL = "http://localhost:3000"

export abstract class Component {
  protected abstract readonly template: HTMLElement
  protected datastore: Datastore

  protected constructor(datastore: Datastore) {
    this.datastore = datastore
  }

  public mount(root: Element): void {
    root.innerHTML = ""
    root.appendChild(this.template)
  }

  protected getInput(inputID: string): HTMLInputElement {
    const selector = `input#${inputID}`

    return this.template.querySelector(selector) as HTMLInputElement
  }

  protected async request<T, K>(method: "POST", endpoint: string, body: T): Promise<K> {
    return new Promise<K>((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      xhr.open(method, `${apiBaseURL}${endpoint}`)

      xhr.onload = (): void => {
        console.log(`Got response data ${xhr.response}.`)
        resolve(JSON.parse(xhr.response))
      }

      xhr.onerror = (): void => {
        console.log("There was an error!")
        reject(new Error(`Status: ${xhr.status}`))
      }

      xhr.setRequestHeader("Content-Type", "application/json")
      xhr.setRequestHeader("Authorization", this.datastore.Authorization)

      const stringifiedBody = JSON.stringify(body)
      console.log("Body", stringifiedBody)

      xhr.send(stringifiedBody)
    })
  }
}
