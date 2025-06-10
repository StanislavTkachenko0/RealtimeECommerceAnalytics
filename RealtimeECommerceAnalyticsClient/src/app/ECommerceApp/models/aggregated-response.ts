import {Product} from './product';

export interface AggregatedResponse {
  fakeStoreData: Product[],
  dummyJsonData: Product[],
  openLibraryData: Product[],
  openFoodFactsData: Product[],
  cryptoData: Product[],
}
