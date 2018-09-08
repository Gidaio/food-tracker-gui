import { Component } from "./component.js"
import { CreateIngredientComponent } from "./createIngredientComponent.js"
import { LoginComponent } from "./loginComponent.js"

interface ElementAttributes {
  [key: string]: string
}

type ElementDescriptor = [string, ElementAttributes?, ...Array<string | HTMLElement>]

export function element(descriptor: ElementDescriptor): HTMLElement {
  const elementToCreate = document.createElement(descriptor[0])

  if (descriptor[1]) {
    Reflect.ownKeys(descriptor[1]!).forEach((attributeName) => {
      const attributeValue = descriptor[1]![attributeName as string]
      elementToCreate.setAttribute(attributeName as string, attributeValue)
    })
  }

  for (let childIndex = 2; childIndex < descriptor.length; childIndex++) {
    const child = descriptor[childIndex]
    if (typeof child === "string") {
      elementToCreate.appendChild(document.createTextNode(child))
    }
    else if (child instanceof HTMLElement) {
      elementToCreate.appendChild(child)
    }
  }

  return elementToCreate
}

const mainElement = document.querySelector("main") as HTMLMainElement

const defaultRoute: Component = new LoginComponent()

const routes: { [key: string]: Component } = {
  "": defaultRoute,
  "#/": defaultRoute,
  "#/ingredients/create": new CreateIngredientComponent()
}

window.onhashchange = (event: HashChangeEvent) => {
  // tslint:disable-next-line:no-unused-expression
  routes[location.hash].mount(mainElement)
}

// tslint:disable-next-line:no-unused-expression
routes[location.hash].mount(mainElement)
