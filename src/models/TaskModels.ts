export class Task {
    public name: string
    public description: string
    public priority: number
    public points: number
    public startDate: Date
    public endDate: Date
    public done: boolean

    constructor(name: string, description: string, priority: number, points: number, startDate: Date, endDate: Date, done: boolean) {
        this.name = name
        this.description = description
        this.priority = priority
        this.points = points
        this.startDate = startDate
        this.endDate = endDate
        this.done = done
    }
}

export class TaskWithOwnerId extends Task {
    public ownerId: number

    constructor(ownerId: number, name: string, description: string, priority: number, points: number, startDate: Date, endDate: Date, done: boolean) {
        super(name, description, priority, points, startDate, endDate, done)
        this.ownerId = ownerId
    }
}

export class TaskWithId extends TaskWithOwnerId {
    public id: number

    constructor(id: number, ownerId: number, name: string, description: string, priority: number, points: number, startDate: Date, endDate: Date, done: boolean) {
        super(ownerId, name, description, priority, points, startDate, endDate, done)
        this.id = id
    }
}