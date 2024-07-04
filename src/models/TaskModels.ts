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