
export class GiftFrequency {

  displayName: string;
  value: string;


  constructor(displayName: string, value: string) {
    this.displayName = displayName;
    this.value = value;
  }

  getDefaultFrequencies(): Array<GiftFrequency> {
    return [
      new GiftFrequency('One Time', 'One Time'),
      new GiftFrequency('Weekly', 'week'),
      new GiftFrequency('Monthly', 'month'),
    ];
  }

  getDisplayNameByValue(value: string): string {
    let freq: GiftFrequency = this.getDefaultFrequencies().find(f => f.value === value);
    return freq.displayName;
  }

}
