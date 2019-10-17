import DDB from '../../../lib/dynamodb';
import { success, failure } from '../../../lib/response';
import remap from '../../../lib/remap';
import fieldMap from './map';

export default async ({ id }, opts = {}) => {
  const params = {
    Key: { pk: id, sk: 'page#data' }
  };
  const { raw } = opts;

  try {
    const data = await DDB('get', params);
    if (!data.Item) {
      return failure(404, { code: 'PageNotFound', message: 'Page not found' });
    }
    if (raw) return data.Item;
    return success(remap(data.Item, fieldMap));
  } catch (e) {
    return failure(500, e);
  }
};
