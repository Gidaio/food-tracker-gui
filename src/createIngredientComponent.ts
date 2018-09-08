import { element } from "./app.js"
import { Component } from "./component.js"

export class CreateIngredientComponent extends Component {
  protected readonly template: HTMLElement = element(["p", undefined, "Hey, it worked!"])
}
