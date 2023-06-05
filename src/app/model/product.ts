import { Category } from "./category";

export class Product {
    uuid!: string;
    title!: string;
    description!: string;
    cat!: Category;
}