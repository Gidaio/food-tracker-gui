export abstract class Component {
  protected abstract readonly template: HTMLElement

  public mount(root: Element): void {
    root.innerHTML = ""
    root.appendChild(this.template)
  }
}
