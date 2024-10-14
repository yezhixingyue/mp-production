// const WIKI_ADDRESS = 'http://file.ybz888.com:7006';
const WIKI_ADDRESS = process.env.NODE_ENV === 'development' ? 'http://192.168.3.85:5173' : 'https://file.ybz888.com:7006';

export class WikiHandler {
  static generateQueryString(query: { [key: string]: string | number }) {
    const queryString = Object.entries(query).map(([key, val]) => `${key}=${val?.toString()}`).join('&');
    return queryString;
  }

  static toWikiPageWithToken(query: { [key: string]: string | number }, replace = false) {
    const { token, siteType, target } = query;
    if (!token || (!siteType && siteType !== 0) || !target) return;

    const queryString = this.generateQueryString(query);
    if (replace) {
      window.location.replace(`${WIKI_ADDRESS}/init?${queryString}`);
      return;
    }

    window.open(`${WIKI_ADDRESS}/init?${queryString}`);
  }
}
