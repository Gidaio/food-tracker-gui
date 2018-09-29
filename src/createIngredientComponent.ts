import { element } from "./app.js"
import { Component } from "./component.js"

interface CreateIngredientRequest {
  amount: number
  unit: string
}

export class CreateIngredientComponent extends Component {
  protected buildTemplate(): HTMLElement {
    const template = element([
      "form", undefined,
      element(["input", { id: "ingredient-name", type: "text", placeholder: "Ingredient Name" }]),
      element(["br"]),
      element(["input", { id: "ingredient-amount", type: "number" }]),
      element(["br"]),
      element([
        "select", { id: "ingredient-unit" },
        element(["option", { value: "cup" }, "cup"]),
        element(["option", { value: "fl oz" }, "fl oz"])
      ]),
      element(["br"]),
      element(["button", { type: "submit" }, "Create"])
    ])

    template.addEventListener("submit", this.submitForm.bind(this))

    return template
  }

  public submitForm(event: Event): void {
    event.stopPropagation()
    event.preventDefault()

    const ingredientName = this.getInput("ingredient-name").value
    const ingredientAmount = this.getInput("ingredient-amount").valueAsNumber
    const ingredientUnit = (this.template.querySelector("select#ingredient-unit") as HTMLSelectElement).value

    this.createIngredient(ingredientName, ingredientAmount, ingredientUnit).then(() => {
      console.log(`Created ingredient ${ingredientName}`)
    }).catch((error) => {
      console.log(error)
    })
  }

  public async createIngredient(name: string, amount: number, unit: string): Promise<void> {
    const encodedName = encodeURIComponent(name)
    const endpoint = `/ingredients/${encodedName}`

    return this.request<CreateIngredientRequest, void>("POST", endpoint, { amount, unit })
  }
}
