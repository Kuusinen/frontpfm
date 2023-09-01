import { Category } from "./category";

export class Product {
    uuid!: string;
    title!: string;
    body!: string;
    category!: Category;
    uuidsImages!: string[];
}