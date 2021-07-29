import { FeedItem } from "./FeedItem";

export interface Feed {
  title: string;
  description: string;
  item: FeedItem[];
}
