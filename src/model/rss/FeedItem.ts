import { Enclosure } from "./Enclosure";

export interface FeedItem {
  title: string;
  description: string;
  pubDate: string;
  enclosure: Enclosure;
}
