
export class Frequency {

  display: string;
  value: string;
  recurring: boolean;

  constructor(display: string, value: string, recurring = false) {
    this.display = display;
    this.value = value;
    this.recurring = recurring;
  }

}
