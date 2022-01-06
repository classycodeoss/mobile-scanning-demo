import { Article } from './article';

export class ShoppingCart {

  private items: Map<Article, number>;

  constructor() {
    this.items = new Map<Article, number>();
  }

  addArticle(article: Article) {
    const existingArticleCount = this.items.get(article) ?? 0;
    if (existingArticleCount !== 0) {
      this.items.set(article, existingArticleCount + 1);
    } else {
      this.items.set(article, 1);
    }
  }

  clear() {
    this.items.clear();
  }

  get isEmpty(): boolean {
    return this.items.size === 0;
  }

  get totalPrice(): number {
    let total = 0;
    for (const entry of this.items.entries()) {
      total += entry[0].price * entry[1];
    }
    return total;
  }

  get contents(): [Article, number][] {
    let result = [];
    for (const entry of this.items.entries()) {
      result.push(entry);
    }
    return result;
  }
}
