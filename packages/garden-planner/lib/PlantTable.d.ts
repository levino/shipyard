import type { CollectionEntry } from 'astro:content';
import type { FC } from 'react';
export declare const PlantTable: FC<{
    plants: CollectionEntry<'plants'>[];
    caption: string;
}>;
