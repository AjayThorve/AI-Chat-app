export class ChatMessage {
  public content: string;
  public time_stamp: Date;
  public type: string;
  constructor(content, type) {
    this.content = content;
    this.type = type;
    this.time_stamp = new Date();
  }
}
