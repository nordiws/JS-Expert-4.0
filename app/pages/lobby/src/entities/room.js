import Attendee from "./attendee.js"

export default class Room {
    constructor({ id, topic, subTopic, roomLink, attendeesCount, speakersCount, featuredAttendees, owner }) {
        this.id = id
        this.topic = topic
        this.subTopic = subTopic || "JS Expert 4.0"
        this.roomLink = roomLink
        this.attendeesCount = attendeesCount
        this.speakersCount = speakersCount
        this.featuredAttendees = featuredAttendees?.map(attendee => new Attendee(attendee))
        this.owner = new Attendee(owner)
    }
}