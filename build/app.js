"use strict";
function element(descriptor) {
    const elementToCreate = document.createElement(descriptor[0]);
    if (descriptor[1]) {
        Reflect.ownKeys(descriptor[1]).forEach((attributeName) => {
            const attributeValue = descriptor[1][attributeName];
            elementToCreate.setAttribute(attributeName, attributeValue);
        });
        for (let childIndex = 2; childIndex < descriptor.length; childIndex++) {
            const child = descriptor[childIndex];
            if (typeof child === "string") {
                elementToCreate.appendChild(document.createTextNode(child));
            }
            else if (child instanceof HTMLElement) {
                elementToCreate.appendChild(child);
            }
        }
    }
    return elementToCreate;
}
class LoginComponent {
    constructor(root) {
        this.authorization = "";
        this.template = element([
            "form", { id: "login" },
            element(["input", { id: "username", type: "text", placeholder: "Username" }]),
            element(["br"]),
            element(["input", { id: "password", type: "password" }]),
            element(["br"]),
            element(["button", { type: "submit" }, "Login!"])
        ]);
        this.template.addEventListener("submit", this.submitForm.bind(this));
        root.appendChild(this.template);
    }
    submitForm(event) {
        event.preventDefault();
        event.stopPropagation();
        const usernameInput = this.template.querySelector("input#username");
        const passwordInput = this.template.querySelector("input#password");
        console.log(`Got username ${usernameInput.value} and password ${passwordInput.value}.`);
        this.login(usernameInput.value, passwordInput.value).then((response) => {
            console.log(response);
            this.authorization = response.authorization;
        }).catch((error) => {
            console.log(error);
        });
    }
    async login(username, password) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "http://localhost:3000/login");
            xhr.onload = () => {
                console.log(`Got response data ${xhr.response}.`);
                resolve(JSON.parse(xhr.response));
            };
            xhr.onerror = () => {
                console.log("There was an error!");
                reject(new Error("Derp."));
            };
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("Authorization", this.authorization);
            const body = JSON.stringify({ username, password });
            console.log("Body", body);
            xhr.send(body);
        });
    }
}
const mainElement = document.querySelector("main");
// tslint:disable-next-line:no-unused-expression
new LoginComponent(mainElement);
