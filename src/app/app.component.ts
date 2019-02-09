import { Component, OnInit} from '@angular/core';
import { Subject } from 'rxjs';

const subject = new Subject<any>();

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Best manager evah!';
  url: string;
  socket: WebSocket;
  managers: any[];

  constructor() {

    this.url = 'ws://localhost:8080';
    this.socket = new WebSocket(this.url);
    this.socket.onerror = subject.error;
    this.socket.onclose = this.closed;

    const managers = [
      {
        id: 1,
        name: 'Alex',
        image: '/assets/alex.jpg',
        votes: 0
      },
      {
        id: 2,
        name: 'Anne Dorte',
        image: '/assets/anne_dorte.jpg',
        votes: 0
      },
      {
        id: 3,
        name: 'Henrik',
        image: '/assets/henrik.jpg',
        votes: 0
      }
    ];

    this.managers = managers;
  }

  ready() {
    console.log("READY")
  }

  closed(event) {
    alert("CLOSED")
  }

  incoming(event) {
    const message = JSON.parse(event.data)

    if (message.type === "update") {
      const manager = this.managers.find(manager => {
        return manager.name === message.name
      })

      manager.votes = message.votes
    }
  }

  send(payload: object): void {
    const toString = JSON.stringify(payload);
    this.socket.send(toString);
  }

  parse(payload) {
    return JSON.parse(payload)
  }

  voteUp(manager: any) {
    console.log(this.managers)
    manager.votes++;

    console.log(this.managers)

    const votes = {
      type: "update",
      name: manager.name,
      votes: manager.votes
    };

    this.send(votes)
  }
  voteDown(manager: any) {

    if (manager.votes >= 1) {
      return manager.votes--
    }

    const votes = {
      type: "update",
      name: manager.name,
      votes: manager.votes
    };

    this.send(votes)

  }

  ngOnInit(): void {
    this.socket.onopen = event => {
      this.ready()
    }
    this.socket.onmessage = event => {
      this.incoming(event)
    }

  }

}