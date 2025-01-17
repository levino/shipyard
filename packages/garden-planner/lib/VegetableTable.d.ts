import type { CollectionEntry } from 'astro:content';
import type { FC } from 'react';
export declare const VegetableTable: FC<{
    vegetables: CollectionEntry<'vegetables'>[];
    caption: string;
}>;
