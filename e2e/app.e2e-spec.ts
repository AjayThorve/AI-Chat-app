import { AIChatAppPage } from './app.po';

describe('ai-chat-app App', () => {
  let page: AIChatAppPage;

  beforeEach(() => {
    page = new AIChatAppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
