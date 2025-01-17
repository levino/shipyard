import { type CollectionEntry } from 'astro:content';
import type { FC, PropsWithChildren } from 'react';
type Props = {
    plant: CollectionEntry<'plants'>;
};
export declare const Plant: FC<PropsWithChildren<Props>>;
export {};
