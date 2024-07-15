export class User {
    public name: string
    public email: string
    public password: string
    public isAdmin: boolean

    constructor(name: string, email: string, password: string, isAdmin: boolean = false) {
        this.name = name
        this.email = email
        this.password = password
        this.isAdmin = isAdmin
    }
}

export class UserWithId extends User {
    public id: number

    constructor(id: number, name: string, email: string, password: string, isAdmin: boolean = false) {
        super(name, email, password, isAdmin)
        this.id = id
    }
}