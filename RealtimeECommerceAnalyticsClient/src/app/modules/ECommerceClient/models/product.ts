import {SourceData} from '../enums/source-data';

export interface Product {
  title?: string;
  description?: string;
  price?: number;
  category?: string;
  imageUrl?: string;

  source: SourceData
}
