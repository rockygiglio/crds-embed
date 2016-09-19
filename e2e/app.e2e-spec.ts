import { CrdsEmbedPage } from './app.po';

describe('crds-embed App', function() {
  let page: CrdsEmbedPage;

  beforeEach(() => {
    page = new CrdsEmbedPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
