import { element } from "./app.js"
import { Component } from "./component.js"

type ListIngredientsResponse = Ingredient[]

interface Ingredient {
  name: string
  amount: number
  unit: string
}

export class ListIngredientsComponent extends Component {
  protected buildTemplate(): HTMLElement {
    const template = element([
      "div", {},
      element(["a", { href: "#/ingredients/create" }, "Create New Ingredient"]),
      element(["hr"]),
      element(["div", { id: "ingredients-list" }])
    ])

    return template
  }

  protected initialize(): void {
    this.getIngredientsList().then((ingredients) => {
      ingredients.forEach(this.addIngredientToList.bind(this))
    }).catch((error) => {
      console.log(error)
    })
  }

  private async getIngredientsList(): Promise<Ingredient[]> {
    return this.request<ListIngredientsResponse>("GET", "/ingredients")
  }

  private addIngredientToList(ingredient: Ingredient): void {
    const ingredientElement = element([
      "div", {},
      element(["h2", {}, ingredient.name]),
      element(["p", {}, `${ingredient.amount} ${ingredient.unit}`])
    ])

    const ingredientsListElement = this.getElementByID("ingredients-list")
    ingredientsListElement.appendChild(ingredientElement)
  }
}
