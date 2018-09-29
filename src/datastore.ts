export class Datastore {
  private authorization: string = ""

  public get Authorization(): string {
    return this.authorization
  }

  public set Authorization(authorization: string) {
    this.authorization = authorization
  }
}
