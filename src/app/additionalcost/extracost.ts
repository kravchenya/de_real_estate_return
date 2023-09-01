import {IExtraCost} from './iextracost';

export class ExtraCost implements IExtraCost {
  id: string;
  federalState: string;
  landAcquisition: number;
  notary: number;
  realtor: number;
  totalCostWithRealtor: number;
  totalCostWithoutRealtor: number;
}
